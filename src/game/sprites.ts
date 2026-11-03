import { CompanionKind, EnemyKind, PlayerSkinId, WeaponId } from '../types/game';
import {
  ASSET_URLS,
  getEnemySpriteUrl,
  getPlayerSkinSpriteUrl,
  getSpaceDogeActionPose,
  ProcessedSprite,
  requestRawImage,
  requestSprite,
} from './assetLoader';
import {
  drawEldritchEnemyBody25D,
  getEldritchCombatAnchors,
  isEldritchEnemyKind,
} from './eldritchSprites';
import {
  drawFestiveHalloweenCrown25D,
  drawHalloweenEnemy25D,
  drawHalloweenPet25D,
  getHalloweenCombatAnchors,
  isHalloweenEnemyKind,
  isWildPetEnemyKind,
} from './halloweenSprites';
import {
  drawMechChimeraEnemy25D,
  getMechChimeraCombatAnchors,
  isEliteEnemyKind,
  isMechaOrChimeraKind,
  isWorldBossKind,
} from './mechChimeraSprites';

export {
  drawIsometricArenaFloor,
  drawObstacle25D,
  type ContinentLandmarkVariant,
  type ObstacleBlock,
} from './arenaRenderer';

export interface RenderEnemyData {
  x: number;
  y: number;
  vx: number;
  vy: number;
  kind: EnemyKind;
  hp: number;
  maxHp: number;
  armor: number;
  maxArmor: number;
  stunTimer: number;
  slowTimer: number;
  berserk: boolean;
  markedByDog: boolean;
  hitFlash: number;
  facingAngle: number;
  syncResistant: boolean;
  captureTimer: number;
  eyeChargeTimer: number;
  eyeTargetX: number;
  eyeTargetY: number;
  meleeSwingTimer: number;
  walkPhase: number;
  isMoving: boolean;
}

export interface FieldChest {
  id: string;
  x: number;
  y: number;
  opened: boolean;
  hackProgress: number;
}

export interface LogicMineEntity {
  id: string;
  x: number;
  y: number;
  timer: number;
  maxTimer: number;
  hp: number;
  radius: number;
}

/** Unified standard humanoid visual foot-to-crown height in world pixels */
export const HUMANOID_VISUAL_HEIGHT = 80;
const GROUND_CONTACT_Y = 7;

function snap(v: number, px = 2): number {
  return Math.round(v / px) * px;
}

/**
 * Computes exact draw rectangle so any sprite's visible character height (bottomUV - topUV)
 * matches `targetHeightPx` and its boots/shoes rest cleanly at `GROUND_CONTACT_Y`.
 */
function computeCalibratedSpriteRect(
  sprite: ProcessedSprite | undefined,
  targetHeightPx: number,
  groundY = GROUND_CONTACT_Y
): { x0: number; y0: number; drawW: number; drawH: number } {
  if (!sprite) {
    return {
      x0: -targetHeightPx * 0.5,
      y0: groundY - targetHeightPx,
      drawW: targetHeightPx,
      drawH: targetHeightPx,
    };
  }
  const spanUV = Math.max(0.45, sprite.bottomUV - sprite.topUV);
  const drawH = targetHeightPx / spanUV;
  const drawW = drawH * (sprite.aspectRatio || 1);
  const y0 = groundY - sprite.bottomUV * drawH;
  const x0 = -drawW / 2;
  return { x0, y0, drawW, drawH };
}

function getEnemyTargetHeight(kind: EnemyKind): number {
  switch (kind) {
    case EnemyKind.OPENAI_VIPER:
      return 77;
    case EnemyKind.OPENAI_STALKER:
      return HUMANOID_VISUAL_HEIGHT; // 80px — matches Space Doge & Operative skins 1:1
    case EnemyKind.ANTHROPIC_BULWARK:
      return 86;
    case EnemyKind.LOGIC_WEAVER_ELITE:
      return 94;
    default:
      return HUMANOID_VISUAL_HEIGHT;
  }
}

/**
 * Exact shared world-space muzzle coordinate for the player's currently equipped weapon.
 * - For Space Doge with Pulse Laser: uses the exact measured muzzle tip of the original artwork's rifle!
 * - For Space Doge with other weapons: uses the attachment anchored inside his original gloved hands!
 * - For Viber Operative skins: anchored at their true lower-torso voxel hand position (`y = -12`)!
 */
export function getPlayerWeaponMuzzleWorld(
  px: number,
  py: number,
  aimAngle: number,
  facingRight: boolean,
  weapon: WeaponId,
  skin: PlayerSkinId,
  isMoving = false,
  walkPhase = 0
): { x: number; y: number } {
  const dir = facingRight ? 1 : -1;

  const barrelByWeapon = (w: WeaponId, doge: boolean) => {
    switch (w) {
      case WeaponId.GAUSS_RAILGUN:
        return doge ? 44 : 46;
      case WeaponId.SINGULARITY_LAUNCHER:
        return doge ? 38 : 40;
      case WeaponId.DISRUPTOR_CANNON:
        return doge ? 36 : 38;
      case WeaponId.TESLA_ARC_EMITTER:
        return doge ? 35 : 37;
      case WeaponId.PLASMA_SCATTERGUN:
        return doge ? 32 : 34;
      default:
        return doge ? 34 : 36;
    }
  };

  if (skin === PlayerSkinId.DEGEN_ASTRO) {
    const pose = getSpaceDogeActionPose(facingRight, isMoving, walkPhase);
    const rect = computeCalibratedSpriteRect(pose.sprite, HUMANOID_VISUAL_HEIGHT);
    if (weapon === WeaponId.PULSE_LASER) {
      return {
        x: px + rect.x0 + pose.muzzleUV.u * rect.drawW,
        y: py + rect.y0 + pose.muzzleUV.v * rect.drawH,
      };
    }
    const gripX = px + rect.x0 + pose.gripUV.u * rect.drawW;
    const gripY = py + rect.y0 + pose.gripUV.v * rect.drawH;
    const barrelLen = barrelByWeapon(weapon, true);
    return {
      x: gripX + Math.cos(aimAngle) * barrelLen,
      y: gripY + Math.sin(aimAngle) * barrelLen,
    };
  }

  // Viber Operative Skins: True hand height is y = -12 (v ≈ 0.79, right at their voxel gloves!)
  const handX = px + dir * 12;
  const handY = py - 12;
  const barrelLen = barrelByWeapon(weapon, false);
  return {
    x: handX + Math.cos(aimAngle) * barrelLen,
    y: handY + Math.sin(aimAngle) * barrelLen,
  };
}

/**
 * Exact shared world-space anchors for enemy held guns, handheld rocket launchers, and glowing crimson eyes!
 * All Viber humanoid enemy weapons are anchored strictly at their voxel hand level (`v ≈ 0.79`, `y ≈ -12..-15`),
 * NEVER up on their blocky heads!
 */
