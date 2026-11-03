import { CompanionKind, EnemyKind } from '../types/game';

export interface HalloweenPumpkinProp {
  id: string;
  x: number;
  y: number;
  hp: number;
  maxHp: number;
  smashed: boolean;
  variant: 'jack' | 'witch_pumpkin' | 'skull_lantern';
  hitFlash: number;
}

export interface BatParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  scale: number;
  color: string;
  phase: number;
}

export function isHalloweenEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.PUMPKIN_SCYTHE_REAPER ||
    kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH ||
    kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT ||
    kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER
  );
}

export function isWildPetEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.WILD_SCOUT_DOG ||
    kind === EnemyKind.WILD_CYBER_CAT ||
    kind === EnemyKind.WILD_PUMPKIN_SPIRIT ||
    kind === EnemyKind.WILD_NIGHT_BAT
  );
}

export function wildEnemyToCompanionKind(kind: EnemyKind): CompanionKind {
  switch (kind) {
    case EnemyKind.WILD_CYBER_CAT:
      return CompanionKind.CYBER_CAT;
    case EnemyKind.WILD_PUMPKIN_SPIRIT:
      return CompanionKind.PUMPKIN_SPIRIT;
    case EnemyKind.WILD_NIGHT_BAT:
      return CompanionKind.NIGHT_BAT;
    default:
      return CompanionKind.SCOUT_DOG;
  }
}

function snap(v: number, px = 2): number {
  return Math.round(v / px) * px;
}

/**
 * Renders a 3-plane 2.5D isometric mecha armor block (front face, beveled top deck, angled side depth)
 * so every cyber-monster has genuine volumetric depth matching the voxel/mecha world aesthetic.
 */
function drawMechaBlock3D(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  depthX: number,
  depthY: number,
  frontColor: string,
  topColor: string,
  sideColor: string,
  strokeColor = '#090d16'
) {
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.8;
  ctx.strokeStyle = strokeColor;

  // Top bevel face
  ctx.fillStyle = topColor;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + depthX, y - depthY);
  ctx.lineTo(x + w + depthX, y - depthY);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Side depth face (drawn on whichever side depthX extends)
  ctx.fillStyle = sideColor;
  ctx.beginPath();
  if (depthX >= 0) {
    ctx.moveTo(x + w, y);
    ctx.lineTo(x + w + depthX, y - depthY);
    ctx.lineTo(x + w + depthX, y + h - depthY);
    ctx.lineTo(x + w, y + h);
  } else {
    ctx.moveTo(x, y);
    ctx.lineTo(x + depthX, y - depthY);
    ctx.lineTo(x + depthX, y + h - depthY);
    ctx.lineTo(x, y + h);
  }
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Front armor plate
  ctx.fillStyle = frontColor;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

/**
 * Renders an articulated 2-segment cybernetic hydraulic leg with knee actuator & glowing hoof/boot pad.
 */
