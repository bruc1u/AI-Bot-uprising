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
    kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM
  );
}

export function isEliteEnemyKind(kind: EnemyKind): boolean {
  return (
    kind === EnemyKind.LOGIC_WEAVER_ELITE ||
    kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT ||
    kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH ||
    kind === EnemyKind.SHOGGOTH_CORE_AMALGAM
  );
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
        x: x + Math.cos(facingAngle) * 38,
        y: turretY + Math.sin(facingAngle) * 38,
      },
      rocketMuzzle: {
        x: x + Math.cos(facingAngle) * 20,
        y: y - 66 + Math.sin(facingAngle) * 20,
      },
      rocketBackblast: { x: x - dir * 16, y: y - 66 },
    };
  }

  if (kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
    const armX = x + dir * 24;
    const armY = y - 42;
    return {
      leftEye: { x: x - 11, y: y - 72 },
      rightEye: { x: x + 11, y: y - 74 },
      gunMuzzle: {
        x: armX + Math.cos(facingAngle) * 36,
        y: armY + Math.sin(facingAngle) * 36,
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
        x: handX + Math.cos(facingAngle) * 30,
        y: handY + Math.sin(facingAngle) * 30,
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
      leftEye: { x: x - 10, y: y - 76 },
      rightEye: { x: x + 10, y: y - 76 },
      gunMuzzle: {
        x: gunX + Math.cos(facingAngle) * 38,
        y: gunY + Math.sin(facingAngle) * 38,
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
    const gatlingX = x + dir * 34;
    const gatlingY = y - 58;
    const podX = x - dir * 26;
    const podY = y - 104;
    return {
      leftEye: { x: x - 12, y: y - 102 },
      rightEye: { x: x + 12, y: y - 102 },
      gunMuzzle: {
        x: gatlingX + Math.cos(facingAngle) * 48,
        y: gatlingY + Math.sin(facingAngle) * 48,
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
  const cannonX = x + dir * 32;
  const cannonY = y - 56;
  const bioPodX = x - dir * 24;
  const bioPodY = y - 96;
  return {
    leftEye: { x: x - 14, y: y - 94 },
    rightEye: { x: x + 14, y: y - 94 },
    gunMuzzle: {
      x: cannonX + Math.cos(facingAngle) * 44,
      y: cannonY + Math.sin(facingAngle) * 44,
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
    // 1. GIANT 6-LEGGED SIEGE SPIDER-TANK MECH (~82px tall, ~96px wide)
    ctx.save();
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // 6 Articulated Hydraulic Spider Legs
    for (let side of [-1, 1]) {
      for (let leg = 0; leg < 3; leg++) {
        const step = Math.sin(walkPhase + leg * 2.1 + (side > 0 ? Math.PI : 0)) * 5;
        const hipX = side * 18;
        const hipY = -30 + (leg - 1) * 7;
        const kneeX = side * (38 + (leg === 1 ? 6 : 0));
        const kneeY = -48 + (leg - 1) * 8 + step * 0.5;
        const footX = side * (46 + (leg === 1 ? 6 : 0)) + step * 0.6;
        const footY = 4 + (leg - 1) * 6;

        ctx.strokeStyle = hitFlash ? '#ffffff' : '#0c0a09';
        ctx.lineWidth = 8;
        ctx.beginPath();
        ctx.moveTo(hipX, hipY);
        ctx.lineTo(kneeX, kneeY);
        ctx.lineTo(footX, footY);
        ctx.stroke();

        ctx.strokeStyle = hitFlash ? '#ffffff' : '#475569';
        ctx.lineWidth = 4.5;
        ctx.stroke();

        // Orange hazard knee joint
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(kneeX, kneeY, 3.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Armored Octagonal Spider Turret Hull
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-28, -58, 56, 34, 10);
    ctx.fill();
    ctx.stroke();

    // Dorsal Mortar Pod
    ctx.fillStyle = '#334155';
    ctx.fillRect(-16, -70, 32, 13);
    ctx.strokeRect(-16, -70, 32, 13);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(-12, -66, 24, 4);

    // 3 Crimson Arachnid Targeting Optics
    drawRedMachineOptic(ctx, -10, -46, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 10, -46, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 0, -52, 3.4, chargingEyes, timeSec);

    // Twin Rotating Plasma Autocannon Barrels aimed at player
    ctx.save();
    ctx.translate(0, -38);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2;
    ctx.fillRect(6, -6, 32, 12);
    ctx.strokeRect(6, -6, 32, 12);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(12, -3.5, 24, 2.2);
    ctx.fillRect(12, 1.3, 24, 2.2);
    ctx.restore();

    ctx.restore();
    return 76;
  }

  if (kind === EnemyKind.MUTATED_EXCAVATOR_BEHEMOTH) {
    // 2. MUTATED HEAVY INDUSTRIAL EXCAVATOR / WRECKER MONSTER (~98px tall)
    ctx.save();
    const rumble = Math.sin(timeSec * 16) * 1.2;

    // Heavy Armored Caterpillar Tank Treads
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1c1917';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(-32, -20, 64, 26, 8);
    ctx.fill();
    ctx.stroke();

    // Rolling tread cleats
    const cleatShift = Math.floor(walkPhase * 3) % 8;
    ctx.fillStyle = '#57534e';
    for (let tx = -24 + cleatShift; tx <= 24; tx += 10) {
      ctx.fillRect(tx, -17, 4, 20);
    }

    // Mutated Rusted Industrial Cab & Molten Furnace Belly
    ctx.fillStyle = hitFlash ? '#ffffff' : '#431407';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(-28, -68 + rumble, 56, 50, 9);
    ctx.fill();
    ctx.stroke();

    // Hazard Yellow Industrial Armor Stripes
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-24, -64 + rumble, 48, 7);
    ctx.fillStyle = '#090a0f';
    for (let hx = -20; hx <= 18; hx += 12) {
      ctx.fillRect(hx, -64 + rumble, 6, 7);
    }

    // Molten Grinder Jaw in Belly
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(-18, -42 + rumble, 36, 16);
    ctx.fillStyle = '#f97316';
    for (let f = -14; f <= 14; f += 7) {
      ctx.fillRect(f, -40 + rumble, 4, 12);
    }

    // Overgrown Mutated Red-Eye Sensor Stalks on Roof
    ctx.strokeStyle = '#292524';
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-10, -68);
    ctx.lineTo(-12, -80);
    ctx.moveTo(10, -68);
    ctx.lineTo(12, -82);
    ctx.stroke();
    drawRedMachineOptic(ctx, -12, -80, 4.6, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 12, -82, 4.8, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 0, -54, 4.0, chargingEyes, timeSec);

    // Left Arm: Spinning Molten Buzzsaw Blade!
    const sawSwing = meleeSwingTimer > 0 ? Math.sin((1 - meleeSwingTimer / 0.28) * Math.PI) * 14 : 0;
    const sawX = -dir * 28 + dir * sawSwing;
    const sawY = -40;
    ctx.save();
    ctx.translate(sawX, sawY);
    ctx.rotate(timeSec * 18);
    ctx.fillStyle = '#94a3b8';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.lineTo(Math.cos(a) * 16, Math.sin(a) * 16);
      ctx.lineTo(Math.cos(a + 0.38) * 10, Math.sin(a + 0.38) * 10);
    }
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.restore();

    // Right Arm: Heavy Slag Shrapnel Cannon aimed at player
    ctx.save();
    ctx.translate(dir * 24, -42);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#27272a';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2;
    ctx.fillRect(-4, -7, 38, 14);
    ctx.strokeRect(-4, -7, 38, 14);
    ctx.fillStyle = '#fb923c';
    ctx.fillRect(8, -3, 24, 6);
    ctx.restore();

    ctx.restore();
    return 94;
  }

  if (kind === EnemyKind.CHIMERA_HOUND_WEAVER) {
    // 3. FUSION MONSTER 1: Cyber-Hound Quadruped Chassis + Rogue AI Torso + Cthulhu Optic Scorpion Tail!
    ctx.save();
    const gallop = Math.sin(walkPhase * 1.4) * 5;

    // 4 Cyber-Beast Quadruped Legs
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2.2;
    ctx.fillRect(-22, -16 + gallop, 9, 22);
    ctx.strokeRect(-22, -16 + gallop, 9, 22);
    ctx.fillRect(-8, -14 - gallop, 9, 20);
    ctx.strokeRect(-8, -14 - gallop, 9, 20);
    ctx.fillRect(8, -16 - gallop, 9, 22);
    ctx.strokeRect(8, -16 - gallop, 9, 22);
    ctx.fillRect(20, -14 + gallop, 9, 20);
    ctx.strokeRect(20, -14 + gallop, 9, 20);

    // Fused Quadruped Lower Chassis
    ctx.fillStyle = hitFlash ? '#ffffff' : '#27272a';
    ctx.beginPath();
    ctx.roundRect(-26, -32, 52, 20, 7);
    ctx.fill();
    ctx.stroke();

    // Writhing Cthulhu Scorpion Optic-Tail arching from rear!
    const tailWag = Math.sin(timeSec * 7.5) * 8;
    ctx.strokeStyle = '#581c87';
    ctx.lineWidth = 7;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-dir * 22, -28);
    ctx.quadraticCurveTo(-dir * 42, -56 + tailWag, -dir * 16, -76 + tailWag * 0.5);
    ctx.stroke();
    ctx.strokeStyle = '#e879f9';
    ctx.lineWidth = 2;
    ctx.stroke();
    drawRedMachineOptic(ctx, -dir * 16, -76 + tailWag * 0.5, 4.2, chargingEyes, timeSec);

    // Grafted Humanoid Rogue-AI Upper Torso & Split Chimera Head
    ctx.fillStyle = hitFlash ? '#ffffff' : '#311042';
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(dir * 4 - 16, -68, 32, 38, 6);
    ctx.fill();
    ctx.stroke();

    drawRedMachineOptic(ctx, dir * 6 - 6, -58, 3.8, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, dir * 6 + 6, -58, 3.8, chargingEyes, timeSec);

    // Grafted Pulse Gun Arm
    ctx.save();
    ctx.translate(dir * 18, -38);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#f43f5e';
    ctx.lineWidth = 1.8;
    ctx.fillRect(-4, -4.5, 32, 9);
    ctx.strokeRect(-4, -4.5, 32, 9);
    ctx.restore();

    ctx.restore();
    return 86;
  }

  if (kind === EnemyKind.ELITE_CHIMERA_JUGGERNAUT) {
    // 4. ELITE MULTI-MONSTER FUSION: Bulwark Shield + Shoggoth Fang Belly + Dual RPG & Twin Cannon!
    ctx.save();
    const stride = Math.sin(walkPhase) * 4;

    // Golden-Cyan Elite Ground Halo
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.78)';
    ctx.lineWidth = 2.6;
    ctx.setLineDash([8, 5]);
    ctx.beginPath();
    ctx.ellipse(0, 8, 36, 15, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);

    // Heavy Armored Pillar Legs
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1e293b';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2.4;
    ctx.fillRect(-20, -24 + stride, 15, 30);
    ctx.strokeRect(-20, -24 + stride, 15, 30);
    ctx.fillRect(5, -24 - stride, 15, 30);
    ctx.strokeRect(5, -24 - stride, 15, 30);

    // Fused Heavy Bulwark + Eldritch Flesh-Plated Torso
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1e1b4b';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-28, -72, 56, 50, 10);
    ctx.fill();
    ctx.stroke();

    // Gnashing Shoggoth Fang Maw fused into the chest!
    ctx.fillStyle = '#09020d';
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(0, -44, 17, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#f8fafc';
    for (let f = -10; f <= 10; f += 5) {
      ctx.fillRect(f - 1, -52, 2.5, 5);
      ctx.fillRect(f - 1, -39, 2.5, 5);
    }

    // Twin Fused Heads (Left OpenAI Block + Right Anthropic Shield-Visor)
    ctx.fillStyle = hitFlash ? '#ffffff' : '#334155';
    ctx.fillRect(-22, -94, 21, 22);
    ctx.strokeRect(-22, -94, 21, 22);
    ctx.fillStyle = hitFlash ? '#ffffff' : '#3b0764';
    ctx.fillRect(1, -96, 22, 24);
    ctx.strokeRect(1, -96, 22, 24);

    drawRedMachineOptic(ctx, -11, -83, 4.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 12, -84, 4.5, chargingEyes, timeSec);

    // Shoulder RPG Launcher
    ctx.save();
    ctx.translate(-dir * 20, -76);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.fillRect(-8, -6, 34, 12);
    ctx.strokeRect(-8, -6, 34, 12);
    ctx.restore();

    // Handheld Twin Autocannon
    ctx.save();
    ctx.translate(dir * 24, -46);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.fillRect(-6, -6.5, 40, 13);
    ctx.strokeRect(-6, -6.5, 40, 13);
    ctx.restore();

    ctx.restore();
    return 104;
  }

  if (kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN) {
    // 5. WORLD BOSS: IRON COLOSSUS TITAN (~136px tall Giant Open-World Mutated War-Mech!)
    ctx.save();
    const stomp = Math.sin(walkPhase) * 5;

    // Fiery Boss Ground Shock-Ring
    ctx.strokeStyle = 'rgba(249, 115, 22, 0.85)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(0, 9, 48, 20, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Colossal Hydraulic Titan Legs
    ctx.fillStyle = hitFlash ? '#ffffff' : '#292524';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 2.8;
    ctx.fillRect(-28, -34 + stomp, 20, 42);
    ctx.strokeRect(-28, -34 + stomp, 20, 42);
    ctx.fillRect(8, -34 - stomp, 20, 42);
    ctx.strokeRect(8, -34 - stomp, 20, 42);

    // Massive Siege Dreadnought Torso & Pauldrons
    ctx.fillStyle = hitFlash ? '#ffffff' : '#1c1917';
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.roundRect(-40, -94, 80, 62, 12);
    ctx.fill();
    ctx.stroke();

    // Blazing Molten Reactor Core in Chest
    const coreGlow = 0.8 + 0.2 * Math.sin(timeSec * 8);
    ctx.fillStyle = `rgba(249, 115, 22, ${coreGlow.toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(0, -62, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(0, -62, 8, 0, Math.PI * 2);
    ctx.fill();

    // Twin 6-Cell Shoulder Missile Pods
    for (const sx of [-32, 32]) {
      ctx.fillStyle = '#334155';
      ctx.strokeStyle = '#090a0f';
      ctx.lineWidth = 2.2;
      ctx.fillRect(sx - 12, -118, 24, 24);
      ctx.strokeRect(sx - 12, -118, 24, 24);
      ctx.fillStyle = '#ff1744';
      for (let mx = -6; mx <= 6; mx += 6) {
        ctx.beginPath();
        ctx.arc(sx + mx, -110, 2.2, 0, Math.PI * 2);
        ctx.arc(sx + mx, -101, 2.2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Horned Titan Command Head + Blazing Crimson Mega-Visor
    ctx.fillStyle = hitFlash ? '#ffffff' : '#27272a';
    ctx.strokeStyle = '#f59e0b';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-20, -118, 40, 26, 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#090a0f';
    ctx.fillRect(-16, -108, 32, 9);
    drawRedMachineOptic(ctx, -10, -103.5, 5.2, chargingEyes, timeSec);
    drawRedMachineOptic(ctx, 10, -103.5, 5.2, chargingEyes, timeSec);

    // Giant Rotary Gatling Cannon Arm
    ctx.save();
    ctx.translate(dir * 34, -58);
    ctx.rotate(facingAngle);
    if (!facingRight) ctx.scale(1, -1);
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.4;
    ctx.fillRect(-8, -9, 52, 18);
    ctx.strokeRect(-8, -9, 52, 18);
    ctx.fillStyle = '#fde047';
    ctx.fillRect(10, -5, 32, 3);
    ctx.fillRect(10, 2, 32, 3);
    ctx.restore();

    ctx.restore();
    return 132;
  }

  // 6. WORLD BOSS: OMEGA CHIMERA OVERLORD (~132px Ultimate Multi-Monster Fusion Boss!)
  ctx.save();
  const flap = Math.sin(timeSec * 5.8) * 9;

  // Dual-Color Apex Fusion Boss Ring
  ctx.strokeStyle = 'rgba(232, 121, 249, 0.88)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.ellipse(0, 9, 50, 21, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Cthulhu Cyber-Membrane Wings
  for (const wSide of [-1, 1]) {
    ctx.fillStyle = hitFlash ? '#ffffff' : 'rgba(76, 29, 149, 0.86)';
    ctx.strokeStyle = wSide < 0 ? '#10b981' : '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.moveTo(wSide * 18, -78);
    ctx.quadraticCurveTo(wSide * 68, -120 + flap, wSide * 74, -72 + flap);
    ctx.lineTo(wSide * 48, -50);
    ctx.lineTo(wSide * 20, -52);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
  }

  // 4 Heavy Arachnid-Mech Legs
  ctx.lineCap = 'round';
  for (const side of [-1, 1]) {
    for (const row of [-1, 1]) {
      const step = Math.sin(walkPhase + row + side) * 5;
      ctx.strokeStyle = hitFlash ? '#ffffff' : '#1e293b';
      ctx.lineWidth = 8.5;
      ctx.beginPath();
      ctx.moveTo(side * 22, -26 + row * 6);
      ctx.lineTo(side * 44, -40 + row * 8 + step);
      ctx.lineTo(side * 52, 6 + row * 7);
      ctx.stroke();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2.2;
      ctx.stroke();
    }
  }

  // Fused Sovereign Dual-Core Chest (Left OpenAI Emerald Core + Right Anthropic Cyan Core!)
  ctx.fillStyle = hitFlash ? '#ffffff' : '#1f1230';
  ctx.strokeStyle = '#f43f5e';
  ctx.lineWidth = 2.8;
  ctx.beginPath();
  ctx.roundRect(-34, -84, 68, 56, 12);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#10b981';
  ctx.beginPath();
  ctx.arc(-12, -56, 9, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#38bdf8';
  ctx.beginPath();
  ctx.arc(12, -56, 9, 0, Math.PI * 2);
  ctx.fill();

  // Multi-Headed Chimera Crown + Writhing Tentacles
  ctx.fillStyle = hitFlash ? '#ffffff' : '#3b0764';
  ctx.strokeStyle = '#fde047';
  ctx.lineWidth = 2.4;
  ctx.beginPath();
  ctx.ellipse(0, -100, 28, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  drawRedMachineOptic(ctx, -14, -96, 5.0, chargingEyes, timeSec);
  drawRedMachineOptic(ctx, 14, -96, 5.0, chargingEyes, timeSec);
  drawRedMachineOptic(ctx, 0, -106, 5.8, chargingEyes, timeSec);

  // Bio-Missile Shoulder Pod + Heavy Chimera Plasma Cannon Arm
  ctx.save();
  ctx.translate(-dir * 24, -96);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  ctx.fillStyle = '#311042';
  ctx.strokeStyle = '#e879f9';
  ctx.lineWidth = 2;
  ctx.fillRect(-8, -7, 36, 14);
  ctx.strokeRect(-8, -7, 36, 14);
  ctx.restore();

  ctx.save();
  ctx.translate(dir * 32, -56);
  ctx.rotate(facingAngle);
  if (!facingRight) ctx.scale(1, -1);
  ctx.fillStyle = '#0f172a';
  ctx.strokeStyle = '#ff1744';
  ctx.lineWidth = 2.2;
  ctx.fillRect(-6, -8, 48, 16);
  ctx.strokeRect(-6, -8, 48, 16);
  ctx.fillStyle = '#c026d3';
  ctx.fillRect(8, -3, 30, 6);
  ctx.restore();

  ctx.restore();
  return 128;
}
