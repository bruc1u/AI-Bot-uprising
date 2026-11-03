import {
  ArmorId,
  CompanionInstance,
  CompanionKind,
  EnemyKind,
  GameState,
  PlayerPortfolio,
  WeaponId,
} from '../types/game';
import { isEldritchEnemyKind } from './eldritchSprites';
import {
  ARENA_OBSTACLES,
  InternalEnemy,
  MAX_PLAYER_HP,
  MECHA_WASTELAND_DIVIDE_X,
  OUTDOOR_DIVIDE_X,
  SimState,
  WORLD_H,
  WORLD_W,
} from './engineStep';
import { computeArmorStats } from './equipmentConfig';
import {
  isHalloweenEnemyKind,
  isWildPetEnemyKind,
  wildEnemyToCompanionKind,
} from './halloweenSprites';
import { isEliteEnemyKind, isMechaOrChimeraKind, isWorldBossKind } from './mechChimeraSprites';
import { soundFX } from './sound';
import { getEnemyCombatAnchorsWorld, getPlayerWeaponMuzzleWorld } from './sprites';
import { BLOOD_MOON_ALTARS } from './worldZones';

export interface ActiveBossHudState {
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  armor: number;
}

export interface TickCallbacks {
  pState: PlayerPortfolio;
  activeComp: CompanionInstance | undefined;
  setPlayerHp: (hp: number) => void;
  setPlayerMaxHp?: (maxHp: number) => void;
  setPlayerShield?: (shield: number, maxShield: number) => void;
  setDashReady: (ready: boolean) => void;
  setSwapComboActive: (active: boolean) => void;
  setDataSyncMap: (map: Record<WeaponId, number>) => void;
  setHostilesCount: (count: number) => void;
  setGameState: (st: GameState) => void;
  setActiveBoss?: (boss: ActiveBossHudState | null) => void;
  onLootCollected: (delta: {
    ru9?: number;
    oCores?: number;
    aCores?: number;
    ammoCells?: number;
    masterSpheres?: number;
    medkits?: number;
    kills?: number;
    waveReached?: number;
  }) => void;
  onSessionLootDelta: (d: { oCores?: number; aCores?: number; ru9?: number }) => void;
  onCompanionCaptured: (kind: CompanionKind) => void;
  onCompanionStateSync: (id: string, hp: number, rebelling: boolean) => void;
}

function clampObs(nx: number, ny: number, radius: number) {
  let cx = Math.max(82, Math.min(WORLD_W - 82, nx));
  let cy = Math.max(106, Math.min(WORLD_H - 84, ny));
  for (const obs of ARENA_OBSTACLES) {
    const left = obs.x - radius;
    const right = obs.x + obs.w + radius;
    const top = obs.y - radius * 0.65;
    const bottom = obs.y + obs.h + radius * 0.65;
    if (cx > left && cx < right && cy > top && cy < bottom) {
      const dL = Math.abs(cx - left);
      const dR = Math.abs(right - cx);
      const dT = Math.abs(cy - top);
      const dB = Math.abs(bottom - cy);
      const m = Math.min(dL, dR, dT, dB);
      if (m === dL) cx = left;
      else if (m === dR) cx = right;
      else if (m === dT) cy = top;
      else cy = bottom;
    }
  }
  return { x: cx, y: cy };
}

/**
 * Guides enemies and pets cleanly through open Blast Doorways & Quarantine Breach Gates
 * across the expanded 7200x4600 6-Room Facility + Open-World Cthulhu & Mecha biomes.
 */
function steerThroughFacilityDoors(
  ex: number,
  ey: number,
  tx: number,
  ty: number
): { wx: number; wy: number } {
  const pickNearest = (val: number, options: number[]) =>
    options.reduce((best, cur) => (Math.abs(cur - val) < Math.abs(best - val) ? cur : best), options[0]);

  // 1. Crossing the Eastern Quarantine Blast Wall (x ≈ 2680) — 4 Breached Gates
  if ((ex < 2652 && tx > 2710) || (ex > 2710 && tx < 2652)) {
    const gateY = pickNearest(ey, [600, 1850, 3050, 4050]);
    if (Math.abs(ey - gateY) > 155) {
      return { wx: ex < 2680 ? 2605 : 2755, wy: gateY };
    }
    return { wx: tx, wy: gateY };
  }

  // 2. Indoor 6-Room Partition Doorway Routing (x < 2670)
  if (ex < 2670 && tx < 2670) {
    // Horizontal Wall 1 (y ≈ 1120): doors at x = [520, 1400, 2260]
    if ((ey < 1094 && ty > 1146) || (ey > 1146 && ty < 1094)) {
      const doorX = pickNearest(ex, [520, 1400, 2260]);
      if (Math.abs(ex - doorX) > 135) {
        return { wx: doorX, wy: ey < 1120 ? 1050 : 1190 };
      }
      return { wx: doorX, wy: ty };
    }
    // Horizontal Wall 2 (y ≈ 2560): doors at x = [520, 1770]
    if ((ey < 2534 && ty > 2586) || (ey > 2586 && ty < 2534)) {
      const doorX = pickNearest(ex, [520, 1770]);
      if (Math.abs(ex - doorX) > 140) {
        return { wx: doorX, wy: ey < 2560 ? 2490 : 2630 };
      }
      return { wx: doorX, wy: ty };
    }
    // Horizontal Wall 3 (y ≈ 3540): doors at x = [710, 1870]
    if ((ey < 3514 && ty > 3566) || (ey > 3566 && ty < 3514)) {
      const doorX = pickNearest(ex, [710, 1870]);
      if (Math.abs(ex - doorX) > 150) {
        return { wx: doorX, wy: ey < 3540 ? 3470 : 3610 };
      }
      return { wx: doorX, wy: ty };
    }
    // Vertical Wall 1 between Server Vault & Foundry (x ≈ 1780, y < 1120): door at y = 610
    if (ey < 1120 && ty < 1120 && ((ex < 1754 && tx > 1806) || (ex > 1806 && tx < 1754))) {
      if (Math.abs(ey - 610) > 130) {
        return { wx: ex < 1780 ? 1710 : 1850, wy: 610 };
      }
      return { wx: tx, wy: 610 };
    }
    // Vertical Wall 2 between Cryo Lab & Command Hub (x ≈ 920, 1120 <= y <= 2560): door at y = 1840
    if (
      ey >= 1120 &&
      ey <= 2560 &&
      ty >= 1120 &&
      ty <= 2560 &&
      ((ex < 894 && tx > 946) || (ex > 946 && tx < 894))
    ) {
      if (Math.abs(ey - 1840) > 150) {
        return { wx: ex < 920 ? 850 : 990, wy: 1840 };
      }
      return { wx: tx, wy: 1840 };
    }
  }

  return { wx: tx, wy: ty };
}

export function findLockedTarget(s: SimState): InternalEnemy | undefined {
  let best: InternalEnemy | undefined;
  let bestDist = 340;
  for (const e of s.enemies) {
    if (isWildPetEnemyKind(e.kind)) continue;
    const refX = s.touchAimActive ? s.px + Math.cos(s.aimAngle) * 220 : s.mouseWorldX;
    const refY = s.touchAimActive ? s.py - 32 + Math.sin(s.aimAngle) * 220 : s.mouseWorldY;
    const d = Math.hypot(e.x - refX, e.y - refY);
    if (d < bestDist) {
      bestDist = d;
      best = e;
    }
  }
  return best;
}

