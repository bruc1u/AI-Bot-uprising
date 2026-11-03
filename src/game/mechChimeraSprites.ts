import { EnemyKind } from '../types/game';

export function isMechaOrChimeraKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.MECH_SPIDER_ARACHNID ||
    kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH ||
    kind === EnemyKind.CHIMERA_HOUND_WEAVER ||
    kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT ||
    kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN ||
    kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM
  );
}

export function isWorldBossKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME ||
    kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN ||
    kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM ||
    kind === EnemyKind.BOSS_HEADLESS_DOOM_RIDER
  );
}

export function isEliteEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.LOGIC_WEAVER_ELITE ||
    kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT ||
    kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH ||
    kind === EnemyKind.SHOGGOTH_CORE_AMALGAM ||
    kind === EnemyKind.FRANKEN_STITCH_JUGGERNAUT
  );
}

/**
 * 3-plane 2.5D isometric extruded mecha block (front plate + top bevel + side depth)
 */
function drawIsoArmorBlock(
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
  ctx.lineWidth = 1.9;
  ctx.strokeStyle = border;

  // Top bevel
  ctx.fillStyle = top;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + dx, y - dy);
  ctx.lineTo(x + w + dx, y - dy);
  ctx.lineTo(x + w, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // Side bevel
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

  // Front face
  ctx.fillStyle = front;
  ctx.fillRect(x, y, w, h);
  ctx.strokeRect(x, y, w, h);
}

