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
    const barrelLen = weapon === WeaponId.DISRUPTOR_CANNON ? 36 : 34;
    return {
      x: gripX + Math.cos(aimAngle) * barrelLen,
      y: gripY + Math.sin(aimAngle) * barrelLen,
    };
  }

  // Viber Operative Skins: True hand height is y = -12 (v ≈ 0.79, right at their voxel gloves!)
  const handX = px + dir * 12;
  const handY = py - 12;
  const barrelLen = weapon === WeaponId.DISRUPTOR_CANNON ? 38 : 36;
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
  if (isEldritchEnemyKind(e.kind)) {
    return getEldritchCombatAnchors(e.x, e.y, e.kind, e.facingAngle);
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
  drop: { x: number; y: number; kind: 'oCore' | 'aCore' | 'ru9' | 'ammo' },
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

  ctx.fillStyle = opened ? '#334155' : '#1e293b';
  ctx.strokeStyle = opened ? '#64748b' : '#00e5ff';
  ctx.lineWidth = 2.2;
  ctx.fillRect(-18, -15, 36, 24);
  ctx.strokeRect(-18, -15, 36, 24);
  ctx.fillStyle = opened ? '#475569' : '#334155';
  ctx.fillRect(-18, -21, 36, 8);
  ctx.strokeRect(-18, -21, 36, 8);

  if (!opened) {
    const glow = 0.65 + 0.35 * Math.sin(timeSec * 6);
    ctx.fillStyle = `rgba(0, 229, 255, ${glow})`;
    ctx.fillRect(-6, -9, 12, 6);
    if (hackProgress > 0) {
      ctx.fillStyle = '#090d16';
      ctx.fillRect(-18, -30, 36, 5);
      ctx.fillStyle = '#00e5ff';
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

function drawQuadrupedRoboDog25D(
  ctx: CanvasRenderingContext2D,
  redEyes: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  const stride = Math.sin(timeSec * 12) * 3;
  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 2.2;

  ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
  ctx.fillRect(-15, -4 + stride, 6, 12);
  ctx.strokeRect(-15, -4 + stride, 6, 12);
  ctx.fillRect(-6, -3 - stride, 6, 12);
  ctx.strokeRect(-6, -3 - stride, 6, 12);
  ctx.fillRect(5, -4 - stride, 6, 12);
  ctx.strokeRect(5, -4 - stride, 6, 12);
  ctx.fillRect(13, -3 + stride, 6, 12);
  ctx.strokeRect(13, -3 + stride, 6, 12);

  ctx.fillStyle = hitFlash ? '#ffffff' : redEyes ? '#475569' : '#334155';
  ctx.fillRect(-16, -18, 34, 15);
  ctx.strokeRect(-16, -18, 34, 15);
  ctx.fillStyle = redEyes ? '#ff1744' : '#00b4ff';
  ctx.fillRect(-4, -14, 14, 4);

  ctx.strokeStyle = redEyes ? '#ff1744' : '#00b4ff';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(18, -15);
  ctx.lineTo(25, -25 + Math.sin(timeSec * 14) * 3);
  ctx.stroke();

  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 2.2;
  ctx.fillStyle = hitFlash ? '#ffffff' : '#64748b';
  ctx.fillRect(-26, -31, 18, 16);
  ctx.strokeRect(-26, -31, 18, 16);
  ctx.fillStyle = hitFlash ? '#ffffff' : '#334155';
  ctx.fillRect(-33, -24, 9, 9);
  ctx.strokeRect(-33, -24, 9, 9);

  ctx.fillStyle = hitFlash ? '#ffffff' : redEyes ? '#1e293b' : '#0284c7';
  ctx.fillRect(-23, -38, 5, 7);
  ctx.strokeRect(-23, -38, 5, 7);
  ctx.fillRect(-14, -38, 5, 7);
  ctx.strokeRect(-14, -38, 5, 7);

  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-25, -27, 13, 6);
  if (redEyes) {
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-24, -26, 4, 4);
    ctx.fillRect(-17, -26, 4, 4);
    drawCrimsonOptic(ctx, -22, -24, 2.8, false, timeSec);
    drawCrimsonOptic(ctx, -15, -24, 2.8, false, timeSec);
  } else {
    ctx.fillStyle = '#00b4ff';
    ctx.fillRect(-24, -26, 4, 4);
    ctx.fillRect(-17, -26, 4, 4);
    drawBlueOptic(ctx, -22, -24, 2.9, timeSec);
    drawBlueOptic(ctx, -15, -24, 2.9, timeSec);
  }
}

function drawQuadrupedRoboCat25D(
  ctx: CanvasRenderingContext2D,
  redEyes: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  const stride = Math.cos(timeSec * 13) * 2.5;
  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 2;

  ctx.fillStyle = hitFlash ? '#ffffff' : '#1e1b4b';
  ctx.fillRect(-12, -3 + stride, 5, 10);
  ctx.strokeRect(-12, -3 + stride, 5, 10);
  ctx.fillRect(-4, -2 - stride, 5, 10);
  ctx.strokeRect(-4, -2 - stride, 5, 10);
  ctx.fillRect(5, -3 - stride, 5, 10);
  ctx.strokeRect(5, -3 - stride, 5, 10);
  ctx.fillRect(12, -2 + stride, 5, 10);
  ctx.strokeRect(12, -2 + stride, 5, 10);

  ctx.fillStyle = hitFlash ? '#ffffff' : '#312e81';
  ctx.fillRect(-13, -16, 29, 13);
  ctx.strokeRect(-13, -16, 29, 13);
  ctx.fillStyle = redEyes ? '#ff1744' : '#00b4ff';
  ctx.fillRect(-4, -12, 12, 3);

  ctx.strokeStyle = redEyes ? '#ff1744' : '#00b4ff';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.moveTo(16, -13);
  ctx.quadraticCurveTo(26, -20, 22 + Math.sin(timeSec * 9) * 4, -30);
  ctx.stroke();

  ctx.strokeStyle = '#090a0f';
  ctx.lineWidth = 2;
  ctx.fillStyle = hitFlash ? '#ffffff' : '#3730a3';
  ctx.fillRect(-23, -29, 17, 15);
  ctx.strokeRect(-23, -29, 17, 15);

  ctx.fillStyle = redEyes ? '#ff1744' : '#38bdf8';
  ctx.beginPath();
  ctx.moveTo(-23, -29);
  ctx.lineTo(-20, -38);
  ctx.lineTo(-16, -29);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(-14, -29);
  ctx.lineTo(-10, -38);
  ctx.lineTo(-6, -29);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#090a0f';
  ctx.fillRect(-22, -24, 13, 5);
  if (redEyes) {
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-21, -23, 4, 3);
    ctx.fillRect(-14, -23, 4, 3);
    drawCrimsonOptic(ctx, -19, -21.5, 2.6, false, timeSec);
    drawCrimsonOptic(ctx, -12, -21.5, 2.6, false, timeSec);
  } else {
    ctx.fillStyle = '#00b4ff';
    ctx.fillRect(-21, -23, 4, 3);
    ctx.fillRect(-14, -23, 4, 3);
    drawBlueOptic(ctx, -19, -21.5, 2.8, timeSec);
    drawBlueOptic(ctx, -12, -21.5, 2.8, timeSec);
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
  } else {
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
  const isWildDog = kind === EnemyKind.WILD_SCOUT_DOG;
  const isWildCat = kind === EnemyKind.WILD_CYBER_CAT;
  const facingRight = Math.cos(facingAngle) >= 0;

  ctx.save();
  ctx.translate(snap(x), snap(y));

  const shadowRx =
    kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME
      ? 36
      : kind === EnemyKind.SHOGGOTH_CORE_AMALGAM
      ? 32
      : isWildDog || isWildCat
      ? 18
      : 24;
  ctx.fillStyle = isEldritch ? 'rgba(46, 16, 101, 0.55)' : 'rgba(9, 13, 22, 0.48)';
  ctx.beginPath();
  ctx.ellipse(0, 9, shadowRx, shadowRx * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  let topBarAnchorY = -80;

  if (isEldritch) {
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
  } else if (isWildDog || isWildCat) {
    ctx.save();
    ctx.translate(0, bob);
    if (facingRight) ctx.scale(-1, 1);
    if (isWildDog) {
      drawQuadrupedRoboDog25D(ctx, true, hitFlash > 0, timeSec);
    } else {
      drawQuadrupedRoboCat25D(ctx, true, hitFlash > 0, timeSec);
    }
    ctx.restore();
    topBarAnchorY = -44;
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
  } else if (isWildDog || isWildCat) {
    const chancePct = Math.min(95, Math.round((0.5 + (1 - hp / maxHp) * 0.45) * 100));
    const label = speciesOwned ? 'MAX 1 OWNED' : `[G] ORB · ${chancePct}%`;
    ctx.font = '800 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const boxW = speciesOwned ? 78 : 94;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
    ctx.fillRect(-boxW / 2, -56 + bob, boxW, 13);
    ctx.strokeStyle = speciesOwned ? '#64748b' : '#00e5ff';
    ctx.lineWidth = 1.2;
    ctx.strokeRect(-boxW / 2, -56 + bob, boxW, 13);
    ctx.fillStyle = speciesOwned ? '#cbd5e1' : '#d9ff00';
    ctx.fillText(label, 0, -46.5 + bob);
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

  const barW =
    kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME
      ? 64
      : kind === EnemyKind.LOGIC_WEAVER_ELITE || kind === EnemyKind.SHOGGOTH_CORE_AMALGAM
      ? 50
      : 38;
  ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
  ctx.fillRect(-barW / 2, topBarAnchorY, barW, 5);
  ctx.fillStyle = syncResistant ? '#f59e0b' : isEldritch ? '#c026d3' : '#f43f5e';
  ctx.fillRect(-barW / 2 + 1, topBarAnchorY + 1, Math.max(0, (barW - 2) * (hp / maxHp)), 3);

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
  timeSec: number
) {
  ctx.save();
  ctx.translate(snap(x), snap(y));

  if (invulnTimer > 0 && Math.floor(timeSec * 24) % 2 === 0) {
    ctx.globalAlpha = 0.55;
  }

  // Ground shadow + Protagonist Cyber-Neon Ring
  ctx.fillStyle = 'rgba(9, 13, 22, 0.52)';
  ctx.beginPath();
  ctx.ellipse(0, 9, 23, 9.5, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 9, 26, 11, 0, 0, Math.PI * 2);
  ctx.stroke();

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
  const bob =
    Math.abs(Math.sin(timeSec * 10 + (kind === CompanionKind.CYBER_CAT ? 1.4 : 0))) * -2.5;

  ctx.save();
  ctx.translate(snap(x), snap(y));

  ctx.fillStyle = 'rgba(9, 13, 22, 0.45)';
  ctx.beginPath();
  ctx.ellipse(0, 9, 19, 8, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'rgba(0, 180, 255, 0.85)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(0, 9, 22, 9.5, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.save();
  ctx.translate(0, bob);
  if (facingRight) ctx.scale(-1, 1);
  if (kind === CompanionKind.SCOUT_DOG) {
    drawQuadrupedRoboDog25D(ctx, false, false, timeSec);
  } else {
    drawQuadrupedRoboCat25D(ctx, false, false, timeSec);
  }
  ctx.restore();

  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(-19, -51 + bob, 38, 12);
  ctx.strokeStyle = '#00e5ff';
  ctx.lineWidth = 1.2;
  ctx.strokeRect(-19, -51 + bob, 38, 12);
  ctx.fillStyle = '#38bdf8';
  ctx.font = '800 8px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ALLY', 0, -42.5 + bob);

  ctx.restore();
}