export function stepCombatPhysics(s: SimState, dt: number, now: number, cb: TickCallbacks) {
  const { pState } = cb;
  const equippedArmor = pState.equippedArmor || ArmorId.EVA_STANDARD_SUIT;
  const armorLevel = pState.armorLevels?.[equippedArmor] || 1;
  const armorStats = computeArmorStats(equippedArmor, armorLevel, MAX_PLAYER_HP);

  if (s.maxHp !== armorStats.maxHp) {
    const deltaHp = armorStats.maxHp - s.maxHp;
    s.maxHp = armorStats.maxHp;
    s.hp = Math.min(s.maxHp, Math.max(1, s.hp + (deltaHp > 0 ? deltaHp : 0)));
    cb.setPlayerMaxHp?.(s.maxHp);
    cb.setPlayerHp(Math.round(s.hp));
  }
  if (s.maxShield !== armorStats.maxShield) {
    const deltaSh = armorStats.maxShield - s.maxShield;
    s.maxShield = armorStats.maxShield;
    s.shield = Math.min(s.maxShield, Math.max(0, s.shield + (deltaSh > 0 ? deltaSh : 0)));
    cb.setPlayerShield?.(Math.round(s.shield), s.maxShield);
  }

  if (s.shieldRegenDelay > 0) {
    s.shieldRegenDelay = Math.max(0, s.shieldRegenDelay - dt);
  } else if (s.shield < s.maxShield && s.hp > 0) {
    const prevRounded = Math.round(s.shield);
    s.shield = Math.min(s.maxShield, s.shield + armorStats.shieldRegenPerSec * dt);
    if (Math.round(s.shield) !== prevRounded) {
      cb.setPlayerShield?.(Math.round(s.shield), s.maxShield);
    }
  }

  if (s.invulnTimer > 0) s.invulnTimer -= dt;
  if (s.attackCooldown > 0) s.attackCooldown -= dt;
  if (s.swingTimer > 0) s.swingTimer -= dt;
  if (s.recoilTimer > 0) s.recoilTimer -= dt;
  if (s.shakeTimer > 0) s.shakeTimer -= dt;
  if (s.sugarRushTimer > 0) s.sugarRushTimer = Math.max(0, s.sugarRushTimer - dt);
  if (s.bloodMoonTimer > 0) s.bloodMoonTimer = Math.max(0, s.bloodMoonTimer - dt);
  if (s.swapComboTimer > 0 && (s.swapComboTimer -= dt) <= 0) cb.setSwapComboActive(false);
  if (s.dashCooldown > 0 && (s.dashCooldown -= dt) <= 0) cb.setDashReady(true);

  for (const prop of s.halloweenProps) {
    if (prop.hitFlash > 0) prop.hitFlash = Math.max(0, prop.hitFlash - dt);
  }

  const spawnBats = (cx: number, cy: number, count: number) => {
    for (let i = 0; i < count; i++) {
      if (s.batParticles.length >= 48) break;
      const ang = -Math.PI * 0.5 + (Math.random() - 0.5) * 2.2;
      const spd = 75 + Math.random() * 95;
      s.batParticles.push({
        x: cx + (Math.random() - 0.5) * 20,
        y: cy + (Math.random() - 0.5) * 16,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 35,
        life: 0.95 + Math.random() * 0.45,
        maxLife: 1.4,
        scale: 0.85 + Math.random() * 0.45,
        color: Math.random() < 0.5 ? '#f97316' : '#c084fc',
        phase: Math.random() * Math.PI * 2,
      });
    }
  };

  // HALLOWEEN EASTER EGG: Blood-Moon Pentagram Altar Awakening Ritual (stand inside for 1.8s)
  if (!s.altarTriggeredThisWave) {
    const activeAltar = BLOOD_MOON_ALTARS.find(
      (al) => Math.hypot(s.px - al.x, s.py - al.y) <= al.radius
    );
    if (activeAltar) {
      s.altarChargeProgress += dt;
      if (Math.random() < 0.55) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * activeAltar.radius * 0.85;
        s.particles.push({
          x: activeAltar.x + Math.cos(a) * r,
          y: activeAltar.y + Math.sin(a) * r * 0.7,
          vx: 0,
          vy: -48 - Math.random() * 30,
          size: 3.8,
          color: Math.random() < 0.5 ? '#fb923c' : '#e879f9',
          life: 0.55,
          maxLife: 0.55,
        });
      }
      if (s.altarChargeProgress >= 1.8) {
        s.altarTriggeredThisWave = true;
        s.altarChargeProgress = 0;
        s.bloodMoonTimer = 18.0;
        s.hp = Math.min(s.maxHp, s.hp + 45);
        s.shield = s.maxShield;
        cb.setPlayerHp(Math.round(s.hp));
        cb.setPlayerShield?.(Math.round(s.shield), s.maxShield);
        s.shakeTimer = 0.22;
        s.shakeIntensity = 6;
        soundFX.playBloodMoonAwaken();
        spawnBats(activeAltar.x, activeAltar.y - 24, 12);
        s.drops.push({ id: `bmo-${now}`, x: activeAltar.x - 22, y: activeAltar.y, kind: 'oCore', amount: 1 });
        s.drops.push({ id: `bma-${now}`, x: activeAltar.x + 22, y: activeAltar.y, kind: 'aCore', amount: 1 });
        s.drops.push({ id: `bmc1-${now}`, x: activeAltar.x, y: activeAltar.y + 18, kind: 'candy', amount: 1 });
        s.drops.push({ id: `bmc2-${now}`, x: activeAltar.x - 14, y: activeAltar.y - 14, kind: 'candy', amount: 1 });
        s.floatTexts.push({
          x: s.px,
          y: s.py - 72,
          text: '🎃 BLOOD MOON AWAKENED! +28% DMG',
          color: '#fb923c',
          life: 1.55,
        });
      }
    } else if (s.altarChargeProgress > 0) {
      s.altarChargeProgress = Math.max(0, s.altarChargeProgress - dt * 0.65);
    }
  }

  if (pState.ammoCells < 24 && (s.passiveAmmoTimer += dt) >= 1.4) {
    s.passiveAmmoTimer = 0;
    cb.onLootCollected({ ammoCells: 3 });
  }

  // Biome atmospheric particles (Cthulhu Abyss spores vs Titan Mecha Wasteland embers)
  if (s.px >= OUTDOOR_DIVIDE_X - 180 && Math.random() < 0.35 && s.particles.length < 110) {
    const inMechaWasteland = s.px >= MECHA_WASTELAND_DIVIDE_X;
    s.particles.push({
      x: s.px + (Math.random() - 0.5) * 940,
      y: s.py + (Math.random() - 0.5) * 640,
      vx: -14 + (Math.random() - 0.5) * 22,
      vy: -22 - Math.random() * 20,
      size: inMechaWasteland ? 3.2 : 3.4,
      color: inMechaWasteland
        ? Math.random() < 0.65
          ? '#f97316'
          : '#38bdf8'
        : Math.random() < 0.5
        ? '#c026d3'
        : '#ff1744',
      life: 0.9,
      maxLife: 0.9,
    });
  }

  // Combine Keyboard WASD/Arrows with Mobile Analog Left Thumbstick
  let mx = s.touchMoveX || 0;
  let my = s.touchMoveY || 0;
  if (s.keys.has('KeyW') || s.keys.has('ArrowUp')) my -= 1;
  if (s.keys.has('KeyS') || s.keys.has('ArrowDown')) my += 1;
  if (s.keys.has('KeyA') || s.keys.has('ArrowLeft')) mx -= 1;
  if (s.keys.has('KeyD') || s.keys.has('ArrowRight')) mx += 1;

  if (s.dashActiveTimer > 0) {
    s.dashActiveTimer -= dt;
    s.isMoving = true;
    s.walkPhase += dt * 18;
    const c = clampObs(s.px + s.dashVx * dt, s.py + s.dashVy * dt, 18);
    s.px = c.x;
    s.py = c.y;
    if (Math.abs(s.dashVx) > 10) s.facingRight = s.dashVx >= 0;
    s.particles.push({
      x: s.px,
      y: s.py - 14,
      vx: 0,
      vy: 0,
      size: 6,
      color: '#00e5ff',
      life: 0.16,
      maxLife: 0.16,
    });
  } else if (Math.hypot(mx, my) > 0.06) {
    const rawLen = Math.hypot(mx, my);
    const speedRatio = Math.min(1, rawLen);
    const nx = mx / rawLen;
    const ny = my / rawLen;
    const moveSpd =
      315 *
      armorStats.moveSpeedMult *
      (1 + (s.bloodMoonTimer > 0 ? 0.2 : 0) + (s.sugarRushTimer > 0 ? 0.16 : 0));
    const c = clampObs(s.px + nx * moveSpd * speedRatio * dt, s.py + ny * moveSpd * speedRatio * dt, 18);
    s.px = c.x;
    s.py = c.y;
    s.isMoving = true;
    s.moveDirX = nx;
    s.walkPhase += dt * (11.5 * Math.max(0.55, speedRatio));

    if (!s.mouseDown && !s.touchAimActive && s.swingTimer <= 0 && s.recoilTimer <= 0) {
      if (nx < -0.1) s.facingRight = false;
      else if (nx > 0.1) s.facingRight = true;
    }

    if (Math.random() < 0.2) {
      s.particles.push({
        x: s.px + (Math.random() - 0.5) * 10,
        y: s.py + 7,
        vx: -nx * 24,
        vy: -8,
        size: 3,
        color:
          s.px >= MECHA_WASTELAND_DIVIDE_X
            ? '#fb923c'
            : s.px >= OUTDOOR_DIVIDE_X
            ? '#c026d3'
            : '#67e8f9',
        life: 0.2,
        maxLife: 0.2,
      });
    }
  } else {
    s.isMoving = false;
    s.moveDirX = 0;
  }

  if (!s.touchAimActive) {
    s.aimAngle = Math.atan2(s.mouseWorldY - (s.py - 36), s.mouseWorldX - s.px);
  }
  if (s.mouseDown || s.touchAimActive || s.swingTimer > 0 || s.recoilTimer > 0) {
    s.facingRight = Math.cos(s.aimAngle) >= 0;
  }

  const damagePlayer = (dmg: number, shake = 3.5) => {
    if (s.invulnTimer > 0) return;
    const mitigated = Math.max(1, dmg * (1 - armorStats.damageReduction));
    s.shieldRegenDelay = 3.0;
    const shieldAbsorb = Math.min(s.shield, mitigated);
    s.shield = Math.max(0, s.shield - shieldAbsorb);
    const hullDamage = mitigated - shieldAbsorb;
    if (hullDamage > 0) {
      s.hp = Math.max(0, s.hp - hullDamage);
      cb.setPlayerHp(Math.round(s.hp));
    }
    cb.setPlayerShield?.(Math.round(s.shield), s.maxShield);
    s.invulnTimer = 0.44;
    s.shakeTimer = 0.1;
    s.shakeIntensity = shake;
  };

  const damageEnemy = (
    e: InternalEnemy,
    rawDmg: number,
    weaponUsed: WeaponId,
    shredFactor = 1,
    fromCompanion = false
  ) => {
    const syncPct = fromCompanion ? 0 : s.syncMap[weaponUsed] || 0;
    const resisting = !fromCompanion && syncPct >= 80;
    e.syncResistant = resisting;
    const mult =
      (resisting ? 0.55 : 1) *
      (!fromCompanion ? armorStats.damageMult : 1) *
      (!fromCompanion && s.swapComboTimer > 0 ? 1.3 : 1) *
      (!fromCompanion && s.bloodMoonTimer > 0 ? 1.28 : 1) *
      (e.markedByDog ? 1.25 : 1);
    let finalDmg = rawDmg * mult;
    if (e.armor > 0) {
      const absorbed = Math.min(e.armor, finalDmg * shredFactor);
      e.armor -= absorbed;
      finalDmg = Math.max(6, finalDmg - absorbed * 0.45);
    }
    e.hp -= finalDmg;
    e.hitFlash = 0.1;

    const isEld = isEldritchEnemyKind(e.kind);
    const isMecha = isMechaOrChimeraKind(e.kind);
    const isHlw = isHalloweenEnemyKind(e.kind);
    const coolant = isHlw
      ? '#fb923c'
      : isEld
      ? '#c026d3'
      : isMecha
      ? '#f97316'
      : e.kind === EnemyKind.ANTHROPIC_BULWARK
      ? '#00b4ff'
      : '#10b981';

    for (let i = 0; i < 4; i++) {
      const a = Math.random() * Math.PI * 2;
      const spd = 45 + Math.random() * 105;
      s.particles.push({
        x: e.x,
        y: e.y - 22,
        vx: Math.cos(a) * spd,
        vy: Math.sin(a) * spd,
        size: 3.5,
        color: fromCompanion ? '#00b4ff' : coolant,
        life: 0.42,
        maxLife: 0.42,
      });
    }
    if (Math.random() < 0.3 && s.puddles.length < 64) {
      s.puddles.push({
        x: e.x + (Math.random() - 0.5) * 16,
        y: e.y + 8,
        rx: 9 + Math.random() * 9,
        color: coolant,
        alpha: 0.42,
      });
    }
    s.floatTexts.push({
      x: e.x + (Math.random() - 0.5) * 14,
      y: e.y - 54,
      text: resisting
        ? `${Math.round(finalDmg)} SYNC`
        : fromCompanion
        ? `${Math.round(finalDmg)} PET`
        : `${Math.round(finalDmg)}`,
      color: resisting
        ? '#f59e0b'
        : fromCompanion
        ? '#38bdf8'
        : weaponUsed === WeaponId.DISRUPTOR_CANNON
        ? '#ff1744'
        : '#ffffff',
      life: 0.55,
    });

    if (e.hp <= 0) {
      if (!fromCompanion) {
        s.consecutiveKills = s.lastKillWeapon === weaponUsed ? s.consecutiveKills + 1 : 1;
        s.lastKillWeapon = weaponUsed;
        for (const wKey of Object.keys(s.syncMap) as WeaponId[]) {
          if (wKey === weaponUsed) {
            s.syncMap[wKey] = Math.min(100, (s.syncMap[wKey] || 0) + 15);
          } else {
            s.syncMap[wKey] = Math.max(0, (s.syncMap[wKey] || 0) - 14);
          }
        }
        cb.setDataSyncMap({ ...s.syncMap });
      }

      // Festive Halloween Bat Swarm + Ghostly Soul-Wisp on Enemy Takedown
      spawnBats(
        e.x,
        e.y - 28,
        isWorldBossKind(e.kind) ? 9 : isHalloweenEnemyKind(e.kind) ? 4 : 2
      );
      for (let sw = 0; sw < 3; sw++) {
        s.particles.push({
          x: e.x + (Math.random() - 0.5) * 18,
          y: e.y - 18,
          vx: (Math.random() - 0.5) * 18,
          vy: -42 - Math.random() * 28,
          size: 4.2,
          color: sw % 2 === 0 ? '#c084fc' : '#fb923c',
          life: 0.65,
          maxLife: 0.65,
        });
      }

      // Enemy & Boss Core + Halloween Soul Candy Drops
      const chance = 0.85 + (!fromCompanion && weaponUsed === WeaponId.CHAINSAW_SWORD ? 0.5 : 0);
      const qty =
        !fromCompanion && weaponUsed === WeaponId.CHAINSAW_SWORD && Math.random() < 0.45 ? 2 : 1;

      if (e.kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER) {
        s.drops.push({ id: `dhdo-${now}-${Math.random()}`, x: e.x - 20, y: e.y, kind: 'oCore', amount: 5 });
        s.drops.push({ id: `dhda-${now}-${Math.random()}`, x: e.x + 20, y: e.y, kind: 'aCore', amount: 5 });
        for (let ci = 0; ci < 3; ci++) {
          s.drops.push({
            id: `dhdc-${now}-${ci}-${Math.random()}`,
            x: e.x + (ci - 1) * 18,
            y: e.y + 14,
            kind: 'candy',
            amount: 1,
          });
        }
      } else if (e.kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT) {
        s.drops.push({ id: `dfro-${now}-${Math.random()}`, x: e.x - 14, y: e.y, kind: 'oCore', amount: 2 });
        s.drops.push({ id: `dfra-${now}-${Math.random()}`, x: e.x + 14, y: e.y, kind: 'aCore', amount: 2 });
        s.drops.push({ id: `dfrc-${now}-${Math.random()}`, x: e.x, y: e.y + 12, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.PUMPKIN_SCYTHE_REAPER) {
        s.drops.push({ id: `dpsr-${now}-${Math.random()}`, x: e.x - 8, y: e.y, kind: 'oCore', amount: qty });
        s.drops.push({ id: `dpsc-${now}-${Math.random()}`, x: e.x + 10, y: e.y, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH) {
        s.drops.push({ id: `dsbw-${now}-${Math.random()}`, x: e.x - 8, y: e.y, kind: 'aCore', amount: qty });
        s.drops.push({ id: `dsbc-${now}-${Math.random()}`, x: e.x + 10, y: e.y, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM) {
        s.drops.push({ id: `doco-${now}-${Math.random()}`, x: e.x - 18, y: e.y, kind: 'oCore', amount: 6 });
        s.drops.push({ id: `doca-${now}-${Math.random()}`, x: e.x + 18, y: e.y, kind: 'aCore', amount: 6 });
        s.drops.push({ id: `docc-${now}-${Math.random()}`, x: e.x, y: e.y + 12, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN) {
        s.drops.push({ id: `dtto-${now}-${Math.random()}`, x: e.x - 18, y: e.y, kind: 'oCore', amount: 5 });
        s.drops.push({ id: `dtta-${now}-${Math.random()}`, x: e.x + 18, y: e.y, kind: 'aCore', amount: 5 });
        s.drops.push({ id: `dttc-${now}-${Math.random()}`, x: e.x, y: e.y + 12, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME) {
        s.drops.push({ id: `dco-${now}-${Math.random()}`, x: e.x - 16, y: e.y, kind: 'oCore', amount: 4 });
        s.drops.push({ id: `dca-${now}-${Math.random()}`, x: e.x + 16, y: e.y, kind: 'aCore', amount: 4 });
        s.drops.push({ id: `dcc-${now}-${Math.random()}`, x: e.x, y: e.y + 12, kind: 'candy', amount: 1 });
      } else if (e.kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT || e.kind === EnemyKind.LOGIC_WEAVER_ELITE) {
        s.drops.push({ id: `deo-${now}-${Math.random()}`, x: e.x - 12, y: e.y, kind: 'oCore', amount: 2 });
        s.drops.push({ id: `dea-${now}-${Math.random()}`, x: e.x + 12, y: e.y, kind: 'aCore', amount: 2 });
      } else if (e.kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
        s.drops.push({ id: `dmbo-${now}-${Math.random()}`, x: e.x - 10, y: e.y, kind: 'oCore', amount: 1 });
        s.drops.push({ id: `dmba-${now}-${Math.random()}`, x: e.x + 10, y: e.y, kind: 'aCore', amount: 2 });
      } else if (e.kind === EnemyKind.MECH_SPIDER_ARACHNID) {
        const spiderCore = Math.random() < 0.5 ? 'oCore' : 'aCore';
        s.drops.push({ id: `dms-${now}-${Math.random()}`, x: e.x, y: e.y, kind: spiderCore, amount: 2 });
      } else if (e.kind === EnemyKind.CHIMERA_HOUND_WEAVER) {
        s.drops.push({ id: `dcho-${now}-${Math.random()}`, x: e.x - 8, y: e.y, kind: 'oCore', amount: 1 });
        s.drops.push({ id: `dcha-${now}-${Math.random()}`, x: e.x + 8, y: e.y, kind: 'aCore', amount: 1 });
      } else if (e.kind === EnemyKind.SHOGGOTH_CORE_AMALGAM) {
        s.drops.push({ id: `dso-${now}-${Math.random()}`, x: e.x - 10, y: e.y, kind: 'oCore', amount: 1 });
        s.drops.push({ id: `dsa-${now}-${Math.random()}`, x: e.x + 10, y: e.y, kind: 'aCore', amount: 2 });
      } else if (e.kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER) {
        const dropKind = Math.random() < 0.5 ? 'oCore' : 'aCore';
        s.drops.push({ id: `dew-${now}-${Math.random()}`, x: e.x, y: e.y, kind: dropKind, amount: qty + 1 });
      } else if (
        (e.kind === EnemyKind.OPENAI_STALKER ||
          e.kind === EnemyKind.OPENAI_VIPER ||
          e.kind === EnemyKind.WILD_SCOUT_DOG ||
          e.kind === EnemyKind.WILD_PUMPKIN_SPIRIT) &&
        Math.random() < chance
      ) {
        s.drops.push({ id: `do-${now}-${Math.random()}`, x: e.x, y: e.y, kind: 'oCore', amount: qty });
      } else if (
        (e.kind === EnemyKind.ANTHROPIC_BULWARK ||
          e.kind === EnemyKind.WILD_CYBER_CAT ||
          e.kind === EnemyKind.WILD_NIGHT_BAT) &&
        Math.random() < chance
      ) {
        s.drops.push({ id: `da-${now}-${Math.random()}`, x: e.x, y: e.y, kind: 'aCore', amount: qty });
      }

      if (!isHalloweenEnemyKind(e.kind) && Math.random() < 0.2) {
        s.drops.push({
          id: `hcandy-${now}-${Math.random()}`,
          x: e.x + 10,
          y: e.y + 6,
          kind: 'candy',
          amount: 1,
        });
      }

      // Direct $RU9 Armory Token Combat Bounty Drops (Cores are strictly for Tokenized Stocks!)
      if (isWorldBossKind(e.kind)) {
        s.drops.push({
          id: `ru9-boss-${now}-${Math.random()}`,
          x: e.x,
          y: e.y - 12,
          kind: 'ru9',
          amount: 12000 + s.waveNum * 2500,
        });
      } else if (isEliteEnemyKind(e.kind)) {
        s.drops.push({
          id: `ru9-el-${now}-${Math.random()}`,
          x: e.x,
          y: e.y - 10,
          kind: 'ru9',
          amount: 2400 + s.waveNum * 450,
        });
      } else if (!isWildPetEnemyKind(e.kind) && Math.random() < 0.68) {
        s.drops.push({
          id: `ru9-mob-${now}-${Math.random()}`,
          x: e.x + (Math.random() - 0.5) * 16,
          y: e.y - 8,
          kind: 'ru9',
          amount: 750 + s.waveNum * 150,
        });
      }

      if (!fromCompanion && armorStats.killHeal > 0 && s.hp < s.maxHp) {
        s.hp = Math.min(s.maxHp, s.hp + armorStats.killHeal);
        cb.setPlayerHp(Math.round(s.hp));
      }

      cb.onLootCollected({ kills: 1 });
    }
  };

  const hitLogicMinesInRange = (cx: number, cy: number, range: number, dmg: number) => {
    for (const m of s.logicMines) {
      if (Math.hypot(m.x - cx, m.y - cy) <= range) {
        m.hp -= dmg;
        if (m.hp <= 0) {
          soundFX.playLootPickup(true);
          s.drops.push({ id: `mo-${now}-${Math.random()}`, x: m.x, y: m.y, kind: 'oCore', amount: 1 });
          s.floatTexts.push({
            x: m.x,
            y: m.y - 24,
            text: 'DEFUSED +1 OpenAI Core',
            color: '#38bdf8',
            life: 0.9,
          });
        }
      }
    }
    s.logicMines = s.logicMines.filter((m) => m.hp > 0);
  };

  // HALLOWEEN EASTER EGG: Destructible "TRICK OR TREAT!" Cyber Jack-o'-Lantern Props
  const damageHalloweenPropsInRange = (cx: number, cy: number, range: number, dmg: number) => {
    for (const prop of s.halloweenProps) {
      if (prop.smashed) continue;
      if (Math.hypot(prop.x - cx, prop.y - cy) <= range) {
        prop.hp -= dmg;
        prop.hitFlash = 0.14;
        if (prop.hp <= 0) {
          prop.smashed = true;
          spawnBats(prop.x, prop.y - 20, 5);
          for (let k = 0; k < 10; k++) {
            const a = Math.random() * Math.PI * 2;
            const spd = 60 + Math.random() * 110;
            s.particles.push({
              x: prop.x,
              y: prop.y - 14,
              vx: Math.cos(a) * spd,
              vy: Math.sin(a) * spd,
              size: 4,
              color: k % 2 === 0 ? '#fb923c' : '#c084fc',
              life: 0.45,
              maxLife: 0.45,
            });
          }

          if (Math.random() < 0.72) {
            soundFX.playHalloweenChime(true);
            s.drops.push({
              id: `trt-c-${now}-${Math.random()}`,
              x: prop.x - 10,
              y: prop.y,
              kind: 'candy',
              amount: 1,
            });
            const bonusCore = Math.random() < 0.5;
            if (bonusCore) {
              s.drops.push({
                id: `trt-core-${now}-${Math.random()}`,
                x: prop.x + 12,
                y: prop.y,
                kind: Math.random() < 0.5 ? 'oCore' : 'aCore',
                amount: 1,
              });
            } else {
              s.drops.push({
                id: `trt-ammo-${now}-${Math.random()}`,
                x: prop.x + 12,
                y: prop.y,
                kind: 'ammo',
                amount: 10,
              });
            }
            s.floatTexts.push({
              x: prop.x,
              y: prop.y - 38,
              text: '🎃 TREAT! SOUL CANDY!',
              color: '#fb923c',
              life: 1.1,
            });
          } else {
            soundFX.playHalloweenChime(false);
            if (s.enemies.length < 76 && Math.random() < 0.5) {
              s.enemies.push({
                id: `trick-reaper-${now}-${Math.random()}`,
                kind: EnemyKind.PUMPKIN_SCYTHE_REAPER,
                x: prop.x,
                y: prop.y,
                vx: 0,
                vy: 0,
                hp: 155 + s.waveNum * 22,
                maxHp: 155 + s.waveNum * 22,
                armor: 20,
                maxArmor: 20,
                attackCooldown: 0.9,
                logicBombCooldown: 99,
                stunTimer: 0,
                slowTimer: 0,
                facingAngle: Math.atan2(s.py - prop.y, s.px - prop.x),
                isMoving: false,
                walkPhase: 0,
                meleeSwingTimer: 0,
                eyeChargeTimer: 0,
                eyeTargetX: s.px,
                eyeTargetY: s.py - 32,
                burstRemaining: 0,
                burstTimer: 0,
                attackPatternStep: 0,
                markedByDog: false,
                syncResistant: false,
                berserk: false,
                captureTimer: 0,
                hitFlash: 0.15,
              });
              s.floatTexts.push({
                x: prop.x,
                y: prop.y - 40,
                text: '🎃 TRICK! REAPER AMBUSH!',
                color: '#c084fc',
                life: 1.2,
              });
            } else {
              s.slashes.push({
                x: prop.x,
                y: prop.y - 10,
                angle: 0,
                radius: 76,
                color: '#fb923c',
                isEmp: true,
                life: 0.24,
              });
              s.drops.push({
                id: `trk-c-${now}-${Math.random()}`,
                x: prop.x,
                y: prop.y,
                kind: 'candy',
                amount: 1,
              });
              s.floatTexts.push({
                x: prop.x,
                y: prop.y - 38,
                text: '🎃 TRICK! PUMPKIN POP!',
                color: '#fde047',
                life: 1.05,
              });
            }
          }
        }
      }
    }
  };

  // Player Attack Execution (spawning strictly from rendered weapon muzzle / blade!)
  if (s.mouseDown && s.attackCooldown <= 0) {
    s.facingRight = Math.cos(s.aimAngle) >= 0;
    const lvlScale = 1 + ((pState.weaponLevels[s.weapon] || 1) - 1) * 0.22;
    const hasteMult = (s.sugarRushTimer > 0 ? 0.82 : 1) * armorStats.fireCooldownMult;
    const muzzle = getPlayerWeaponMuzzleWorld(
      s.px,
      s.py,
      s.aimAngle,
      s.facingRight,
      s.weapon,
      pState.selectedSkin,
      s.isMoving,
      s.walkPhase
    );

    if (s.weapon === WeaponId.ARC_BLADE) {
      s.attackCooldown = 0.24 * hasteMult;
      s.swingTimer = 0.22;
      s.arcComboStep = (s.arcComboStep + 1) % 3;
      const isEmp = s.arcComboStep === 0;
      soundFX.playArcSlash(isEmp);
      const reach = isEmp ? 168 : 126;
      s.slashes.push({
        x: s.px,
        y: s.py - 32,
        angle: s.aimAngle,
        radius: reach,
        color: '#38bdf8',
        isEmp,
        life: 0.2,
      });
      hitLogicMinesInRange(s.px + Math.cos(s.aimAngle) * 55, s.py + Math.sin(s.aimAngle) * 55, 88, 55);
      damageHalloweenPropsInRange(s.px + Math.cos(s.aimAngle) * 55, s.py + Math.sin(s.aimAngle) * 55, 96, 50);
      let hit = false;
      for (const e of s.enemies) {
        const d = Math.hypot(e.x - s.px, e.y - s.py);
        const ad = Math.abs(
          Math.atan2(
            Math.sin(Math.atan2(e.y - s.py, e.x - s.px) - s.aimAngle),
            Math.cos(Math.atan2(e.y - s.py, e.x - s.px) - s.aimAngle)
          )
        );
        if (d <= reach + 16 && (isEmp || ad < 1.35)) {
          hit = true;
          if (isEmp) {
            e.stunTimer = isWorldBossKind(e.kind) ? 0.9 : 2.2;
            e.armor = Math.max(0, e.armor - 65);
          }
          damageEnemy(e, (isEmp ? 82 : 60) * lvlScale, WeaponId.ARC_BLADE, 3.2);
        }
      }
      if (hit) cb.onLootCollected({ ammoCells: 1 });
    } else if (s.weapon === WeaponId.CHAINSAW_SWORD) {
      s.attackCooldown = 0.3 * hasteMult;
      s.swingTimer = 0.26;
      s.shakeTimer = 0.08;
      s.shakeIntensity = 3.5;
      soundFX.playChainsawRip();
      s.slashes.push({
        x: s.px,
        y: s.py - 32,
        angle: s.aimAngle,
        radius: 134,
        color: '#fb923c',
        isEmp: false,
        life: 0.24,
      });
      hitLogicMinesInRange(s.px + Math.cos(s.aimAngle) * 55, s.py + Math.sin(s.aimAngle) * 55, 95, 70);
      damageHalloweenPropsInRange(s.px + Math.cos(s.aimAngle) * 55, s.py + Math.sin(s.aimAngle) * 55, 102, 65);
      let hit = false;
      for (const e of s.enemies) {
        const d = Math.hypot(e.x - s.px, e.y - s.py);
        const ad = Math.abs(
          Math.atan2(
            Math.sin(Math.atan2(e.y - s.py, e.x - s.px) - s.aimAngle),
            Math.cos(Math.atan2(e.y - s.py, e.x - s.px) - s.aimAngle)
          )
        );
        if (d <= 142 && ad < 1.38) {
          hit = true;
          damageEnemy(e, 80 * lvlScale, WeaponId.CHAINSAW_SWORD, 1.5);
        }
      }
      if (hit) cb.onLootCollected({ ammoCells: 1 });
    } else if (s.weapon === WeaponId.PULSE_LASER) {
      if (pState.ammoCells > 0) {
        s.attackCooldown = 0.21 * hasteMult;
        s.recoilTimer = 0.14;
        cb.onLootCollected({ ammoCells: -1 });
        soundFX.playPulseLaser();
        const x2 = muzzle.x + Math.cos(s.aimAngle) * 700;
        const y2 = muzzle.y + Math.sin(s.aimAngle) * 700;
        s.lasers.push({
          x1: muzzle.x,
          y1: muzzle.y,
          x2,
          y2,
          life: 0.16,
          color: '#ff2a85',
          width: 5.5,
        });
        const dx = x2 - muzzle.x;
        const dy = y2 - muzzle.y;
        const lenSq = dx * dx + dy * dy;
        for (const e of s.enemies) {
          const targetY = e.y - 36;
          const hitTol = isWorldBossKind(e.kind) ? 58 : 44;
          const pr = Math.max(0, Math.min(1, ((e.x - muzzle.x) * dx + (targetY - muzzle.y) * dy) / lenSq));
          if (Math.hypot(e.x - (muzzle.x + pr * dx), targetY - (muzzle.y + pr * dy)) < hitTol) {
            damageEnemy(e, 54 * lvlScale, WeaponId.PULSE_LASER, 1.0);
          }
        }
        for (const m of s.logicMines) {
          const pr = Math.max(0, Math.min(1, ((m.x - muzzle.x) * dx + (m.y - muzzle.y) * dy) / lenSq));
          if (Math.hypot(m.x - (muzzle.x + pr * dx), m.y - (muzzle.y + pr * dy)) < 32) {
            hitLogicMinesInRange(m.x, m.y, 35, 60);
          }
        }
        for (const prop of s.halloweenProps) {
          if (prop.smashed) continue;
          const pyCenter = prop.y - 14;
          const pr = Math.max(0, Math.min(1, ((prop.x - muzzle.x) * dx + (pyCenter - muzzle.y) * dy) / lenSq));
          if (Math.hypot(prop.x - (muzzle.x + pr * dx), pyCenter - (muzzle.y + pr * dy)) < 34) {
            damageHalloweenPropsInRange(prop.x, prop.y, 32, 48);
          }
        }
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    } else if (s.weapon === WeaponId.DISRUPTOR_CANNON) {
      if (pState.ammoCells >= 2) {
        s.attackCooldown = 0.48 * hasteMult;
        s.recoilTimer = 0.18;
        s.shakeTimer = 0.14;
        s.shakeIntensity = 6;
        cb.onLootCollected({ ammoCells: -2 });
        soundFX.playDisruptorCannon();
        const locked = findLockedTarget(s);
        const ang = locked ? Math.atan2(locked.y - 34 - muzzle.y, locked.x - muzzle.x) : s.aimAngle;
        s.projectiles.push({
          id: `cn-${now}`,
          x: muzzle.x,
          y: muzzle.y,
          vx: Math.cos(ang) * 630,
          vy: Math.sin(ang) * 630,
          fromPlayer: true,
          kind: 'cannon_shell',
          damage: 116 * lvlScale,
          targetEnemyId: locked?.id,
          life: 1.55,
        });
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    } else if (s.weapon === WeaponId.PLASMA_SCATTERGUN) {
      if (pState.ammoCells >= 1) {
        s.attackCooldown = 0.34 * hasteMult;
        s.recoilTimer = 0.16;
        s.shakeTimer = 0.08;
        s.shakeIntensity = 4;
        cb.onLootCollected({ ammoCells: -1 });
        soundFX.playPlasmaScatter();
        for (const spread of [-0.26, -0.13, 0, 0.13, 0.26]) {
          const ang = s.aimAngle + spread;
          s.projectiles.push({
            id: `psg-${now}-${spread}-${Math.random()}`,
            x: muzzle.x,
            y: muzzle.y,
            vx: Math.cos(ang) * 720,
            vy: Math.sin(ang) * 720,
            fromPlayer: true,
            kind: 'plasma_pellet',
            damage: 34 * lvlScale,
            life: 0.56,
          });
        }
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    } else if (s.weapon === WeaponId.TESLA_ARC_EMITTER) {
      if (pState.ammoCells >= 1) {
        s.attackCooldown = 0.28 * hasteMult;
        s.recoilTimer = 0.12;
        cb.onLootCollected({ ammoCells: -1 });
        soundFX.playTeslaArc();

        const visited = new Set<string>();
        let fromX = muzzle.x;
        let fromY = muzzle.y;

        // First target along aim cone within 460px
        let firstTarget: InternalEnemy | undefined;
        let bestScore = 460;
        for (const e of s.enemies) {
          if (e.hp <= 0 || isWildPetEnemyKind(e.kind)) continue;
          const d = Math.hypot(e.x - fromX, e.y - 32 - fromY);
          const angDiff = Math.abs(
            Math.atan2(
              Math.sin(Math.atan2(e.y - 32 - fromY, e.x - fromX) - s.aimAngle),
              Math.cos(Math.atan2(e.y - 32 - fromY, e.x - fromX) - s.aimAngle)
            )
          );
          if (d <= 460 && angDiff < 0.75 && d < bestScore) {
            bestScore = d;
            firstTarget = e;
          }
        }

        if (firstTarget) {
          let cur: InternalEnemy | undefined = firstTarget;
          for (let hop = 0; hop < 4 && cur; hop++) {
            visited.add(cur.id);
            const tx = cur.x;
            const ty = cur.y - 32;
            const midX = (fromX + tx) * 0.5 + (Math.random() - 0.5) * 26;
            const midY = (fromY + ty) * 0.5 + (Math.random() - 0.5) * 26;
            s.lasers.push({ x1: fromX, y1: fromY, x2: midX, y2: midY, life: 0.16, color: '#38bdf8', width: 4.5 });
            s.lasers.push({ x1: midX, y1: midY, x2: tx, y2: ty, life: 0.16, color: '#a855f7', width: 4.5 });
            cur.stunTimer = Math.max(cur.stunTimer, isWorldBossKind(cur.kind) ? 0.25 : 0.48);
            damageEnemy(cur, 66 * lvlScale * Math.pow(0.88, hop), WeaponId.TESLA_ARC_EMITTER, 2.2);
            fromX = tx;
            fromY = ty;

            let nextChain: InternalEnemy | undefined;
            let bestChainDist = 240;
            for (const cand of s.enemies) {
              if (cand.hp <= 0 || visited.has(cand.id) || isWildPetEnemyKind(cand.kind)) continue;
              const cd = Math.hypot(cand.x - fromX, cand.y - 32 - fromY);
              if (cd < bestChainDist) {
                bestChainDist = cd;
                nextChain = cand;
              }
            }
            cur = nextChain;
          }
        } else {
          const endX = muzzle.x + Math.cos(s.aimAngle) * 340;
          const endY = muzzle.y + Math.sin(s.aimAngle) * 340;
          s.lasers.push({ x1: muzzle.x, y1: muzzle.y, x2: endX, y2: endY, life: 0.14, color: '#38bdf8', width: 4 });
          hitLogicMinesInRange(endX, endY, 85, 65);
          damageHalloweenPropsInRange(endX, endY, 85, 60);
        }
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    } else if (s.weapon === WeaponId.GAUSS_RAILGUN) {
      if (pState.ammoCells >= 2) {
        s.attackCooldown = 0.56 * hasteMult;
        s.recoilTimer = 0.22;
        s.shakeTimer = 0.16;
        s.shakeIntensity = 7.5;
        cb.onLootCollected({ ammoCells: -2 });
        soundFX.playGaussRailgun();

        const x2 = muzzle.x + Math.cos(s.aimAngle) * 960;
        const y2 = muzzle.y + Math.sin(s.aimAngle) * 960;
        s.lasers.push({ x1: muzzle.x, y1: muzzle.y, x2, y2, life: 0.24, color: '#00e5ff', width: 8 });
        s.lasers.push({ x1: muzzle.x, y1: muzzle.y, x2, y2, life: 0.2, color: '#fde047', width: 3.5 });
        for (const distStep of [160, 380, 620]) {
          s.slashes.push({
            x: muzzle.x + Math.cos(s.aimAngle) * distStep,
            y: muzzle.y + Math.sin(s.aimAngle) * distStep,
            angle: 0,
            radius: 34,
            color: '#00e5ff',
            isEmp: true,
            life: 0.18,
          });
        }

        const dx = x2 - muzzle.x;
        const dy = y2 - muzzle.y;
        const lenSq = dx * dx + dy * dy;
        for (const e of s.enemies) {
          const targetY = e.y - 36;
          const hitTol = isWorldBossKind(e.kind) ? 62 : 48;
          const pr = Math.max(0, Math.min(1, ((e.x - muzzle.x) * dx + (targetY - muzzle.y) * dy) / lenSq));
          if (Math.hypot(e.x - (muzzle.x + pr * dx), targetY - (muzzle.y + pr * dy)) < hitTol) {
            damageEnemy(e, 165 * lvlScale, WeaponId.GAUSS_RAILGUN, 3.6);
          }
        }
        for (const m of s.logicMines) {
          const pr = Math.max(0, Math.min(1, ((m.x - muzzle.x) * dx + (m.y - muzzle.y) * dy) / lenSq));
          if (Math.hypot(m.x - (muzzle.x + pr * dx), m.y - (muzzle.y + pr * dy)) < 38) {
            hitLogicMinesInRange(m.x, m.y, 40, 120);
          }
        }
        for (const prop of s.halloweenProps) {
          if (prop.smashed) continue;
          const pyCenter = prop.y - 14;
          const pr = Math.max(0, Math.min(1, ((prop.x - muzzle.x) * dx + (pyCenter - muzzle.y) * dy) / lenSq));
          if (Math.hypot(prop.x - (muzzle.x + pr * dx), pyCenter - (muzzle.y + pr * dy)) < 40) {
            damageHalloweenPropsInRange(prop.x, prop.y, 40, 120);
          }
        }
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    } else if (s.weapon === WeaponId.SINGULARITY_LAUNCHER) {
      if (pState.ammoCells >= 3) {
        s.attackCooldown = 0.68 * hasteMult;
        s.recoilTimer = 0.24;
        s.shakeTimer = 0.16;
        s.shakeIntensity = 7;
        cb.onLootCollected({ ammoCells: -3 });
        soundFX.playSingularityBlast();
        s.projectiles.push({
          id: `sng-${now}-${Math.random()}`,
          x: muzzle.x,
          y: muzzle.y,
          vx: Math.cos(s.aimAngle) * 410,
          vy: Math.sin(s.aimAngle) * 410,
          fromPlayer: true,
          kind: 'singularity_orb',
          damage: 195 * lvlScale,
          life: 1.65,
        });
      } else {
        s.attackCooldown = 0.35;
        s.floatTexts.push({ x: s.px, y: s.py - 68, text: 'NO CELLS [R]', color: '#fbbf24', life: 0.7 });
      }
    }
  }

  // Update Defusable In-World Logic Mines
  const activeMines: SimState['logicMines'] = [];
  for (const m of s.logicMines) {
    m.timer -= dt;
    if (m.timer <= 0) {
      soundFX.playDisruptorCannon();
      if (Math.hypot(s.px - m.x, s.py - m.y) <= m.radius) {
        damagePlayer(14, 5);
      }
      for (let k = 0; k < 14; k++) {
        const a = Math.random() * Math.PI * 2;
        s.particles.push({
          x: m.x,
          y: m.y,
          vx: Math.cos(a) * 160,
          vy: Math.sin(a) * 160,
          size: 4,
          color: '#ff1744',
          life: 0.4,
          maxLife: 0.4,
        });
      }
    } else {
      activeMines.push(m);
    }
  }
  s.logicMines = activeMines;

  const findPetTarget = (fromX: number, fromY: number, maxRange: number): InternalEnemy | undefined => {
    let bestHostile: InternalEnemy | undefined;
    let bestHostileDist = maxRange;
    let bestWild: InternalEnemy | undefined;
    let bestWildDist = maxRange;
    for (const e of s.enemies) {
      if (e.hp <= 0 || e.captureTimer > 0) continue;
      const d = Math.hypot(e.x - fromX, e.y - fromY);
      const isWild = isWildPetEnemyKind(e.kind);
      if (!isWild) {
        if (d < bestHostileDist) {
          bestHostileDist = d;
          bestHostile = e;
        }
      } else if (e.berserk && d < bestWildDist) {
        bestWildDist = d;
        bestWild = e;
      }
    }
    return bestHostile || bestWild;
  };

  // PET 1: Tamed Cyber Hound
  const dogComp = pState.companions.find((c) => c.kind === CompanionKind.SCOUT_DOG);
  if (dogComp) {
    if (s.dogAttackCd > 0) s.dogAttackCd -= dt;
    const target = findPetTarget(s.px, s.py, 620);
    if (target) {
      target.markedByDog = true;
      const wp = steerThroughFacilityDoors(s.dogX, s.dogY, target.x, target.y);
      const dx = wp.wx - s.dogX;
      const dy = wp.wy - s.dogY;
      const d = Math.hypot(dx, dy) || 1;
      s.dogFacingRight = dx >= 0;
      if (d > 28) {
        s.dogX += (dx / d) * 320 * dt;
        s.dogY += (dy / d) * 320 * dt;
      }
      if (Math.hypot(target.x - s.dogX, target.y - s.dogY) < 52 && s.dogAttackCd <= 0) {
        s.dogAttackCd = 0.65;
        target.slowTimer = 2.6;
        const biteAng = Math.atan2(target.y - s.dogY, target.x - s.dogX);
        s.slashes.push({
          x: s.dogX,
          y: s.dogY - 14,
          angle: biteAng,
          radius: 48,
          color: '#00b4ff',
          isEmp: false,
          life: 0.16,
        });
        damageEnemy(target, 40 + dogComp.level * 10, s.weapon, 1.5, true);
      }
    } else {
      const homeX = s.px - 54;
      const homeY = s.py + 22;
      const dx = homeX - s.dogX;
      const dy = homeY - s.dogY;
      if (Math.abs(dx) > 2) s.dogFacingRight = dx >= 0;
      s.dogX += dx * 5.2 * dt;
      s.dogY += dy * 5.2 * dt;
    }
  }

  // PET 2: Tamed Cyber Cat
  const catComp = pState.companions.find((c) => c.kind === CompanionKind.CYBER_CAT);
  if (catComp) {
    if (s.catAttackCd > 0) s.catAttackCd -= dt;
    const nearbyChest = s.chests.find((c) => !c.opened && Math.hypot(c.x - s.px, c.y - s.py) < 280);
    if (nearbyChest) {
      const dx = nearbyChest.x - s.catX;
      const dy = nearbyChest.y - s.catY;
      const d = Math.hypot(dx, dy) || 1;
      s.catFacingRight = dx >= 0;
      if (d > 24) {
        s.catX += (dx / d) * 265 * dt;
        s.catY += (dy / d) * 265 * dt;
      } else if ((nearbyChest.hackProgress += dt * 1.1) >= 1) {
        nearbyChest.opened = true;
        soundFX.playLootPickup(true);
        s.drops.push({ id: `co-${now}`, x: nearbyChest.x - 12, y: nearbyChest.y, kind: 'oCore', amount: 1 });
        s.drops.push({ id: `ca-${now}`, x: nearbyChest.x + 12, y: nearbyChest.y, kind: 'aCore', amount: 1 });
        s.drops.push({ id: `cru9-${now}`, x: nearbyChest.x, y: nearbyChest.y + 10, kind: 'ru9', amount: 3500 });
      }
    } else {
      const homeX = s.px + 54;
      const homeY = s.py - 18;
      const dx = homeX - s.catX;
      const dy = homeY - s.catY;
      if (Math.abs(dx) > 3) s.catFacingRight = dx >= 0;
      s.catX += dx * 5.2 * dt;
      s.catY += dy * 5.2 * dt;
    }

    const catTarget = findPetTarget(s.catX, s.catY, 560);
    if (catTarget && s.catAttackCd <= 0) {
      s.catAttackCd = 0.6;
      s.catFacingRight = catTarget.x >= s.catX;
      s.lasers.push({
        x1: s.catX,
        y1: s.catY - 22,
        x2: catTarget.x,
        y2: catTarget.y - 28,
        life: 0.15,
        color: '#00b4ff',
        width: 3.6,
      });
      damageEnemy(catTarget, 36 + catComp.level * 9, s.weapon, 1.1, true);
    }

    for (const drop of s.drops) {
      const d = Math.hypot(s.px - drop.x, s.py - drop.y);
      if (d < 460 && d > 12) {
        drop.x += ((s.px - drop.x) / d) * 440 * dt;
        drop.y += ((s.py - drop.y) / d) * 440 * dt;
      }
    }
  }

  // PET 3: Tamed Halloween Pumpkin Spirit (Jack-Pup — hurls explosive Jack-o'-Bombs & conjures Soul Candies)
  const pumpkinComp = pState.companions.find((c) => c.kind === CompanionKind.PUMPKIN_SPIRIT);
  if (pumpkinComp) {
    if (s.pumpkinPetAttackCd > 0) s.pumpkinPetAttackCd -= dt;
    const homeX = s.px - 46 + Math.cos(now * 2.1) * 10;
    const homeY = s.py - 32 + Math.sin(now * 2.8) * 8;
    const dx = homeX - s.pumpkinPetX;
    const dy = homeY - s.pumpkinPetY;
    if (Math.abs(dx) > 3) s.pumpkinPetFacingRight = dx >= 0;
    s.pumpkinPetX += dx * 5.6 * dt;
    s.pumpkinPetY += dy * 5.6 * dt;

    const pTarget = findPetTarget(s.pumpkinPetX, s.pumpkinPetY, 560);
    if (pTarget && s.pumpkinPetAttackCd <= 0) {
      s.pumpkinPetAttackCd = 0.88;
      s.pumpkinPetFacingRight = pTarget.x >= s.pumpkinPetX;
      const ang = Math.atan2(pTarget.y - 26 - (s.pumpkinPetY - 22), pTarget.x - s.pumpkinPetX);
      s.projectiles.push({
        id: `pjb-${now}-${Math.random()}`,
        x: s.pumpkinPetX,
        y: s.pumpkinPetY - 22,
        vx: Math.cos(ang) * 420,
        vy: Math.sin(ang) * 420,
        fromPlayer: true,
        kind: 'jack_bomb',
        damage: 44 + pumpkinComp.level * 11,
        targetEnemyId: pTarget.id,
        life: 1.5,
      });
    }

    if ((s.pumpkinCandyTimer -= dt) <= 0) {
      s.pumpkinCandyTimer = 14.0;
      s.drops.push({
        id: `pup-candy-${now}`,
        x: s.pumpkinPetX,
        y: s.pumpkinPetY + 6,
        kind: 'candy',
        amount: 1,
      });
    }
  }

  // PET 4: Tamed Halloween Cyber Night-Bat (Nosferatu-Bit — fires sonic mark beams & leeches HP)
  const batComp = pState.companions.find((c) => c.kind === CompanionKind.NIGHT_BAT);
  if (batComp) {
    if (s.batPetAttackCd > 0) s.batPetAttackCd -= dt;
    const homeX = s.px + 46 + Math.sin(now * 2.6) * 12;
    const homeY = s.py - 38 + Math.cos(now * 3.2) * 9;
    const dx = homeX - s.batPetX;
    const dy = homeY - s.batPetY;
    if (Math.abs(dx) > 3) s.batPetFacingRight = dx >= 0;
    s.batPetX += dx * 6.0 * dt;
    s.batPetY += dy * 6.0 * dt;

    const bTarget = findPetTarget(s.batPetX, s.batPetY, 580);
    if (bTarget && s.batPetAttackCd <= 0) {
      s.batPetAttackCd = 0.58;
      s.batPetFacingRight = bTarget.x >= s.batPetX;
      bTarget.markedByDog = true;
      s.lasers.push({
        x1: s.batPetX,
        y1: s.batPetY - 26,
        x2: bTarget.x,
        y2: bTarget.y - 30,
        life: 0.14,
        color: '#c084fc',
        width: 3.4,
      });
      damageEnemy(bTarget, 34 + batComp.level * 9, s.weapon, 1.25, true);
      s.batLeechHits += 1;
      if (s.batLeechHits % 3 === 0 && s.hp < s.maxHp) {
        s.hp = Math.min(s.maxHp, s.hp + 3);
        cb.setPlayerHp(Math.round(s.hp));
      }
    }
  }

  for (const chest of s.chests) {
    if (!chest.opened && Math.hypot(s.px - chest.x, s.py - chest.y) < 48 && (chest.hackProgress += dt * 0.75) >= 1) {
      chest.opened = true;
      soundFX.playLootPickup(true);
      s.drops.push({ id: `pco-${now}`, x: chest.x - 12, y: chest.y, kind: 'oCore', amount: 1 });
      s.drops.push({ id: `pca-${now}`, x: chest.x + 12, y: chest.y, kind: 'ammo', amount: 12 });
      s.drops.push({ id: `pcru9-${now}`, x: chest.x, y: chest.y + 10, kind: 'ru9', amount: 3500 });
    }
  }

  const emitMuzzleSparks = (mxPos: number, myPos: number, ang: number, color: string, count = 4) => {
    for (let i = 0; i < count; i++) {
      const spread = ang + (Math.random() - 0.5) * 0.6;
      const spd = 60 + Math.random() * 75;
      s.particles.push({
        x: mxPos,
        y: myPos,
        vx: Math.cos(spread) * spd,
        vy: Math.sin(spread) * spd,
        size: 3.2,
        color,
        life: 0.18,
        maxLife: 0.18,
      });
    }
  };

  const indoorBotsRemaining = s.enemies.some(
    (en) => en.hp > 0 && en.x < OUTDOOR_DIVIDE_X && !isWildPetEnemyKind(en.kind)
  );

  // Hostile Bots, Cthulhu Mutants, Giant Mechs, Chimeras, Halloween Revenants & World Bosses Resolution
  const capturedIds = new Set<string>();
  let nearestBoss: InternalEnemy | undefined;
  let nearestBossDist = 1040;

  for (const e of s.enemies) {
    if (e.hitFlash > 0) e.hitFlash -= dt;
    if (e.slowTimer > 0) e.slowTimer -= dt;
    if (e.meleeSwingTimer > 0) e.meleeSwingTimer -= dt;

    if (e.captureTimer > 0) {
      e.captureTimer -= dt;
      e.eyeChargeTimer = 0;
      if (e.captureTimer <= 0) {
        const compKind = wildEnemyToCompanionKind(e.kind);
        const alreadyOwned = pState.companions.some((c) => c.kind === compKind);
        const captureProb = Math.min(0.95, 0.52 + (1 - e.hp / e.maxHp) * 0.45);

        if (alreadyOwned) {
          cb.onLootCollected({ masterSpheres: 1 });
          s.floatTexts.push({
            x: e.x,
            y: e.y - 52,
            text: 'ALREADY TAMED (ORB REFUNDED)',
            color: '#d9ff00',
            life: 1.2,
          });
        } else if (Math.random() < captureProb) {
          soundFX.playCaptureResult(true);
          capturedIds.add(e.id);
          if (compKind === CompanionKind.SCOUT_DOG) {
            s.dogX = e.x;
            s.dogY = e.y;
          } else if (compKind === CompanionKind.CYBER_CAT) {
            s.catX = e.x;
            s.catY = e.y;
          } else if (compKind === CompanionKind.PUMPKIN_SPIRIT) {
            s.pumpkinPetX = e.x;
            s.pumpkinPetY = e.y;
            spawnBats(e.x, e.y - 24, 6);
          } else if (compKind === CompanionKind.NIGHT_BAT) {
            s.batPetX = e.x;
            s.batPetY = e.y;
            spawnBats(e.x, e.y - 24, 6);
          }
          cb.onCompanionCaptured(compKind);
          const tamedLabel =
            compKind === CompanionKind.PUMPKIN_SPIRIT
              ? '🎃 PUMPKIN SPIRIT TAMED!'
              : compKind === CompanionKind.NIGHT_BAT
              ? '🦇 CYBER NIGHT-BAT TAMED!'
              : compKind === CompanionKind.CYBER_CAT
              ? 'CYBER CAT TAMED!'
              : 'CYBER HOUND TAMED!';
          s.floatTexts.push({
            x: e.x,
            y: e.y - 52,
            text: tamedLabel,
            color:
              compKind === CompanionKind.PUMPKIN_SPIRIT
                ? '#fb923c'
                : compKind === CompanionKind.NIGHT_BAT
                ? '#c084fc'
                : '#38bdf8',
            life: 1.35,
          });
        } else {
          soundFX.playCaptureResult(false);
          e.berserk = true;
          s.floatTexts.push({
            x: e.x,
            y: e.y - 52,
            text: `RESISTED (${Math.round(captureProb * 100)}%) · WEAKEN HP!`,
            color: '#fbbf24',
            life: 1.25,
          });
        }
      }
      continue;
    }

    const groundDist = Math.hypot(s.px - e.x, s.py - e.y) || 1;
    if (isWorldBossKind(e.kind) && e.hp > 0 && groundDist < nearestBossDist) {
      nearestBossDist = groundDist;
      nearestBoss = e;
    }

    if (e.stunTimer > 0) {
      e.stunTimer -= dt;
      e.eyeChargeTimer = 0;
      e.burstRemaining = 0;
      e.isMoving = false;
      continue;
    }

    const dx = s.px - e.x;
    const dy = s.py - 28 - (e.y - 24);
    const isWildPet = isWildPetEnemyKind(e.kind);
    const isEldritch = isEldritchEnemyKind(e.kind);
    const isBoss = isWorldBossKind(e.kind);

    // Resolve Active Crimson / Abyssal / Titan / Halloween Eye-Laser Charge -> Twin Eye Beams!
    if (e.eyeChargeTimer > 0) {
      e.eyeChargeTimer -= dt;
      e.isMoving = false;
      if (e.eyeChargeTimer <= 0) {
        const anchors = getEnemyCombatAnchorsWorld(e);
        soundFX.playPulseLaser();
        const beamColor =
          e.kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN ||
          e.kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER ||
          e.kind === EnemyKind.PUMPKIN_SCYTHE_REAPER
            ? '#f97316'
            : e.kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH ||
              isEldritch ||
              e.kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM
            ? '#c026d3'
            : '#ff1744';
        const beamRange = isBoss ? 680 : 540;
        const beamWidth = isBoss ? 5.6 : isEldritch ? 4.4 : 3.6;

        const fireFromEye = (eyePos: { x: number; y: number }, angleOffset = 0) => {
          const ang = Math.atan2(e.eyeTargetY - eyePos.y, e.eyeTargetX - eyePos.x) + angleOffset;
          const lx2 = eyePos.x + Math.cos(ang) * beamRange;
          const ly2 = eyePos.y + Math.sin(ang) * beamRange;
          s.lasers.push({
            x1: eyePos.x,
            y1: eyePos.y,
            x2: lx2,
            y2: ly2,
            life: 0.25,
            color: beamColor,
            width: beamWidth,
          });
          const ldx = lx2 - eyePos.x;
          const ldy = ly2 - eyePos.y;
          const lSq = ldx * ldx + ldy * ldy;
          const pr = Math.max(
            0,
            Math.min(1, ((s.px - eyePos.x) * ldx + (s.py - 32 - eyePos.y) * ldy) / lSq)
          );
          if (Math.hypot(s.px - (eyePos.x + pr * ldx), s.py - 32 - (eyePos.y + pr * ldy)) < 25) {
            damagePlayer(isBoss ? 12 : isEldritch ? 10 : 8, 5);
          }
        };
        fireFromEye(anchors.leftEye);
        fireFromEye(anchors.rightEye);
        if (e.kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM) {
          fireFromEye(
            {
              x: (anchors.leftEye.x + anchors.rightEye.x) * 0.5,
              y: anchors.leftEye.y - 10,
            },
            0
          );
        }
      }
      continue;
    }

    // Resolve Multi-Shot Rifle / Autocannon Burst from exact Gun Muzzle
    if (e.burstRemaining > 0) {
      e.burstTimer -= dt;
      if (e.burstTimer <= 0) {
        e.burstRemaining -= 1;
        e.burstTimer = 0.14;
        const anchors = getEnemyCombatAnchorsWorld(e);
        const spread = (Math.random() - 0.5) * 0.1;
        const ang = e.facingAngle + spread;
        emitMuzzleSparks(
          anchors.gunMuzzle.x,
          anchors.gunMuzzle.y,
          ang,
          isMechaOrChimeraKind(e.kind) ? '#f97316' : '#ff2a85',
          4
        );
        s.projectiles.push({
          id: `eb-${now}-${Math.random()}`,
          x: anchors.gunMuzzle.x,
          y: anchors.gunMuzzle.y,
          vx: Math.cos(ang) * 255,
          vy: Math.sin(ang) * 255,
          fromPlayer: false,
          kind: 'enemy_bullet',
          damage: isBoss ? 8 : 6,
          life: 2.6,
        });
      }
    }

    let spd =
      e.kind === EnemyKind.CHIMERA_HOUND_WEAVER
        ? 86
        : e.kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER
        ? 82
        : e.kind === EnemyKind.OPENAI_VIPER
        ? 78
        : e.kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH
        ? 76
        : e.kind === EnemyKind.PUMPKIN_SCYTHE_REAPER
        ? 74
        : e.kind === EnemyKind.MECH_SPIDER_ARACHNID
        ? 66
        : e.kind === EnemyKind.OPENAI_STALKER
        ? 64
        : e.kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER
        ? 58
        : e.kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH
        ? 52
        : e.kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT ||
          e.kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT ||
          e.kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM
        ? 50
        : e.kind === EnemyKind.SHOGGOTH_CORE_AMALGAM
        ? 48
        : e.kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN
        ? 46
        : e.kind === EnemyKind.ANTHROPIC_BULWARK
        ? 45
        : e.kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME
        ? 44
        : e.kind === EnemyKind.LOGIC_WEAVER_ELITE
        ? 42
        : 52;
    if (e.berserk) spd *= 1.15;
    if (e.slowTimer > 0) spd *= 0.48;

    // Open-World Monsters (x > OUTDOOR_DIVIDE_X) patrol their outdoor territory until player approaches or clears indoor rooms
    const outdoorTerritoryProwl =
      e.x >= OUTDOOR_DIVIDE_X &&
      s.px < OUTDOOR_DIVIDE_X - 240 &&
      groundDist > 920 &&
      indoorBotsRemaining;

    if ((isWildPet && !e.berserk) || outdoorTerritoryProwl) {
      const patrolAng = now * 0.7 + e.id.length * 1.3;
      e.facingAngle = patrolAng;
      e.isMoving = true;
      e.walkPhase += dt * 6.5;
      const m = clampObs(
        e.x + Math.cos(patrolAng) * 34 * dt,
        e.y + Math.sin(patrolAng) * 28 * dt,
        22
      );
      if (e.x < OUTDOOR_DIVIDE_X || m.x > OUTDOOR_DIVIDE_X + 60) {
        e.x = m.x;
        e.y = m.y;
      }
    } else {
      e.facingAngle = Math.atan2(dy, dx);
      const preferredStopDist =
        isBoss || e.kind === EnemyKind.LOGIC_WEAVER_ELITE
          ? 240
          : e.kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT || e.kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT
          ? 200
          : e.kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH ||
            e.kind === EnemyKind.SHOGGOTH_CORE_AMALGAM ||
            e.kind === EnemyKind.ANTHROPIC_BULWARK
          ? 185
          : e.kind === EnemyKind.MECH_SPIDER_ARACHNID || e.kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH
          ? 170
          : e.kind === EnemyKind.OPENAI_STALKER
          ? 155
          : 44;

      if (groundDist > preferredStopDist) {
        e.isMoving = true;
        e.walkPhase += dt * (spd * 0.14);
        const wp = steerThroughFacilityDoors(e.x, e.y, s.px, s.py);
        const wDist = Math.hypot(wp.wx - e.x, wp.wy - e.y) || 1;
        const m = clampObs(
          e.x + ((wp.wx - e.x) / wDist) * spd * dt,
          e.y + ((wp.wy - e.y) / wDist) * spd * dt,
          isBoss ? 26 : 20
        );
        e.x = m.x;
        e.y = m.y;
      } else {
        e.isMoving = false;
      }
    }

    e.attackCooldown -= dt;
    if (e.attackCooldown <= 0 && !outdoorTerritoryProwl) {
      if (isWildPet) {
        if (e.berserk && groundDist < 48) {
          e.attackCooldown = 1.15;
          s.slashes.push({
            x: e.x,
            y: e.y - 14,
            angle: e.facingAngle,
            radius: 42,
            color: '#ff1744',
            isEmp: false,
            life: 0.18,
          });
          damagePlayer(7, 3.5);
        }
      } else if (e.kind === EnemyKind.MECH_SPIDER_ARACHNID && groundDist < 580) {
        // Giant 6-Legged Spider Mech: Twin Plasma Salvo -> Dorsal Mortar Rocket!
        const step = e.attackPatternStep % 3;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);
        if (step < 2) {
          e.attackCooldown = 2.1;
          e.burstRemaining = 3;
          e.burstTimer = 0.02;
        } else {
          e.attackCooldown = 2.6;
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#f97316', 6);
          s.projectiles.push({
            id: `msp-r-${now}-${Math.random()}`,
            x: anchors.rocketMuzzle.x,
            y: anchors.rocketMuzzle.y,
            vx: Math.cos(e.facingAngle) * 210,
            vy: Math.sin(e.facingAngle) * 210,
            fromPlayer: false,
            kind: 'enemy_rocket',
            damage: 11,
            life: 2.9,
          });
        }
      } else if (e.kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
        // Mutated Excavator Wrecker: Molten Buzzsaw Cleave OR Spinning Plasma Saw + Shrapnel!
        if (groundDist < 84) {
          e.attackCooldown = 1.15;
          e.meleeSwingTimer = 0.28;
          soundFX.playChainsawRip();
          s.slashes.push({
            x: e.x,
            y: e.y - 26,
            angle: e.facingAngle,
            radius: 82,
            color: '#f97316',
            isEmp: false,
            life: 0.24,
          });
          damagePlayer(11, 5);
        } else if (groundDist < 560) {
          e.attackCooldown = 2.55;
          const anchors = getEnemyCombatAnchorsWorld(e);
          soundFX.playChainsawRip();
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#fb923c', 7);
          s.projectiles.push({
            id: `exc-saw-${now}-${Math.random()}`,
            x: anchors.gunMuzzle.x,
            y: anchors.gunMuzzle.y,
            vx: Math.cos(e.facingAngle) * 235,
            vy: Math.sin(e.facingAngle) * 235,
            fromPlayer: false,
            kind: 'plasma_saw',
            damage: 11,
            life: 3.0,
          });
          for (const off of [-0.22, 0.22]) {
            const ang = e.facingAngle + off;
            s.projectiles.push({
              id: `exc-sh-${now}-${off}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 250,
              vy: Math.sin(ang) * 250,
              fromPlayer: false,
              kind: 'enemy_bullet',
              damage: 7,
              life: 2.5,
            });
          }
        }
      } else if (e.kind === EnemyKind.CHIMERA_HOUND_WEAVER) {
        // Fusion Monster: Quadruped Claw Pounce + Grafted Pulse Burst + Cthulhu Scorpion Optic Laser!
        if (groundDist < 74) {
          e.attackCooldown = 1.05;
          e.meleeSwingTimer = 0.24;
          soundFX.playArcSlash(false);
          s.slashes.push({
            x: e.x,
            y: e.y - 20,
            angle: e.facingAngle,
            radius: 68,
            color: '#f43f5e',
            isEmp: false,
            life: 0.2,
          });
          damagePlayer(9, 4);
        } else if (groundDist < 480) {
          const step = e.attackPatternStep % 2;
          e.attackPatternStep += 1;
          if (step === 0) {
            e.attackCooldown = 2.1;
            e.burstRemaining = 2;
            e.burstTimer = 0.02;
          } else {
            e.attackCooldown = 2.5;
            e.eyeChargeTimer = 0.42;
            e.eyeTargetX = s.px;
            e.eyeTargetY = s.py - 32;
          }
        }
      } else if (e.kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT && groundDist < 600) {
        // Elite Multi-Monster Fusion: 3-Shot Autocannon -> Shoulder RPG -> Twin Abyssal Orbs!
        const step = e.attackPatternStep % 3;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);
        if (step === 0) {
          e.attackCooldown = 2.2;
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#00e5ff', 6);
          for (let b = -1; b <= 1; b++) {
            const ang = e.facingAngle + b * 0.2;
            s.projectiles.push({
              id: `jug-b-${now}-${b}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 250,
              vy: Math.sin(ang) * 250,
              fromPlayer: false,
              kind: 'enemy_bullet',
              damage: 8,
              life: 2.7,
            });
          }
        } else if (step === 1) {
          e.attackCooldown = 2.5;
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#eab308', 7);
          s.projectiles.push({
            id: `jug-r-${now}-${Math.random()}`,
            x: anchors.rocketMuzzle.x,
            y: anchors.rocketMuzzle.y,
            vx: Math.cos(e.facingAngle) * 215,
            vy: Math.sin(e.facingAngle) * 215,
            fromPlayer: false,
            kind: 'enemy_rocket',
            damage: 12,
            life: 2.9,
          });
        } else {
          e.attackCooldown = 2.4;
          for (const off of [-0.18, 0.18]) {
            const ang = e.facingAngle + off;
            s.projectiles.push({
              id: `jug-o-${now}-${off}-${Math.random()}`,
              x: e.x,
              y: e.y - 44,
              vx: Math.cos(ang) * 215,
              vy: Math.sin(ang) * 215,
              fromPlayer: false,
              kind: 'eldritch_orb',
              damage: 9,
              life: 3.0,
            });
          }
        }
      } else if (e.kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN && groundDist < 720) {
        // WORLD BOSS 1: Iron Colossus Titan (Shockwave Stomp / 5-Shot Gatling / Twin Rockets / 3 Plasma Saws / Mega-Visor Beam!)
        if (groundDist < 96) {
          e.attackCooldown = 1.45;
          soundFX.playDisruptorCannon();
          s.slashes.push({
            x: e.x,
            y: e.y - 16,
            angle: 0,
            radius: 112,
            color: '#f97316',
            isEmp: true,
            life: 0.25,
          });
          damagePlayer(13, 6.5);
        } else {
          const step = e.attackPatternStep % 4;
          e.attackPatternStep += 1;
          const anchors = getEnemyCombatAnchorsWorld(e);

          if (step === 0) {
            e.attackCooldown = 2.0;
            emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#f97316', 9);
            for (let b = -2; b <= 2; b++) {
              const ang = e.facingAngle + b * 0.14;
              s.projectiles.push({
                id: `tit-g-${now}-${b}-${Math.random()}`,
                x: anchors.gunMuzzle.x,
                y: anchors.gunMuzzle.y,
                vx: Math.cos(ang) * 265,
                vy: Math.sin(ang) * 265,
                fromPlayer: false,
                kind: 'enemy_bullet',
                damage: 8,
                life: 2.8,
              });
            }
          } else if (step === 1) {
            e.attackCooldown = 2.3;
            soundFX.playDisruptorCannon();
            emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#fb923c', 8);
            for (const off of [-0.12, 0.12]) {
              const ang = e.facingAngle + off;
              s.projectiles.push({
                id: `tit-r-${now}-${off}-${Math.random()}`,
                x: anchors.rocketMuzzle.x,
                y: anchors.rocketMuzzle.y,
                vx: Math.cos(ang) * 225,
                vy: Math.sin(ang) * 225,
                fromPlayer: false,
                kind: 'enemy_rocket',
                damage: 13,
                life: 3.1,
              });
            }
          } else if (step === 2) {
            e.attackCooldown = 2.4;
            soundFX.playChainsawRip();
            for (let k = -1; k <= 1; k++) {
              const ang = e.facingAngle + k * 0.22;
              s.projectiles.push({
                id: `tit-saw-${now}-${k}-${Math.random()}`,
                x: anchors.gunMuzzle.x,
                y: anchors.gunMuzzle.y,
                vx: Math.cos(ang) * 240,
                vy: Math.sin(ang) * 240,
                fromPlayer: false,
                kind: 'plasma_saw',
                damage: 12,
                life: 3.1,
              });
            }
          } else {
            e.attackCooldown = 2.4;
            e.eyeChargeTimer = 0.48;
            e.eyeTargetX = s.px;
            e.eyeTargetY = s.py - 32;
          }
        }
      } else if (e.kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM && groundDist < 720) {
        // WORLD BOSS 2: Omega Chimera Overlord (Apex Multi-Monster Fusion Boss!)
        const step = e.attackPatternStep % 4;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);

        if (step === 0) {
          e.attackCooldown = 2.1;
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#e879f9', 9);
          for (let k = -1; k <= 1; k++) {
            const ang = e.facingAngle + k * 0.25;
            s.projectiles.push({
              id: `omg-o-${now}-${k}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 235,
              vy: Math.sin(ang) * 235,
              fromPlayer: false,
              kind: 'eldritch_orb',
              damage: 10,
              life: 3.2,
            });
          }
          for (const off of [-0.12, 0.12]) {
            const ang = e.facingAngle + off;
            s.projectiles.push({
              id: `omg-s-${now}-${off}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 255,
              vy: Math.sin(ang) * 255,
              fromPlayer: false,
              kind: 'plasma_saw',
              damage: 11,
              life: 3.0,
            });
          }
        } else if (step === 1) {
          e.attackCooldown = 2.2;
          e.eyeChargeTimer = 0.46;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        } else if (step === 2) {
          e.attackCooldown = 2.4;
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#ff1744', 8);
          for (const off of [-0.14, 0.14]) {
            const ang = e.facingAngle + off;
            s.projectiles.push({
              id: `omg-r-${now}-${off}-${Math.random()}`,
              x: anchors.rocketMuzzle.x,
              y: anchors.rocketMuzzle.y,
              vx: Math.cos(ang) * 225,
              vy: Math.sin(ang) * 225,
              fromPlayer: false,
              kind: 'enemy_rocket',
              damage: 13,
              life: 3.1,
            });
          }
        } else {
          e.attackCooldown = 1.9;
          e.burstRemaining = 4;
          e.burstTimer = 0.02;
        }
      } else if (e.kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER) {
        if (groundDist < 78) {
          e.attackCooldown = 1.05;
          e.meleeSwingTimer = 0.28;
          soundFX.playArcSlash(false);
          s.slashes.push({
            x: e.x,
            y: e.y - 24,
            angle: e.facingAngle,
            radius: 74,
            color: '#c026d3',
            isEmp: false,
            life: 0.22,
          });
          damagePlayer(10, 4.5);
        } else if (groundDist < 460) {
          e.attackCooldown = 2.6;
          e.eyeChargeTimer = 0.42;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        }
      } else if (e.kind === EnemyKind.SHOGGOTH_CORE_AMALGAM) {
        if (groundDist < 68) {
          e.attackCooldown = 1.35;
          s.slashes.push({
            x: e.x,
            y: e.y - 18,
            angle: 0,
            radius: 82,
            color: '#a855f7',
            isEmp: true,
            life: 0.22,
          });
          damagePlayer(11, 5.5);
        } else if (groundDist < 540) {
          e.attackCooldown = 2.5;
          const anchors = getEnemyCombatAnchorsWorld(e);
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#c026d3', 6);
          for (const offset of [-0.16, 0.16]) {
            const ang = e.facingAngle + offset;
            s.projectiles.push({
              id: `shog-${now}-${offset}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 210,
              vy: Math.sin(ang) * 210,
              fromPlayer: false,
              kind: 'eldritch_orb',
              damage: 9,
              life: 3.0,
            });
          }
        }
      } else if (e.kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME && groundDist < 650) {
        const step = e.attackPatternStep % 3;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);

        if (step === 0) {
          e.attackCooldown = 2.2;
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#c026d3', 8);
          for (let b = -1; b <= 1; b++) {
            const ang = e.facingAngle + b * 0.24;
            s.projectiles.push({
              id: `cth-o-${now}-${b}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 235,
              vy: Math.sin(ang) * 235,
              fromPlayer: false,
              kind: 'eldritch_orb',
              damage: 10,
              life: 3.1,
            });
          }
        } else if (step === 1) {
          e.attackCooldown = 2.4;
          e.eyeChargeTimer = 0.45;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        } else {
          e.attackCooldown = 2.6;
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#fb923c', 7);
          s.projectiles.push({
            id: `cth-r-${now}-${Math.random()}`,
            x: anchors.rocketMuzzle.x,
            y: anchors.rocketMuzzle.y,
            vx: Math.cos(e.facingAngle) * 215,
            vy: Math.sin(e.facingAngle) * 215,
            fromPlayer: false,
            kind: 'enemy_rocket',
            damage: 13,
            life: 3.0,
          });
        }
      } else if (e.kind === EnemyKind.OPENAI_STALKER) {
        if (groundDist < 50) {
          e.attackCooldown = 1.25;
          s.slashes.push({
            x: e.x,
            y: e.y - 16,
            angle: e.facingAngle,
            radius: 46,
            color: '#ff2a85',
            isEmp: false,
            life: 0.18,
          });
          damagePlayer(7, 4);
        } else if (groundDist < 480) {
          e.attackCooldown = 2.35;
          e.burstRemaining = 2;
          e.burstTimer = 0.02;
        }
      } else if (e.kind === EnemyKind.OPENAI_VIPER) {
        if (groundDist < 72) {
          e.attackCooldown = 1.15;
          e.meleeSwingTimer = 0.25;
          soundFX.playArcSlash(false);
          s.slashes.push({
            x: e.x,
            y: e.y - 16,
            angle: e.facingAngle,
            radius: 62,
            color: '#ff1744',
            isEmp: false,
            life: 0.2,
          });
          damagePlayer(8, 4);
        } else if (groundDist >= 85 && groundDist < 430) {
          e.attackCooldown = 2.9;
          e.eyeChargeTimer = 0.44;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        }
      } else if (e.kind === EnemyKind.ANTHROPIC_BULWARK) {
        if (groundDist < 54) {
          e.attackCooldown = 1.45;
          s.slashes.push({
            x: e.x,
            y: e.y - 18,
            angle: e.facingAngle,
            radius: 56,
            color: '#00e5ff',
            isEmp: false,
            life: 0.2,
          });
          damagePlayer(9, 5);
        } else if (groundDist < 540) {
          e.attackCooldown = 3.2;
          const anchors = getEnemyCombatAnchorsWorld(e);
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#fb923c', 6);
          emitMuzzleSparks(anchors.rocketBackblast.x, anchors.rocketBackblast.y, e.facingAngle + Math.PI, '#94a3b8', 5);
          s.projectiles.push({
            id: `erk-${now}-${Math.random()}`,
            x: anchors.rocketMuzzle.x,
            y: anchors.rocketMuzzle.y,
            vx: Math.cos(e.facingAngle) * 195,
            vy: Math.sin(e.facingAngle) * 195,
            fromPlayer: false,
            kind: 'enemy_rocket',
            damage: 11,
            life: 2.8,
          });
        }
      } else if (e.kind === EnemyKind.LOGIC_WEAVER_ELITE && groundDist < 560) {
        const step = e.attackPatternStep % 3;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);

        if (step === 0) {
          e.attackCooldown = 2.4;
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#ff2a85', 6);
          for (let b = -1; b <= 1; b++) {
            const ang = e.facingAngle + b * 0.22;
            s.projectiles.push({
              id: `ewb-${now}-${b}-${Math.random()}`,
              x: anchors.gunMuzzle.x,
              y: anchors.gunMuzzle.y,
              vx: Math.cos(ang) * 235,
              vy: Math.sin(ang) * 235,
              fromPlayer: false,
              kind: 'enemy_bullet',
              damage: 7,
              life: 2.6,
            });
          }
        } else if (step === 1) {
          e.attackCooldown = 2.7;
          e.eyeChargeTimer = 0.46;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        } else {
          e.attackCooldown = 2.8;
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#fb923c', 6);
          s.projectiles.push({
            id: `ewr-${now}-${Math.random()}`,
            x: anchors.rocketMuzzle.x,
            y: anchors.rocketMuzzle.y,
            vx: Math.cos(e.facingAngle) * 205,
            vy: Math.sin(e.facingAngle) * 205,
            fromPlayer: false,
            kind: 'enemy_rocket',
            damage: 12,
            life: 2.8,
          });
        }
      } else if (e.kind === EnemyKind.PUMPKIN_SCYTHE_REAPER) {
        // Halloween Monster 1: Plasma Scythe Cleave OR Spinning Flaming Jack-o'-Bomb!
        if (groundDist < 78) {
          e.attackCooldown = 1.05;
          e.meleeSwingTimer = 0.28;
          soundFX.playArcSlash(false);
          s.slashes.push({
            x: e.x,
            y: e.y - 24,
            angle: e.facingAngle,
            radius: 76,
            color: '#fb923c',
            isEmp: false,
            life: 0.22,
          });
          damagePlayer(9, 4.2);
        } else if (groundDist < 500) {
          e.attackCooldown = 2.45;
          const anchors = getEnemyCombatAnchorsWorld(e);
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#fb923c', 5);
          s.projectiles.push({
            id: `psr-jb-${now}-${Math.random()}`,
            x: anchors.gunMuzzle.x,
            y: anchors.gunMuzzle.y,
            vx: Math.cos(e.facingAngle) * 225,
            vy: Math.sin(e.facingAngle) * 225,
            fromPlayer: false,
            kind: 'jack_bomb',
            damage: 10,
            life: 2.8,
          });
        }
      } else if (e.kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH && groundDist < 520) {
        // Halloween Monster 2: Screaming Homing Ectoplasm Skull OR Twin Ghost Eye-Lasers!
        const step = e.attackPatternStep % 2;
        e.attackPatternStep += 1;
        const anchors = getEnemyCombatAnchorsWorld(e);
        if (step === 0) {
          e.attackCooldown = 2.25;
          soundFX.playGhostWail();
          emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#c084fc', 5);
          s.projectiles.push({
            id: `sbw-sk-${now}-${Math.random()}`,
            x: anchors.gunMuzzle.x,
            y: anchors.gunMuzzle.y,
            vx: Math.cos(e.facingAngle) * 215,
            vy: Math.sin(e.facingAngle) * 215,
            fromPlayer: false,
            kind: 'spectral_skull',
            damage: 9,
            life: 3.0,
          });
        } else {
          e.attackCooldown = 2.55;
          e.eyeChargeTimer = 0.44;
          e.eyeTargetX = s.px;
          e.eyeTargetY = s.py - 32;
        }
      } else if (e.kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT) {
        // Halloween Elite: Tesla Bolt EMP Slam OR Twin Jack-o'-Bomb Mortar Volley!
        if (groundDist < 84) {
          e.attackCooldown = 1.25;
          e.meleeSwingTimer = 0.28;
          soundFX.playArcSlash(true);
          s.slashes.push({
            x: e.x,
            y: e.y - 20,
            angle: 0,
            radius: 88,
            color: '#4ade80',
            isEmp: true,
            life: 0.24,
          });
          damagePlayer(11, 5.2);
        } else if (groundDist < 560) {
          e.attackCooldown = 2.45;
          const anchors = getEnemyCombatAnchorsWorld(e);
          soundFX.playDisruptorCannon();
          emitMuzzleSparks(anchors.rocketMuzzle.x, anchors.rocketMuzzle.y, e.facingAngle, '#4ade80', 6);
          for (const off of [-0.16, 0.16]) {
            const ang = e.facingAngle + off;
            s.projectiles.push({
              id: `frk-jb-${now}-${off}-${Math.random()}`,
              x: anchors.rocketMuzzle.x,
              y: anchors.rocketMuzzle.y,
              vx: Math.cos(ang) * 225,
              vy: Math.sin(ang) * 225,
              fromPlayer: false,
              kind: 'jack_bomb',
              damage: 11,
              life: 2.9,
            });
          }
        }
      } else if (e.kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER && groundDist < 700) {
        // WORLD BOSS 4: Headless Doom Rider (4-Phase Blood-Moon Dullahan!)
        if (groundDist < 94) {
          e.attackCooldown = 1.3;
          e.meleeSwingTimer = 0.3;
          soundFX.playChainsawRip();
          s.slashes.push({
            x: e.x,
            y: e.y - 22,
            angle: 0,
            radius: 108,
            color: '#fb923c',
            isEmp: true,
            life: 0.26,
          });
          damagePlayer(13, 6.2);
        } else {
          const step = e.attackPatternStep % 4;
          e.attackPatternStep += 1;
          const anchors = getEnemyCombatAnchorsWorld(e);

          if (step === 0) {
            e.attackCooldown = 2.05;
            soundFX.playHalloweenChime(false);
            emitMuzzleSparks(anchors.gunMuzzle.x, anchors.gunMuzzle.y, e.facingAngle, '#fb923c', 8);
            for (let b = -1; b <= 1; b++) {
              const ang = e.facingAngle + b * 0.22;
              s.projectiles.push({
                id: `hdr-jb-${now}-${b}-${Math.random()}`,
                x: anchors.gunMuzzle.x,
                y: anchors.gunMuzzle.y,
                vx: Math.cos(ang) * 245,
                vy: Math.sin(ang) * 245,
                fromPlayer: false,
                kind: 'jack_bomb',
                damage: 11,
                life: 3.0,
              });
            }
          } else if (step === 1) {
            e.attackCooldown = 2.2;
            soundFX.playGhostWail();
            spawnBats(e.x, e.y - 42, 4);
            for (let k = -1; k <= 1; k++) {
              const ang = e.facingAngle + k * 0.26;
              s.projectiles.push({
                id: `hdr-sk-${now}-${k}-${Math.random()}`,
                x: anchors.rocketMuzzle.x,
                y: anchors.rocketMuzzle.y,
                vx: Math.cos(ang) * 230,
                vy: Math.sin(ang) * 230,
                fromPlayer: false,
                kind: 'spectral_skull',
                damage: 10,
                life: 3.2,
              });
            }
          } else if (step === 2) {
            e.attackCooldown = 2.3;
            e.eyeChargeTimer = 0.45;
            e.eyeTargetX = s.px;
            e.eyeTargetY = s.py - 32;
          } else {
            e.attackCooldown = 1.95;
            e.burstRemaining = 4;
            e.burstTimer = 0.02;
          }
        }
      }
    }

    if (
      (e.kind === EnemyKind.LOGIC_WEAVER_ELITE ||
        e.kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT ||
        e.kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT ||
        isBoss) &&
      groundDist < 680 &&
      (e.logicBombCooldown -= dt) <= 0
    ) {
      e.logicBombCooldown = 10.5;
      if (s.logicMines.length < 3) {
        s.logicMines.push({
          id: `mine-${now}-${Math.random()}`,
          x: Math.max(140, Math.min(WORLD_W - 140, s.px + (Math.random() - 0.5) * 220)),
          y: Math.max(140, Math.min(WORLD_H - 140, s.py + (Math.random() - 0.5) * 170)),
          timer: 4.2,
          maxTimer: 4.2,
          hp: 35,
          radius: 95,
        });
      }
    }
  }

  if (cb.setActiveBoss) {
    cb.setActiveBoss(
      nearestBoss
        ? {
            kind: nearestBoss.kind,
            hp: Math.max(0, Math.round(nearestBoss.hp)),
            maxHp: nearestBoss.maxHp,
            armor: Math.max(0, Math.round(nearestBoss.armor)),
          }
        : null
    );
  }

  const countHostilesOnly = (arr: InternalEnemy[]) =>
    arr.filter((e) => !isWildPetEnemyKind(e.kind)).length;

  const prevHostiles = countHostilesOnly(s.enemies);
  s.enemies = s.enemies.filter((e) => e.hp > 0 && !capturedIds.has(e.id));
  const remainingHostiles = countHostilesOnly(s.enemies);
  if (remainingHostiles !== prevHostiles) cb.setHostilesCount(remainingHostiles);

  // Projectiles Update
  const nextProj: SimState['projectiles'] = [];
  for (const p of s.projectiles) {
    if ((p.life -= dt) <= 0) {
      if (p.kind === 'enemy_rocket' || p.kind === 'jack_bomb') {
        s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 58, color: '#fb923c', isEmp: true, life: 0.22 });
      } else if (p.kind === 'singularity_orb') {
        s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 155, color: '#c084fc', isEmp: true, life: 0.28 });
        s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 95, color: '#00e5ff', isEmp: true, life: 0.24 });
        for (const sp of s.enemies) {
          if (Math.hypot(sp.x - p.x, sp.y - p.y) <= 165) {
            damageEnemy(sp, p.damage, WeaponId.SINGULARITY_LAUNCHER, 2.5);
          }
        }
      }
      continue;
    }

    if (p.kind === 'singularity_orb') {
      // Gravitational vortex pulls nearby enemies inward while in flight!
      for (const ge of s.enemies) {
        if (isWildPetEnemyKind(ge.kind)) continue;
        const gd = Math.hypot(p.x - ge.x, p.y - (ge.y - 26));
        if (gd < 210 && gd > 16) {
          const pull = (isWorldBossKind(ge.kind) ? 45 : 120) * dt;
          const cl = clampObs(ge.x + ((p.x - ge.x) / gd) * pull, ge.y + ((p.y - (ge.y - 26)) / gd) * pull, 18);
          ge.x = cl.x;
          ge.y = cl.y;
        }
      }
    }

    if ((p.kind === 'cannon_shell' || (p.kind === 'jack_bomb' && p.fromPlayer)) && p.targetEnemyId) {
      const tgt = s.enemies.find((e) => e.id === p.targetEnemyId);
      if (tgt) {
        const a = Math.atan2(tgt.y - 28 - p.y, tgt.x - p.x);
        const spd = Math.hypot(p.vx, p.vy);
        p.vx = Math.cos(a) * spd;
        p.vy = Math.sin(a) * spd;
      }
    }

    if (p.kind === 'eldritch_orb' || p.kind === 'spectral_skull') {
      const turnRate = p.kind === 'spectral_skull' ? 0.95 : 0.85;
      const desired = Math.atan2(s.py - 32 - p.y, s.px - p.x);
      const cur = Math.atan2(p.vy, p.vx);
      const diff = Math.atan2(Math.sin(desired - cur), Math.cos(desired - cur));
      const nextAng = cur + Math.max(-turnRate * dt, Math.min(turnRate * dt, diff));
      const spd = Math.hypot(p.vx, p.vy);
      p.vx = Math.cos(nextAng) * spd;
      p.vy = Math.sin(nextAng) * spd;
      if (Math.random() < 0.45) {
        s.particles.push({
          x: p.x,
          y: p.y,
          vx: (Math.random() - 0.5) * 18,
          vy: (Math.random() - 0.5) * 18,
          size: 3.5,
          color: p.kind === 'spectral_skull' ? '#a855f7' : '#c026d3',
          life: 0.22,
          maxLife: 0.22,
        });
      }
    }

    if (p.kind === 'jack_bomb' && Math.random() < 0.55) {
      s.particles.push({
        x: p.x,
        y: p.y,
        vx: (Math.random() - 0.5) * 28,
        vy: -14 + (Math.random() - 0.5) * 20,
        size: 3.6,
        color: Math.random() < 0.65 ? '#fb923c' : '#a855f7',
        life: 0.22,
        maxLife: 0.22,
      });
    }

    if (p.kind === 'plasma_saw' && Math.random() < 0.5) {
      s.particles.push({
        x: p.x,
        y: p.y,
        vx: (Math.random() - 0.5) * 35,
        vy: (Math.random() - 0.5) * 35,
        size: 3.2,
        color: '#f97316',
        life: 0.18,
        maxLife: 0.18,
      });
    }

    if (p.kind === 'enemy_rocket' && Math.random() < 0.65) {
      s.particles.push({
        x: p.x - p.vx * 0.03,
        y: p.y - p.vy * 0.03,
        vx: (Math.random() - 0.5) * 22,
        vy: (Math.random() - 0.5) * 22,
        size: 4.2,
        color: Math.random() < 0.45 ? '#fb923c' : '#94a3b8',
        life: 0.28,
        maxLife: 0.28,
      });
    }

    p.x += p.vx * dt;
    p.y += p.vy * dt;

    let hit = false;
    if (p.fromPlayer) {
      if (p.kind === 'master_sphere') {
        for (const e of s.enemies) {
          if (Math.hypot(e.x - p.x, e.y - 18 - p.y) < 54 && e.captureTimer <= 0) {
            if (isWildPetEnemyKind(e.kind)) {
              hit = true;
              const targetKind = wildEnemyToCompanionKind(e.kind);
              if (pState.companions.some((c) => c.kind === targetKind)) {
                cb.onLootCollected({ masterSpheres: 1 });
                s.floatTexts.push({
                  x: e.x,
                  y: e.y - 48,
                  text: 'ALREADY TAMED (ORB REFUNDED)',
                  color: '#d9ff00',
                  life: 1.1,
                });
              } else {
                e.captureTimer = 1.05;
                soundFX.playLootPickup(true);
              }
              break;
            }
          }
        }
      } else if (p.kind === 'jack_bomb') {
        // Pet Jack-Pup's explosive Jack-o'-Bomb
        for (const e of s.enemies) {
          const hitTol = isWorldBossKind(e.kind) ? 54 : 40;
          if (Math.hypot(e.x - p.x, e.y - 26 - p.y) < hitTol) {
            hit = true;
            s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 74, color: '#fb923c', isEmp: true, life: 0.2 });
            for (const sp of s.enemies) {
              if (Math.hypot(sp.x - p.x, sp.y - p.y) <= 96) {
                damageEnemy(sp, p.damage, s.weapon, 1.3, true);
              }
            }
            damageHalloweenPropsInRange(p.x, p.y, 85, 50);
            break;
          }
        }
      } else if (p.kind === 'plasma_pellet') {
        for (const prop of s.halloweenProps) {
          if (!prop.smashed && Math.hypot(prop.x - p.x, prop.y - 14 - p.y) < 30) {
            hit = true;
            damageHalloweenPropsInRange(p.x, p.y, 42, p.damage);
            break;
          }
        }
        if (!hit) {
          for (const e of s.enemies) {
            const hitTol = isWorldBossKind(e.kind) ? 52 : 38;
            if (Math.hypot(e.x - p.x, e.y - 28 - p.y) < hitTol) {
              hit = true;
              damageEnemy(e, p.damage, WeaponId.PLASMA_SCATTERGUN, 1.4);
              break;
            }
          }
        }
      } else if (p.kind === 'singularity_orb') {
        for (const e of s.enemies) {
          const hitTol = isWorldBossKind(e.kind) ? 62 : 46;
          if (Math.hypot(e.x - p.x, e.y - 28 - p.y) < hitTol) {
            hit = true;
            s.shakeTimer = 0.2;
            s.shakeIntensity = 8;
            s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 165, color: '#c084fc', isEmp: true, life: 0.28 });
            s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 98, color: '#00e5ff', isEmp: true, life: 0.24 });
            for (const sp of s.enemies) {
              if (Math.hypot(sp.x - p.x, sp.y - p.y) <= 172) {
                sp.stunTimer = Math.max(sp.stunTimer, isWorldBossKind(sp.kind) ? 0.35 : 0.75);
                damageEnemy(sp, p.damage, WeaponId.SINGULARITY_LAUNCHER, 2.8);
              }
            }
            hitLogicMinesInRange(p.x, p.y, 150, 120);
            damageHalloweenPropsInRange(p.x, p.y, 150, 120);
            break;
          }
        }
      } else {
        for (const prop of s.halloweenProps) {
          if (!prop.smashed && Math.hypot(prop.x - p.x, prop.y - 14 - p.y) < 36) {
            hit = true;
            s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 92, color: '#ff1744', isEmp: true, life: 0.2 });
            damageHalloweenPropsInRange(p.x, p.y, 115, 80);
            break;
          }
        }
        if (!hit) {
          for (const e of s.enemies) {
            const hitTol = isWorldBossKind(e.kind) ? 58 : 44;
            if (Math.hypot(e.x - p.x, e.y - 28 - p.y) < hitTol) {
              hit = true;
              s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 98, color: '#ff1744', isEmp: true, life: 0.2 });
              for (const sp of s.enemies) {
                if (Math.hypot(sp.x - p.x, sp.y - p.y) <= 132) {
                  damageEnemy(sp, p.damage, WeaponId.DISRUPTOR_CANNON, 1.8);
                }
              }
              hitLogicMinesInRange(p.x, p.y, 115, 80);
              damageHalloweenPropsInRange(p.x, p.y, 115, 80);
              break;
            }
          }
        }
      }
    } else {
      const hitRadius =
        p.kind === 'enemy_rocket' || p.kind === 'jack_bomb'
          ? 26
          : p.kind === 'plasma_saw'
          ? 24
          : p.kind === 'eldritch_orb' || p.kind === 'spectral_skull'
          ? 23
          : 19;
      if (Math.hypot(s.px - p.x, s.py - 32 - p.y) < hitRadius) {
        hit = true;
        if (p.kind === 'enemy_rocket' || p.kind === 'jack_bomb') {
          soundFX.playDisruptorCannon();
          s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 68, color: '#fb923c', isEmp: true, life: 0.24 });
          damagePlayer(p.damage, 5.5);
        } else if (p.kind === 'plasma_saw') {
          soundFX.playChainsawRip();
          s.slashes.push({ x: p.x, y: p.y, angle: 0, radius: 56, color: '#f97316', isEmp: false, life: 0.2 });
          damagePlayer(p.damage, 4.8);
        } else if (p.kind === 'eldritch_orb' || p.kind === 'spectral_skull') {
          s.slashes.push({
            x: p.x,
            y: p.y,
            angle: 0,
            radius: 52,
            color: p.kind === 'spectral_skull' ? '#a855f7' : '#c026d3',
            isEmp: true,
            life: 0.2,
          });
          damagePlayer(p.damage, 4.5);
        } else {
          damagePlayer(p.damage, 3);
        }
      }
    }
    if (!hit) nextProj.push(p);
  }
  s.projectiles = nextProj;

  // Loot Drops Pickup (including Halloween Soul Candy -> Heal + Sugar Rush Haste!)
  const nextDrops: SimState['drops'] = [];
  for (const d of s.drops) {
    const dist = Math.hypot(s.px - d.x, s.py - d.y);
    if (dist < 130 && dist > 16) {
      d.x += ((s.px - d.x) / dist) * 320 * dt;
      d.y += ((s.py - d.y) / dist) * 320 * dt;
    }
    if (dist <= 38) {
      if (d.kind === 'candy') {
        soundFX.playHalloweenChime(true);
        s.hp = Math.min(s.maxHp, s.hp + 18);
        cb.setPlayerHp(Math.round(s.hp));
        cb.onLootCollected({ ammoCells: 6 });
        s.sugarRushTimer = 6.5;
        s.floatTexts.push({
          x: d.x,
          y: d.y - 22,
          text: '🍬 +18 HP · SUGAR RUSH!',
          color: '#fb923c',
          life: 0.95,
        });
      } else if (d.kind === 'ru9') {
        soundFX.playLootPickup(true);
        cb.onLootCollected({ ru9: d.amount });
        cb.onSessionLootDelta({ ru9: d.amount });
        s.floatTexts.push({
          x: d.x,
          y: d.y - 22,
          text: `+${d.amount.toLocaleString()} $RU9`,
          color: '#fde047',
          life: 0.9,
        });
      } else {
        soundFX.playLootPickup(d.kind === 'oCore' || d.kind === 'aCore');
        if (d.kind === 'oCore') {
          cb.onLootCollected({ oCores: d.amount });
          cb.onSessionLootDelta({ oCores: d.amount });
          s.floatTexts.push({
            x: d.x,
            y: d.y - 20,
            text: `+${d.amount} OpenAI Core`,
            color: '#ffffff',
            life: 0.85,
          });
        } else if (d.kind === 'aCore') {
          cb.onLootCollected({ aCores: d.amount });
          cb.onSessionLootDelta({ aCores: d.amount });
          s.floatTexts.push({
            x: d.x,
            y: d.y - 20,
            text: `+${d.amount} Anthropic Core`,
            color: '#38bdf8',
            life: 0.85,
          });
        } else {
          cb.onLootCollected({ ammoCells: d.amount });
          s.floatTexts.push({
            x: d.x,
            y: d.y - 20,
            text: `+${d.amount} CELLS`,
            color: '#d9ff00',
            life: 0.75,
          });
        }
      }
    } else nextDrops.push(d);
  }
  s.drops = nextDrops;

  if (s.hp <= 0) cb.setGameState(GameState.GAME_OVER);
  else if (remainingHostiles === 0) {
    const waveBonusRu9 = 18000 + s.waveNum * 4000;
    cb.onLootCollected({ waveReached: s.waveNum, ru9: waveBonusRu9 });
    cb.onSessionLootDelta({ ru9: waveBonusRu9 });
    cb.setGameState(GameState.ROUND_SUMMARY);
  }

  s.lasers = s.lasers.filter((l) => (l.life -= dt) > 0);
  s.slashes = s.slashes.filter((sl) => (sl.life -= dt) > 0);
  s.particles = s.particles.filter((pt) => {
    pt.x += pt.vx * dt;
    pt.y += pt.vy * dt;
    return (pt.life -= dt) > 0;
  });
  s.batParticles = s.batParticles.filter((bp) => {
    bp.x += bp.vx * dt;
    bp.y += bp.vy * dt + Math.sin(now * 16 + bp.phase) * 24 * dt;
    return (bp.life -= dt) > 0;
  });
  s.floatTexts = s.floatTexts.filter((ft) => {
    ft.y -= 28 * dt;
    return (ft.life -= dt) > 0;
  });
}