export function getEnemyCombatAnchorsWorld(e: RenderEnemyData): {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  gunMuzzle: { x: number; y: number };
  rocketMuzzle: { x: number; y: number };
  rocketBackblast: { x: number; y: number };
} {
  if (isHalloweenEnemyKind(e.kind)) {
    return getHalloweenCombatAnchors(e.x, e.y, e.kind, e.facingAngle);
  }
  if (isEldritchEnemyKind(e.kind)) {
    return getEldritchCombatAnchors(e.x, e.y, e.kind, e.facingAngle);
  }
  if (isMechaOrChimeraKind(e.kind)) {
    return getMechChimeraCombatAnchors(e.x, e.y, e.kind, e.facingAngle);
  }

  const targetH = getEnemyTargetHeight(e.kind);
  const facingRight = Math.cos(e.facingAngle) >= 0;
  const dir = facingRight ? 1 : -1;

  const spriteObj = requestSprite(getEnemySpriteUrl(e.kind));
  const rect = computeCalibratedSpriteRect(spriteObj, targetH);

  const lu = spriteObj ? spriteObj.leftEyeUV.u : 0.27;
  const lv = spriteObj ? spriteObj.leftEyeUV.v : 0.52;
  const ru = spriteObj ? spriteObj.rightEyeUV.u : 0.5;
  const rv = spriteObj ? spriteObj.rightEyeUV.v : 0.54;

  const lxLocal = rect.x0 + lu * rect.drawW;
  const lyLocal = rect.y0 + lv * rect.drawH;
  const rxLocal = rect.x0 + ru * rect.drawW;
  const ryLocal = rect.y0 + rv * rect.drawH;

  const leftEye = {
    x: e.x + (facingRight ? -lxLocal : lxLocal),
    y: e.y + lyLocal,
  };
  const rightEye = {
    x: e.x + (facingRight ? -rxLocal : rxLocal),
    y: e.y + ryLocal,
  };

  // Voxel hand position on Viber sprites is at v = 0.79 (lower torso glove level, ~12-15px above ground)
  const handOffsetY = rect.y0 + 0.79 * rect.drawH;
  const handPivotX = e.x + dir * (e.kind === EnemyKind.LOGIC_WEAVER_ELITE ? 15 : 13);
  const handPivotY = e.y + handOffsetY;

  const gunBarrelLen = e.kind === EnemyKind.LOGIC_WEAVER_ELITE ? 36 : 31;
  const gunMuzzle = {
    x: handPivotX + Math.cos(e.facingAngle) * gunBarrelLen,
    y: handPivotY + Math.sin(e.facingAngle) * gunBarrelLen,
  };

  // Handheld Heavy Rocket Launcher (RPG) also held at hand level so it never floats on the head!
  const rpgFrontLen = 32;
  const rocketMuzzle = {
    x: handPivotX + Math.cos(e.facingAngle) * rpgFrontLen,
    y: handPivotY + Math.sin(e.facingAngle) * rpgFrontLen,
  };
  const rocketBackblast = {
    x: handPivotX - Math.cos(e.facingAngle) * 16,
    y: handPivotY - Math.sin(e.facingAngle) * 16,
  };

  return { leftEye, rightEye, gunMuzzle, rocketMuzzle, rocketBackblast };
}

export function drawLootDrop25D(
  ctx: CanvasRenderingContext2D,
  drop: { x: number; y: number; kind: 'oCore' | 'aCore' | 'ru9' | 'ammo' | 'candy' },
  timeSec: number
) {
  const bob = Math.sin(timeSec * 5 + drop.x * 0.05) * 3;
  ctx.save();
  ctx.translate(snap(drop.x), snap(drop.y + bob));

  ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 13, 12, 5, 0, 0, Math.PI * 2);
  ctx.fill();

  if (drop.kind === 'oCore') {
    ctx.fillStyle = 'rgba(16, 163, 127, 0.32)';
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.strokeStyle = '#10a37f';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-12, -12, 24, 24, 6);
    ctx.fill();
    ctx.stroke();

    const knot = requestRawImage(ASSET_URLS.OPENAI_KNOT);
    if (knot) {
      ctx.drawImage(knot, -9.5, -9.5, 19, 19);
    } else {
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, 6.5, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (drop.kind === 'aCore') {
    ctx.fillStyle = 'rgba(0, 229, 255, 0.32)';
    ctx.beginPath();
    ctx.arc(0, 0, 17, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#082f49';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(-12, -12, 24, 24, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e0f2fe';
    ctx.font = '800 11.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('A\\', 0, 4);
  } else if (drop.kind === 'candy') {
    // Festive Glowing Halloween Soul-Candy (Wrapped Orange-Violet Cyber Candy!)
    ctx.fillStyle = 'rgba(249, 115, 22, 0.36)';
    ctx.beginPath();
    ctx.arc(0, 0, 16, 0, Math.PI * 2);
    ctx.fill();

    ctx.save();
    ctx.rotate(-0.35);
    // Candy wrapper tails
    ctx.fillStyle = '#a855f7';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(-8, 0);
    ctx.lineTo(-14, -6);
    ctx.lineTo(-14, 6);
    ctx.closePath();
    ctx.moveTo(8, 0);
    ctx.lineTo(14, -6);
    ctx.lineTo(14, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Striped Pumpkin-Candy center
    ctx.fillStyle = '#f97316';
    ctx.strokeStyle = '#fde047';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, 0, 8.5, 6.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(-3, -5);
    ctx.lineTo(3, 5);
    ctx.stroke();
    ctx.restore();
  } else if (drop.kind === 'ru9') {
    // Gleaming 3D Hexagonal $RU9 Armory Token Coin
    ctx.fillStyle = 'rgba(251, 191, 36, 0.34)';
    ctx.beginPath();
    ctx.arc(0, 0, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#78350f';
    ctx.strokeStyle = '#fbbf24';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i < 6; i++) {
      const a = (i * Math.PI) / 3 - Math.PI / 6;
      const hx = Math.cos(a) * 11;
      const hy = Math.sin(a) * 11;
      if (i === 0) ctx.moveTo(hx, hy);
      else ctx.lineTo(hx, hy);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#fef08a';
    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('RU9', 0, 2.8);
  } else {
    ctx.fillStyle = '#0284c7';
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.6;
    ctx.fillRect(-6, -8, 12, 16);
    ctx.strokeRect(-6, -8, 12, 16);
  }

  ctx.restore();
}

export function drawFieldChest(
  ctx: CanvasRenderingContext2D,
  chest: FieldChest,
  timeSec: number
) {
  const { x, y, opened, hackProgress } = chest;
  ctx.save();
  ctx.translate(snap(x), snap(y));

  ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 10, 22, 10, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = opened ? '#334155' : '#24142e';
  ctx.strokeStyle = opened ? '#64748b' : '#f97316';
  ctx.lineWidth = 2.2;
  ctx.fillRect(-18, -15, 36, 24);
  ctx.strokeRect(-18, -15, 36, 24);
  ctx.fillStyle = opened ? '#475569' : '#3b1548';
  ctx.fillRect(-18, -21, 36, 8);
  ctx.strokeRect(-18, -21, 36, 8);

  if (!opened) {
    const glow = 0.7 + 0.3 * Math.sin(timeSec * 6);
    // Haunted Pumpkin Supply Crate Faceplate
    ctx.fillStyle = `rgba(253, 224, 71, ${glow.toFixed(2)})`;
    ctx.beginPath();
    ctx.moveTo(-9, -8);
    ctx.lineTo(-6, -12);
    ctx.lineTo(-3, -8);
    ctx.moveTo(3, -8);
    ctx.lineTo(6, -12);
    ctx.lineTo(9, -8);
    ctx.fill();
    ctx.fillRect(-8, -3, 16, 3);
    if (hackProgress > 0) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(-18, -30, 36, 5);
      ctx.fillStyle = '#f97316';
      ctx.fillRect(-17, -29, 34 * Math.min(1, hackProgress), 3);
    }
  }
  ctx.restore();
}

export function drawLogicMine25D(
  ctx: CanvasRenderingContext2D,
  mine: LogicMineEntity,
  timeSec: number
) {
  const { x, y, timer, maxTimer, radius } = mine;
  const urgency = 1 - Math.max(0, timer / maxTimer);

  ctx.save();
  ctx.translate(snap(x), snap(y));

  ctx.strokeStyle = `rgba(255, 23, 68, ${(0.5 + urgency * 0.45).toFixed(2)})`;
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(0, 6, radius, radius * 0.52, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = `rgba(225, 29, 72, ${(0.1 + urgency * 0.16).toFixed(2)})`;
  ctx.fill();

  const pulse = Math.sin(timeSec * (8 + urgency * 16)) > 0;
  ctx.fillStyle = pulse ? '#ff1744' : '#3b0a18';
  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 2.5;
  ctx.fillRect(-12, -16, 24, 22);
  ctx.strokeRect(-12, -16, 24, 22);

  ctx.fillStyle = '#f8fafc';
  ctx.font = '800 10.5px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText(`${timer.toFixed(1)}s`, 0, -22);
  ctx.restore();
}

export function drawQuantumPrism25D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  scale: number,
  timeSec: number
) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);

  ctx.strokeStyle = 'rgba(0, 229, 255, 0.8)';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 14, 0, Math.PI * 2);
  ctx.stroke();

  const grad = ctx.createRadialGradient(-3.5, -4, 1, 0, 0, 11);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.35, '#38bdf8');
  grad.addColorStop(0.78, '#4f46e5');
  grad.addColorStop(1, '#1e1b4b');

  ctx.fillStyle = grad;
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.arc(0, 0, 10.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  ctx.save();
  ctx.rotate(timeSec * 6);
  ctx.strokeStyle = '#ff2a85';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 4.2, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCrimsonOptic(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  radius: number,
  rapidFlash: boolean,
  timeSec: number
) {
  const pulse = rapidFlash
    ? Math.sin(timeSec * 28) > 0
      ? 1.45
      : 0.72
    : 0.92 + 0.16 * Math.sin(timeSec * 7.5);

  ctx.save();
  const grad = ctx.createRadialGradient(ex, ey, 0.4, ex, ey, radius * 3.1 * pulse);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.28, '#ff1744');
  grad.addColorStop(0.7, 'rgba(255, 23, 68, 0.55)');
  grad.addColorStop(1, 'rgba(255, 23, 68, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(ex, ey, radius * 3.1 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(255, 42, 95, 0.95)';
  ctx.fillRect(ex - radius * 2.3, ey - 0.9, radius * 4.6, 1.8);
  ctx.restore();
}

function drawBlueOptic(
  ctx: CanvasRenderingContext2D,
  ex: number,
  ey: number,
  radius: number,
  timeSec: number
) {
  const pulse = 0.94 + 0.14 * Math.sin(timeSec * 6.5);
  ctx.save();
  const grad = ctx.createRadialGradient(ex, ey, 0.4, ex, ey, radius * 2.9 * pulse);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.32, '#00b4ff');
  grad.addColorStop(0.72, 'rgba(0, 180, 255, 0.55)');
  grad.addColorStop(1, 'rgba(0, 180, 255, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(ex, ey, radius * 2.9 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'rgba(0, 212, 255, 0.92)';
  ctx.fillRect(ex - radius * 2.1, ey - 0.9, radius * 4.2, 1.8);
  ctx.restore();
}

function drawPetIsoBlock(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  dx: number,
  dy: number,
  front: string,
  top: string,
  side: string,
  border = '#090d16'
) {
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = border;

  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y - dy);
  ctx.lineTo(x + w + dx, y - dy);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = side;
  ctx.beginPath();
  if (dx >= 0) {
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + dx, y - dy);
    ctx.lineTo(x + w + dx, y + h - dy);
    ctx.lineTo(x + w, y + h);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x + dx, y - dy);
    ctx.lineTo(x + dx, y + h - dy);
    ctx.lineTo(x, y + h);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = front;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