function drawRedMachineOptic(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  r: number,
  charging: boolean,
  timeSec: number
) {
  const pulse = charging ? 1.35 + 0.25 * Math.sin(timeSec * 32) : 0.94 + 0.12 * Math.sin(timeSec * 6);
  const grad = ctx.createRadialGradient(x, y, 0.5, x, y, r * 2.6 * pulse);
  grad.addColorStop(0, '#ffffff');
  grad.addColorStop(0.32, '#ff1744');
  grad.addColorStop(0.7, 'rgba(255, 23, 68, 0.45)');
  grad.addColorStop(1, 'rgba(255, 23, 68, 0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(x, y, r * 2.6 * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ff1744';
  ctx.beginPath();
  ctx.arc(x, y, r * pulse, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(x, y, r * 0.42, 0, Math.PI * 2);
  ctx.fill();
}

export function getMechChimeraCombatAnchors(
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

  if (kind === EnemyKind.MECH_SPIDER_ARACHNID) {
    const turretY = y - 44;
    return {
      leftEye: { x: x - 10, y: y - 50 },
      rightEye: { x: x + 10, y: y - 50 },
      gunMuzzle: {
        x: x + Math.cos(facingAngle) * 40,
        y: turretY + Math.sin(facingAngle) * 40,
      },
      rocketMuzzle: {
        x: x + Math.cos(facingAngle) * 20,
        y: y - 68 + Math.sin(facingAngle) * 20,
      },
      rocketBackblast: { x: x - dir * 16, y: y - 68 },
    };
  }

  if (kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
    const armX = x + dir * 24;
    const armY = y - 42;
    return {
      leftEye: { x: x - 11, y: y - 74 },
      rightEye: { x: x + 11, y: y - 76 },
      gunMuzzle: {
        x: armX + Math.cos(facingAngle) * 38,
        y: armY + Math.sin(facingAngle) * 38,
      },
      rocketMuzzle: {
        x: x - dir * 18 + Math.cos(facingAngle) * 26,
        y: y - 78 + Math.sin(facingAngle) * 26,
      },
      rocketBackblast: { x: x - dir * 28, y: y - 78 },
    };
  }

  if (kind === EnemyKind.CHIMERA_HOUND_WEAVER) {
    const handX = x + dir * 18;
    const handY = y - 38;
    return {
      leftEye: { x: x + dir * 6 - 6, y: y - 62 },
      rightEye: { x: x + dir * 6 + 6, y: y - 62 },
      gunMuzzle: {
        x: handX + Math.cos(facingAngle) * 32,
        y: handY + Math.sin(facingAngle) * 32,
      },
      rocketMuzzle: {
        x: x - dir * 18,
        y: y - 56,
      },
      rocketBackblast: { x: x - dir * 24, y: y - 56 },
    };
  }

  if (kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT) {
    const gunX = x + dir * 24;
    const gunY = y - 46;
    const rpgX = x - dir * 20;
    const rpgY = y - 76;
    return {
      leftEye: { x: x - 10, y: y - 82 },
      rightEye: { x: x + 10, y: y - 82 },
      gunMuzzle: {
        x: gunX + Math.cos(facingAngle) * 40,
        y: gunY + Math.sin(facingAngle) * 40,
      },
      rocketMuzzle: {
        x: rpgX + Math.cos(facingAngle) * 30,
        y: rpgY + Math.sin(facingAngle) * 30,
      },
      rocketBackblast: {
        x: rpgX - Math.cos(facingAngle) * 16,
        y: rpgY - Math.sin(facingAngle) * 16,
      },
    };
  }

  if (kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN) {
    const gatlingX = x + dir * 36;
    const gatlingY = y - 58;
    const podX = x - dir * 28;
    const podY = y - 106;
    return {
      leftEye: { x: x - 11, y: y - 104 },
      rightEye: { x: x + 11, y: y - 104 },
      gunMuzzle: {
        x: gatlingX + Math.cos(facingAngle) * 50,
        y: gatlingY + Math.sin(facingAngle) * 50,
      },
      rocketMuzzle: {
        x: podX + Math.cos(facingAngle) * 28,
        y: podY + Math.sin(facingAngle) * 28,
      },
      rocketBackblast: {
        x: podX - Math.cos(facingAngle) * 18,
        y: podY - Math.sin(facingAngle) * 18,
      },
    };
  }

  // BOSS_OMEGA_CHIMERA_AMALGAM
  const cannonX = x + dir * 34;
  const cannonY = y - 56;
  const bioPodX = x - dir * 24;
  const bioPodY = y - 96;
  return {
    leftEye: { x: x - 14, y: y - 96 },
    rightEye: { x: x + 14, y: y - 96 },
    gunMuzzle: {
      x: cannonX + Math.cos(facingAngle) * 46,
      y: cannonY + Math.sin(facingAngle) * 46,
    },
    rocketMuzzle: {
      x: bioPodX + Math.cos(facingAngle) * 30,
      y: bioPodY + Math.sin(facingAngle) * 30,
    },
    rocketBackblast: {
      x: bioPodX - Math.cos(facingAngle) * 16,
      y: bioPodY - Math.sin(facingAngle) * 16,
    },
  };
}

export function drawMechChimeraEnemy25D(
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

  if (kind === EnemyKind.MECH_SPIDER_ARACHNID) {
    // 1. 3D ISOMETRIC 6-LEGGED SIEGE ARACHNID WAR-MECH (~82px tall)
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    for (const side of [-1, 1]) {
      for (let leg = 0; leg < 3; leg++) {
        const step = Math.sin(walkPhase + leg * 2.1 + (side > 0 ? Math.PI : 0)) * 5.5;
        const hipX = side * 20;
        const hipY = -32 + (leg - 1) * 7;
        const kneeX = side * (40 + (leg === 1 ? 7 : 0));
        const kneeY = -52 + (leg - 1) * 8 + step * 0.5;
        const footX = side * (48 + (leg === 1 ? 6 : 0)) + step * 0.6;
        const footY = 4 + (leg - 1) * 6;

        // Heavy armored spider femur & tibia
        ctx.strokeStyle = '#090d16';
        ctx.lineWidth = 9;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.strokeStyle = hitFlash ? '#ffffff' : leg === 1 ? '#64748b' : '#475569';
        ctx.lineWidth = 5;
        ctx.stroke();

        // Chrome hydraulic cylinder
        ctx.strokeStyle = '#cbd5e1';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY - 3);
        ctx.lineTo(kneeX - side * 4, kneeY - 2);
        ctx.stroke();

        // Glowing orange servo knee + anchor spike claw
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 4.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 2.8, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#38bdf8';
        ctx.fillRect(footX - 3, footY - 2, 6, 3);
      }
    }

    // 3D Isometric Beveled Spider Turret Chassis
    drawIsoArmorBlock(
      ctx,
      -28,
      -58,
      56,
      32,
      -dir * 5,
      7,
      hitFlash ? '#ffffff' : '#1e293b',
      hitFlash ? '#ffffff' : '#475569',
      '#0f172a'
    );

    // Hazard stripe armor trim + cooling vents
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-24, -55, 48, 4);
    ctx.fillStyle = '#090d16';
    for (let hx = -20; hx <= 18; hx += 10) {
      ctx.fillRect(hx, -55, 5, 4);
    }

    // 3D Dorsal VLS Micro-Missile Pod + Radar Mast
    drawIsoArmorBlock(ctx, -16, -72, 32, 13, -dir * 3, 4, '#334155', '#64748b', '#1e293b');
    ctx.fillStyle = '#ff1744';
    for (let mx = -10; mx <= 10; mx += 6.5) {
      ctx.beginPath();
      ctx.arc(mx, -65.5, 2, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3 Crimson Arachnid Targeting Optics
    drawRedMachineOptic(ctx, -11, -45, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 11, -45, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 0, -49, 3.5, chargingEyes, timeSec);

    // Twin Rotating Plasma Autocannon Barrels
    ctx.save();
    ctx.translate(0, -36);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, 4, -6.5, 34, 13, 0, 3, '#18181b', '#3f3f46', '#090a0f');
    ctx.fillStyle = '#f97316';
    ctx.fillRect(10, -4, 26, 2.5);
    ctx.fillRect(10, 1.5, 26, 2.5);
    ctx.restore();

    ctx.restore();
    return 80;
  }

  if (kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
    // 2. 3D ISOMETRIC MUTATED INDUSTRIAL WRECKER / EXCAVATOR MECH (~98px tall)
    ctx.save();
    const rumble = Math.sin(timeSec * 16) * 1.2;

    // 3D Isometric Twin Armored Caterpillar Treads + Bogie Wheels
    drawIsoArmorBlock(
      ctx,
      -34,
      -22,
      68,
      27,
      -dir * 5,
      5,
      hitFlash ? '#ffffff' : '#1c1917',
      '#44403c',
      '#0c0a09'
    );
    const cleatShift = Math.floor(walkPhase * 3) % 8;
    ctx.fillStyle = '#78716c';
    for (let tx = -28 + cleatShift; tx <= 26; tx += 9) {
      ctx.fillRect(tx, -19, 4, 21);
    }
    for (const wx of [-20, 0, 20]) {
      ctx.fillStyle = '#090d16';
      ctx.beginPath();
      ctx.arc(wx, -8, 6.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(wx, -8, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // 3D Industrial Wrecker Hull + Twin Smokestacks
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2;
    ctx.fillRect(-24, -86 + rumble, 8, 18);
    ctx.strokeRect(-24, -86 + rumble, 8, 18);
    ctx.fillRect(16, -86 + rumble, 8, 18);
    ctx.strokeRect(16, -86 + rumble, 8, 18);

    drawIsoArmorBlock(
      ctx,
      -28,
      -69 + rumble,
      56,
      48,
      -dir * 6,
      7,
      hitFlash ? '#ffffff' : '#78350f',
      hitFlash ? '#ffffff' : '#b45309',
      '#451a03'
    );

    // Industrial Yellow/Black Caution Chevron Band
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-25, -65 + rumble, 50, 7);
    ctx.fillStyle = '#090a0f';
    for (let hx = -22; hx <= 20; hx += 11) {
      ctx.fillRect(hx, -65 + rumble, 5.5, 7);
    }

    // Blazing Molten Ore-Crusher Maw in Belly
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(-20, -45 + rumble, 40, 18);
    ctx.strokeStyle = '#ea580c';
    ctx.strokeRect(-20, -45 + rumble, 40, 18);
    ctx.fillStyle = '#f97316';
    for (let f = -15; f <= 15; f += 6) {
      ctx.fillRect(f, -42 + rumble, 3.5, 12);
    }

    // Armored Sensor Pod + 3 Mutated Crimson Optics
    drawIsoArmorBlock(ctx, -16, -82 + rumble, 32, 13, -dir * 3, 4, '#292524', '#57534e', '#1c1917');
    drawRedMachineOptic(ctx, -9, -75 + rumble, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 9, -75 + rumble, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 0, -53 + rumble, 4.0, chargingEyes, timeSec);

    // Left Hydraulic Boom Arm + Spinning Plasma-Heated Diamond Buzzsaw!
    const sawSwing = meleeSwingTimer > 0 ? Math.sin((1 - meleeSwingTimer / 0.28) * Math.PI) * 14 : 0;
    const sawX = -dir * 30 + dir * sawSwing;
    const sawY = -40;
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-dir * 18, -50);
    ctx.lineTo(sawX, sawY);
    ctx.stroke();

    ctx.save();
    ctx.translate(sawX, sawY);
    ctx.rotate(timeSec * 18);
    ctx.fillStyle = '#cbd5e1';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = (i * Math.PI) / 5;
      ctx.lineTo(Math.cos(a) * 17, Math.sin(a) * 17);
      ctx.lineTo(Math.cos(a + 0.31) * 11, Math.sin(a + 0.31) * 11);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f97316';
    ctx.beginPath();
    ctx.arc(0, 0, 5, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // Right Arm: 3D Heavy Slag Shrapnel Cannon
    ctx.save();
    ctx.translate(dir * 24, -42);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, -4, -8, 40, 15, 0, 3.5, '#27272a', '#52525b', '#090a0f');
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(8, -3.5, 26, 6);
    ctx.restore();

    ctx.restore();
    return 96;
  }

  if (kind === EnemyKind.CHIMERA_HOUND_WEAVER) {
    // 3. 3D CYBER-CHIMERA CENTAUR ASSAULT UNIT (Quadruped Mecha Chassis + Spliced Android + Scorpion Laser Tail)
    ctx.save();
    const gallop = Math.sin(walkPhase * 1.4) * 5;

    for (const lx of [-21, -7, 9, 21]) {
      const legOff = lx < 0 ? gallop : -gallop;
      drawIsoArmorBlock(
        ctx,
        lx - 4.5,
        -16 + legOff,
        9,
        22,
        2,
        2,
        hitFlash ? '#ffffff' : '#1e293b',
        '#475569',
        '#0f172a'
      );
      ctx.fillStyle = '#10b981';
      ctx.fillRect(lx - 3, 2 + legOff, 6, 2.5);
    }

    // 3D Quadruped Mecha Lower Chassis
    drawIsoArmorBlock(
      ctx,
      -26,
      -34,
      52,
      20,
      -dir * 4,
      5,
      hitFlash ? '#ffffff' : '#1e293b',
      '#334155',
      '#0f172a',
      '#10b981'
    );

    // Segmented Cyber-Scorpion Optic-Stinger Tail
    const tailWag = Math.sin(timeSec * 7.5) * 7;
    const segments = 5;
    for (let sIdx = 0; sIdx < segments; sIdx++) {
      const t = sIdx / segments;
      const sx = -dir * (22 + Math.sin(t * Math.PI) * 16 - t * 6);
      const sy = -30 - t * 46 + tailWag * t;
      ctx.fillStyle = sIdx % 2 === 0 ? '#4c1d95' : '#1e293b';
      ctx.strokeStyle = '#e879f9';
      ctx.lineWidth = 1.5;
      ctx.fillRect(sx - 4, sy - 4, 8, 8);
      ctx.strokeRect(sx - 4, sy - 4, 8, 8);
    }
    drawRedMachineOptic(ctx, -dir * 16, -78 + tailWag, 4.4, chargingEyes, timeSec);

    // Spliced 3D Cyber-Android Upper Torso & Dual-Optic Head
    drawIsoArmorBlock(
      ctx,
      dir * 4 - 16,
      -68,
      32,
      35,
      -dir * 4,
      5,
      hitFlash ? '#ffffff' : '#311042',
      '#581c87',
      '#1a0626',
      '#10b981'
    );
    ctx.fillStyle = '#10b981';
    ctx.fillRect(dir * 4 - 10, -48, 20, 4);

    drawRedMachineOptic(ctx, dir * 6 - 6, -57, 3.8, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, dir * 6 + 6, -57, 3.8, chargingEyes, timeSec);

    // Grafted Pulse Rifle Arm
    ctx.save();
    ctx.translate(dir * 18, -38);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, -4, -5, 34, 10, 0, 2.5, '#0f172a', '#334155', '#090d16', '#f43f5e');
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(6, -1.5, 22, 3);
    ctx.restore();

    ctx.restore();
    return 88;
  }

  if (kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT) {
    // 4. ELITE DUAL-AI SPLICED DREADNOUGHT (~106px tall)
    ctx.save();
    const stride = Math.sin(walkPhase) * 4;

    ctx.strokeStyle = 'rgba(250, 204, 21, 0.8)';
    ctx.lineWidth = 2.6;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.ellipse(0, 8, 36, 15, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    drawIsoArmorBlock(
      ctx,
      -22,
      -24 + stride,
      16,
      30,
      -4,
      3,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a'
    );
    drawIsoArmorBlock(
      ctx,
      6,
      -24 - stride,
      16,
      30,
      4,
      3,
      hitFlash ? '#ffffff' : '#1e293b',
      '#475569',
      '#0f172a'
    );

    // 3D Spliced Dreadnought Torso
    drawIsoArmorBlock(
      ctx,
      -28,
      -74,
      56,
      51,
      -dir * 6,
      7,
      hitFlash ? '#ffffff' : '#1e1b4b',
      '#312e81',
      '#0f172a',
      '#eab308'
    );

    // Biomechanical Grinder Core in Chest
    ctx.fillStyle = '#09020d';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2;
    ctx.fillRect(-18, -54, 36, 19);
    ctx.strokeRect(-18, -54, 36, 19);
    ctx.fillStyle = '#f8fafc';
    for (let f = -12; f <= 12; f += 6) {
      ctx.fillRect(f - 1.5, -53, 3, 5);
      ctx.fillRect(f - 1.5, -41, 3, 5);
    }

    // Twin 3D Spliced AI Command Heads (Left Gunmetal OpenAI Unit + Right Cyan-Violet Anthropic Unit)
    drawIsoArmorBlock(
      ctx,
      -23,
      -96,
      21,
      22,
      -3,
      4,
      hitFlash ? '#ffffff' : '#334155',
      '#64748b',
      '#1e293b',
      '#10b981'
    );
    drawIsoArmorBlock(
      ctx,
      2,
      -98,
      22,
      24,
      3,
      4,
      hitFlash ? '#ffffff' : '#3b0764',
      '#6b21a8',
      '#1e1b4b',
      '#00e5ff'
    );

    drawRedMachineOptic(ctx, -12, -84, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 13, -85, 4.5, chargingEyes, timeSec);

    // 3D Shoulder RPG Pod + Handheld Twin Plasma Autocannon
    ctx.save();
    ctx.translate(-dir * 20, -76);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, -8, -6.5, 34, 13, 0, 3, '#1f2937', '#4b5563', '#090a0f', '#eab308');
    ctx.restore();

    ctx.save();
    ctx.translate(dir * 24, -46);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, -6, -7, 42, 14, 0, 3.5, '#0f172a', '#334155', '#090a0f', '#00e5ff');
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(8, -3, 28, 2.2);
    ctx.fillRect(8, 1.2, 28, 2.2);
    ctx.restore();

    ctx.restore();
    return 106;
  }

  if (kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN) {
    // 5. WORLD BOSS: 3D IRON COLOSSUS SIEGE TITAN (~136px tall Giant War-Mech)
    ctx.save();
    const stomp = Math.sin(walkPhase) * 5;

    ctx.strokeStyle = 'rgba(249, 115, 22, 0.9)';
    ctx.lineWidth = 3.2;
    ctx.beginPath();
    ctx.ellipse(0, 9, 50, 21, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Colossal 3D Hydraulic Titan Legs with Knee Pistons
    for (const side of [-1, 1]) {
      const off = side < 0 ? stomp : -stomp;
      const lx = side < 0 ? -30 : 8;
      drawIsoArmorBlock(
        ctx,
        lx,
        -36 + off,
        22,
        44,
        side * 4,
        4,
        hitFlash ? '#ffffff' : '#292524',
        '#57534e',
        '#1c1917',
        '#ea580c'
      );
      ctx.fillStyle = '#f97316';
      ctx.fillRect(lx + 4, -18 + off, 14, 5);
    }

    // 3D Dreadnought Reactor Torso
    drawIsoArmorBlock(
      ctx,
      -40,
      -96,
      80,
      62,
      -dir * 7,
      9,
      hitFlash ? '#ffffff' : '#1c1917',
      hitFlash ? '#ffffff' : '#44403c',
      '#0c0a09',
      '#ea580c'
    );

    // Armored Blast Louvers + Blazing Tokamak Fusion Core in Chest
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(0, -64, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.2;
    ctx.stroke();

    const coreGlow = 0.82 + 0.18 * Math.sin(timeSec * 8);
    ctx.fillStyle = `rgba(249, 115, 22, ${coreGlow.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(0, -64, 14, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -64, 7, 0, Math.PI * 2);
    ctx.fill();

    // Twin 3D 6-Cell Shoulder VLS Missile Pods
    for (const sx of [-34, 34]) {
      drawIsoArmorBlock(
        ctx,
        sx - 13,
        -122,
        26,
        25,
        sx < 0 ? -4 : 4,
        5,
        '#334155',
        '#64748b',
        '#1e293b',
        '#f97316'
      );
      ctx.fillStyle = '#ff1744';
      for (let mx = -6; mx <= 6; mx += 6) {
        ctx.beginPath();
        ctx.arc(sx + mx, -114, 2.3, 0, Math.PI * 2);
        ctx.arc(sx + mx, -104, 2.3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // 3D Armored Command Bridge Head + Dual Crimson Mega-Optics
    drawIsoArmorBlock(
      ctx,
      -20,
      -120,
      40,
      25,
      -dir * 4,
      5,
      hitFlash ? '#ffffff' : '#27272a',
      '#52525b',
      '#090a0f',
      '#f59e0b'
    );
    ctx.fillStyle = '#090a0f';
    ctx.fillRect(-16, -110, 32, 9);
    drawRedMachineOptic(ctx, -10, -105.5, 5.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 10, -105.5, 5.2, chargingEyes, timeSec);

    // 3D Rotary 4-Barrel Gatling Siege Cannon Arm
    ctx.save();
    ctx.translate(dir * 36, -58);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    drawIsoArmorBlock(ctx, -8, -10, 54, 20, 0, 4, '#18181b', '#3f3f46', '#090a0f', '#f97316');
    ctx.fillStyle = '#fde047';
    ctx.fillRect(10, -6, 34, 2.8);
    ctx.fillRect(10, -1, 34, 2.8);
    ctx.fillRect(10, 4, 34, 2.8);
    ctx.restore();

    ctx.restore();
    return 134;
  }

  // 6. WORLD BOSS: 3D OMEGA CHIMERA APEX OVERLORD (~132px Ultimate Bio-Cyber Mecha Fusion)
  ctx.save();
  const flap = Math.sin(timeSec * 5.8) * 9;

  ctx.strokeStyle = 'rgba(232, 121, 249, 0.9)';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.ellipse(0, 9, 52, 21, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Articulated Cyber-Solar Pinion Wings (Metal Spar + Energy Grid)
  for (const wSide of [-1, 1]) {
    ctx.fillStyle = hitFlash ? '#ffffff' : 'rgba(59, 7, 100, 0.88)';
    ctx.strokeStyle = wSide < 0 ? '#10b981' : '#00e5ff';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(wSide * 18, -80);
    ctx.lineTo(wSide * 58, -118 + flap);
    ctx.lineTo(wSide * 76, -74 + flap);
    ctx.lineTo(wSide * 48, -50);
    ctx.lineTo(wSide * 20, -52);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(wSide * 58, -118 + flap);
    ctx.lineTo(wSide * 48, -50);
    ctx.stroke();
  }

  // 4 Heavy Articulated Spider-Mech Legs with Servo Joints
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (const row of [-1, 1]) {
      const step = Math.sin(walkPhase + row + side) * 5;
      const hx = side * 22;
      const hy = -28 + row * 6;
      const kx = side * 45;
      const ky = -44 + row * 8 + step;
      const fx = side * 54;
      const fy = 6 + row * 7;

      ctx.strokeStyle = '#090d16';
      ctx.lineWidth = 10;
      ctx.beginPath();
      ctx.moveTo(hx, hy);
      ctx.lineTo(kx, ky);
      ctx.lineTo(fx, fy);
      ctx.stroke();

      ctx.strokeStyle = hitFlash ? '#ffffff' : '#334155';
      ctx.lineWidth = 5.5;
      ctx.stroke();

      ctx.fillStyle = side < 0 ? '#10b981' : '#00e5ff';
      ctx.beginPath();
      ctx.arc(kx, ky, 3.8, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 3D Sovereign Dual-Core Mecha Chest (Left OpenAI Emerald Reactor + Right Anthropic Cyan Reactor!)
  drawIsoArmorBlock(
    ctx,
    -34,
    -86,
    68,
    56,
    -dir * 6,
    8,
    hitFlash ? '#ffffff' : '#1f1230',
    '#3b0764',
    '#0f071a',
    '#f43f5e'
  );

  // Dual Contained Core Chambers
  ctx.fillStyle = '#090d16';
  ctx.fillRect(-26, -70, 22, 24);
  ctx.fillRect(4, -70, 22, 24);
  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-15, -58, 7.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#00e5ff';
  ctx.beginPath();
  ctx.arc(15, -58, 7.5, 0, Math.PI * 2);
  ctx.fill();

  // 3D Armored Sovereign Crown + 3 Blazing Tri-Optics
  drawIsoArmorBlock(
    ctx,
    -24,
    -114,
    48,
    28,
    -dir * 4,
    5,
    hitFlash ? '#ffffff' : '#311042',
    '#581c87',
    '#1e1b4b',
    '#fde047'
  );
  drawRedMachineOptic(ctx, -13, -98, 4.8, chargingEyes, timeSec);
  drawRedMachineOptic(ctx, 13, -98, 4.8, chargingEyes, timeSec);
  drawRedMachineOptic(ctx, 0, -106, 5.6, chargingEyes, timeSec);

  // Shoulder Pod + Heavy Chimera Singularity Cannon
  ctx.save();
  ctx.translate(-dir * 24, -96);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  drawIsoArmorBlock(ctx, -8, -7, 36, 14, 0, 3, '#311042', '#6b21a8', '#090d16', '#e879f9');
  ctx.restore();

  ctx.save();
  ctx.translate(dir * 34, -56);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  drawIsoArmorBlock(ctx, -6, -8.5, 50, 17, 0, 4, '#0f172a', '#334155', '#090d16', '#ff1744');
  ctx.fillStyle = '#c026d3';
  ctx.fillRect(8, -3.5, 32, 7);
  ctx.restore();

  ctx.restore();
  return 130;
}
