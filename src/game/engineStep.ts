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
  MECHA_WASTELAND_DIVIDE_X,
  OUTDOOR_DIVIDE_X,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  WORLD_H,
  WORLD_W,
} from './worldZones';

export {
  ARENA_OBSTACLES,
  getZoneAt,
  MECHA_WASTELAND_DIVIDE_X,
  OUTDOOR_DIVIDE_X,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  WORLD_H,
  WORLD_W,
};
export const MAX_PLAYER_HP = 210;

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
  touchMoveX: number;
  touchMoveY: number;
  touchAimActive: boolean;
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
    kind:
      | 'enemy_bullet'
      | 'enemy_rocket'
      | 'eldritch_orb'
      | 'plasma_saw'
      | 'cannon_shell'
      | 'master_sphere';
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
    touchMoveX: 0,
    touchMoveY: 0,
    touchAimActive: false,
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
    // Sector A1: OpenAI Neural Server Vault
    { x: 520, y: 460 },
    { x: 980, y: 680 },
    { x: 1460, y: 580 },
    { x: 740, y: 920 },
    // Sector A2: Anthropic Robotics Foundry
    { x: 1960, y: 520 },
    { x: 2420, y: 540 },
    { x: 2220, y: 940 },
    // Sector B1: Bio-Cryo Containment Lab
    { x: 420, y: 1640 },
    { x: 680, y: 1920 },
    { x: 460, y: 2340 },
    // Sector 00: Quantum Command Hub Outer Flanks
    { x: 1140, y: 1580 },
    { x: 1180, y: 2160 },
    { x: 2420, y: 1560 },
    { x: 2440, y: 2140 },
    // Sector C1: Heavy Ordnance Hangar
    { x: 580, y: 3060 },
    { x: 1480, y: 3040 },
    { x: 2040, y: 3120 },
    { x: 2480, y: 3020 },
    // Sector D1: Chimera Splicing Lab
    { x: 640, y: 3860 },
    { x: 1080, y: 4180 },
    { x: 1840, y: 3920 },
    { x: 2440, y: 4140 },
  ];

  const cthulhuAbyssSpawns = [
    { x: 2980, y: 620 },
    { x: 3580, y: 540 },
    { x: 4280, y: 820 },
    { x: 3040, y: 1480 },
    { x: 3680, y: 1640 },
    { x: 4380, y: 1980 },
    { x: 3080, y: 2680 },
    { x: 3740, y: 2880 },
    { x: 4340, y: 2940 },
    { x: 3120, y: 3680 },
    { x: 3780, y: 3920 },
    { x: 4380, y: 4120 },
  ];

  const mechaWastelandSpawns = [
    { x: 4920, y: 780 },
    { x: 5540, y: 680 },
    { x: 6280, y: 760 },
    { x: 6840, y: 980 },
    { x: 4980, y: 1780 },
    { x: 5620, y: 1680 },
    { x: 6480, y: 1840 },
    { x: 6920, y: 2140 },
    { x: 4960, y: 2840 },
    { x: 5680, y: 2780 },
    { x: 6340, y: 2960 },
    { x: 6880, y: 3240 },
    { x: 4980, y: 3780 },
    { x: 5640, y: 3880 },
    { x: 6480, y: 3960 },
    { x: 6920, y: 4220 },
  ];

  const jitter = (base: { x: number; y: number }, r = 120) => ({
    x: base.x + (Math.random() - 0.5) * r,
    y: base.y + (Math.random() - 0.5) * (r * 0.8),
  });

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
    attackCooldown: 1.2 + Math.random() * 1.2,
    burstRemaining: 0,
    burstTimer: 0,
    attackPatternStep: 0,
    logicBombCooldown: lbCd,
  });

  const enemies: InternalEnemy[] = [];
  let inIdx = 0;
  let cthIdx = 0;
  let mechIdx = 0;

  // 1. INDOOR 6-SECTOR CORPORATE & CHIMERA LEGIONS (Dense room-to-room combat)
  const stalkerCount = 9 + waveNum * 2;
  for (let i = 0; i < stalkerCount; i++) {
    enemies.push(
      mk(
        `st-${waveNum}-${i}`,
        EnemyKind.OPENAI_STALKER,
        125 + waveNum * 22,
        0,
        99,
        jitter(indoorRoomSpawns[inIdx++ % indoorRoomSpawns.length])
      )
    );
  }

  const viperCount = 6 + Math.floor(waveNum * 1.5);
  for (let i = 0; i < viperCount; i++) {
    enemies.push(
      mk(
        `vp-${waveNum}-${i}`,
        EnemyKind.OPENAI_VIPER,
        95 + waveNum * 18,
        0,
        99,
        jitter(indoorRoomSpawns[inIdx++ % indoorRoomSpawns.length])
      )
    );
  }

  const bulwarkCount = 4 + waveNum;
  for (let i = 0; i < bulwarkCount; i++) {
    enemies.push(
      mk(
        `bw-${waveNum}-${i}`,
        EnemyKind.ANTHROPIC_BULWARK,
        210 + waveNum * 34,
        60 + waveNum * 14,
        99,
        jitter(indoorRoomSpawns[inIdx++ % indoorRoomSpawns.length])
      )
    );
  }

  const indoorChimeraCount = 3 + Math.floor(waveNum * 0.8);
  for (let i = 0; i < indoorChimeraCount; i++) {
    const labSpot = indoorRoomSpawns[18 + (i % 4)];
    enemies.push(
      mk(
        `chm-in-${waveNum}-${i}`,
        EnemyKind.CHIMERA_HOUND_WEAVER,
        175 + waveNum * 28,
        30,
        99,
        jitter(labSpot, 140)
      )
    );
  }

  const indoorEliteCount = 2 + Math.floor(waveNum * 0.5);
  const eliteIndoorSpots = [
    { x: 1380, y: 580 },
    { x: 1680, y: 3060 },
    { x: 1680, y: 4080 },
  ];
  for (let i = 0; i < indoorEliteCount; i++) {
    enemies.push(
      mk(
        `wv-${waveNum}-${i}`,
        EnemyKind.LOGIC_WEAVER_ELITE,
        310 + waveNum * 50,
        55 + waveNum * 12,
        10.5,
        jitter(eliteIndoorSpots[i % eliteIndoorSpots.length], 70)
      )
    );
  }

  // 2. OUTDOOR CTHULHU BIO-CYBER ABYSS HORRORS & CHIMERAS (x: 2680..4680)
  const weaverMutantCount = 6 + waveNum;
  for (let i = 0; i < weaverMutantCount; i++) {
    enemies.push(
      mk(
        `eld-w-${waveNum}-${i}`,
        EnemyKind.ELDRITCH_TENTACLE_WEAVER,
        160 + waveNum * 28,
        25,
        99,
        jitter(cthulhuAbyssSpawns[cthIdx++ % cthulhuAbyssSpawns.length], 150)
      )
    );
  }

  const shoggothCount = 4 + Math.floor(waveNum * 0.8);
  for (let i = 0; i < shoggothCount; i++) {
    enemies.push(
      mk(
        `eld-s-${waveNum}-${i}`,
        EnemyKind.SHOGGOTH_CORE_AMALGAM,
        255 + waveNum * 42,
        55 + waveNum * 14,
        99,
        jitter(cthulhuAbyssSpawns[cthIdx++ % cthulhuAbyssSpawns.length], 150)
      )
    );
  }

  const abyssChimeraCount = 3 + Math.floor(waveNum * 0.7);
  for (let i = 0; i < abyssChimeraCount; i++) {
    enemies.push(
      mk(
        `chm-ab-${waveNum}-${i}`,
        EnemyKind.CHIMERA_HOUND_WEAVER,
        185 + waveNum * 30,
        35,
        99,
        jitter(cthulhuAbyssSpawns[cthIdx++ % cthulhuAbyssSpawns.length], 150)
      )
    );
  }

  // WORLD BOSS 1: Cthulhu Leviathan Prime (Central Bio-Abyss)
  enemies.push(
    mk(
      `boss-cthulhu-${waveNum}`,
      EnemyKind.CTHULHU_LEVIATHAN_PRIME,
      560 + waveNum * 95,
      110 + waveNum * 22,
      9.0,
      { x: 3920, y: 2160 }
    )
  );

  // 3. OPEN-WORLD TITAN MECHA WASTELAND GIANT WAR-MACHINES, ELITES & BOSSES (x: 4680..7136)
  const spiderMechCount = 6 + waveNum;
  for (let i = 0; i < spiderMechCount; i++) {
    enemies.push(
      mk(
        `m-sp-${waveNum}-${i}`,
        EnemyKind.MECH_SPIDER_ARACHNID,
        230 + waveNum * 36,
        65 + waveNum * 14,
        99,
        jitter(mechaWastelandSpawns[mechIdx++ % mechaWastelandSpawns.length], 160)
      )
    );
  }

  const excavatorCount = 4 + Math.floor(waveNum * 0.8);
  for (let i = 0; i < excavatorCount; i++) {
    enemies.push(
      mk(
        `m-ex-${waveNum}-${i}`,
        EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH,
        295 + waveNum * 46,
        80 + waveNum * 16,
        99,
        jitter(mechaWastelandSpawns[mechIdx++ % mechaWastelandSpawns.length], 160)
      )
    );
  }

  const eliteChimeraCount = 3 + Math.floor(waveNum * 0.6);
  for (let i = 0; i < eliteChimeraCount; i++) {
    enemies.push(
      mk(
        `el-chm-${waveNum}-${i}`,
        EnemyKind.ELITE_CHIMERA_JUGGERNAUT,
        350 + waveNum * 56,
        90 + waveNum * 18,
        10.0,
        jitter(mechaWastelandSpawns[mechIdx++ % mechaWastelandSpawns.length], 160)
      )
    );
  }

  // WORLD BOSS 2: Iron Colossus Titan (North-Central Open-World Mecha Wasteland)
  enemies.push(
    mk(
      `boss-titan-${waveNum}`,
      EnemyKind.BOSS_IRON_COLOSSUS_TITAN,
      720 + waveNum * 120,
      150 + waveNum * 28,
      8.5,
      { x: 6040, y: 1760 }
    )
  );

  // WORLD BOSS 3: Omega Chimera Overlord (South-East Apex Fusion Grounds)
  enemies.push(
    mk(
      `boss-chimera-${waveNum}`,
      EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM,
      780 + waveNum * 130,
      140 + waveNum * 26,
      8.0,
      { x: 6380, y: 3460 }
    )
  );

  // 4. WILD CAPTURABLE CYBER PETS (Across Indoor & Outdoor Frontier)
  enemies.push(mk(`wild-dog-${waveNum}-0`, EnemyKind.WILD_SCOUT_DOG, 90 + waveNum * 12, 0, 99, { x: 1320, y: 2040 }));
  enemies.push(mk(`wild-dog-${waveNum}-1`, EnemyKind.WILD_SCOUT_DOG, 90 + waveNum * 12, 0, 99, { x: 2940, y: 1520 }));
  enemies.push(mk(`wild-dog-${waveNum}-2`, EnemyKind.WILD_SCOUT_DOG, 90 + waveNum * 12, 0, 99, { x: 5120, y: 1940 }));
  enemies.push(mk(`wild-cat-${waveNum}-0`, EnemyKind.WILD_CYBER_CAT, 84 + waveNum * 12, 0, 99, { x: 2220, y: 2020 }));
  enemies.push(mk(`wild-cat-${waveNum}-1`, EnemyKind.WILD_CYBER_CAT, 84 + waveNum * 12, 0, 99, { x: 3020, y: 2940 }));
  enemies.push(mk(`wild-cat-${waveNum}-2`, EnemyKind.WILD_CYBER_CAT, 84 + waveNum * 12, 0, 99, { x: 5240, y: 3120 }));

  const chests: FieldChest[] = [
    { id: `ch-${waveNum}-1`, x: 760, y: 360, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-2`, x: 2480, y: 380, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-3`, x: 460, y: 1720, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-4`, x: 1780, y: 3140, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-5`, x: 1120, y: 4160, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-6`, x: 3340, y: 820, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-7`, x: 4180, y: 2420, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-8`, x: 3620, y: 3880, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-9`, x: 5340, y: 960, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-10`, x: 6420, y: 1580, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-11`, x: 5560, y: 3180, opened: false, hackProgress: 0 },
    { id: `ch-${waveNum}-12`, x: 6680, y: 4060, opened: false, hackProgress: 0 },
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
    if (
      puddle.x < camX - 80 ||
      puddle.x > camX + viewW + 80 ||
      puddle.y < camY - 80 ||
      puddle.y > camY + viewH + 80
    ) {
      continue;
    }
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
    if (d.x > camX - 60 && d.x < camX + viewW + 60 && d.y > camY - 60 && d.y < camY + viewH + 60) {
      drawLootDrop25D(ctx, d, timeSec);
    }
  }

  for (const c of s.chests) {
    if (c.x > camX - 80 && c.x < camX + viewW + 80 && c.y > camY - 80 && c.y < camY + viewH + 80) {
      drawFieldChest(ctx, c, timeSec);
    }
  }

  type Item =
    | { sortY: number; type: 'obs'; obs: ObstacleBlock }
    | { sortY: number; type: 'enemy'; enemy: InternalEnemy }
    | { sortY: number; type: 'player' }
    | { sortY: number; type: 'comp'; kind: CompanionKind; x: number; y: number; facingRight: boolean };

  const visibleEnemies = s.enemies.filter(
    (en) =>
      en.x > camX - 180 &&
      en.x < camX + viewW + 180 &&
      en.y > camY - 140 &&
      en.y < camY + viewH + 220
  );

  const list: Item[] = [
    ...ARENA_OBSTACLES.map((obs) => ({ sortY: obs.y + obs.h * 0.85, type: 'obs' as const, obs })),
    ...visibleEnemies.map((enemy) => ({ sortY: enemy.y, type: 'enemy' as const, enemy })),
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

  // Combat Slashes, Lasers, Rifle Bolts, Rockets, Spinning Plasma Saws & Void Orbs
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
    if (p.x < camX - 60 || p.x > camX + viewW + 60 || p.y < camY - 60 || p.y > camY + viewH + 60) {
      continue;
    }
    if (p.kind === 'master_sphere') {
      drawQuantumPrism25D(ctx, p.x, p.y, 1.15, timeSec);
    } else if (p.kind === 'plasma_saw') {
      // Spinning Molten Buzzsaw / Plasma Disc hurled by Mutated Heavy Machinery & Iron Colossus!
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(timeSec * 22);
      ctx.fillStyle = 'rgba(249, 115, 22, 0.35)';
      ctx.beginPath();
      ctx.arc(0, 0, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#e2e8f0';
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const a = (i * Math.PI) / 4;
        ctx.lineTo(Math.cos(a) * 12, Math.sin(a) * 12);
        ctx.lineTo(Math.cos(a + 0.38) * 7, Math.sin(a + 0.38) * 7);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (p.kind === 'eldritch_orb') {
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

  // Dynamic Biome Vignette (Indoor Neon Steel vs Cthulhu Bio-Abyss vs Open-World Mecha Furnace)
  const inMecha = s.px >= MECHA_WASTELAND_DIVIDE_X;
  const inOutdoor = s.px >= OUTDOOR_DIVIDE_X;
  const edgeGlow = ctx.createRadialGradient(
    viewW / 2,
    viewH / 2,
    Math.max(viewW, viewH) * (inOutdoor ? 0.38 : 0.46),
    viewW / 2,
    viewH / 2,
    Math.max(viewW, viewH) * 0.86
  );
  edgeGlow.addColorStop(0, 'rgba(0, 0, 0, 0)');
  edgeGlow.addColorStop(
    1,
    inMecha
      ? 'rgba(124, 45, 18, 0.42)'
      : inOutdoor
      ? 'rgba(74, 4, 78, 0.46)'
      : 'rgba(8, 15, 28, 0.3)'
  );
  ctx.fillStyle = edgeGlow;
  ctx.fillRect(0, 0, viewW, viewH);
}