function drawQuadrupedRoboDog25D(
  ctx: CanvasRenderingContext2D,
  redEyes: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  const stride = Math.sin(timeSec * 12) * 3;
  const accent = redEyes ? '#ff1744' : '#00e5ff';

  // Far-side articulated servo legs
  for (const lx of [-13, 7]) {
    const off = lx < 0 ? -stride : stride;
    drawPetIsoBlock(
      ctx,
      lx,
      -5 + off,
      6.5,
      12,
      2,
      2,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a'
    );
  }

  // 3D Isometric Boston-Dynamics-style Tactical Hound Chassis + Dorsal Power Pack
  drawPetIsoBlock(
    ctx,
    -17,
    -20,
    35,
    15,
    4,
    4.5,
    hitFlash ? '#ffffff' : redEyes ? '#334155' : '#1e293b',
    hitFlash ? '#ffffff' : redEyes ? '#64748b' : '#475569',
    '#0f172a'
  );
  // Dorsal radar pack & glowing core bar
  drawPetIsoBlock(ctx, -6, -24, 18, 4.5, 3, 2.5, '#334155', '#94a3b8', '#1e293b');
  ctx.fillStyle = accent;
  ctx.fillRect(-10, -14, 20, 3.5);

  // Near-side articulated servo legs with glowing ankle actuators
  for (const lx of [-6, 13]) {
    const off = lx < 0 ? stride : -stride;
    drawPetIsoBlock(
      ctx,
      lx,
      -4 + off,
      7,
      12.5,
      2.5,
      2,
      hitFlash ? '#ffffff' : '#334155',
      '#64748b',
      '#0f172a'
    );
    ctx.fillStyle = accent;
    ctx.fillRect(lx + 1, 5 + off, 5, 2.2);
  }

  // Segmented Cyber Tail Antenna with Telemetry Beacon
  const tailY = -27 + Math.sin(timeSec * 14) * 3;
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.moveTo(18, -17);
  ctx.lineTo(25, tailY);
  ctx.stroke();
  ctx.fillStyle = accent;
  ctx.beginPath();
  ctx.arc(25, tailY, 2.8, 0, Math.PI * 2);
  ctx.fill();

  // 3D Isometric Armored Hound Head + Snout Muzzle + Twin Sensor Ears
  drawPetIsoBlock(
    ctx,
    -28,
    -33,
    19,
    16,
    3.5,
    4,
    hitFlash ? '#ffffff' : '#475569',
    '#94a3b8',
    '#1e293b'
  );
  drawPetIsoBlock(
    ctx,
    -35,
    -26,
    9,
    9,
    2.5,
    2.5,
    hitFlash ? '#ffffff' : '#334155',
    '#64748b',
    '#0f172a'
  );
  drawPetIsoBlock(ctx, -25, -40, 5, 7, 2, 2, accent, '#e0f2fe', '#0284c7');
  drawPetIsoBlock(ctx, -16, -40, 5, 7, 2, 2, accent, '#e0f2fe', '#0284c7');

  // Armored HUD Visor + Glowing Optics
  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-27, -29, 14, 6);
  if (redEyes) {
    drawCrimsonOptic(ctx, -24, -26, 2.8, false, timeSec);
    drawCrimsonOptic(ctx, -17, -26, 2.8, false, timeSec);
  } else {
    drawBlueOptic(ctx, -24, -26, 2.9, timeSec);
    drawBlueOptic(ctx, -17, -26, 2.9, timeSec);
  }
}

