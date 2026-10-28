import {
  CompanionInstance,
  CompanionKind,
  EnemyKind,
  PlayerSkinId,
  WeaponId,
} from '../types/game';
import {
  drawCompanionSprite25D,
  drawEnemySprite25D,
  drawFieldChest,
  drawIsometricArenaFloor,
  drawLogicMine25D,
  drawLootDrop25D,
  drawObstacle25D,
  drawPlayerSprite25D,
  drawQuantumPrism25D,
  FieldChest,
  LogicMineEntity,
  ObstacleBlock,
  RenderEnemyData,
} from './sprites';
import {
  ARENA_OBSTACLES,
  getZoneAt,
  OUTDOOR_DIVIDE_X,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  WORLD_H,
  WORLD_W,
} from './worldZones';

export { ARENA_OBSTACLES, getZoneAt, OUTDOOR_DIVIDE_X, PLAYER_SPAWN_X, PLAYER_SPAWN_Y, WORLD_H, WORLD_W };
export const MAX_PLAYER_HP = 180;

export interface InternalEnemy extends RenderEnemyData {
  id: string;
  attackCooldown: number;
  burstRemaining: number;
  burstTimer: number;
  attackPatternStep: number;
  logicBombCooldown: number;
}

export interface SimState {
  px: number;
  py: number;
  aimAngle: number;
  facingRight: boolean;
  isMoving: boolean;
  walkPhase: number;
  moveDirX: number;
  recoilTimer: number;
  mouseWorldX: number;
  mouseWorldY: number;
  mouseDown: boolean;
  keys: Set<string>;
  hp: number;
  invulnTimer: number;
  dashCooldown: number;
  dashActiveTimer: number;
  dashVx: number;
  dashVy: number;
  attackCooldown: number;
  swingTimer: number;
  arcComboStep: number;
  weapon: WeaponId;
  lastKillWeapon: WeaponId | null;
  consecutiveKills: number;
  syncMap: Record<WeaponId, number>;
  swapComboTimer: number;
  passiveAmmoTimer: number;
  shakeTimer: number;
  shakeIntensity: number;
  enemies: InternalEnemy[];
  logicMines: LogicMineEntity[];
  projectiles: {
    id: string;
    x: number;
    y: number;
    vx: number;
    vy: number;
    fromPlayer: boolean;
    kind: 'enemy_bullet' | 'enemy_rocket' | 'eldritch_orb' | 'cannon_shell' | 'master_sphere';
    damage: number;
    targetEnemyId?: string;
    life: number;
  }[];
  lasers: { x1: number; y1: number; x2: number; y2: number; life: number; color: string; width: number }[];
  slashes: { x: number; y: number; angle: number; radius: number; color: string; isEmp: boolean; life: number }[];
  puddles: { x: number; y: number; rx: number; color: string; alpha: number }[];
  particles: { x: number; y: number; vx: number; vy: number; size: number; color: string; life: number; maxLife: number }[];
  floatTexts: { x: number; y: number; text: string; color: string; life: number }[];
  drops: { id: string; x: number; y: number; kind: 'oCore' | 'aCore' | 'ammo'; amount: number }[];
  chests: FieldChest[];
  dogX: number;
  dogY: number;
  dogFacingRight: boolean;
  dogAttackCd: number;
  catX: number;
  catY: number;
  catFacingRight: boolean;
  catAttackCd: number;
  waveNum: number;
}