function drawArticulatedMechaLeg(
  ctx: CanvasRenderingContext2D,
  hipX: number,
  hipY: number,
  kneeX: number,
  kneeY: number,
  footX: number,
  footY: number,
  thickness: number,
  armorColor: string,
  jointGlow: string,
  hitFlash: boolean
) {
  ctx.save();
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Dark outer casing
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = thickness + 3.5;
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(kneeX, kneeY);
  ctx.lineTo(footX, footY);
  ctx.stroke();

  // Metallic femur & tibia strut
  ctx.strokeStyle = hitFlash ? '#ffffff' : armorColor;
  ctx.lineWidth = thickness;
  ctx.beginPath();
  ctx.moveTo(hipX, hipY);
  ctx.lineTo(kneeX, kneeY);
  ctx.lineTo(footX, footY);
  ctx.stroke();

  // Silver hydraulic piston rod parallel to upper leg
  ctx.strokeStyle = '#94a3b8';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.moveTo(hipX + 2, hipY + 2);
  ctx.lineTo(kneeX + 2, kneeY - 1);
  ctx.stroke();

  // Glowing knee servo actuator
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(kneeX, kneeY, thickness * 0.52 + 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = jointGlow;
  ctx.beginPath();
  ctx.arc(kneeX, kneeY, thickness * 0.36 + 0.8, 0, Math.PI * 2);
  ctx.fill();

  // Armored cloven mecha-hoof / boot thruster
  ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.6;
  ctx.fillRect(footX - thickness * 0.8, footY - 4, thickness * 1.6, 6);
  ctx.strokeRect(footX - thickness * 0.8, footY - 4, thickness * 1.6, 6);
  ctx.fillStyle = jointGlow;
  ctx.fillRect(footX - thickness * 0.65, footY - 1, thickness * 1.3, 2.5);
  ctx.restore();
}

/**
 * Renders a futuristic 3D Armored Cyber-Jack-o'-Core Helmet (metallic segmented pumpkin shell,
 * circuit-board seams, internal reactor furnace glow, and holographic triangular optics).
 */
function drawCyberJackCoreHead(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  glowColor: string,
  shellColor: string,
  charging: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  const flicker = charging
    ? 1.2 + 0.25 * Math.sin(timeSec * 30)
    : 0.92 + 0.1 * Math.sin(timeSec * 9 + cx * 0.05);

  // Volumetric plasma reactor halo
  const aura = ctx.createRadialGradient(cx, cy, 2, cx, cy, rx * 2.15 * flicker);
  aura.addColorStop(0, glowColor);
  aura.addColorStop(0.42, 'rgba(249, 115, 22, 0.3)');
  aura.addColorStop(1, 'rgba(249, 115, 22, 0)');
  ctx.fillStyle = aura;
  ctx.beginPath();
  ctx.arc(cx, cy, rx * 2.15 * flicker, 0, Math.PI * 2);
  ctx.fill();

  // Top cybernetic power-cable stem + antenna node
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = Math.max(2.4, rx * 0.18);
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(cx, cy - ry * 0.88);
  ctx.lineTo(cx + rx * 0.18, cy - ry * 1.38);
  ctx.lineTo(cx - rx * 0.12, cy - ry * 1.56);
  ctx.stroke();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(cx - rx * 0.12, cy - ry * 1.56, 2.3, 0, Math.PI * 2);
  ctx.fill();

  // Gunmetal jaw-cradle base ring
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(cx, cy + ry * 0.65, rx * 0.82, ry * 0.36, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 3D Multi-lobed metallic orange/violet cyber-shell gradient
  const shellGrad = ctx.createRadialGradient(
    cx - rx * 0.3,
    cy - ry * 0.35,
    rx * 0.15,
    cx,
    cy,
    rx * 1.15
  );
  if (hitFlash) {
    shellGrad.addColorStop(0, '#ffffff');
    shellGrad.addColorStop(1, '#e2e8f0');
  } else {
    shellGrad.addColorStop(0, '#fb923c');
    shellGrad.addColorStop(0.55, shellColor);
    shellGrad.addColorStop(1, '#431407');
  }

  ctx.fillStyle = shellGrad;
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2.2;
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // Segmented mecha armor panel seams + micro-rivets
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.72)';
  ctx.lineWidth = 1.5;
  for (const frac of [-0.55, 0, 0.55]) {
    ctx.beginPath();
    ctx.ellipse(
      cx + rx * frac * 0.45,
      cy,
      Math.max(2, rx * (0.32 + Math.abs(frac) * 0.2)),
      ry * 0.95,
      0,
      0,
      Math.PI * 2
    );
    ctx.stroke();
  }

  // Dark metallic brow visor band
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.78, cy - ry * 0.22);
  ctx.lineTo(cx, cy - ry * 0.04);
  ctx.lineTo(cx + rx * 0.78, cy - ry * 0.22);
  ctx.lineTo(cx + rx * 0.68, cy - ry * 0.46);
  ctx.lineTo(cx, cy - ry * 0.3);
  ctx.lineTo(cx - rx * 0.68, cy - ry * 0.46);
  ctx.closePath();
  ctx.fill();

  // Glowing holographic triangular cyber-optics
  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.58, cy - ry * 0.1);
  ctx.lineTo(cx - rx * 0.3, cy - ry * 0.42);
  ctx.lineTo(cx - rx * 0.1, cy - ry * 0.08);
  ctx.closePath();
  ctx.moveTo(cx + rx * 0.1, cy - ry * 0.08);
  ctx.lineTo(cx + rx * 0.3, cy - ry * 0.42);
  ctx.lineTo(cx + rx * 0.58, cy - ry * 0.1);
  ctx.closePath();
  ctx.fill();

  // Sawtooth plasma furnace mouth grille
  ctx.fillStyle = '#090d16';
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.66, cy + ry * 0.18);
  ctx.lineTo(cx + rx * 0.66, cy + ry * 0.18);
  ctx.lineTo(cx + rx * 0.46, cy + ry * 0.68);
  ctx.lineTo(cx - rx * 0.46, cy + ry * 0.68);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = glowColor;
  ctx.beginPath();
  ctx.moveTo(cx - rx * 0.58, cy + ry * 0.22);
  ctx.lineTo(cx - rx * 0.36, cy + ry * 0.52);
  ctx.lineTo(cx - rx * 0.18, cy + ry * 0.25);
  ctx.lineTo(cx, cy + ry * 0.56);
  ctx.lineTo(cx + rx * 0.18, cy + ry * 0.25);
  ctx.lineTo(cx + rx * 0.36, cy + ry * 0.52);
  ctx.lineTo(cx + rx * 0.58, cy + ry * 0.22);
  ctx.lineTo(cx + rx * 0.4, cy + ry * 0.62);
  ctx.lineTo(cx - rx * 0.4, cy + ry * 0.62);
  ctx.closePath();
  ctx.fill();
}

/**
 * Draws a high-tech Twin-Coil Plasma Reaper War-Scythe (carbon-titanium shaft, power cell collar,
 * mechanical blade spine, and multi-stop plasma energy crescent).
 */
function drawCyberPlasmaScythe(
  ctx: CanvasRenderingContext2D,
  scale: number,
  primaryPlasma: string,
  secondaryPlasma: string,
  timeSec: number
) {
  ctx.save();
  ctx.scale(scale, scale);

  // Titanium reinforced shaft + glowing power conduit
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 6.2;
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(-18, 22);
  ctx.lineTo(28, -28);
  ctx.stroke();

  ctx.strokeStyle = '#64748b';
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  ctx.moveTo(-18, 22);
  ctx.lineTo(28, -28);
  ctx.stroke();

  ctx.strokeStyle = primaryPlasma;
  ctx.lineWidth = 1.3;
  ctx.beginPath();
  ctx.moveTo(-8, 11);
  ctx.lineTo(25, -25);
  ctx.stroke();

  // Heavy mechanical emitter head housing
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(20, -24);
  ctx.lineTo(34, -34);
  ctx.lineTo(42, -25);
  ctx.lineTo(26, -16);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Dark tungsten mechanical outer scythe spine
  ctx.fillStyle = '#334155';
  ctx.beginPath();
  ctx.moveTo(28, -32);
  ctx.quadraticCurveTo(58, -29, 64, -2);
  ctx.quadraticCurveTo(52, -16, 26, -24);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Blazing Plasma Energy Crescent Blade
  const bladeGrad = ctx.createLinearGradient(24, -28, 62, 8);
  bladeGrad.addColorStop(0, '#ffffff');
  bladeGrad.addColorStop(0.28, '#fef08a');
  bladeGrad.addColorStop(0.68, primaryPlasma);
  bladeGrad.addColorStop(1, secondaryPlasma);
  ctx.fillStyle = bladeGrad;
  ctx.beginPath();
  ctx.moveTo(25, -24);
  ctx.quadraticCurveTo(56, -20, 62, 8);
  ctx.quadraticCurveTo(42, -9, 18, -17);
  ctx.closePath();
  ctx.fill();

  // Crackling plasma arc along edge
  const jitter = Math.sin(timeSec * 28) * 2.2;
  ctx.strokeStyle = '#fef08a';
  ctx.lineWidth = 1.2;
  ctx.beginPath();
  ctx.moveTo(30, -21);
  ctx.lineTo(44, -14 + jitter);
  ctx.lineTo(56, -2 - jitter);
  ctx.stroke();

  ctx.restore();
}