function drawQuadrupedRoboCat25D(
  ctx: CanvasRenderingContext2D,
  redEyes: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  const stride = Math.cos(timeSec * 13) * 2.6;
  const accent = redEyes ? '#ff1744' : '#00e5ff';

  // Far-side sleek cyber-panther legs
  for (const lx of [-11, 6]) {
    const off = lx < 0 ? -stride : stride;
    drawPetIsoBlock(
      ctx,
      lx,
      -4 + off,
      5.5,
      11,
      2,
      2,
      hitFlash ? '#ffffff' : '#1e1b4b',
      '#4338ca',
      '#0f172a'
    );
  }

  // 3D Isometric Sleek Stealth Cyber-Panther Chassis + Twin Micro-Wing Thrusters
  drawPetIsoBlock(
    ctx,
    -14,
    -18,
    30,
    13,
    4,
    4,
    hitFlash ? '#ffffff' : '#1e1b4b',
    hitFlash ? '#ffffff' : '#3730a3',
    '#090d16',
    accent
  );
  // Side holographic circuit stripe + dorsal laser emitter pod
  ctx.fillStyle = accent;
  ctx.fillRect(-8, -13, 18, 2.8);
  drawPetIsoBlock(ctx, -3, -22, 12, 4, 2.5, 2, '#0f172a', '#38bdf8', '#1e293b', accent);

  // Near-side articulated cyber-paws
  for (const lx of [-4, 12]) {
    const off = lx < 0 ? stride : -stride;
    drawPetIsoBlock(
      ctx,
      lx,
      -3 + off,
      5.5,
      11,
      2,
      2,
      hitFlash ? '#ffffff' : '#312e81',
      '#4f46e5',
      '#0f172a'
    );
    ctx.fillStyle = accent;
    ctx.fillRect(lx + 0.8, 5.5 + off, 4, 2);
  }

  // Segmented Whip-Blade Fiber-Optic Cyber Tail
  const tailSway = Math.sin(timeSec * 9.5) * 4;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 4.6;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(16, -14);
  ctx.quadraticCurveTo(27, -21, 23 + tailSway, -32);
  ctx.stroke();
  ctx.strokeStyle = accent;
  ctx.lineWidth = 2.2;
  ctx.stroke();
  ctx.fillStyle = '#e0f2fe';
  ctx.beginPath();
  ctx.arc(23 + tailSway, -32, 2.4, 0, Math.PI * 2);
  ctx.fill();

  // 3D Isometric Angular Cyber-Feline Visor Helmet + Pointed Sonar Ears
  drawPetIsoBlock(
    ctx,
    -25,
    -31,
    18,
    15,
    3.5,
    4,
    hitFlash ? '#ffffff' : '#1e1b4b',
    '#4338ca',
    '#090d16',
    accent
  );

  for (const ex of [-23, -13]) {
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(ex, -31);
    ctx.lineTo(ex + 3, -41);
    ctx.lineTo(ex + 7, -31);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-24, -26, 14, 5.5);
  if (redEyes) {
    drawCrimsonOptic(ctx, -21, -23.2, 2.6, false, timeSec);
    drawCrimsonOptic(ctx, -14, -23.2, 2.6, false, timeSec);
  } else {
    drawBlueOptic(ctx, -21, -23.2, 2.8, timeSec);
    drawBlueOptic(ctx, -14, -23.2, 2.8, timeSec);
  }
}

function drawFallbackVoxelCube(ctx: CanvasRenderingContext2D, mainColor: string, visorColor: string) {
  ctx.fillStyle = mainColor;
  ctx.strokeStyle = '#141210';
  ctx.lineWidth = 2.5;
  ctx.fillRect(-12, -4, 9, 11);
  ctx.strokeRect(-12, -4, 9, 11);
  ctx.fillRect(3, -4, 9, 11);
  ctx.strokeRect(3, -4, 9, 11);
  ctx.fillRect(-15, -26, 30, 22);
  ctx.strokeRect(-15, -26, 30, 22);
  ctx.fillRect(-20, -72, 40, 46);
  ctx.strokeRect(-20, -72, 40, 46);
  ctx.fillStyle = visorColor;
  ctx.fillRect(-15, -52, 12, 11);
  ctx.fillRect(3, -52, 12, 11);
}

/**
 * Draws the in-hand 2.5D weapon skin matching `WeaponPreviewArt` in the inventory 1:1,
 * anchored directly at the character's hand grip!
 */
