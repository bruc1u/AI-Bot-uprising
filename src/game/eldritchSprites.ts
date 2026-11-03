import { EnemyKind } from '../types/game';

export function isEldritchEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER ||
    kind === EnemyKind.SHOGGOTH_CORE_AMALGAM ||
    kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME
  );
}

function drawIsoBioCyberBlock(
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
  border = '#09040e'
) {
  ctx.lineJoin = 'round';
  ctx.lineWidth = 1.9;
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

function drawAbyssalSlitEye(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  rx: number,
  ry: number,
  charging: boolean,
  timeSec: number,
  phase = 0
) {
  const pulse = charging
    ? 1.25 + 0.25 * Math.sin(timeSec * 30)
    : 0.92 + 0.14 * Math.sin(timeSec * 5 + phase);
  const blink = charging ? 1 : Math.abs(Math.sin(timeSec * 1.9 + phase)) > 0.1 ? 1 : 0.18;

  ctx.save();
  const halo = ctx.createRadialGradient(x, y, 0.5, x, y, rx * 2.5 * pulse);
  halo.addColorStop(0, '#ffffff');
  halo.addColorStop(0.3, '#ff1744');
  halo.addColorStop(0.68, 'rgba(192, 38, 211, 0.52)');
  halo.addColorStop(1, 'rgba(192, 38, 211, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, rx * 2.5 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff1744';
  ctx.strokeStyle = '#09040e';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * pulse, Math.max(1.2, ry * blink * pulse), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (blink > 0.3) {
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(x, y, rx * 0.48, ry * 0.78, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#050208';
    ctx.beginPath();
    ctx.ellipse(x, y, Math.max(1.2, rx * 0.18), ry * 0.82, 0, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

export function getEldritchCombatAnchors(
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

  if (kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME) {
    const gunPivotX = x + dir * 24;
    const gunPivotY = y - 48;
    const rpgPivotX = x - dir * 18;
    const rpgPivotY = y - 78;
    return {
      leftEye: { x: x - 11, y: y - 78 },
      rightEye: { x: x + 11, y: y - 78 },
      gunMuzzle: {
        x: gunPivotX + Math.cos(facingAngle) * 36,
        y: gunPivotY + Math.sin(facingAngle) * 36,
      },
      rocketMuzzle: {
        x: rpgPivotX + Math.cos(facingAngle) * 28,
        y: rpgPivotY + Math.sin(facingAngle) * 28,
      },
      rocketBackblast: {
        x: rpgPivotX - Math.cos(facingAngle) * 16,
        y: rpgPivotY - Math.sin(facingAngle) * 16,
      },
    };
  }

  if (kind === EnemyKind.SHOGGOTH_CORE_AMALGAM) {
    const mawX = x + dir * 18;
    const mawY = y - 34;
    return {
      leftEye: { x: x - 14, y: y - 56 },
      rightEye: { x: x + 12, y: y - 58 },
      gunMuzzle: {
        x: mawX + Math.cos(facingAngle) * 18,
        y: mawY + Math.sin(facingAngle) * 18,
      },
      rocketMuzzle: {
        x: mawX + Math.cos(facingAngle) * 18,
        y: mawY + Math.sin(facingAngle) * 18,
      },
      rocketBackblast: { x, y: y - 34 },
    };
  }

  return {
    leftEye: { x: x - 9, y: y - 56 },
    rightEye: { x: x + 9, y: y - 56 },
    gunMuzzle: {
      x: x + Math.cos(facingAngle) * 28,
      y: y - 42 + Math.sin(facingAngle) * 28,
    },
    rocketMuzzle: { x, y: y - 54 },
    rocketBackblast: { x, y: y - 54 },
  };
}

/**
 * Renders the 3 Outdoor Bio-Cyber Mainframe Horror Species in 3D Isometric detail:
 * 1. ELDRITCH_TENTACLE_WEAVER: Ruptured 3D Quantum Server Core + Segmented Fiber-Optic Mechanical Tentacles
 * 2. SHOGGOTH_CORE_AMALGAM: Corrupted Server-Blade Amalgamation + Hydraulic Fang Maw + Bubbling Optic Nodes
 * 3. CTHULHU_LEVIATHAN_PRIME: 3D Cyber-Cephalopod Dreadnought Boss with Solar-Membrane Wings & Void Cannon
 */
export function drawEldritchEnemyBody25D(
  ctx: CanvasRenderingContext2D,
  kind: EnemyKind,
  facingRight: boolean,
  hitFlash: boolean,
  chargingEyes: boolean,
  meleeSwingTimer: number,
  facingAngle: number,
  timeSec: number
): number {
  const dir = facingRight ? 1 : -1;

  if (kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER) {
    ctx.save();
    ctx.lineCap = 'round';
    // 6 Segmented Coaxial Fiber-Optic Mech-Tentacles with glowing nodes
    for (let i = 0; i < 6; i++) {
      const spread = (i - 2.5) * 10;
      const wave = Math.sin(timeSec * 8.5 + i * 1.35) * 9;
      const lash =
        meleeSwingTimer > 0 && ((facingRight && i >= 3) || (!facingRight && i <= 2))
          ? dir * 24 * Math.sin((1 - meleeSwingTimer / 0.28) * Math.PI)
          : 0;
      const midX = spread + wave * 0.7;
      const endX = spread * 1.35 + wave + lash;

      ctx.strokeStyle = '#09040e';
      ctx.lineWidth = 9.5;
      ctx.beginPath();
      ctx.moveTo(spread * 0.45, -36);
      ctx.quadraticCurveTo(midX, -15, endX, 6);
      ctx.stroke();

      ctx.strokeStyle = hitFlash ? '#ffffff' : '#311042';
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.strokeStyle = i % 2 === 0 ? '#ff1744' : '#38bdf8';
      ctx.lineWidth = 1.8;
      ctx.setLineDash([4, 4]);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    // 3D Isometric Ruptured AI Server Cranial Cube + Exposed Circuitry
    drawIsoBioCyberBlock(
      ctx,
      -23,
      -76,
      46,
      42,
      -dir * 5,
      6,
      hitFlash ? '#ffffff' : '#1e1b4b',
      hitFlash ? '#ffffff' : '#312e81',
      '#0f172a',
      '#a855f7'
    );

    // Server rack LED strips on carapace
    ctx.fillStyle = '#090d16';
    ctx.fillRect(-19, -71, 38, 8);
    ctx.fillStyle = '#38bdf8';
    ctx.fillRect(-16, -69, 10, 3);
    ctx.fillStyle = '#f43f5e';
    ctx.fillRect(6, -69, 10, 3);

    // 5 Asymmetric Abyssal Targeting Optics
    drawAbyssalSlitEye(ctx, 0, -58, 6.2, 4.2, chargingEyes, timeSec, 0);
    drawAbyssalSlitEye(ctx, -11, -47, 5.0, 3.6, chargingEyes, timeSec, 1.1);
    drawAbyssalSlitEye(ctx, 11, -47, 5.0, 3.6, chargingEyes, timeSec, 1.8);
    drawAbyssalSlitEye(ctx, -16, -39, 3.4, 2.5, chargingEyes, timeSec, 2.5);
    drawAbyssalSlitEye(ctx, 16, -39, 3.4, 2.5, chargingEyes, timeSec, 3.2);
    ctx.restore();
    return 86;
  }

  if (kind === EnemyKind.SHOGGOTH_CORE_AMALGAM) {
    ctx.save();
    const throb = Math.sin(timeSec * 6.2) * 2.5;

    // Coiling heavy power-cable tendrils at base
    ctx.lineCap = 'round';
    for (let t = -3; t <= 3; t++) {
      const tx = t * 11;
      const wig = Math.cos(timeSec * 7 + t) * 7;
      ctx.strokeStyle = hitFlash ? '#ffffff' : '#1f1230';
      ctx.lineWidth = 9.5;
      ctx.beginPath();
      ctx.moveTo(tx * 0.6, -18);
      ctx.quadraticCurveTo(tx + wig, -4, tx * 1.2 - wig * 0.5, 7);
      ctx.stroke();
      ctx.strokeStyle = t % 2 === 0 ? '#c026d3' : '#38bdf8';
      ctx.lineWidth = 1.6;
      ctx.stroke();
    }

    // Core Bio-Cyber Biomass Volume
    const massGrad = ctx.createRadialGradient(-8, -52, 6, 0, -44, 42);
    massGrad.addColorStop(0, hitFlash ? '#ffffff' : '#581c87');
    massGrad.addColorStop(0.6, hitFlash ? '#ffffff' : '#2e1065');
    massGrad.addColorStop(1, '#09040e');
    ctx.fillStyle = massGrad;
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, -44, 34 + throb, 37 - throb * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // 3D Isometric Shattered Data-Center Server Blades Jutting Out of Shoggoth!
    ctx.save();
    ctx.translate(-22, -68);
    ctx.rotate(-0.28);
    drawIsoBioCyberBlock(ctx, -11, -10, 22, 18, -4, 4, '#1e293b', '#475569', '#0f172a', '#38bdf8');
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(-7, -6, 12, 2.5);
    ctx.restore();

    ctx.save();
    ctx.translate(22, -64);
    ctx.rotate(0.32);
    drawIsoBioCyberBlock(ctx, -10, -9, 20, 17, 4, 4, '#1e293b', '#475569', '#0f172a', '#f43f5e');
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-6, -5, 11, 2.5);
    ctx.restore();

    // Mechanical Hydraulic Shredder Jaw at y = -32
    const mawX = dir * 12;
    ctx.fillStyle = '#09020d';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(mawX, -32, 17, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    for (let f = -10; f <= 10; f += 5) {
      ctx.beginPath();
      ctx.moveTo(mawX + f - 2, -41);
      ctx.lineTo(mawX + f, -35);
      ctx.lineTo(mawX + f + 2, -41);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(mawX + f - 2, -23);
      ctx.lineTo(mawX + f, -29);
      ctx.lineTo(mawX + f + 2, -23);
      ctx.fill();
    }

    const eyes = [
      { x: -14, y: -56, rx: 6.5, ry: 4.5 },
      { x: 12, y: -58, rx: 7, ry: 4.8 },
      { x: -2, y: -70, rx: 5.5, ry: 4 },
      { x: -24, y: -44, rx: 4.5, ry: 3.2 },
      { x: 23, y: -46, rx: 4.8, ry: 3.5 },
    ];
    eyes.forEach((ey, idx) =>
      drawAbyssalSlitEye(ctx, ey.x, ey.y, ey.rx, ey.ry, chargingEyes, timeSec, idx * 0.9)
    );
    ctx.restore();
    return 92;
  }

  // 3. WORLD BOSS: CTHULHU_LEVIATHAN_PRIME (3D Cyber-Cephalopod Dreadnought Overmind)
  ctx.save();
  const wingFlap = Math.sin(timeSec * 5.2) * 8;

  // Cyber-Wing Struts & Plasma Membranes
  for (const wSide of [-1, 1]) {
    ctx.fillStyle = hitFlash ? '#ffffff' : 'rgba(59, 7, 100, 0.9)';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(wSide * 14, -70);
    ctx.lineTo(wSide * 52, -108 + wingFlap);
    ctx.lineTo(wSide * 64, -66 + wingFlap);
    ctx.lineTo(wSide * 44, -50 + wingFlap * 0.4);
    ctx.lineTo(wSide * 18, -46);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 3D Armored Mecha Pillar Legs
  const stride = Math.sin(timeSec * 6) * 3.5;
  drawIsoBioCyberBlock(
    ctx,
    -21,
    -24 + stride,
    15,
    30,
    -3,
    3,
    hitFlash ? '#ffffff' : '#1e1b4b',
    '#4c1d95',
    '#09040e'
  );
  drawIsoBioCyberBlock(
    ctx,
    6,
    -24 - stride,
    15,
    30,
    3,
    3,
    hitFlash ? '#ffffff' : '#1e1b4b',
    '#4c1d95',
    '#09040e'
  );

  // 3D Ribbed Reactor Chestplate
  drawIsoBioCyberBlock(
    ctx,
    -25,
    -66,
    50,
    43,
    -dir * 5,
    6,
    hitFlash ? '#ffffff' : '#261438',
    '#4c1d95',
    '#140921',
    '#c026d3'
  );
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(0, -45, 9.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -45, 4.5, 0, Math.PI * 2);
  ctx.fill();

  // Shoulder Abyssal Bio-Rocket Pod
  ctx.save();
  ctx.translate(-dir * 18, -78);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  drawIsoBioCyberBlock(ctx, -10, -7, 34, 14, 0, 3, '#1f122e', '#581c87', '#09040e', '#c026d3');
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(24, 0, 3.8, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // 3D Armored Cephalopod Cranial Dome + 8 Segmented Fiber-Optic Tentacles
  drawIsoBioCyberBlock(
    ctx,
    -22,
    -104,
    44,
    36,
    -dir * 4,
    6,
    hitFlash ? '#ffffff' : '#3b0764',
    '#6b21a8',
    '#1e1b4b',
    '#f43f5e'
  );

  ctx.lineCap = 'round';
  for (let ft = -3.5; ft <= 3.5; ft += 1) {
    const fx = ft * 4.8;
    const curl = Math.sin(timeSec * 8 + ft * 1.2) * 6;
    ctx.strokeStyle = hitFlash ? '#ffffff' : '#581c87';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(fx, -67);
    ctx.quadraticCurveTo(fx + curl, -53, fx * 1.3 - curl * 0.5, -40);
    ctx.stroke();
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.3;
    ctx.stroke();
  }

  drawAbyssalSlitEye(ctx, -11, -78, 6.2, 4.4, chargingEyes, timeSec, 0.4);
  drawAbyssalSlitEye(ctx, 11, -78, 6.2, 4.4, chargingEyes, timeSec, 1.2);
  drawAbyssalSlitEye(ctx, 0, -92, 7.2, 5.0, chargingEyes, timeSec, 2.0);

  // 3D Void Singularity Cannon Arm
  ctx.save();
  ctx.translate(dir * 24, -48);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  drawIsoBioCyberBlock(ctx, -6, -7, 40, 14, 0, 3.5, '#1e102b', '#4c1d95', '#09040e', '#ff1744');
  ctx.fillStyle = '#c026d3';
  ctx.fillRect(6, -2.5, 26, 5);
  ctx.restore();

  ctx.restore();
  return 116;
}