export function getHalloweenCombatAnchors(
  x: number,
  y: number,
  kind: EnemyKind,
  facingAngle: number
): {
  leftEye: { x: number; y: number };
  rightEye: { x: number; y: number };
  gunMuzzle: { x: number; y: number };
  rocketMuzzle: { x: number; y: number };
  rocketBackblast: { x: number; y: number };
} {
  const dir = Math.cos(facingAngle) >= 0 ? 1 : -1;

  if (kind === EnemyKind.PUMPKIN_SCYTHE_REAPER) {
    const handX = x + dir * 18;
    const handY = y - 38;
    return {
      leftEye: { x: x - 6, y: y - 68 },
      rightEye: { x: x + 6, y: y - 68 },
      gunMuzzle: {
        x: handX + Math.cos(facingAngle) * 32,
        y: handY + Math.sin(facingAngle) * 32,
      },
      rocketMuzzle: { x: handX, y: handY },
      rocketBackblast: { x: x - dir * 14, y: handY },
    };
  }

  if (kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH) {
    const lanternX = x + dir * 22;
    const lanternY = y - 42;
    return {
      leftEye: { x: x - 6, y: y - 58 },
      rightEye: { x: x + 6, y: y - 58 },
      gunMuzzle: {
        x: lanternX + Math.cos(facingAngle) * 20,
        y: lanternY + Math.sin(facingAngle) * 20,
      },
      rocketMuzzle: { x: lanternX, y: lanternY },
      rocketBackblast: { x: x - dir * 12, y: lanternY },
    };
  }

  if (kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT) {
    const gunX = x + dir * 28;
    const gunY = y - 46;
    return {
      leftEye: { x: x - 8, y: y - 84 },
      rightEye: { x: x + 8, y: y - 84 },
      gunMuzzle: {
        x: gunX + Math.cos(facingAngle) * 36,
        y: gunY + Math.sin(facingAngle) * 36,
      },
      rocketMuzzle: {
        x: gunX + Math.cos(facingAngle) * 36,
        y: gunY + Math.sin(facingAngle) * 36,
      },
      rocketBackblast: { x: x - dir * 20, y: y - 76 },
    };
  }

  // BOSS_HEADLESS_DOOM_RIDER (Dullahan Cyber-Destrier Mecha Overlord)
  const pumpkinHandX = x - dir * 30;
  const pumpkinHandY = y - 86;
  const scytheHandX = x + dir * 34;
  const scytheHandY = y - 64;
  return {
    leftEye: { x: pumpkinHandX - 6, y: pumpkinHandY - 2 },
    rightEye: { x: pumpkinHandX + 6, y: pumpkinHandY - 2 },
    gunMuzzle: {
      x: scytheHandX + Math.cos(facingAngle) * 44,
      y: scytheHandY + Math.sin(facingAngle) * 44,
    },
    rocketMuzzle: {
      x: pumpkinHandX + Math.cos(facingAngle) * 20,
      y: pumpkinHandY + Math.sin(facingAngle) * 20,
    },
    rocketBackblast: { x: x - dir * 34, y: y - 58 },
  };
}

/**
 * Renders the 4 Futuristic Cyber-Halloween Mecha Monsters & World Boss in 3D Isometric style:
 * 1. PUMPKIN_SCYTHE_REAPER (赛博南瓜死神机甲)
 * 2. SPECTRAL_BANSHEE_WRAITH (全息女妖幽灵猎手)
 * 3. FRANKEN_STITCH_JUGGERNAUT (科学怪人特斯拉重装机兵)
 * 4. BOSS_HEADLESS_DOOM_RIDER (无头魔神机甲铁骑 · 万圣世界 Boss)
 */