export function createInitialSimState(): SimState {
  return {
    px: PLAYER_SPAWN_X,
    py: PLAYER_SPAWN_Y,
    aimAngle: 0,
    facingRight: true,
    isMoving: false,
    walkPhase: 0,
    moveDirX: 0,
    recoilTimer: 0,
    mouseWorldX: PLAYER_SPAWN_X + 140,
    mouseWorldY: PLAYER_SPAWN_Y,
    mouseDown: false,
    keys: new Set<string>(),
    hp: MAX_PLAYER_HP,
    invulnTimer: 0,
    dashCooldown: 0,
    dashActiveTimer: 0,
    dashVx: 0,
    dashVy: 0,
    attackCooldown: 0,
    swingTimer: 0,
    arcComboStep: 0,
    weapon: WeaponId.PULSE_LASER,
    lastKillWeapon: null,
    consecutiveKills: 0,
    syncMap: {
      [WeaponId.ARC_BLADE]: 0,
      [WeaponId.CHAINSAW_SWORD]: 0,
      [WeaponId.PULSE_LASER]: 0,
      [WeaponId.DISRUPTOR_CANNON]: 0,
    },
    swapComboTimer: 0,
    passiveAmmoTimer: 0,
    shakeTimer: 0,
    shakeIntensity: 0,
    enemies: [],
    logicMines: [],
    projectiles: [],
    lasers: [],
    slashes: [],
    puddles: [],
    particles: [],
    floatTexts: [],
    drops: [],
    chests: [],
    dogX: PLAYER_SPAWN_X - 58,
    dogY: PLAYER_SPAWN_Y + 18,
    dogFacingRight: true,
    dogAttackCd: 0,
    catX: PLAYER_SPAWN_X + 58,
    catY: PLAYER_SPAWN_Y + 18,
    catFacingRight: true,
    catAttackCd: 0,
    waveNum: 1,
  };
}

