import { EnemyKind } from '../types/game';

export function isEldritchEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.ELDRITCH_TENTACLE_WEAVER ||
    kind === EnemyKind.SHOGGOTH_CORE_AMALGAM ||
    kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME
  );
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
  // Outer crimson-violet abyssal halo
  const halo = ctx.createRadialGradient(x, y, 0.5, x, y, rx * 2.5 * pulse);
  halo.addColorStop(0, '#ffffff');
  halo.addColorStop(0.3, '#ff1744');
  halo.addColorStop(0.68, 'rgba(192, 38, 211, 0.52)');
  halo.addColorStop(1, 'rgba(192, 38, 211, 0)');
  ctx.fillStyle = halo;
  ctx.beginPath();
  ctx.arc(x, y, rx * 2.5 * pulse, 0, Math.PI * 2);
  ctx.fill();

  // Crimson sclera
  ctx.fillStyle = '#ff1744';
  ctx.strokeStyle = '#09040e';
  ctx.lineWidth = 1.4;
  ctx.beginPath();
  ctx.ellipse(x, y, rx * pulse, Math.max(1.2, ry * blink * pulse), 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  if (blink > 0.3) {
    // Eldritch gold iris + vertical black Cthulhu slit pupil
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
      leftEye: { x: x - 11, y: y - 76 },
      rightEye: { x: x + 11, y: y - 76 },
      gunMuzzle: {
        x: gunPivotX + Math.cos(facingAngle) * 34,
        y: gunPivotY + Math.sin(facingAngle) * 34,
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
    // Fires void orbs directly from its gaping biomechanical maw!
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

  // ELDRITCH_TENTACLE_WEAVER
  return {
    leftEye: { x: x - 9, y: y - 54 },
    rightEye: { x: x + 9, y: y - 54 },
    gunMuzzle: {
      x: x + Math.cos(facingAngle) * 28,
      y: y - 42 + Math.sin(facingAngle) * 28,
    },
    rocketMuzzle: { x, y: y - 54 },
    rocketBackblast: { x, y: y - 54 },
  };
}

/**
 * Renders the 3 Outdoor Cthulhu-Mutated AI Horror Species in 2.5D:
 * 1. ELDRITCH_TENTACLE_WEAVER (~82px tall): 6 writhing biomechanical tentacles + ruptured AI skull + 5 crimson eyes
 * 2. SHOGGOTH_CORE_AMALGAM (~90px tall): Shifting mass of dark server plates, gnashing fangs, tendrils & 8 bubbling eyes
 * 3. CTHULHU_LEVIATHAN_PRIME (~112px tall): Winged cephalopod cyber-deity with 8 face tentacles, 3 blazing eyes & bio-cannon
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
    // 6 Writhing Fiber-Optic & Flesh Tentacles supporting a cracked AI Cranial Carapace (~82px tall)
    ctx.save();
    ctx.lineCap = 'round';
    for (let i = 0; i < 6; i++) {
      const spread = (i - 2.5) * 10;
      const wave = Math.sin(timeSec * 8.5 + i * 1.35) * 9;
      const lash =
        meleeSwingTimer > 0 && ((facingRight && i >= 3) || (!facingRight && i <= 2))
          ? dir * 24 * Math.sin((1 - meleeSwingTimer / 0.28) * Math.PI)
          : 0;

      ctx.strokeStyle = hitFlash ? '#ffffff' : '#2e103d';
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(spread * 0.45, -36);
      ctx.quadraticCurveTo(spread + wave * 0.7, -16, spread * 1.35 + wave + lash, 6);
      ctx.stroke();

      ctx.strokeStyle = i % 2 === 0 ? '#ff1744' : '#c026d3';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }

    // Cracked Gunmetal-Chitin AI Skull Carapace (from y = -76 down to -32)
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1f1630';
    ctx.strokeStyle = '#09040e';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(-24, -40);
    ctx.quadraticCurveTo(-28, -74, 0, -78);
    ctx.quadraticCurveTo(28, -74, 24, -40);
    ctx.lineTo(16, -30);
    ctx.lineTo(-16, -30);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Corrupted circuit ribs
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(-16, -64);
    ctx.lineTo(-8, -46);
    ctx.moveTo(16, -64);
    ctx.lineTo(8, -46);
    ctx.stroke();

    // 5 Asymmetric Abyssal Crimson Slit Eyes
    drawAbyssalSlitEye(ctx, 0, -64, 6.2, 4.2, chargingEyes, timeSec, 0);
    drawAbyssalSlitEye(ctx, -10, -53, 5.2, 3.8, chargingEyes, timeSec, 1.1);
    drawAbyssalSlitEye(ctx, 10, -53, 5.2, 3.8, chargingEyes, timeSec, 1.8);
    drawAbyssalSlitEye(ctx, -17, -44, 3.5, 2.6, chargingEyes, timeSec, 2.5);
    drawAbyssalSlitEye(ctx, 17, -44, 3.5, 2.6, chargingEyes, timeSec, 3.2);
    ctx.restore();
    return 84;
  }

  if (kind === EnemyKind.SHOGGOTH_CORE_AMALGAM) {
    // Hulking Shifting Bio-Server Shoggoth (~90px tall) with Server Shards, Fang Maw & 7 Bubbling Eyes
    ctx.save();
    const throb = Math.sin(timeSec * 6.2) * 3;

    // Base coiling dark sludge & cable tendrils
    ctx.lineCap = 'round';
    for (let t = -3; t <= 3; t++) {
      const tx = t * 11;
      const wig = Math.cos(timeSec * 7 + t) * 7;
      ctx.strokeStyle = hitFlash ? '#ffffff' : '#240b30';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(tx * 0.6, -18);
      ctx.quadraticCurveTo(tx + wig, -4, tx * 1.2 - wig * 0.5, 7);
      ctx.stroke();
    }

    // Main Amorphous Flesh-Metal Bulk (y = -84 .. -6)
    ctx.fillStyle = hitFlash ? '#ffffff' : '#31103f';
    ctx.strokeStyle = '#09040e';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.ellipse(0, -44, 34 + throb, 38 - throb * 0.5, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Embedded shattered server-rack armor plates sticking out of the Shoggoth
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.6;
    ctx.save();
    ctx.translate(-22, -68);
    ctx.rotate(-0.35);
    ctx.fillRect(-10, -8, 20, 16);
    ctx.strokeRect(-10, -8, 20, 16);
    ctx.restore();

    ctx.save();
    ctx.translate(22, -64);
    ctx.rotate(0.4);
    ctx.fillRect(-9, -8, 18, 15);
    ctx.strokeRect(-9, -8, 18, 15);
    ctx.restore();

    // Gaping Biomechanical Fang Maw at y = -34 facing player!
    const mawX = dir * 12;
    ctx.fillStyle = '#09020d';
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(mawX, -32, 16, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Jagged chrome teeth inside maw
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

    // Cluster of 6 Bubbling Crimson-Gold Eyes across upper mass
    const eyes = [
      { x: -14, y: -56, rx: 6.5, ry: 4.5 },
      { x: 12, y: -58, rx: 7, ry: 4.8 },
      { x: -2, y: -70, rx: 5.5, ry: 4 },
      { x: -24, y: -44, rx: 4.5, ry: 3.2 },
      { x: 23, y: -46, rx: 4.8, ry: 3.5 },
      { x: 0, y: -50, rx: 4.2, ry: 3 },
    ];
    eyes.forEach((ey, idx) =>
      drawAbyssalSlitEye(ctx, ey.x, ey.y, ey.rx, ey.ry, chargingEyes, timeSec, idx * 0.9)
    );
    ctx.restore();
    return 90;
  }

  // 3. CTHULHU_LEVIATHAN_PRIME: Towering 112px Winged Cephalopod Overmind Dreadnought!
  ctx.save();
  const wingFlap = Math.sin(timeSec * 5.2) * 8;

  // Tattered Biomechanical Cable-Membrane Bat Wings (Left & Right)
  for (const wSide of [-1, 1]) {
    ctx.fillStyle = hitFlash ? '#ffffff' : 'rgba(59, 7, 100, 0.88)';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(wSide * 14, -68);
    ctx.quadraticCurveTo(wSide * 54, -104 + wingFlap, wSide * 62, -66 + wingFlap);
    ctx.lineTo(wSide * 44, -52 + wingFlap * 0.5);
    ctx.lineTo(wSide * 30, -40);
    ctx.lineTo(wSide * 16, -46);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // Heavy Biomechanical Pillar Legs + Claws (grounded at y = +8)
  const stride = Math.sin(timeSec * 6) * 3;
  ctx.fillStyle = hitFlash ? '#ffffff' : '#1e1b2e';
  ctx.strokeStyle = '#09040e';
  ctx.lineWidth = 2.4;
  ctx.fillRect(-20, -24 + stride, 14, 30);
  ctx.strokeRect(-20, -24 + stride, 14, 30);
  ctx.fillRect(6, -24 - stride, 14, 30);
  ctx.strokeRect(6, -24 - stride, 14, 30);

  // Armored Ribcage Reactor Torso (y = -64 .. -22)
  ctx.fillStyle = hitFlash ? '#ffffff' : '#261438';
  ctx.beginPath();
  ctx.roundRect(-24, -64, 48, 42, 8);
  ctx.fill();
  ctx.stroke();

  // Pulsing Crimson Abyssal Core in Chest
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(0, -44, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.arc(0, -44, 4, 0, Math.PI * 2);
  ctx.fill();

  // Shoulder Abyssal Bio-Rocket Pod (at x = -dir*18, y = -78)
  ctx.save();
  ctx.translate(-dir * 18, -78);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  ctx.fillStyle = '#1f122e';
  ctx.strokeStyle = '#c026d3';
  ctx.lineWidth = 2;
  ctx.fillRect(-10, -7, 34, 14);
  ctx.strokeRect(-10, -7, 34, 14);
  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(24, 0, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Cephalopod Cthulhu Head Dome (y = -104 .. -60) + 8 Writhing Face Tentacles!
  ctx.fillStyle = hitFlash ? '#ffffff' : '#3b0764';
  ctx.strokeStyle = '#09040e';
  ctx.lineWidth = 2.6;
  ctx.beginPath();
  ctx.ellipse(0, -82, 24, 22, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  // 8 Writhing Cthulhu Beard/Face Tentacles hanging from y = -66
  ctx.lineCap = 'round';
  for (let ft = -3.5; ft <= 3.5; ft += 1) {
    const fx = ft * 4.8;
    const curl = Math.sin(timeSec * 8 + ft * 1.2) * 6;
    ctx.strokeStyle = hitFlash ? '#ffffff' : '#581c87';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(fx, -65);
    ctx.quadraticCurveTo(fx + curl, -52, fx * 1.3 - curl * 0.5, -40);
    ctx.stroke();
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.4;
    ctx.stroke();
  }

  // 3 Blazing Crimson-Gold Abyssal Eyes on Cthulhu Crown
  drawAbyssalSlitEye(ctx, -11, -76, 6.2, 4.4, chargingEyes, timeSec, 0.4);
  drawAbyssalSlitEye(ctx, 11, -76, 6.2, 4.4, chargingEyes, timeSec, 1.2);
  drawAbyssalSlitEye(ctx, 0, -89, 7.2, 5.0, chargingEyes, timeSec, 2.0);

  // Bio-Mechanical Void Cannon Arm held at x = dir*24, y = -48
  ctx.save();
  ctx.translate(dir * 24, -48);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  ctx.fillStyle = '#1e102b';
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(-6, -6.5, 38, 13, 4);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#c026d3';
  ctx.fillRect(6, -2.5, 24, 5);
  ctx.restore();

  ctx.restore();
  return 112;
}