function drawWeaponAttachment25D(
  ctx: CanvasRenderingContext2D,
  weapon: WeaponId,
  pivotX: number,
  pivotY: number,
  renderAngle: number,
  swingTimer: number,
  recoilTimer: number,
  timeSec: number,
  scale = 0.86
) {
  const flipY = Math.cos(renderAngle) < 0 ? -1 : 1;
  const swingArc =
    swingTimer > 0
      ? Math.sin((1 - swingTimer / 0.24) * Math.PI * 2) * 0.82 * flipY
      : 0;
  const totalAngle = renderAngle + swingArc;
  const recoilShift = recoilTimer > 0 ? -Math.min(6, recoilTimer * 40) : 0;

  ctx.save();
  ctx.translate(pivotX, pivotY);
  ctx.rotate(totalAngle);
  if (flipY < 0) ctx.scale(1, -1);
  ctx.scale(scale, scale);
  ctx.translate(recoilShift, 0);

  if (weapon === WeaponId.ARC_BLADE) {
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillRect(-6, -3, 14, 6);
    ctx.strokeRect(-6, -3, 14, 6);
    ctx.fillStyle = '#334155';
    ctx.fillRect(7, -8, 5, 16);
    ctx.strokeRect(7, -8, 5, 16);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(8.5, -6, 2.2, 2.2);
    ctx.fillRect(8.5, 3.8, 2.2, 2.2);

    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(12, -4.5);
    ctx.lineTo(40, -4);
    ctx.lineTo(46, 0.5);
    ctx.lineTo(12, 0.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const edgeGrad = ctx.createLinearGradient(12, 0, 46, 0);
    edgeGrad.addColorStop(0, '#0284c7');
    edgeGrad.addColorStop(0.55, '#38bdf8');
    edgeGrad.addColorStop(1, '#e0f2fe');
    ctx.fillStyle = edgeGrad;
    ctx.beginPath();
    ctx.moveTo(12, 0.5);
    ctx.lineTo(46, 0.5);
    ctx.lineTo(41, 4.2);
    ctx.lineTo(12, 3.8);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    const jitter = Math.sin(timeSec * 28) * 1.6;
    ctx.moveTo(16, -5);
    ctx.lineTo(24, -8 + jitter);
    ctx.lineTo(31, -4 - jitter);
    ctx.lineTo(40, -7 + jitter);
    ctx.stroke();
  } else if (weapon === WeaponId.CHAINSAW_SWORD) {
    ctx.fillStyle = '#7c2d12';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillRect(-8, -5, 17, 11);
    ctx.strokeRect(-8, -5, 17, 11);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(3, -4, 6, 9);

    const toothPhase = Math.floor(timeSec * 24) % 2 === 0 ? 0 : 2;
    ctx.fillStyle = '#fb923c';
    for (let tx = 10 + toothPhase; tx <= 40; tx += 5) {
      ctx.fillRect(tx, -8, 3, 3);
      ctx.fillRect(tx, 5, 3, 3);
    }

    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(9, -5, 35, 10, 4);
    ctx.fill();
    ctx.stroke();

    const coreGrad = ctx.createLinearGradient(11, 0, 41, 0);
    coreGrad.addColorStop(0, '#ea580c');
    coreGrad.addColorStop(0.6, '#fb923c');
    coreGrad.addColorStop(1, '#fef08a');
    ctx.fillStyle = coreGrad;
    ctx.fillRect(12, -1.3, 28, 2.6);
  } else if (weapon === WeaponId.PULSE_LASER) {
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -4, 14, 8);
    ctx.strokeRect(-10, -4, 14, 8);

    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.3;
    ctx.fillRect(8, 3, 5, 8);
    ctx.strokeRect(8, 3, 5, 8);

    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.6;
    ctx.fillStyle = '#334155';
    ctx.fillRect(5, -9, 10, 4.5);
    ctx.strokeRect(5, -9, 10, 4.5);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(7.5, -7.8, 5, 2);

    ctx.fillStyle = '#27303f';
    ctx.fillRect(2, -5, 36, 8.5);
    ctx.strokeRect(2, -5, 36, 8.5);

    const lGrad = ctx.createLinearGradient(5, 0, 40, 0);
    lGrad.addColorStop(0, '#be123c');
    lGrad.addColorStop(0.65, '#f43f5e');
    lGrad.addColorStop(1, '#ffffff');
    ctx.fillStyle = lGrad;
    ctx.fillRect(5, -1.8, 34, 2.6);

    ctx.fillStyle = '#475569';
    ctx.fillRect(36, -5, 6, 2.5);
    ctx.fillRect(36, 1, 6, 2.5);
  } else if (weapon === WeaponId.PLASMA_SCATTERGUN) {
    // Wide Twin-Choke Ion Breacher Scattergun
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(-10, -5, 16, 10);
    ctx.strokeRect(-10, -5, 16, 10);

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(4, -6, 30, 12);
    ctx.strokeRect(4, -6, 30, 12);

    // Emerald-Cyan Ion Pump & Twin Barrels
    ctx.fillStyle = '#10b981';
    ctx.fillRect(10, 3.5, 16, 4);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(8, -3.5, 24, 2.5);
    ctx.fillRect(8, 0.5, 24, 2.5);

    // Flared Heavy Breacher Choke
    ctx.fillStyle = '#475569';
    ctx.fillRect(33, -7, 7, 14);
    ctx.strokeRect(33, -7, 7, 14);
  } else if (weapon === WeaponId.TESLA_ARC_EMITTER) {
    // 3-Ring High-Voltage Tesla Coil Projector
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#1e1b4b';
    ctx.fillRect(-10, -5, 18, 10);
    ctx.strokeRect(-10, -5, 18, 10);

    ctx.fillStyle = '#312e81';
    ctx.fillRect(6, -4, 28, 8);
    ctx.strokeRect(6, -4, 28, 8);

    // 3 Copper/Cyan Induction Rings
    for (const rx of [12, 20, 28]) {
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(rx, -7.5, 3.2, 15);
      ctx.strokeRect(rx, -7.5, 3.2, 15);
    }

    // Glowing Spherical Arc Emitter Tip
    ctx.fillStyle = '#a855f7';
    ctx.beginPath();
    ctx.arc(38, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#e0f2fe';
    ctx.beginPath();
    ctx.arc(38, 0, 2.3, 0, Math.PI * 2);
    ctx.fill();
  } else if (weapon === WeaponId.GAUSS_RAILGUN) {
    // Long Split-Rail Hypervelocity Gauss Sniper
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-12, -5, 18, 10);
    ctx.strokeRect(-12, -5, 18, 10);

    // Top digital rangefinder scope
    ctx.fillStyle = '#334155';
    ctx.fillRect(6, -10, 16, 4.5);
    ctx.strokeRect(6, -10, 16, 4.5);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(18, -9, 3, 2.5);

    // Upper & Lower Magnetic Accelerator Rails with Glowing Gap!
    ctx.fillStyle = '#1e293b';
    ctx.fillRect(5, -5.5, 45, 4);
    ctx.strokeRect(5, -5.5, 45, 4);
    ctx.fillRect(5, 1.5, 45, 4);
    ctx.strokeRect(5, 1.5, 45, 4);

    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(8, -1.2, 42, 2.4);
  } else if (weapon === WeaponId.SINGULARITY_LAUNCHER) {
    // Graviton Dark-Matter Torus Cannon
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-12, -6, 16, 12);
    ctx.strokeRect(-12, -6, 16, 12);

    ctx.fillStyle = '#2e1065';
    ctx.fillRect(2, -7.5, 32, 15);
    ctx.strokeRect(2, -7.5, 32, 15);

    // Glowing Violet-Cyan Event Horizon Core
    ctx.fillStyle = '#090514';
    ctx.beginPath();
    ctx.arc(22, 0, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#c084fc';
    ctx.lineWidth = 1.8;
    ctx.stroke();

    // Open Magnetic Containment Claws at Muzzle
    ctx.fillStyle = '#475569';
    ctx.fillRect(34, -8.5, 9, 3.5);
    ctx.fillRect(34, 5, 9, 3.5);
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(39, 0, 3.4, 0, Math.PI * 2);
    ctx.fill();
  } else {
    // DISRUPTOR_CANNON
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#18181b';
    ctx.fillRect(-12, -5, 11, 10);
    ctx.strokeRect(-12, -5, 11, 10);

    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.roundRect(2, 4, 13, 8, 2);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillStyle = '#1f2937';
    ctx.beginPath();
    ctx.roundRect(-3, -6.5, 38, 11.5, 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.fillRect(7, -11, 14, 4.5);
    ctx.strokeRect(7, -11, 14, 4.5);

    const cGrad = ctx.createLinearGradient(2, 0, 33, 0);
    cGrad.addColorStop(0, '#9f1239');
    cGrad.addColorStop(0.5, '#ff1744');
    cGrad.addColorStop(1, '#fde047');
    ctx.fillStyle = cGrad;
    ctx.fillRect(2, -2.5, 30, 4);

    ctx.fillStyle = '#374151';
    ctx.beginPath();
    ctx.moveTo(35, -7.5);
    ctx.lineTo(43, -5.5);
    ctx.lineTo(43, 4);
    ctx.lineTo(35, 6);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws Enemy-Held Weapons STRICTLY at the Viber Robot's Lower-Torso Hand Position (`v = 0.79`, `y ≈ -13`)
 * so weapons NEVER float up on their giant blocky heads!
 */
function drawEnemyWeaponAtHands25D(
  ctx: CanvasRenderingContext2D,
  e: RenderEnemyData,
  handOffsetY: number,
  bob: number
) {
  const facingRight = Math.cos(e.facingAngle) >= 0;
  const dir = facingRight ? 1 : -1;
  const flipY = facingRight ? 1 : -1;
  const handX = dir * (e.kind === EnemyKind.LOGIC_WEAVER_ELITE ? 15 : 13);
  const handY = handOffsetY + bob;

  if (e.kind === EnemyKind.OPENAI_STALKER) {
    // Pulse Rifle held in lower-torso voxel hand!
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(e.facingAngle);
    if (flipY < 0) ctx.scale(1, -1);

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.fillRect(-5, -3.5, 32, 6.5);
    ctx.strokeRect(-5, -3.5, 32, 6.5);
    ctx.fillStyle = '#334155';
    ctx.fillRect(7, 3, 5, 5);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(3, -1.3, 23, 2.2);
    ctx.fillStyle = '#475569';
    ctx.fillRect(26, -3, 5, 5.5);
    // Voxel glove gripping handle
    ctx.fillStyle = '#786350';
    ctx.fillRect(-2, -3, 6, 6);
    ctx.strokeRect(-2, -3, 6, 6);
    ctx.restore();
  } else if (e.kind === EnemyKind.OPENAI_VIPER) {
    // Melee Crimson Electro-Blade held in lower-torso voxel hand!
    const swing =
      e.meleeSwingTimer > 0
        ? Math.sin((1 - e.meleeSwingTimer / 0.25) * Math.PI * 2) * 0.95 * flipY
        : 0;
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(e.facingAngle + swing);
    if (flipY < 0) ctx.scale(1, -1);

    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.6;
    ctx.fillRect(-2, -3, 6, 6);
    ctx.strokeRect(-2, -3, 6, 6);

    ctx.fillStyle = '#1e293b';
    ctx.fillRect(3, -2.2, 8, 4.4);
    ctx.strokeRect(3, -2.2, 8, 4.4);

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.moveTo(11, -3.5);
    ctx.lineTo(29, 0);
    ctx.lineTo(11, 3.5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  } else if (e.kind === EnemyKind.ANTHROPIC_BULWARK) {
    // Underarm / Hand-Gripped Heavy Rocket Launcher (RPG) right at voxel hand level!
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(e.facingAngle);
    if (flipY < 0) ctx.scale(1, -1);

    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.9;
    ctx.fillRect(-16, -5, 7, 10);
    ctx.strokeRect(-16, -5, 7, 10);

    ctx.fillStyle = '#1f2937';
    ctx.fillRect(-9, -6, 36, 12);
    ctx.strokeRect(-9, -6, 36, 12);

    ctx.fillStyle = '#eab308';
    ctx.fillRect(7, -5.5, 5, 11);

    ctx.fillStyle = '#475569';
    ctx.fillRect(26, -7, 5, 14);
    ctx.strokeRect(26, -7, 5, 14);
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(31, 0, 3, 0, Math.PI * 2);
    ctx.fill();

    // White voxel cuff hand gripping RPG launcher
    ctx.fillStyle = '#e2e8f0';
    ctx.fillRect(-2, -3, 6, 6);
    ctx.strokeRect(-2, -3, 6, 6);
    ctx.restore();
  } else if (e.kind === EnemyKind.LOGIC_WEAVER_ELITE) {
    // Hand-Gripped Heavy Twin Autocannon & Micro-Pod at voxel hand level!
    ctx.save();
    ctx.translate(handX, handY);
    ctx.rotate(e.facingAngle);
    if (flipY < 0) ctx.scale(1, -1);
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2;
    ctx.fillRect(-6, -6, 38, 12);
    ctx.strokeRect(-6, -6, 38, 12);
    ctx.fillStyle = '#ff2a85';
    ctx.fillRect(6, -3.8, 29, 2.4);
    ctx.fillRect(6, 1.4, 29, 2.4);
    ctx.fillStyle = '#d6d3d1';
    ctx.fillRect(-2, -3.5, 6, 7);
    ctx.strokeRect(-2, -3.5, 6, 7);
    ctx.restore();
  }
}

export function drawEnemySprite25D(
  ctx: CanvasRenderingContext2D,
  e: RenderEnemyData,
  timeSec: number,
  lockedByCannon: boolean,
  speciesOwned = false
) {
  const {
    x,
    y,
    kind,
    hp,
    maxHp,
    armor,
    maxArmor,
    stunTimer,
    berserk,
    markedByDog,
    hitFlash,
    facingAngle,
    syncResistant,
    captureTimer,
    eyeChargeTimer,
    isMoving,
    walkPhase,
  } = e;

  const bob = isMoving
    ? -Math.abs(Math.cos(walkPhase)) * 3.0
    : Math.sin(timeSec * 3.5 + x * 0.04) * -1.1;
  const isEldritch = isEldritchEnemyKind(kind);
  const isMechChimera = isMechaOrChimeraKind(kind);
  const isHalloween = isHalloweenEnemyKind(kind);
  const isBoss = isWorldBossKind(kind);
  const isElite = isEliteEnemyKind(kind);
  const isWildPet = isWildPetEnemyKind(kind);
  const isWildDog = kind === EnemyKind.WILD_SCOUT_DOG;
  const isWildCat = kind === EnemyKind.WILD_CYBER_CAT;
  const isWildPumpkin = kind === EnemyKind.WILD_PUMPKIN_SPIRIT;
  const facingRight = Math.cos(facingAngle) >= 0;

  ctx.save();
  ctx.translate(snap(x), snap(y));

  const shadowRx = isBoss
    ? 44
    : kind === EnemyKind.MECH_SPIDER_ARACHNID || kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH
    ? 36
    : isElite
    ? 32
    : isWildPet
    ? 18
    : 24;
  ctx.fillStyle = isHalloween
    ? 'rgba(124, 45, 18, 0.52)'
    : isEldritch
    ? 'rgba(46, 16, 101, 0.55)'
    : isBoss
    ? 'rgba(124, 45, 18, 0.55)'
    : 'rgba(9, 13, 22, 0.48)';
  ctx.beginPath();
  ctx.ellipse(0, 9, shadowRx, shadowRx * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  let topBarAnchorY = -80;

  if (isHalloween) {
    ctx.save();
    ctx.translate(0, bob);
    const hPx = drawHalloweenEnemy25D(
      ctx,
      kind,
      facingRight,
      hitFlash > 0,
      eyeChargeTimer > 0 || berserk,
      e.meleeSwingTimer,
      facingAngle,
      walkPhase,
      timeSec
    );
    topBarAnchorY = -hPx - 6;
    ctx.restore();
  } else if (isMechChimera) {
    ctx.save();
    ctx.translate(0, bob);
    const hPx = drawMechChimeraEnemy25D(
      ctx,
      kind,
      facingRight,
      hitFlash > 0,
      eyeChargeTimer > 0 || berserk,
      e.meleeSwingTimer,
      facingAngle,
      walkPhase,
      timeSec
    );
    topBarAnchorY = -hPx - 6;
    ctx.restore();
  } else if (isEldritch) {
    ctx.save();
    ctx.translate(0, bob);
    const hPx = drawEldritchEnemyBody25D(
      ctx,
      kind,
      facingRight,
      hitFlash > 0,
      eyeChargeTimer > 0 || berserk,
      e.meleeSwingTimer,
      facingAngle,
      timeSec
    );
    topBarAnchorY = -hPx - 4;
    ctx.restore();
  } else if (isWildPet) {
    ctx.save();
    ctx.translate(0, bob);
    if (facingRight) ctx.scale(-1, 1);
    if (isWildDog) {
      drawQuadrupedRoboDog25D(ctx, true, hitFlash > 0, timeSec);
    } else if (isWildCat) {
      drawQuadrupedRoboCat25D(ctx, true, hitFlash > 0, timeSec);
    } else {
      drawHalloweenPet25D(ctx, isWildPumpkin, true, hitFlash > 0, timeSec);
    }
    ctx.restore();
    topBarAnchorY = -46;
  } else {
    const targetH = getEnemyTargetHeight(kind);
    const spriteObj = requestSprite(getEnemySpriteUrl(kind));
    const rect = computeCalibratedSpriteRect(spriteObj, targetH);
    topBarAnchorY = -targetH + 2;

    ctx.save();
    ctx.translate(0, bob);
    if (facingRight) ctx.scale(-1, 1);

    if (spriteObj) {
      const imgToDraw = hitFlash > 0 ? spriteObj.flashCanvas : spriteObj.canvas;
      ctx.drawImage(imgToDraw, rect.x0, rect.y0, rect.drawW, rect.drawH);

      const lx = rect.x0 + spriteObj.leftEyeUV.u * rect.drawW;
      const ly = rect.y0 + spriteObj.leftEyeUV.v * rect.drawH;
      const rx = rect.x0 + spriteObj.rightEyeUV.u * rect.drawW;
      const ry = rect.y0 + spriteObj.rightEyeUV.v * rect.drawH;
      const eyeR =
        (kind === EnemyKind.LOGIC_WEAVER_ELITE ? 4.0 : 3.2) * (eyeChargeTimer > 0 ? 1.45 : 1);

      drawCrimsonOptic(ctx, lx, ly, eyeR, syncResistant || berserk || eyeChargeTimer > 0, timeSec);
      drawCrimsonOptic(ctx, rx, ry, eyeR, syncResistant || berserk || eyeChargeTimer > 0, timeSec);
    } else {
      drawFallbackVoxelCube(ctx, '#b45309', '#ff1744');
    }
    ctx.restore();

    // Render held weapon strictly at the robot's lower-body hand position (v = 0.79)
    if (captureTimer <= 0) {
      const handOffsetY = rect.y0 + 0.79 * rect.drawH;
      drawEnemyWeaponAtHands25D(ctx, e, handOffsetY, bob);
    }
  }

  // Eye-Laser Lock-On Telegraph Sight Line (drawn from exact red pupils!)
  if (eyeChargeTimer > 0) {
    const anchors = getEnemyCombatAnchorsWorld(e);
    const alpha = 0.38 + 0.45 * Math.abs(Math.sin(timeSec * 26));
    ctx.save();
    ctx.translate(-snap(x), -snap(y));
    ctx.strokeStyle = isEldritch
      ? `rgba(192, 38, 211, ${alpha.toFixed(2)})`
      : `rgba(255, 23, 68, ${alpha.toFixed(2)})`;
    ctx.lineWidth = 1.8;
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(anchors.leftEye.x, anchors.leftEye.y + bob);
    ctx.lineTo(e.eyeTargetX, e.eyeTargetY);
    ctx.moveTo(anchors.rightEye.x, anchors.rightEye.y + bob);
    ctx.lineTo(e.eyeTargetX, e.eyeTargetY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  }

  if (captureTimer > 0) {
    drawQuantumPrism25D(ctx, 0, -24 + bob, 1.9, timeSec);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(-24, topBarAnchorY - 12, 48, 6);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(-23, topBarAnchorY - 11, 46 * Math.min(1, 1 - captureTimer / 1.05), 4);
  } else if (isWildPet) {
    const chancePct = Math.min(95, Math.round((0.5 + (1 - hp / maxHp) * 0.45) * 100));
    const label = speciesOwned ? 'TAMED' : `[G] ORB · ${chancePct}%`;
    ctx.font = '800 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const boxW = speciesOwned ? 56 : 94;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(-boxW / 2, -58 + bob, boxW, 13);
    ctx.strokeStyle = speciesOwned ? '#64748b' : '#f97316';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-boxW / 2, -58 + bob, boxW, 13);
    ctx.fillStyle = speciesOwned ? '#cbd5e1' : '#fde047';
    ctx.fillText(label, 0, -48.5 + bob);
  } else if (isBoss || isElite) {
    const badge = isBoss ? 'BOSS' : 'ELITE';
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const bw = isBoss ? 40 : 42;
    ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.fillRect(-bw / 2, topBarAnchorY - 16, bw, 12);
    ctx.strokeStyle = isBoss ? '#f97316' : '#eab308';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-bw / 2, topBarAnchorY - 16, bw, 12);
    ctx.fillStyle = isBoss ? '#fb923c' : '#fde047';
    ctx.fillText(badge, 0, topBarAnchorY - 7);
  }

  if (markedByDog) {
    ctx.strokeStyle = '#00b4ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, topBarAnchorY - 2 + bob);
    ctx.lineTo(-6, topBarAnchorY - 10 + bob);
    ctx.lineTo(6, topBarAnchorY - 10 + bob);
    ctx.closePath();
    ctx.stroke();
  }

  if (stunTimer > 0) {
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(-14, -38);
    ctx.lineTo(-3, -30);
    ctx.lineTo(7, -42);
    ctx.lineTo(15, -29);
    ctx.stroke();
  }

  if (lockedByCannon) {
    ctx.save();
    ctx.translate(0, -38 + bob);
    ctx.rotate(timeSec * 3.5);
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.strokeRect(-18, -18, 36, 36);
    ctx.restore();
  }

  const barW = isBoss ? 76 : isElite || isMechChimera ? 54 : 38;
  ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
  ctx.fillRect(-barW / 2, topBarAnchorY, barW, isBoss ? 6 : 5);
  ctx.fillStyle = syncResistant
    ? '#f59e0b'
    : isBoss
    ? '#f97316'
    : isEldritch
    ? '#c026d3'
    : '#f43f5e';
  ctx.fillRect(
    -barW / 2 + 1,
    topBarAnchorY + 1,
    Math.max(0, (barW - 2) * (hp / maxHp)),
    isBoss ? 4 : 3
  );

  if (maxArmor > 0 && armor > 0) {
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(-barW / 2 + 1, topBarAnchorY - 3, Math.max(0, (barW - 2) * (armor / maxArmor)), 2);
  }

  ctx.restore();
}

/**
 * Renders the Protagonist:
 * 1. Space Doge (`DEGEN_ASTRO`): Uses 100% authentic user-provided comic-inked frames (`DOGE_R_IDLE`,
 *    `DOGE_R_STRIDE`, `DOGE_R_STEP`, `DOGE_L_IDLE`, `DOGE_L_STEP`) without drawing ANY fake limbs!
 * 2. Other Operatives (`Cipher`, `Volt`, `Rotor`): Calibrated to the EXACT same `80px` humanoid height
 *    as Space Doge, holding their equipped weapon right at their lower-body voxel hand (`y = -12`)!
 */
export function drawPlayerSprite25D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  aimAngle: number,
  facingRight: boolean,
  isMoving: boolean,
  walkPhase: number,
  _moveDirX: number,
  weapon: WeaponId,
  skin: PlayerSkinId,
  swingTimer: number,
  recoilTimer: number,
  invulnTimer: number,
  timeSec: number,
  wearWitchHat = false,
  bloodMoonActive = false,
  armorRingColor = '#00e5ff',
  shieldRatio = 0
) {
  ctx.save();
  ctx.translate(snap(x), snap(y));

  if (invulnTimer > 0 && Math.floor(timeSec * 24) % 2 === 0) {
    ctx.globalAlpha = 0.55;
  }

  // Ground shadow + Protagonist Exo-Armor Holographic Ring
  ctx.fillStyle = 'rgba(9, 13, 22, 0.52)';
  ctx.beginPath();
  ctx.ellipse(0, 9, 23, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = bloodMoonActive ? '#f97316' : armorRingColor;
  ctx.lineWidth = bloodMoonActive ? 2.6 : 2.1;
  ctx.beginPath();
  ctx.ellipse(0, 9, 26, 11, 0, 0, Math.PI * 2);
  ctx.stroke();

  if (shieldRatio > 0.05) {
    ctx.save();
    ctx.globalAlpha = 0.35 + shieldRatio * 0.45;
    ctx.strokeStyle = armorRingColor;
    ctx.lineWidth = 1.6;
    ctx.setLineDash([8, 4]);
    ctx.beginPath();
    ctx.ellipse(0, 9, 32, 13.5, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  const dir = facingRight ? 1 : -1;
  let displayAngle = aimAngle;
  const activelyAttacking = swingTimer > 0 || recoilTimer > 0;
  if (!activelyAttacking && Math.cos(aimAngle) * dir < 0) {
    const clampedSin = Math.max(-0.5, Math.min(0.5, Math.sin(aimAngle)));
    displayAngle = Math.atan2(clampedSin, dir * 0.88);
  }

  const bodyBob = isMoving
    ? -Math.abs(Math.cos(walkPhase)) * 2.8
    : Math.sin(timeSec * 3.2) * 0.9;

  if (skin === PlayerSkinId.DEGEN_ASTRO) {
    const pose = getSpaceDogeActionPose(facingRight, isMoving, walkPhase);
    const spriteObj = pose.sprite;
    const rect = computeCalibratedSpriteRect(spriteObj, HUMANOID_VISUAL_HEIGHT);
    const recoilNudgeX = recoilTimer > 0 ? -dir * Math.min(3.5, recoilTimer * 22) : 0;

    ctx.save();
    ctx.translate(recoilNudgeX, bodyBob);

    if (spriteObj) {
      const usePureOriginalRifle = weapon === WeaponId.PULSE_LASER;
      const canvasToDraw = usePureOriginalRifle
        ? spriteObj.canvas
        : spriteObj.customWeaponBaseCanvas || spriteObj.canvas;

      ctx.save();
      if (pose.mirrorX) {
        ctx.scale(-1, 1);
      }
      ctx.drawImage(canvasToDraw, rect.x0, rect.y0, rect.drawW, rect.drawH);
      ctx.restore();

      // Muzzle flash right at Space Doge's original rifle barrel tip when firing Pulse Laser!
      if (usePureOriginalRifle && recoilTimer > 0.04) {
        const mx = rect.x0 + pose.muzzleUV.u * rect.drawW;
        const my = rect.y0 + pose.muzzleUV.v * rect.drawH;
        ctx.fillStyle = '#ff2a85';
        ctx.beginPath();
        ctx.arc(mx, my, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(mx, my, 2.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // If equipping Arc Blade, Chainsaw Sword, or Disruptor Cannon, anchor it cleanly inside
      // Space Doge's original comic-drawn white gloved hands without altering his limbs!
      if (!usePureOriginalRifle) {
        const gripX = rect.x0 + pose.gripUV.u * rect.drawW;
        const gripY = rect.y0 + pose.gripUV.v * rect.drawH;
        const clampedWeaponAngle = Math.atan2(
          Math.max(-0.45, Math.min(0.45, Math.sin(displayAngle))),
          dir * Math.max(0.55, Math.abs(Math.cos(displayAngle)))
        );
        drawWeaponAttachment25D(
          ctx,
          weapon,
          gripX,
          gripY,
          clampedWeaponAngle,
          swingTimer,
          recoilTimer,
          timeSec,
          0.84
        );
      }
    } else {
      drawFallbackVoxelCube(ctx, '#e2e8f0', '#22ff88');
    }

    ctx.restore();
  } else {
    // Viber Operative Skins (`Cipher`, `Volt`, `Rotor`):
    // Calibrated to HUMANOID_VISUAL_HEIGHT (80px — exact same height as Space Doge!)
    // and holding weapons strictly at their lower-body voxel hand (`y = -12`, NEVER on their heads!)
    const spriteObj = requestSprite(getPlayerSkinSpriteUrl(skin));
    const rect = computeCalibratedSpriteRect(spriteObj, HUMANOID_VISUAL_HEIGHT);
    const tilt = isMoving ? Math.sin(walkPhase) * 0.045 : 0;

    ctx.save();
    ctx.translate(0, bodyBob);
    if (facingRight) ctx.scale(-1, 1);
    if (tilt !== 0) ctx.rotate(tilt);

    if (spriteObj) {
      ctx.drawImage(spriteObj.canvas, rect.x0, rect.y0, rect.drawW, rect.drawH);
    } else {
      drawFallbackVoxelCube(ctx, '#0f766e', '#38bdf8');
    }
    ctx.restore();

    // True voxel hand level on calibrated 80px Viber sprite (`v = 0.79` -> y ≈ -12)
    const handX = dir * 12;
    const handY = rect.y0 + 0.79 * rect.drawH + bodyBob;
    drawWeaponAttachment25D(
      ctx,
      weapon,
      handX,
      handY,
      displayAngle,
      swingTimer,
      recoilTimer,
      timeSec,
      0.86
    );

    // Matching voxel glove block gripping the weapon handle at hand level
    ctx.fillStyle = '#e2e8f0';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.6;
    ctx.fillRect(handX - 3, handY - 3, 6, 6);
    ctx.strokeRect(handX - 3, handY - 3, 6, 6);
  }

  drawFestiveHalloweenCrown25D(
    ctx,
    -HUMANOID_VISUAL_HEIGHT + 4 + bodyBob,
    wearWitchHat,
    bloodMoonActive,
    timeSec
  );

  ctx.restore();
}

export function drawCompanionSprite25D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  kind: CompanionKind,
  facingRight: boolean,
  timeSec: number
) {
  const isHalloweenPet =
    kind === CompanionKind.PUMPKIN_SPIRIT || kind === CompanionKind.NIGHT_BAT;
  const bob =
    Math.abs(Math.sin(timeSec * 10 + (kind === CompanionKind.CYBER_CAT ? 1.4 : 0))) * -2.5;

  ctx.save();
  ctx.translate(snap(x), snap(y));

  ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 9, 19, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = isHalloweenPet ? 'rgba(249, 115, 22, 0.88)' : 'rgba(0, 180, 255, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 9, 22, 9.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(0, bob);
  if (facingRight) ctx.scale(-1, 1);
  if (kind === CompanionKind.SCOUT_DOG) {
    drawQuadrupedRoboDog25D(ctx, false, false, timeSec);
  } else if (kind === CompanionKind.CYBER_CAT) {
    drawQuadrupedRoboCat25D(ctx, false, false, timeSec);
  } else {
    drawHalloweenPet25D(
      ctx,
      kind === CompanionKind.PUMPKIN_SPIRIT,
      false,
      false,
      timeSec
    );
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(-18, -53 + bob, 36, 12);
  ctx.strokeStyle = isHalloweenPet ? '#f97316' : '#00e5ff';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-18, -53 + bob, 36, 12);
  ctx.fillStyle = isHalloweenPet ? '#fde047' : '#38bdf8';
  ctx.font = '800 8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('PET', 0, -44.5 + bob);

  ctx.restore();
}