export function buildWaveEnemies(waveNum: number): { enemies: InternalEnemy[]; chests: FieldChest[] } {
  const indoorRoomSpawns = [
    // OpenAI Neural Server Vault
    { x: 640, y: 420 },
    { x: 1080, y: 580 },
    { x: 1520, y: 520 },
    // Anthropic Robotics Foundry
    { x: 1960, y: 480 },
    { x: 2440, y: 520 },
    // Bio-Cryo Containment Lab
    { x: 460, y: 1520 },
    { x: 680, y: 1680 },
    // Command Hub Outer Perimeter
    { x: 1180, y: 1560 },
    { x: 2420, y: 1580 },
    // South Heavy Ordnance Hangar
    { x: 860, y: 2680 },
    { x: 1680, y: 2740 },
    { x: 2380, y: 2680 },
  ];

  const outdoorEldritchSpawns = [
    { x: 2980, y: 620 },
    { x: 3560, y: 560 },
    { x: 4180, y: 780 },
    { x: 3040, y: 1580 },
    { x: 3680, y: 1560 },
    { x: 4280, y: 1920 },
    { x: 3080, y: 2620 },
    { x: 3680, y: 2780 },
    { x: 4260, y: 2560 },
  ];

  const pickIndoor = (idx: number) => {
    const base = indoorRoomSpawns[idx % indoorRoomSpawns.length];
    return {
      x: base.x + (Math.random() - 0.5) * 120,
      y: base.y + (Math.random() - 0.5) * 90,
    };
  };

  const pickOutdoor = (idx: number) => {
    const base = outdoorEldritchSpawns[idx % outdoorEldritchSpawns.length];
    return {
      x: base.x + (Math.random() - 0.5) * 140,
      y: base.y + (Math.random() - 0.5) * 120,
    };
  };

  const mk = (
    id: string,
    kind: EnemyKind,
    hp: number,
    armor = 0,
    lbCd = 99,
    pos: { x: number; y: number }
  ): InternalEnemy => ({
    id,
    x: pos.x,
    y: pos.y,
    vx: 0,
    vy: 0,
    kind,
    hp,
    maxHp: hp,
    armor,
    maxArmor: armor,
    stunTimer: 0,
    slowTimer: 0,
    berserk: false,
    markedByDog: false,
    hitFlash: 0,
    facingAngle: Math.PI,
    syncResistant: false,
    captureTimer: 0,
    eyeChargeTimer: 0,
    eyeTargetX: pos.x,
    eyeTargetY: pos.y,
    meleeSwingTimer: 0,
    walkPhase: Math.random() * Math.PI * 2,
    isMoving: false,
    attackCooldown: 1.3 + Math.random() * 1.1,
    burstRemaining: 0,
    burstTimer: 0,
    attackPatternStep: 0,
    logicBombCooldown: lbCd,
  });

  const enemies: InternalEnemy[] = [];
  let sIdx = 0;

  // 1. INDOOR CORPORATE RED-EYE LEGIONS (Stationed across the 5 Facility Rooms)
  const stalkerCount = 3 + waveNum;
  for (let i = 0; i < stalkerCount; i++) {
    enemies.push(mk(`st-${waveNum}-${i}`, EnemyKind.OPENAI_STALKER, 128 + waveNum * 24, 0, 99, pickIndoor(sIdx++)));
  }
  const viperCount = 2 + Math.floor(waveNum * 0.8);
  for (let i = 0; i < viperCount; i++) {
    enemies.push(mk(`vp-${waveNum}-${i}`, EnemyKind.OPENAI_VIPER, 96 + waveNum * 20, 0, 99, pickIndoor(sIdx++)));
  }
  const bulwarkCount = 1 + Math.floor(waveNum * 0.7);
  for (let i = 0; i < bulwarkCount; i++) {
    enemies.push(
      mk(`bw-${waveNum}-${i}`, EnemyKind.ANTHROPIC_BULWARK, 215 + waveNum * 38, 65 + waveNum * 15, 99, pickIndoor(sIdx++))
    );
  }
  enemies.push(
    mk(`wv-${waveNum}-0`, EnemyKind.LOGIC_WEAVER_ELITE, 320 + waveNum * 55, 55 + waveNum * 12, 10.5, {
      x: 1380,
      y: 540,
    })
  );

  // 2. OUTDOOR CTHULHU-MUTATED AI HORRORS (Haunting the Crimson Eldritch Wastes beyond x = 2680!)
  const weaverMutantCount = 2 + Math.floor(waveNum * 0.8);
  for (let i = 0; i < weaverMutantCount; i++) {
    enemies.push(
      mk(
        `eld-w-${waveNum}-${i}`,
        EnemyKind.ELDRITCH_TENTACLE_WEAVER,
        165 + waveNum * 30,
        25,
        99,
        pickOutdoor(i)
      )
    );
  }

  const shoggothCount = 1 + Math.floor(waveNum * 0.6);
  for (let i = 0; i < shoggothCount; i++) {
    enemies.push(
      mk(
        `eld-s-${waveNum}-${i}`,
        EnemyKind.SHOGGOTH_CORE_AMALGAM,
        265 + waveNum * 45,
        55 + waveNum * 14,
        99,
        pickOutdoor(i + 3)
      )
    );
  }

  // Towering Cthulhu Overmind Dreadnought Boss in deep Outdoor Wastes!
  enemies.push(
    mk(
      `eld-c-${waveNum}-0`,
      EnemyKind.CTHULHU_LEVIATHAN_PRIME,
      440 + waveNum * 80,
      85 + waveNum * 20,
      9.0,
      { x: 3920, y: 1620 }
    )
  );

  // 3. WILD CAPTURABLE CYBER PETS (Indoor & Outdoor Breach)
  enemies.push(mk(`wild-dog-${waveNum}-0`, EnemyKind.WILD_SCOUT_DOG, 90 + waveNum * 12, 0, 99, { x: 1320, y: 1840 }));
  enemies.push(mk(`wild-dog-${waveNum}-1`, EnemyKind.WILD_SCOUT_DOG, 90 + waveNum * 12, 0, 99, { x: 2940, y: 1220 }));
  enemies.push(mk(`wild-cat-${waveNum}-0`, EnemyKind.WILD_CYBER_CAT, 84 + waveNum * 12, 0, 99, { x: 2220, y: 1820 }));
  enemies.push(mk(`wild-cat-${waveNum}-1`, EnemyKind.WILD_CYBER_CAT, 84 + waveNum * 12, 0, 99, { x: 3020, y: 2040 }));

  const chests: FieldChest[] = [
    { id: `ch-${waveNum}-1`, x: 760, y: 340, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-2`, x: 2480, y: 360, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-3`, x: 460, y: 1480, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-4`, x: 1780, y: 2820, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-5`, x: 3340, y: 780, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-6`, x: 4160, y: 2280, opened: false, hackProgress: 0 },
  ];
  return { enemies, chests };
}

export function renderWorld25D(
  ctx: CanvasRenderingContext2D,
  s: SimState,
  viewW: number,
  viewH: number,
  timeSec: number,
  selectedSkin: PlayerSkinId,
  _activeComp: CompanionInstance | undefined,
  ownedCompanions: CompanionInstance[],
  lockedEnemyId: string | undefined
) {
  let camX = Math.max(0, Math.min(WORLD_W - viewW, s.px - viewW / 2));
  let camY = Math.max(0, Math.min(WORLD_H - viewH, s.py - viewH / 2));
  if (s.shakeTimer > 0) {
    camX += (Math.random() - 0.5) * s.shakeIntensity * 2;
    camY += (Math.random() - 0.5) * s.shakeIntensity * 2;
  }

  const dogComp = ownedCompanions.find((c) => c.kind === CompanionKind.SCOUT_DOG);
  const catComp = ownedCompanions.find((c) => c.kind === CompanionKind.CYBER_CAT);
  const ownsDog = Boolean(dogComp);
  const ownsCat = Boolean(catComp);

  drawIsometricArenaFloor(ctx, camX, camY, viewW, viewH, WORLD_W, WORLD_H, timeSec);
  ctx.save();
  ctx.translate(-camX, -camY);

  for (const puddle of s.puddles) {
    ctx.fillStyle = puddle.color;
    ctx.globalAlpha = puddle.alpha * 0.42;
    ctx.beginPath();
    ctx.ellipse(puddle.x, puddle.y, puddle.rx, puddle.rx * 0.48, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  for (const mine of s.logicMines) {
    drawLogicMine25D(ctx, mine, timeSec);
  }

  for (const d of s.drops) {
    drawLootDrop25D(ctx, d, timeSec);
  }

  for (const c of s.chests) drawFieldChest(ctx, c, timeSec);

  type Item =
    | { sortY: number; type: 'obs'; obs: ObstacleBlock }
    | { sortY: number; type: 'enemy'; enemy: InternalEnemy }
    | { sortY: number; type: 'player' }
    | { sortY: number; type: 'comp'; kind: CompanionKind; x: number; y: number; facingRight: boolean };

  const list: Item[] = [
    ...ARENA_OBSTACLES.map((obs) => ({ sortY: obs.y + obs.h * 0.85, type: 'obs' as const, obs })),
    ...s.enemies.map((enemy) => ({ sortY: enemy.y, type: 'enemy' as const, enemy })),
    { sortY: s.py, type: 'player' as const },
  ];
  if (dogComp) {
    list.push({
      sortY: s.dogY,
      type: 'comp',
      kind: CompanionKind.SCOUT_DOG,
      x: s.dogX,
      y: s.dogY,
      facingRight: s.dogFacingRight,
    });
  }
  if (catComp) {
    list.push({
      sortY: s.catY,
      type: 'comp',
      kind: CompanionKind.CYBER_CAT,
      x: s.catX,
      y: s.catY,
      facingRight: s.catFacingRight,
    });
  }
  list.sort((a, b) => a.sortY - b.sortY);

  for (const item of list) {
    if (item.type === 'obs') {
      if (
        item.obs.x + item.obs.w > camX - 120 &&
        item.obs.x < camX + viewW + 120 &&
        item.obs.y + item.obs.h > camY - 140 &&
        item.obs.y - item.obs.heightZ < camY + viewH + 120
      ) {
        drawObstacle25D(ctx, item.obs, timeSec);
      }
    } else if (item.type === 'enemy') {
      const speciesOwned =
        (item.enemy.kind === EnemyKind.WILD_SCOUT_DOG && ownsDog) ||
        (item.enemy.kind === EnemyKind.WILD_CYBER_CAT && ownsCat);
      drawEnemySprite25D(ctx, item.enemy, timeSec, lockedEnemyId === item.enemy.id, speciesOwned);
    } else if (item.type === 'comp') {
      drawCompanionSprite25D(ctx, item.x, item.y, item.kind, item.facingRight, timeSec);
    } else {
      drawPlayerSprite25D(
        ctx,
        s.px,
        s.py,
        s.aimAngle,
        s.facingRight,
        s.isMoving,
        s.walkPhase,
        s.moveDirX,
        s.weapon,
        selectedSkin,
        s.swingTimer,
        s.recoilTimer,
        s.invulnTimer,
        timeSec
      );
    }
  }

  // Combat Slashes, Lasers, Rifle Bolts, Rockets & Cthulhu Abyssal Void Orbs
  ctx.save();
  for (const sl of s.slashes) {
    ctx.strokeStyle = sl.color;
    ctx.lineWidth = sl.isEmp ? 4.5 : 6.5;
    ctx.globalAlpha = Math.min(0.95, sl.life * 5);
    ctx.beginPath();
    if (sl.isEmp) ctx.arc(sl.x, sl.y, sl.radius * (1 - sl.life * 2), 0, Math.PI * 2);
    else ctx.arc(sl.x, sl.y, sl.radius * 0.72, sl.angle - 0.95, sl.angle + 0.95);
    ctx.stroke();
  }
  for (const l of s.lasers) {
    const a = Math.min(1, l.life * 6);
    ctx.globalAlpha = a * 0.35;
    ctx.strokeStyle = l.color;
    ctx.lineWidth = l.width * 3.2;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();

    ctx.globalAlpha = a;
    ctx.strokeStyle = l.color;
    ctx.lineWidth = l.width * 1.5;
    ctx.beginPath();
    ctx.moveTo(l.x1, l.y1);
    ctx.lineTo(l.x2, l.y2);
    ctx.stroke();

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1.8;
    ctx.stroke();
  }

  ctx.globalAlpha = 1;
  for (const p of s.projectiles) {
    if (p.kind === 'master_sphere') {
      drawQuantumPrism25D(ctx, p.x, p.y, 1.15, timeSec);
    } else if (p.kind === 'eldritch_orb') {
      // Swirling Cthulhu Abyssal Eyeball / Void Sphere with trailing dark tendrils!
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = 'rgba(192, 38, 211, 0.36)';
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#581c87';
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(0, 0, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Vertical yellow-black slit Cthulhu pupil inside the flying orb
      ctx.fillStyle = '#fde047';
      ctx.beginPath();
      ctx.ellipse(0, 0, 4.2, 5.5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#050208';
      ctx.fillRect(-1.2, -5, 2.4, 10);
      ctx.restore();
    } else if (p.kind === 'enemy_rocket') {
      const ang = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      ctx.fillStyle = '#fb923c';
      ctx.beginPath();
      ctx.moveTo(-9, -3);
      ctx.lineTo(-19 - Math.random() * 5, 0);
      ctx.lineTo(-9, 3);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#090a0f';
      ctx.lineWidth = 1.6;
      ctx.fillRect(-8, -3.5, 14, 7);
      ctx.strokeRect(-8, -3.5, 14, 7);
      ctx.fillStyle = '#eab308';
      ctx.fillRect(-2, -3, 3, 6);
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.moveTo(6, -4);
      ctx.lineTo(13, 0);
      ctx.lineTo(6, 4);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    } else if (p.kind === 'enemy_bullet') {
      const ang = Math.atan2(p.vy, p.vx);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(ang);
      ctx.fillStyle = 'rgba(255, 23, 68, 0.35)';
      ctx.beginPath();
      ctx.ellipse(0, 0, 11, 5, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.roundRect(-7, -2.5, 14, 5, 2.5);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(-3, -1, 7, 2);
      ctx.restore();
    } else {
      ctx.fillStyle = 'rgba(255, 23, 68, 0.32)';
      ctx.beginPath();
      ctx.arc(p.x, p.y, 15, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ff1744';
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 8.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
    }
  }

  for (const pt of s.particles) {
    ctx.globalAlpha = Math.max(0, pt.life / pt.maxLife);
    ctx.fillStyle = pt.color;
    ctx.fillRect(pt.x - pt.size / 2, pt.y - pt.size / 2, pt.size, pt.size);
  }
  ctx.restore();

  ctx.font = '800 11.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.lineJoin = 'round';
  for (const ft of s.floatTexts) {
    ctx.strokeStyle = 'rgba(9, 13, 22, 0.94)';
    ctx.lineWidth = 3.2;
    ctx.strokeText(ft.text, ft.x, ft.y);
    ctx.fillStyle = ft.color;
    ctx.fillText(ft.text, ft.x, ft.y);
  }
  ctx.restore();

  // Dynamic Indoor vs Terrifying Outdoor Eldritch Vignette
  const inOutdoor = s.px >= OUTDOOR_DIVIDE_X;
  const edgeGlow = ctx.createRadialGradient(
    viewW / 2,
    viewH / 2,
    Math.max(viewW, viewH) * (inOutdoor ? 0.36 : 0.46),
    viewW / 2,
    viewH / 2,
    Math.max(viewW, viewH) * 0.86
  );
  edgeGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  edgeGlow.addColorStop(
    1,
    inOutdoor ? 'rgba(74, 4, 78, 0.48)' : 'rgba(8, 15, 28, 0.32)'
  );
  ctx.fillStyle = edgeGlow;
  ctx.fillRect(0, 0, viewW, viewH);
}