export function drawHalloweenEnemy25D(
  ctx: CanvasRenderingContext2D,
  kind: EnemyKind,
  facingRight: boolean,
  hitFlash: boolean,
  chargingEyes: boolean,
  meleeSwingTimer: number,
  facingAngle: number,
  walkPhase: number,
  timeSec: number
): number {
  const dir = facingRight ? 1 : -1;

  if (kind === EnemyKind.PUMPKIN_SCYTHE_REAPER) {
    ctx.save();
    const hover = Math.sin(timeSec * 5.4 + walkPhase * 0.4) * 3.5;
    ctx.translate(0, hover);

    // Anti-gravity plasma thruster glow beneath skirt
    const jetGrad = ctx.createRadialGradient(0, -2, 2, 0, 2, 22);
    jetGrad.addColorStop(0, 'rgba(192, 38, 211, 0.85)');
    jetGrad.addColorStop(0.55, 'rgba(249, 115, 22, 0.35)');
    jetGrad.addColorStop(1, 'rgba(249, 115, 22, 0)');
    ctx.fillStyle = jetGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, 20, 9, 0, 0, Math.PI * 2);
    ctx.fill();

    // Segmented 3D Stealth Thruster Skirt Fins (3 armored panels + holographic edge)
    for (const fin of [-12, 0, 12]) {
      drawMechaBlock3D(
        ctx,
        fin - 6,
        -26,
        12,
        22 - Math.abs(fin) * 0.25,
        -dir * 4,
        3,
        hitFlash ? '#ffffff' : '#1e102e',
        hitFlash ? '#ffffff' : '#3b0764',
        '#0f0718',
        '#7e22ce'
      );
    }

    // 3D Isometric Armored Reaper Chest Chassis + Exposed Furnace Ribcage
    drawMechaBlock3D(
      ctx,
      -15,
      -54,
      30,
      29,
      -dir * 5,
      5,
      hitFlash ? '#ffffff' : '#1e293b',
      hitFlash ? '#ffffff' : '#334155',
      '#0f172a'
    );

    // Glowing Orange Reactor Ribs & Central Core
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-10, -49, 20, 19);
    ctx.fillStyle = '#fb923c';
    for (let r = 0; r < 3; r++) {
      ctx.fillRect(-8, -47 + r * 6, 16, 2.6);
    }
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2.5, -48, 5, 17);

    // 3D Beveled Spiked Shoulder Pauldrons
    drawMechaBlock3D(
      ctx,
      -23,
      -55,
      10,
      11,
      -dir * 3,
      3,
      hitFlash ? '#ffffff' : '#581c87',
      '#9333ea',
      '#2e1065'
    );
    drawMechaBlock3D(
      ctx,
      13,
      -55,
      10,
      11,
      -dir * 3,
      3,
      hitFlash ? '#ffffff' : '#581c87',
      '#9333ea',
      '#2e1065'
    );

    // Cyber-Carved Jack-o'-Core Mecha Helmet
    drawCyberJackCoreHead(
      ctx,
      dir * 2,
      -68,
      15.5,
      13.5,
      chargingEyes ? '#ff1744' : '#fde047',
      '#ea580c',
      chargingEyes,
      hitFlash,
      timeSec
    );

    // Articulated Robotic Arm + Twin-Coil Plasma Reaper War-Scythe
    const swing =
      meleeSwingTimer > 0
        ? Math.sin((1 - meleeSwingTimer / 0.28) * Math.PI * 2) * 1.15 * dir
        : 0;
    ctx.save();
    ctx.translate(dir * 16, -38);
    ctx.rotate(facingAngle * 0.35 + swing);
    if (!facingRight) ctx.scale(-1, 1);
    drawCyberPlasmaScythe(ctx, 0.78, '#f97316', '#c026d3', timeSec);
    ctx.restore();

    ctx.restore();
    return 86;
  }

  if (kind === EnemyKind.SPECTRAL_BANSHEE_WRAITH) {
    ctx.save();
    const floatY = Math.sin(timeSec * 6.4) * 5;
    ctx.translate(0, floatY);

    // Holographic Data-Stream Jet Ribbons trailing beneath chassis
    for (const rOff of [-10, 0, 10]) {
      const wave = Math.sin(timeSec * 9 + rOff) * 4;
      const ribGrad = ctx.createLinearGradient(rOff, -24, rOff + wave, 6);
      ribGrad.addColorStop(0, 'rgba(56, 189, 248, 0.85)');
      ribGrad.addColorStop(0.55, 'rgba(168, 85, 247, 0.5)');
      ribGrad.addColorStop(1, 'rgba(168, 85, 247, 0)');
      ctx.strokeStyle = ribGrad;
      ctx.lineWidth = 5;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.moveTo(rOff, -22);
      ctx.quadraticCurveTo(rOff - wave, -8, rOff + wave, 5);
      ctx.stroke();
    }

    // Floating Aero-Wing Stabilizer Fins (Left & Right)
    for (const side of [-1, 1]) {
      ctx.fillStyle = hitFlash ? '#ffffff' : '#1e1b4b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.beginPath();
      ctx.moveTo(side * 13, -46);
      ctx.lineTo(side * 28, -56);
      ctx.lineTo(side * 24, -34);
      ctx.lineTo(side * 12, -30);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }

    // 3D Isometric Valkyrie Drone Torso Pod
    drawMechaBlock3D(
      ctx,
      -13,
      -49,
      26,
      26,
      -dir * 4,
      4,
      hitFlash ? '#ffffff' : '#1e1b4b',
      hitFlash ? '#ffffff' : '#312e81',
      '#0f172a',
      '#38bdf8'
    );

    // Cyan-Violet Quantum Core Window in Chest
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-7, -43, 14, 12);
    ctx.fillStyle = '#22d3ee';
    ctx.beginPath();
    ctx.arc(0, -37, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // 3D Cybernetic Banshee Visor Helmet
    drawMechaBlock3D(
      ctx,
      -11,
      -66,
      22,
      16,
      -dir * 3,
      3,
      hitFlash ? '#ffffff' : '#0f172a',
      '#1e293b',
      '#090d16',
      '#c084fc'
    );
    ctx.fillStyle = chargingEyes ? '#ff1744' : '#00e5ff';
    ctx.fillRect(-8, -60, 6, 4);
    ctx.fillRect(2, -60, 6, 4);

    // Futuristic Cyber-Witch Radar Spire Hat + Holo-Brim Ring
    ctx.strokeStyle = '#38bdf8';
    ctx.fillStyle = 'rgba(30, 27, 75, 0.9)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -68, 22, 5.5, -0.06 * dir, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#312e81';
    ctx.strokeStyle = '#e879f9';
    ctx.beginPath();
    ctx.moveTo(-11, -68);
    ctx.lineTo(-dir * 4, -93);
    ctx.lineTo(11, -68);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    //Glowing pumpkin telemetry buckle on witch hat
    ctx.fillStyle = '#f97316';
    ctx.fillRect(-7, -73, 14, 4);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(-2.5, -74, 5, 5.5);

    // Orbiting Chained Quantum Soul-Lantern Emitter
    const sway = Math.sin(timeSec * 7) * 3;
    const lx = dir * 22 + sway;
    const ly = -35;
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.setLineDash([3, 2]);
    ctx.beginPath();
    ctx.moveTo(dir * 13, -44);
    ctx.lineTo(lx, ly - 9);
    ctx.stroke();
    ctx.setLineDash([]);

    drawMechaBlock3D(ctx, lx - 6, ly - 8, 12, 15, 3, 2.5, '#090d16', '#1e293b', '#0f172a', '#38bdf8');
    ctx.fillStyle = '#c084fc';
    ctx.beginPath();
    ctx.arc(lx, ly - 0.5, 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return 92;
  }

  if (kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT) {
    // 3. ELITE BIO-CYBER TESLA JUGGERNAUT (~106px tall)
    ctx.save();
    const stomp = Math.sin(walkPhase) * 4;

    // High-Voltage Emerald-Violet Elite Ground Ring
    ctx.strokeStyle = 'rgba(74, 222, 128, 0.8)';
    ctx.lineWidth = 2.4;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.ellipse(0, 8, 35, 14, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // 3D Hydraulic Siege Stomper Boots
    drawMechaBlock3D(
      ctx,
      -22,
      -24 + stomp,
      16,
      29,
      -4,
      3,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a'
    );
    drawMechaBlock3D(
      ctx,
      6,
      -24 - stomp,
      16,
      29,
      4,
      3,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a'
    );
    ctx.fillStyle = '#4ade80';
    ctx.fillRect(-19, -8 + stomp, 10, 3);
    ctx.fillRect(9, -8 - stomp, 10, 3);

    // Dorsal Twin High-Voltage Tesla Coil Pylons
    for (const tx of [-20, 20]) {
      drawMechaBlock3D(ctx, tx - 5, -94, 10, 22, 3, 3, '#334155', '#64748b', '#1e293b');
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      for (let cy = -90; cy <= -78; cy += 5) {
        ctx.beginPath();
        ctx.moveTo(tx - 6, cy);
        ctx.lineTo(tx + 6, cy);
        ctx.stroke();
      }
      ctx.fillStyle = '#4ade80';
      ctx.beginPath();
      ctx.arc(tx, -97, 4.5, 0, Math.PI * 2);
      ctx.fill();
    }
    // Live electric arc jumping between dorsal Tesla coils!
    ctx.strokeStyle = '#7dd3fc';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-20, -97);
    ctx.lineTo(-7, -102 + Math.sin(timeSec * 35) * 3);
    ctx.lineTo(7, -95 - Math.sin(timeSec * 35) * 3);
    ctx.lineTo(20, -97);
    ctx.stroke();

    // 3D Asymmetric Bio-Armor + Cyber-Plate Stitched Hulking Chest
    drawMechaBlock3D(
      ctx,
      -28,
      -73,
      28,
      50,
      -5,
      6,
      hitFlash ? '#ffffff' : '#14532d',
      '#166534',
      '#052e16'
    );
    drawMechaBlock3D(
      ctx,
      0,
      -73,
      28,
      50,
      5,
      6,
      hitFlash ? '#ffffff' : '#3b0764',
      '#581c87',
      '#1e1b4b'
    );

    // Glowing plasma weld seam + heavy titanium clamp Staples down torso center
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(0, -72);
    ctx.lineTo(0, -24);
    ctx.stroke();
    ctx.fillStyle = '#cbd5e1';
    for (let sy = -65; sy <= -32; sy += 10) {
      ctx.fillRect(-7, sy, 14, 3.5);
    }

    // 3D Isometric Flat-Top Cyber-Franken Helmet + Neck Electrode Bolts
    drawMechaBlock3D(
      ctx,
      -16,
      -96,
      32,
      24,
      -dir * 4,
      4,
      hitFlash ? '#ffffff' : '#365314',
      '#1e293b',
      '#1a2e05'
    );
    // Neck electrode bolts
    ctx.fillStyle = '#94a3b8';
    ctx.fillRect(-25, -84, 9, 6);
    ctx.fillRect(16, -84, 9, 6);
    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-26, -81, 3.5, 0, Math.PI * 2);
    ctx.arc(26, -81, 3.5, 0, Math.PI * 2);
    ctx.fill();

    // Glowing Visor Slit
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-13, -88, 26, 7);
    ctx.fillStyle = chargingEyes ? '#ff1744' : '#fde047';
    ctx.fillRect(-11, -86.5, 8, 4);
    ctx.fillRect(3, -86.5, 8, 4);

    // 3D Drum-Fed Heavy Pumpkin-Plasma Mortar Cannon
    ctx.save();
    ctx.translate(dir * 26, -46);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawMechaBlock3D(ctx, -6, -9, 40, 17, 0, 4, '#1e293b', '#475569', '#0f172a', '#4ade80');
    ctx.fillStyle = '#f97316';
    ctx.fillRect(6, -4, 24, 7);
    ctx.fillStyle = '#fef08a';
    ctx.fillRect(10, -2, 16, 3);
    ctx.restore();

    ctx.restore();
    return 106;
  }

  // ============================================================================
  // 4. WORLD BOSS: BOSS_HEADLESS_DOOM_RIDER (3D Cyber-Destrier Mecha Knight!)
  // ============================================================================
  ctx.save();
  const gallop = Math.sin(walkPhase * 1.6) * 6;

  // Blazing Cyber-Hexagon Blood-Moon Boss Telemetry Ring
  ctx.strokeStyle = 'rgba(249, 115, 22, 0.92)';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.ellipse(0, 9, 54, 22, 0, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(56, 189, 248, 0.72)';
  ctx.lineWidth = 1.8;
  ctx.setLineDash([10, 6]);
  ctx.beginPath();
  ctx.ellipse(0, 9, 45, 17.5, 0, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  // Back Pair of Articulated 3D Mecha-Destrier Legs
  drawArticulatedMechaLeg(
    ctx,
    -24,
    -26,
    -30 - gallop * 0.4,
    -11,
    -28 - gallop * 0.8,
    5,
    6.5,
    '#1e293b',
    '#c084fc',
    hitFlash
  );
  drawArticulatedMechaLeg(
    ctx,
    18,
    -26,
    24 + gallop * 0.4,
    -11,
    24 + gallop * 0.8,
    5,
    6.5,
    '#1e293b',
    '#c084fc',
    hitFlash
  );

  // Digital Glitch-Torn Holographic Dread-Cape streaming behind Knight
  const capeWave = Math.sin(timeSec * 8.5) * 7;
  const capeGrad = ctx.createLinearGradient(-dir * 8, -92, -dir * 58, -34);
  capeGrad.addColorStop(0, 'rgba(147, 51, 234, 0.94)');
  capeGrad.addColorStop(0.65, 'rgba(225, 29, 72, 0.82)');
  capeGrad.addColorStop(1, 'rgba(249, 115, 22, 0.25)');
  ctx.fillStyle = capeGrad;
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(-dir * 8, -90);
  ctx.quadraticCurveTo(-dir * 46, -80 + capeWave, -dir * 60, -40 - capeWave * 0.4);
  ctx.lineTo(-dir * 44, -46);
  ctx.lineTo(-dir * 36, -34);
  ctx.lineTo(-dir * 16, -50);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Rear Plasma Thruster Exhaust Pipes on Mecha-Steed Flank
  ctx.save();
  ctx.translate(-dir * 38, -42);
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 1.8;
  ctx.fillRect(-8, -6, 14, 5);
  ctx.strokeRect(-8, -6, 14, 5);
  ctx.fillRect(-10, 1, 14, 5);
  ctx.strokeRect(-10, 1, 14, 5);
  ctx.fillStyle = '#fb923c';
  ctx.beginPath();
  ctx.arc(dir < 0 ? 8 : -10, -3.5, 3.5 + Math.random() * 2, 0, Math.PI * 2);
  ctx.arc(dir < 0 ? 6 : -12, 3.5, 3.5 + Math.random() * 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3D Isometric Armored Mecha-Destrier Chassis + Glowing Furnace Ribcage
  drawMechaBlock3D(
    ctx,
    -36,
    -52,
    72,
    27,
    -dir * 6,
    6,
    hitFlash ? '#ffffff' : '#1e293b',
    hitFlash ? '#ffffff' : '#334155',
    '#0f172a',
    '#ea580c'
  );
  // Exposed orange-cyan fusion turbine ribs on steed side
  ctx.fillStyle = '#090d16';
  ctx.fillRect(-24, -47, 48, 16);
  for (let rx = -20; rx <= 18; rx += 9) {
    ctx.fillStyle = rx % 18 === 0 ? '#f97316' : '#38bdf8';
    ctx.fillRect(rx, -45, 5, 12);
  }

  // Front Pair of Articulated 3D Mecha-Destrier Legs
  drawArticulatedMechaLeg(
    ctx,
    -12,
    -25,
    -14 + gallop * 0.5,
    -9,
    -10 + gallop * 0.9,
    7,
    7,
    '#334155',
    '#f97316',
    hitFlash
  );
  drawArticulatedMechaLeg(
    ctx,
    28,
    -25,
    34 - gallop * 0.5,
    -9,
    34 - gallop * 0.9,
    7,
    7,
    '#334155',
    '#f97316',
    hitFlash
  );

  // Armored Robotic Destrier Neck & Cyber-Warhorse Skull Visor
  ctx.save();
  ctx.translate(dir * 32, -52);
  if (!facingRight) ctx.scale(-1, 1);
  // Segmented armored neck plates
  ctx.fillStyle = hitFlash ? '#ffffff' : '#334155';
  ctx.strokeStyle = '#090d16';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-8, 12);
  ctx.lineTo(4, -22);
  ctx.lineTo(18, -18);
  ctx.lineTo(10, 12);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Holographic plasma mane blades along neck spine
  ctx.fillStyle = '#f97316';
  ctx.beginPath();
  ctx.moveTo(-4, 2);
  ctx.lineTo(-12, -6);
  ctx.lineTo(-1, -8);
  ctx.lineTo(-9, -17);
  ctx.lineTo(4, -22);
  ctx.closePath();
  ctx.fill();

  // Angular Mecha-Steed Head + Glowing Crimson Laser Visor + Iron Jaw
  ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
  ctx.strokeStyle = '#f97316';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.moveTo(2, -24);
  ctx.lineTo(28, -12);
  ctx.lineTo(25, -3);
  ctx.lineTo(8, -6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#ff1744';
  ctx.fillRect(11, -17, 10, 4);
  ctx.fillStyle = '#fef08a';
  ctx.fillRect(14, -16, 5, 2);
  ctx.restore();

  // Headless Dullahan Cyber-Dreadnought Knight Upper Torso (3D Beveled Heavy Cuirass)
  drawMechaBlock3D(
    ctx,
    -20,
    -94,
    40,
    43,
    -dir * 5,
    6,
    hitFlash ? '#ffffff' : '#0f172a',
    hitFlash ? '#ffffff' : '#334155',
    '#090d16',
    '#f59e0b'
  );

  // Knight Chest Arc-Reactor Core & Ribbed Cyber-Plating
  const corePulse = 0.85 + 0.2 * Math.sin(timeSec * 10);
  ctx.fillStyle = '#1e1b4b';
  ctx.fillRect(-13, -86, 26, 26);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.4;
  ctx.strokeRect(-13, -86, 26, 26);
  ctx.fillStyle = `rgba(249, 115, 22, ${corePulse.toFixed(2)})`;
  ctx.beginPath();
  ctx.moveTo(0, -83);
  ctx.lineTo(9, -73);
  ctx.lineTo(0, -63);
  ctx.lineTo(-9, -73);
  ctx.closePath();
  ctx.fill();
  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(0, -73, 3.8, 0, Math.PI * 2);
  ctx.fill();

  // Massive 3D Multi-Tiered Spiked Mecha Pauldrons (Left & Right)
  for (const pSide of [-1, 1]) {
    drawMechaBlock3D(
      ctx,
      pSide * 22 - 9,
      -96,
      18,
      16,
      pSide * 3,
      4,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a',
      '#f97316'
    );
    // Orange plasma horn spike atop pauldron
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(pSide * 20, -96);
    ctx.lineTo(pSide * 28, -110);
    ctx.lineTo(pSide * 26, -96);
    ctx.closePath();
    ctx.fill();
  }

  // Severed Bionic Neck Collar + Erupting Multi-Tone Plasma Flame & Sparking Wires!
  ctx.fillStyle = '#334155';
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 1.6;
  ctx.beginPath();
  ctx.ellipse(0, -96, 11, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const neckFlameH = 16 + Math.sin(timeSec * 18) * 4;
  const neckGrad = ctx.createLinearGradient(0, -96, 0, -96 - neckFlameH);
  neckGrad.addColorStop(0, '#38bdf8');
  neckGrad.addColorStop(0.45, '#c026d3');
  neckGrad.addColorStop(0.8, '#f97316');
  neckGrad.addColorStop(1, '#fef08a');
  ctx.fillStyle = neckGrad;
  ctx.beginPath();
  ctx.moveTo(-9, -96);
  ctx.quadraticCurveTo(-5, -96 - neckFlameH, 0, -100 - neckFlameH);
  ctx.quadraticCurveTo(6, -96 - neckFlameH, 9, -96);
  ctx.closePath();
  ctx.fill();

  // Off-Hand Articulated Gauntlet Holding Aloft the Cyber-Jack-o'-Core Head!
  const jackBob = Math.sin(timeSec * 6) * 3.5;
  ctx.strokeStyle = '#475569';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(-dir * 18, -82);
  ctx.lineTo(-dir * 30, -72 + jackBob);
  ctx.stroke();

  drawCyberJackCoreHead(
    ctx,
    -dir * 30,
    -86 + jackBob,
    17.5,
    15.5,
    chargingEyes ? '#ff1744' : '#fef08a',
    '#ea580c',
    chargingEyes,
    hitFlash,
    timeSec
  );

  // Main-Hand Articulated Gauntlet Wielding Colossal Twin-Coil Plasma Reaper War-Scythe!
  ctx.save();
  ctx.translate(dir * 30, -64);
  ctx.rotate(facingAngle * 0.45);
  if (!facingRight) ctx.scale(-1, 1);
  drawCyberPlasmaScythe(ctx, 1.06, '#f97316', '#e11d48', timeSec);
  ctx.restore();

  ctx.restore();
  return 132;
}

/**
 * Renders Wild or Tamed Futuristic Cyber-Halloween Pets in 3D Isometric Mecha style:
 * 1. PUMPKIN_SPIRIT / WILD_PUMPKIN_SPIRIT (赛博南瓜机甲幼犬)
 * 2. NIGHT_BAT / WILD_NIGHT_BAT (全息声呐夜魔蝠机兵)
 */
export function drawHalloweenPet25D(
  ctx: CanvasRenderingContext2D,
  isPumpkinSpirit: boolean,
  isWild: boolean,
  hitFlash: boolean,
  timeSec: number
) {
  if (isPumpkinSpirit) {
    const hover = Math.sin(timeSec * 8.5) * 2.8;
    const stride = Math.sin(timeSec * 14) * 2.5;
    ctx.save();
    ctx.translate(0, hover);

    // 4 Articulated Micro-Thruster Mecha Paws
    const pawAccent = isWild ? '#fb923c' : '#00e5ff';
    for (const px of [-10, -2, 6, 13]) {
      const off = px < 2 ? stride : -stride;
      ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 1.6;
      ctx.fillRect(px - 2.5, -9 + off, 5, 10);
      ctx.strokeRect(px - 2.5, -9 + off, 5, 10);
      ctx.fillStyle = pawAccent;
      ctx.fillRect(px - 2, -1 + off, 4, 2.2);
    }

    // 3D Isometric Cyber-Pup Chassis + Glowing Reactor Spine
    drawMechaBlock3D(
      ctx,
      -12,
      -21,
      26,
      13,
      3,
      3.5,
      hitFlash ? '#ffffff' : isWild ? '#431407' : '#0f172a',
      hitFlash ? '#ffffff' : isWild ? '#7c2d12' : '#1e293b',
      '#090d16',
      pawAccent
    );
    ctx.fillStyle = pawAccent;
    ctx.fillRect(-4, -17, 13, 3.2);

    // Holographic Wagging Plasma Tail Antenna
    ctx.strokeStyle = pawAccent;
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(14, -17);
    ctx.quadraticCurveTo(24, -25 + Math.sin(timeSec * 16) * 4, 21, -29);
    ctx.stroke();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.arc(21, -29, 2.5, 0, Math.PI * 2);
    ctx.fill();

    // 3D Cyber-Jack-o'-Core Puppy Head
    drawCyberJackCoreHead(
      ctx,
      -13,
      -25,
      12.5,
      11,
      isWild ? '#ff1744' : '#00e5ff',
      '#f97316',
      false,
      hitFlash,
      timeSec
    );

    ctx.restore();
    return;
  }

  // NIGHT_BAT (3D Isometric Stealth Sonar-Wing Bat Drone)
  const flap = Math.sin(timeSec * 18) * 9;
  const wingNeon = isWild ? '#f43f5e' : '#00e5ff';
  ctx.save();
  ctx.translate(0, -20 + Math.sin(timeSec * 7) * 2.5);

  // Articulated Carbon-Fiber Strut + Translucent Holo-Grid Bat Wings
  for (const side of [-1, 1]) {
    ctx.fillStyle = hitFlash
      ? '#ffffff'
      : isWild
      ? 'rgba(131, 24, 67, 0.85)'
      : 'rgba(14, 116, 144, 0.82)';
    ctx.strokeStyle = wingNeon;
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.moveTo(side * 6, -5);
    ctx.lineTo(side * 18, -16 + flap * 0.7);
    ctx.lineTo(side * 30, -3 + flap);
    ctx.lineTo(side * 20, 4 + flap * 0.4);
    ctx.lineTo(side * 11, 1);
    ctx.lineTo(side * 5, 5);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Internal wing rib struts
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(side * 18, -16 + flap * 0.7);
    ctx.lineTo(side * 20, 4 + flap * 0.4);
    ctx.moveTo(side * 18, -16 + flap * 0.7);
    ctx.lineTo(side * 11, 1);
    ctx.stroke();
  }

  // 3D Isometric Stealth Avionics Core Body
  drawMechaBlock3D(
    ctx,
    -8,
    -10,
    16,
    14,
    0,
    3,
    hitFlash ? '#ffffff' : '#0f172a',
    '#334155',
    '#090d16',
    wingNeon
  );

  // Twin Pointed Sonar Radar Array Ears
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = wingNeon;
  ctx.lineWidth = 1.6;
  for (const side of [-1, 1]) {
    ctx.beginPath();
    ctx.moveTo(side * 7, -10);
    ctx.lineTo(side * 10, -22);
    ctx.lineTo(side * 2, -11);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Glowing Visor Optics + Twin Chrome Sonic Emitters
  ctx.fillStyle = wingNeon;
  ctx.fillRect(-5.5, -5, 4, 3);
  ctx.fillRect(1.5, -5, 4, 3);
  ctx.fillStyle = '#e2e8f0';
  ctx.fillRect(-3.5, 1, 2, 3);
  ctx.fillRect(1.5, 1, 2, 3);
  ctx.restore();
}

/**
 * Interactive Destructible "TRICK OR TREAT!" Cyber Jack-o'-Core Pods in the Arena
 */
export function drawHalloweenPumpkinProp25D(
  ctx: CanvasRenderingContext2D,
  prop: HalloweenPumpkinProp,
  timeSec: number
) {
  if (prop.smashed) return;
  const bob = Math.sin(timeSec * 3.4 + prop.x * 0.02) * 1.5;

  ctx.save();
  ctx.translate(snap(prop.x), snap(prop.y));

  // Ground shadow + metallic docking ring
  ctx.fillStyle = 'rgba(9, 13, 22, 0.5)';
  ctx.beginPath();
  ctx.ellipse(0, 9, 21, 9, 0, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = prop.variant === 'skull_lantern' ? '#38bdf8' : '#f97316';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.ellipse(0, 6, 16, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const shell = prop.variant === 'skull_lantern' ? '#7e22ce' : '#ea580c';
  const glow = prop.variant === 'skull_lantern' ? '#38bdf8' : '#fde047';

  drawCyberJackCoreHead(
    ctx,
    0,
    -8 + bob,
    16.5,
    14,
    glow,
    shell,
    false,
    prop.hitFlash > 0,
    timeSec
  );

  if (prop.variant === 'witch_pumpkin') {
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = '#c026d3';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -21 + bob, 18, 4.5, -0.08, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(-9, -21 + bob);
    ctx.lineTo(3, -39 + bob);
    ctx.lineTo(10, -21 + bob);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}

/**
 * Draws flapping Cyber-Bat silhouettes & Ghostly Soul-Wisps
 */
export function drawBatParticles25D(
  ctx: CanvasRenderingContext2D,
  bats: BatParticle[],
  timeSec: number
) {
  for (const b of bats) {
    const alpha = Math.min(1, (b.life / b.maxLife) * 1.4);
    const wing = Math.sin(timeSec * 24 + b.phase) * 6 * b.scale;
    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.translate(b.x, b.y);
    ctx.fillStyle = '#090514';
    ctx.strokeStyle = b.color;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(0, -2 * b.scale);
    ctx.quadraticCurveTo(-8 * b.scale, -7 * b.scale + wing, -12 * b.scale, wing);
    ctx.quadraticCurveTo(-5 * b.scale, 2 * b.scale, 0, 3 * b.scale);
    ctx.quadraticCurveTo(5 * b.scale, 2 * b.scale, 12 * b.scale, wing);
    ctx.quadraticCurveTo(8 * b.scale, -7 * b.scale + wing, 0, -2 * b.scale);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

/**
 * Draws the optional Festive Cyber Witch-Hat / Blood-Moon Halo neatly above the player's helmet
 * WITHOUT modifying or covering any part of Space Doge's original comic limbs or suit!
 */
export function drawFestiveHalloweenCrown25D(
  ctx: CanvasRenderingContext2D,
  topY: number,
  wearWitchHat: boolean,
  bloodMoonActive: boolean,
  timeSec: number
) {
  if (!wearWitchHat && !bloodMoonActive) return;

  ctx.save();
  const hover = Math.sin(timeSec * 4.5) * 2;

  if (bloodMoonActive) {
    for (let i = 0; i < 3; i++) {
      const ang = timeSec * 3.8 + (i * Math.PI * 2) / 3;
      const ox = Math.cos(ang) * 30;
      const oy = -34 + Math.sin(ang) * 10;
      ctx.fillStyle = i % 2 === 0 ? '#f97316' : '#c026d3';
      ctx.beginPath();
      ctx.arc(ox, oy, 4.2, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(ox, oy, 1.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  if (wearWitchHat || bloodMoonActive) {
    const hy = topY - 2 + hover;
    ctx.fillStyle = '#1e1b4b';
    ctx.strokeStyle = bloodMoonActive ? '#f97316' : '#c026d3';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(0, hy, 18, 4.5, -0.06, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(-10, hy);
    ctx.lineTo(3, hy - 20);
    ctx.lineTo(10, hy);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#f97316';
    ctx.fillRect(-6, hy - 4, 12, 3.2);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(-2, hy - 4.5, 4, 4);
  }

  ctx.restore();
}
