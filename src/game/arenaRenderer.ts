import { ASSET_URLS, requestRawImage } from './assetLoader';
import {
  ContinentLandmarkVariant,
  MECHA_WASTELAND_DIVIDE_X,
  OUTDOOR_DIVIDE_X,
  ObstacleBlock,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
} from './worldZones';

export type { ContinentLandmarkVariant, ObstacleBlock };

function snap(v: number, px = 2): number {
  return Math.round(v / px) * px;
}

const OUTDOOR_ABYSS_EYES = [
  { x: 2980, y: 380, r: 22 },
  { x: 3560, y: 680, r: 28 },
  { x: 4220, y: 940, r: 24 },
  { x: 3040, y: 1620, r: 26 },
  { x: 3780, y: 1940, r: 32 },
  { x: 4380, y: 2320, r: 25 },
  { x: 3280, y: 3040, r: 28 },
  { x: 4080, y: 3260, r: 24 },
  { x: 3560, y: 3980, r: 30 },
  { x: 4320, y: 4240, r: 25 },
];

const MECHA_SLAG_CRATERS = [
  { x: 4980, y: 920, r: 64 },
  { x: 5640, y: 840, r: 78 },
  { x: 6420, y: 1020, r: 72 },
  { x: 5520, y: 1860, r: 88 },
  { x: 6360, y: 1980, r: 74 },
  { x: 5460, y: 2920, r: 82 },
  { x: 6840, y: 3060, r: 76 },
  { x: 5680, y: 3860, r: 84 },
  { x: 6520, y: 4160, r: 70 },
];

const DOORWAY_THRESHOLDS = [
  // Row A <-> Row B doorways (y = 1104)
  { x: 360, y: 1096, w: 320, h: 48, color: '#00f5d4' },
  { x: 1220, y: 1096, w: 360, h: 48, color: '#10a37f' },
  { x: 2080, y: 1096, w: 360, h: 48, color: '#eab308' },
  // Server Vault <-> Foundry (x = 1764)
  { x: 1756, y: 440, w: 48, h: 340, color: '#eab308' },
  // Cryo Lab <-> Command Hub (x = 904)
  { x: 896, y: 1640, w: 48, h: 400, color: '#00f5d4' },
  // Row B <-> Ordnance Hangar (y = 2544)
  { x: 360, y: 2536, w: 320, h: 48, color: '#38bdf8' },
  { x: 1560, y: 2536, w: 420, h: 48, color: '#38bdf8' },
  // Ordnance Hangar <-> Chimera Splicing Lab (y = 3524)
  { x: 520, y: 3516, w: 380, h: 48, color: '#f43f5e' },
  { x: 1660, y: 3516, w: 420, h: 48, color: '#f43f5e' },
  // 4 Breached Quarantine Blast Gates to Outdoor Open World (x = 2662)
  { x: 2648, y: 420, w: 68, h: 360, color: '#ff1744' },
  { x: 2648, y: 1620, w: 68, h: 460, color: '#ff1744' },
  { x: 2648, y: 2860, w: 68, h: 380, color: '#ff1744' },
  { x: 2648, y: 3860, w: 68, h: 380, color: '#ff1744' },
];

/**
 * Renders the 7200x4600 Multi-Biome World:
 * 1. West (0..2680): 6 Interconnected Sci-Fi Facility Chambers
 * 2. Central-East (2680..4680): Cthulhu Bio-Cyber Forbidden Wastes
 * 3. Far-East Open World (4680..7200): Mutated Giant Mecha Wasteland & Titan Graveyard
 */
export function drawIsometricArenaFloor(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  viewW: number,
  viewH: number,
  worldW: number,
  worldH: number,
  timeSec: number
) {
  ctx.fillStyle = '#0f141e';
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.save();
  ctx.translate(-camX, -camY);

  const wallPadX = 64;
  const wallPadTop = 88;
  const wallPadBot = 68;

  // 1. INDOOR FACILITY SUBSTRATE
  if (camX < OUTDOOR_DIVIDE_X + 40) {
    const indoorGrad = ctx.createLinearGradient(0, 0, 0, worldH);
    indoorGrad.addColorStop(0, '#1e293b');
    indoorGrad.addColorStop(0.5, '#273449');
    indoorGrad.addColorStop(1, '#1c2536');
    ctx.fillStyle = indoorGrad;
    ctx.fillRect(0, 0, OUTDOOR_DIVIDE_X, worldH);
  }

  // 2. CTHULHU BIO-CYBER ABYSS SUBSTRATE
  if (camX + viewW > OUTDOOR_DIVIDE_X - 40 && camX < MECHA_WASTELAND_DIVIDE_X + 40) {
    const outGrad = ctx.createLinearGradient(OUTDOOR_DIVIDE_X, 0, MECHA_WASTELAND_DIVIDE_X, worldH);
    outGrad.addColorStop(0, '#180c1e');
    outGrad.addColorStop(0.5, '#13091a');
    outGrad.addColorStop(1, '#1a0c20');
    ctx.fillStyle = outGrad;
    ctx.fillRect(OUTDOOR_DIVIDE_X, 0, MECHA_WASTELAND_DIVIDE_X - OUTDOOR_DIVIDE_X, worldH);
  }

  // 3. OPEN-WORLD TITAN MECHA WASTELAND SUBSTRATE
  if (camX + viewW > MECHA_WASTELAND_DIVIDE_X - 40) {
    const mechGrad = ctx.createLinearGradient(MECHA_WASTELAND_DIVIDE_X, 0, worldW, worldH);
    mechGrad.addColorStop(0, '#1d1917');
    mechGrad.addColorStop(0.5, '#241e1a');
    mechGrad.addColorStop(1, '#181412');
    ctx.fillStyle = mechGrad;
    ctx.fillRect(MECHA_WASTELAND_DIVIDE_X, 0, worldW - MECHA_WASTELAND_DIVIDE_X, worldH);
  }

  // 4. FRUSTUM-CULLED TILE RENDERING (60fps across 7200x4600)
  const tileW = 160;
  const tileH = 120;
  const startCol = Math.max(0, Math.floor((camX - tileW) / tileW));
  const endCol = Math.min(Math.ceil(worldW / tileW), Math.ceil((camX + viewW + tileW) / tileW));
  const startRow = Math.max(0, Math.floor((camY - tileH) / tileH));
  const endRow = Math.min(Math.ceil(worldH / tileH), Math.ceil((camY + viewH + tileH) / tileH));

  for (let r = startRow; r < endRow; r++) {
    const ty = r * tileH;
    for (let c = startCol; c < endCol; c++) {
      const tx = c * tileW;
      const alt = (r + c) % 2 === 0;
      const centerTx = tx + tileW * 0.5;

      if (centerTx < OUTDOOR_DIVIDE_X) {
        let fillA = '#293548';
        let fillB = '#243042';
        let trim = 'rgba(148, 163, 184, 0.16)';
        if (ty < 1120 && tx < 1780) {
          fillA = '#1d2d3a';
          fillB = '#192733';
          trim = 'rgba(16, 163, 127, 0.22)';
        } else if (ty < 1120 && tx >= 1780) {
          fillA = '#2c2f3b';
          fillB = '#252834';
          trim = 'rgba(234, 179, 8, 0.2)';
        } else if (ty >= 1120 && ty < 2560 && tx < 920) {
          fillA = '#1e3340';
          fillB = '#192b36';
          trim = 'rgba(0, 245, 212, 0.22)';
        } else if (ty >= 2560 && ty < 3540) {
          fillA = '#252f3f';
          fillB = '#202938';
        } else if (ty >= 3540) {
          // South Chimera Splicing Lab (Rose-Slate Hybrid Floor)
          fillA = '#2b2234';
          fillB = '#241c2c';
          trim = 'rgba(244, 63, 94, 0.22)';
        }

        ctx.fillStyle = '#111824';
        ctx.fillRect(tx, ty, tileW, tileH);
        ctx.fillStyle = alt ? fillA : fillB;
        ctx.fillRect(tx + 2, ty + 2, tileW - 4, tileH - 4);
        ctx.strokeStyle = trim;
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 5, ty + 5, tileW - 10, tileH - 10);
        ctx.fillStyle = '#475569';
        ctx.fillRect(tx + 8, ty + 8, 3, 3);
        ctx.fillRect(tx + tileW - 11, ty + tileH - 11, 3, 3);
      } else if (centerTx < MECHA_WASTELAND_DIVIDE_X) {
        // CTHULHU BIO-CYBER ABYSS TILES
        ctx.fillStyle = alt ? '#170b1f' : '#13081a';
        ctx.fillRect(tx, ty, tileW, tileH);

        const seed = (r * 31 + c * 17) % 7;
        ctx.strokeStyle =
          seed % 2 === 0 ? 'rgba(192, 38, 211, 0.24)' : 'rgba(255, 23, 68, 0.22)';
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.moveTo(tx + 14 + seed * 8, ty + 12);
        ctx.lineTo(tx + 74, ty + 56 + seed * 4);
        ctx.lineTo(tx + 138 - seed * 6, ty + 104);
        ctx.stroke();

        if (seed === 1 || seed === 5) {
          ctx.fillStyle = 'rgba(88, 28, 135, 0.22)';
          ctx.beginPath();
          ctx.ellipse(tx + 80, ty + 62, 38, 20, 0.2, 0, Math.PI * 2);
          ctx.fill();
        }
      } else {
        // OPEN-WORLD MUTATED MECHA WASTELAND TILES (Scorched Ferro-Plates, Tank Treads & Molten Slag)
        ctx.fillStyle = alt ? '#231f1d' : '#1e1a18';
        ctx.fillRect(tx, ty, tileW, tileH);

        // Industrial rusted steel plate seams
        ctx.strokeStyle = 'rgba(251, 146, 60, 0.14)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 4, ty + 4, tileW - 8, tileH - 8);

        const seed = (r * 19 + c * 23) % 9;
        if (seed === 0 || seed === 4) {
          // Giant Colossal Mech Tank-Tread Imprints etched into the wasteland
          ctx.fillStyle = 'rgba(12, 10, 9, 0.55)';
          for (let k = 0; k < 4; k++) {
            ctx.fillRect(tx + 18 + k * 34, ty + 28, 20, 12);
            ctx.fillRect(tx + 18 + k * 34, ty + 76, 20, 12);
          }
        } else if (seed === 2 || seed === 7) {
          // Glowing molten furnace-slag cracks
          ctx.strokeStyle = 'rgba(249, 115, 22, 0.42)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(tx + 20, ty + 18);
          ctx.lineTo(tx + 82, ty + 64);
          ctx.lineTo(tx + 144, ty + 48);
          ctx.stroke();
        }
      }
    }
  }

  // 5. INDOOR ROOM FLOOR STENCILS & LED CONDUITS
  const pulse = 0.58 + 0.22 * Math.sin(timeSec * 3.0);
  if (camX < OUTDOOR_DIVIDE_X + 60) {
    const hConduits = [580, 1520, 2120, 3040, 4040];
    for (const hy of hConduits) {
      if (hy > camY - 30 && hy < camY + viewH + 30) {
        ctx.fillStyle = '#0d1522';
        ctx.fillRect(wallPadX, hy - 3, OUTDOOR_DIVIDE_X - wallPadX - 18, 6);
        ctx.strokeStyle = `rgba(0, 229, 255, ${(pulse * 0.65).toFixed(2)})`;
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(wallPadX, hy);
        ctx.lineTo(OUTDOOR_DIVIDE_X - 18, hy);
        ctx.stroke();
      }
    }

    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    const stencils = [
      { x: 920, y: 980, text: 'SECTOR-A1 · OPENAI NEURAL VAULT', c: 'rgba(16, 185, 129, 0.45)' },
      { x: 2220, y: 980, text: 'SECTOR-A2 · ANTHROPIC FOUNDRY', c: 'rgba(234, 179, 8, 0.45)' },
      { x: 480, y: 1840, text: 'SECTOR-B1 · BIO-CRYO CONTAINMENT', c: 'rgba(0, 245, 212, 0.45)' },
      { x: 1380, y: 2740, text: 'SECTOR-C1 · HEAVY ORDNANCE HANGAR', c: 'rgba(56, 189, 248, 0.45)' },
      { x: 1380, y: 3740, text: 'SECTOR-D1 · CHIMERA SPLICING REACTOR', c: 'rgba(244, 63, 94, 0.48)' },
    ];
    for (const st of stencils) {
      if (st.x > camX - 280 && st.x < camX + viewW + 280 && st.y > camY - 60 && st.y < camY + viewH + 60) {
        ctx.fillStyle = st.c;
        ctx.fillText(st.text, st.x, st.y);
      }
    }
  }

  // 6. CENTRAL QUANTUM COMMAND HUB REACTOR PAD
  const cx = PLAYER_SPAWN_X;
  const cy = PLAYER_SPAWN_Y - 120;
  if (cx > camX - 360 && cx < camX + viewW + 360 && cy > camY - 260 && cy < camY + viewH + 260) {
    ctx.save();
    ctx.translate(cx, cy);
    ctx.fillStyle = '#161f2e';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(-200, -104, 400, 208, 18);
    ctx.fill();
    ctx.stroke();

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.52)';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, 145, 70, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2.2;
    ctx.fillRect(-104, -34, 208, 68);
    ctx.strokeRect(-104, -34, 208, 68);

    const vibeLogo = requestRawImage(ASSET_URLS.VIBEVIBE_LOGO);
    if (vibeLogo) {
      ctx.drawImage(vibeLogo, -86, -25, 172, 50);
    }
    ctx.fillStyle = '#94a3b8';
    ctx.font = '700 10px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SECTOR-00 QUANTUM COMMAND · EAST GATES -> OPEN WORLD', 0, 52);
    ctx.restore();
  }

  // 7. GLOWING BLAST DOORWAY THRESHOLD PADS
  for (const dt of DOORWAY_THRESHOLDS) {
    if (
      dt.x + dt.w > camX &&
      dt.x < camX + viewW &&
      dt.y + dt.h > camY &&
      dt.y < camY + viewH
    ) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.85)';
      ctx.fillRect(dt.x, dt.y, dt.w, dt.h);
      ctx.strokeStyle = dt.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(dt.x + 2, dt.y + 2, dt.w - 4, dt.h - 4);
      ctx.setLineDash([]);
    }
  }

  // 8. CTHULHU BIO-CYBER ABYSS GROUND TENTACLES & ABYSSAL EYES
  if (camX + viewW > OUTDOOR_DIVIDE_X - 80 && camX < MECHA_WASTELAND_DIVIDE_X + 120) {
    ctx.fillStyle = 'rgba(255, 23, 68, 0.68)';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    for (const gy of [600, 1850, 3050, 4050]) {
      if (gy > camY - 60 && gy < camY + viewH + 60) {
        ctx.fillText('DANGER · CTHULHU BIO-CYBER ABYSS -> EAST: MECHA WASTELAND', OUTDOOR_DIVIDE_X + 54, gy);
      }
    }

    for (let ti = 0; ti < 16; ti++) {
      const baseX = OUTDOOR_DIVIDE_X + 200 + (ti % 4) * 440;
      const baseY = 300 + Math.floor(ti / 4) * 1060 + (ti % 2) * 180;
      if (
        baseX + 240 < camX ||
        baseX - 240 > camX + viewW ||
        baseY + 180 < camY ||
        baseY - 180 > camY + viewH
      ) {
        continue;
      }

      ctx.save();
      ctx.lineCap = 'round';
      for (let arm = 0; arm < 3; arm++) {
        const ang = ti * 1.3 + arm * 2.09;
        const wriggle = Math.sin(timeSec * 2.8 + ti + arm) * 26;
        const midX = baseX + Math.cos(ang) * 95 - Math.sin(ang) * wriggle;
        const midY = baseY + Math.sin(ang) * 68 + Math.cos(ang) * wriggle * 0.6;
        const tipX = baseX + Math.cos(ang + 0.25) * 185 + wriggle;
        const tipY = baseY + Math.sin(ang + 0.25) * 125 - wriggle * 0.5;

        ctx.strokeStyle = '#2e1038';
        ctx.lineWidth = 11;
        ctx.beginPath();
        ctx.moveTo(baseX, baseY);
        ctx.quadraticCurveTo(midX, midY, tipX, tipY);
        ctx.stroke();

        ctx.strokeStyle = arm % 2 === 0 ? 'rgba(255, 23, 68, 0.55)' : 'rgba(192, 38, 211, 0.55)';
        ctx.lineWidth = 3;
        ctx.stroke();
      }
      ctx.restore();
    }

    for (let i = 0; i < OUTDOOR_ABYSS_EYES.length; i++) {
      const ge = OUTDOOR_ABYSS_EYES[i];
      if (
        ge.x + 60 < camX ||
        ge.x - 60 > camX + viewW ||
        ge.y + 60 < camY ||
        ge.y - 60 > camY + viewH
      ) {
        continue;
      }
      const blink = Math.abs(Math.sin(timeSec * 1.7 + i * 2.1));
      const openH = Math.max(1.5, ge.r * 0.52 * (blink > 0.14 ? 1 : 0.1));

      ctx.save();
      ctx.translate(ge.x, ge.y);
      ctx.fillStyle = '#240a2e';
      ctx.strokeStyle = '#7e22ce';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(0, 0, ge.r * 1.25, ge.r * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.ellipse(0, 0, ge.r, openH, 0, 0, Math.PI * 2);
      ctx.fill();

      if (openH > 3) {
        ctx.fillStyle = '#fde047';
        ctx.beginPath();
        ctx.ellipse(0, 0, ge.r * 0.45, openH * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#09050f';
        ctx.beginPath();
        ctx.ellipse(0, 0, 3.2, openH * 0.82, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();
    }
  }

  // 9. OPEN-WORLD TITAN MECHA WASTELAND FRONTIER DETAILS (x >= 4680)
  if (camX + viewW > MECHA_WASTELAND_DIVIDE_X - 80) {
    // Open-World Frontier Hazard Line
    if (MECHA_WASTELAND_DIVIDE_X > camX - 40 && MECHA_WASTELAND_DIVIDE_X < camX + viewW + 40) {
      ctx.strokeStyle = 'rgba(249, 115, 22, 0.55)';
      ctx.lineWidth = 3;
      ctx.setLineDash([16, 12]);
      ctx.beginPath();
      ctx.moveTo(MECHA_WASTELAND_DIVIDE_X, wallPadTop);
      ctx.lineTo(MECHA_WASTELAND_DIVIDE_X, worldH - wallPadBot);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    ctx.fillStyle = 'rgba(251, 146, 60, 0.72)';
    ctx.font = '800 12px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    for (const wy of [740, 1880, 3120, 4120]) {
      if (wy > camY - 60 && wy < camY + viewH + 60) {
        ctx.fillText('OPEN WORLD · MUTATED TITAN MECHA WASTELAND', MECHA_WASTELAND_DIVIDE_X + 38, wy);
      }
    }

    // Glowing Molten Plasma & Oil Slag Craters
    for (let i = 0; i < MECHA_SLAG_CRATERS.length; i++) {
      const sc = MECHA_SLAG_CRATERS[i];
      if (
        sc.x + sc.r * 1.4 < camX ||
        sc.x - sc.r * 1.4 > camX + viewW ||
        sc.y + sc.r < camY ||
        sc.y - sc.r > camY + viewH
      ) {
        continue;
      }
      const glow = 0.65 + 0.3 * Math.sin(timeSec * 2.6 + i * 1.5);
      ctx.save();
      ctx.translate(sc.x, sc.y);
      ctx.fillStyle = '#0c0a09';
      ctx.strokeStyle = '#7c2d12';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.ellipse(0, 0, sc.r * 1.15, sc.r * 0.62, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      const lava = ctx.createRadialGradient(0, 0, 4, 0, 0, sc.r * 0.85);
      lava.addColorStop(0, `rgba(254, 240, 138, ${(0.8 * glow).toFixed(2)})`);
      lava.addColorStop(0.45, `rgba(249, 115, 22, ${(0.65 * glow).toFixed(2)})`);
      lava.addColorStop(1, 'rgba(153, 27, 27, 0)');
      ctx.fillStyle = lava;
      ctx.beginPath();
      ctx.ellipse(0, 0, sc.r * 0.9, sc.r * 0.48, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // 10. OUTER WORLD PERIMETER BORDERS
  if (camY < wallPadTop + 30) {
    if (camX < OUTDOOR_DIVIDE_X) {
      ctx.fillStyle = '#334155';
      ctx.fillRect(0, 0, OUTDOOR_DIVIDE_X, wallPadTop);
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 3;
      ctx.strokeRect(0, 0, OUTDOOR_DIVIDE_X, wallPadTop);
    }
    if (camX + viewW > OUTDOOR_DIVIDE_X) {
      ctx.fillStyle = '#1f0b29';
      ctx.fillRect(OUTDOOR_DIVIDE_X, 0, MECHA_WASTELAND_DIVIDE_X - OUTDOOR_DIVIDE_X, wallPadTop);
      ctx.fillStyle = '#291d18';
      ctx.fillRect(MECHA_WASTELAND_DIVIDE_X, 0, worldW - MECHA_WASTELAND_DIVIDE_X, wallPadTop);
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(OUTDOOR_DIVIDE_X, wallPadTop);
      ctx.lineTo(worldW, wallPadTop);
      ctx.stroke();
    }
  }

  if (camY + viewH > worldH - wallPadBot - 30) {
    const by = worldH - wallPadBot;
    ctx.fillStyle = '#1b2434';
    ctx.fillRect(0, by, OUTDOOR_DIVIDE_X, wallPadBot);
    ctx.fillStyle = '#190921';
    ctx.fillRect(OUTDOOR_DIVIDE_X, by, MECHA_WASTELAND_DIVIDE_X - OUTDOOR_DIVIDE_X, wallPadBot);
    ctx.fillStyle = '#241914';
    ctx.fillRect(MECHA_WASTELAND_DIVIDE_X, by, worldW - MECHA_WASTELAND_DIVIDE_X, wallPadBot);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wallPadX, by);
    ctx.lineTo(OUTDOOR_DIVIDE_X, by);
    ctx.stroke();
    ctx.strokeStyle = '#f97316';
    ctx.beginPath();
    ctx.moveTo(OUTDOOR_DIVIDE_X, by);
    ctx.lineTo(worldW - wallPadX, by);
    ctx.stroke();
  }

  if (camX < wallPadX + 20) {
    ctx.fillStyle = '#273449';
    ctx.fillRect(0, 0, wallPadX, worldH);
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(wallPadX, wallPadTop);
    ctx.lineTo(wallPadX, worldH - wallPadBot);
    ctx.stroke();
  }

  if (camX + viewW > worldW - wallPadX - 20) {
    const rx = worldW - wallPadX;
    ctx.fillStyle = '#291d18';
    ctx.fillRect(rx, 0, wallPadX, worldH);
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(rx, wallPadTop);
    ctx.lineTo(rx, worldH - wallPadBot);
    ctx.stroke();
  }

  ctx.restore();
}

export function drawObstacle25D(
  ctx: CanvasRenderingContext2D,
  obs: ObstacleBlock,
  timeSec: number
) {
  const { x, y, w, h, heightZ, variant } = obs;

  if (variant === 'partition_wall') {
    const isQuarantineWall = x >= OUTDOOR_DIVIDE_X - 30;
    const topY = snap(y - heightZ);
    ctx.save();
    ctx.fillStyle = 'rgba(7, 10, 18, 0.5)';
    ctx.fillRect(snap(x + 4), snap(y + 6), snap(w), snap(h));

    ctx.fillStyle = isQuarantineWall ? '#2b192e' : '#263346';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.2;
    ctx.fillRect(snap(x), topY, snap(w), snap(heightZ + h));
    ctx.strokeRect(snap(x), topY, snap(w), snap(heightZ + h));

    ctx.fillStyle = isQuarantineWall ? '#4a1d46' : '#3b4c63';
    ctx.fillRect(snap(x + 2), topY + 2, snap(w - 4), Math.min(20, snap(h * 0.65)));

    ctx.fillStyle = isQuarantineWall ? '#ff1744' : '#38bdf8';
    if (w > h) {
      ctx.fillRect(snap(x + 8), topY + 9, snap(w - 16), 3);
    } else {
      ctx.fillRect(snap(x + w * 0.42), topY + 8, 4, snap(heightZ + h - 18));
    }
    ctx.restore();
    return;
  }

  ctx.save();
  ctx.fillStyle = 'rgba(9, 13, 22, 0.48)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.5, y + h * 0.86, w * 0.58, h * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  if (variant === 'titan_wreck') {
    // Colossal Downed War-Mech Husk in the Open-World Mecha Wasteland!
    const topY = snap(y - heightZ);
    const pulse = 0.65 + 0.35 * Math.sin(timeSec * 3.4 + x * 0.01);

    // Armored fallen torso & shoulder pauldron
    ctx.fillStyle = '#292524';
    ctx.strokeStyle = '#0c0a09';
    ctx.lineWidth = 2.6;
    ctx.beginPath();
    ctx.roundRect(snap(x), topY + 18, snap(w), snap(heightZ + h * 0.62), 14);
    ctx.fill();
    ctx.stroke();

    // Heavy hazard stripe armor plate
    ctx.fillStyle = '#44403c';
    ctx.fillRect(snap(x + 10), topY + 26, snap(w - 20), 22);
    ctx.fillStyle = '#f59e0b';
    for (let sx = x + 16; sx < x + w - 24; sx += 24) {
      ctx.fillRect(snap(sx), topY + 30, 12, 6);
    }

    // Ruptured glowing furnace reactor core inside the giant wreck
    ctx.fillStyle = `rgba(249, 115, 22, ${(0.85 * pulse).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x + w * 0.36, topY + 68, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + w * 0.36, topY + 68, 7, 0, Math.PI * 2);
    ctx.fill();

    // Tilted Colossal Titan Head Unit with flickering Crimson Optic Visor
    ctx.save();
    ctx.translate(x + w * 0.72, topY + 56);
    ctx.rotate(0.24);
    ctx.fillStyle = '#1c1917';
    ctx.strokeStyle = '#ea580c';
    ctx.lineWidth = 2;
    ctx.fillRect(-26, -22, 52, 38);
    ctx.strokeRect(-26, -22, 52, 38);
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(-18, -6, 36, 8);
    ctx.restore();

    ctx.restore();
    return;
  }

  if (variant === 'mech_gantry') {
    // Mutated Automated Heavy Forge Gantry with Twin Steel Pillars & Plasma Welder Claw
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.75);

    ctx.fillStyle = '#1f2937';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.4;
    // Left & right heavy gantry legs
    ctx.fillRect(snap(x + 6), topY + 14, 24, totalH - 14);
    ctx.strokeRect(snap(x + 6), topY + 14, 24, totalH - 14);
    ctx.fillRect(snap(x + w - 30), topY + 14, 24, totalH - 14);
    ctx.strokeRect(snap(x + w - 30), topY + 14, 24, totalH - 14);

    // Overhead cross-beam bridge
    ctx.fillStyle = '#334155';
    ctx.fillRect(snap(x), topY, snap(w), 24);
    ctx.strokeRect(snap(x), topY, snap(w), 24);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(snap(x + 8), topY + 9, snap(w - 16), 5);

    // Swinging servo-claw assembly
    const clawX = x + w * 0.5 + Math.sin(timeSec * 2.1 + y * 0.01) * (w * 0.18);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(clawX, topY + 24);
    ctx.lineTo(clawX, topY + 56);
    ctx.stroke();

    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(clawX, topY + 58, 6, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return;
  }

  if (variant === 'tesla_pylon') {
    // High-Voltage Electromagnetic Storm Pylon in the Mecha Wasteland
    const topY = snap(y - heightZ);
    const cx = x + w * 0.5;

    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(snap(x + 8), snap(y + h * 0.25), snap(w - 16), snap(h * 0.65), 8);
    ctx.fill();
    ctx.stroke();

    // Insulated coil tower
    ctx.fillStyle = '#334155';
    ctx.fillRect(snap(cx - 12), topY + 18, 24, snap(heightZ));
    ctx.strokeRect(snap(cx - 12), topY + 18, 24, snap(heightZ));

    for (let ring = 0; ring < 3; ring++) {
      const ry = topY + 28 + ring * 22;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx, ry, 22 - ring * 2, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Crown plasma sphere + crackling lightning bolt
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(cx, topY + 12, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx, topY + 12, 5, 0, Math.PI * 2);
    ctx.fill();

    if (Math.sin(timeSec * 14 + x) > 0) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx, topY + 12);
      ctx.lineTo(cx + 22, topY + 30);
      ctx.lineTo(cx + 8, topY + 48);
      ctx.stroke();
    }

    ctx.restore();
    return;
  }

  if (variant === 'eldritch_obelisk') {
    const topY = snap(y - heightZ);
    const pulse = 0.7 + 0.3 * Math.sin(timeSec * 3.8 + x * 0.01);

    const aura = ctx.createRadialGradient(x + w / 2, y + h * 0.6, 8, x + w / 2, y + h * 0.6, w * 0.95);
    aura.addColorStop(0, `rgba(192, 38, 211, ${(0.38 * pulse).toFixed(2)})`);
    aura.addColorStop(1, 'rgba(255, 23, 68, 0)');
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.6, w * 0.95, 0, Math.PI * 2);
    ctx.fill();

    ctx.lineCap = 'round';
    for (let t = 0; t < 4; t++) {
      const dir = t < 2 ? -1 : 1;
      const sway = Math.sin(timeSec * 4.2 + t * 1.6) * 12;
      ctx.strokeStyle = '#3b0764';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(x + w * 0.5, y + h * 0.6);
      ctx.quadraticCurveTo(x + w * 0.5 + dir * 36, y + h * 0.4 + sway, x + w * 0.5 + dir * 58, y + h * 0.75 - sway * 0.5);
      ctx.stroke();
      ctx.strokeStyle = '#ff1744';
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = '#14091c';
    ctx.strokeStyle = '#c026d3';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.moveTo(x + w * 0.16, y + h * 0.75);
    ctx.lineTo(x + w * 0.3, topY);
    ctx.lineTo(x + w * 0.7, topY);
    ctx.lineTo(x + w * 0.84, y + h * 0.75);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    const eyeX = x + w * 0.5;
    const eyeY = topY + (heightZ + h * 0.5) * 0.42;
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 14, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 7, 17, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09040e';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 2.6, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return;
  }

  if (variant === 'flesh_hive') {
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.72);

    ctx.fillStyle = '#1f122b';
    ctx.strokeStyle = '#09050f';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(snap(x), topY + 10, snap(w), totalH, 14);
    ctx.fill();
    ctx.stroke();

    const swell = Math.sin(timeSec * 4.5 + y * 0.02) * 3;
    ctx.fillStyle = '#581c87';
    ctx.strokeStyle = '#e11d48';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.ellipse(x + w * 0.52, topY + 26, w * 0.44 + swell, 22 + swell * 0.5, -0.12, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    const hiveEyes = [
      { ox: 0.32, oy: 22, r: 6.5 },
      { ox: 0.55, oy: 18, r: 8.5 },
      { ox: 0.72, oy: 29, r: 5.5 },
      { ox: 0.44, oy: 48, r: 6 },
      { ox: 0.66, oy: 54, r: 7 },
    ];
    for (let i = 0; i < hiveEyes.length; i++) {
      const he = hiveEyes[i];
      const ex = x + w * he.ox;
      const ey = topY + he.oy;
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(ex, ey, he.r, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.arc(ex, ey, he.r * 0.45, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#09050f';
      ctx.fillRect(ex - 1, ey - he.r * 0.65, 2, he.r * 1.3);
    }

    ctx.restore();
    return;
  }

  if (variant === 'cryo_core') {
    const pulse = 0.72 + 0.25 * Math.sin(timeSec * 3.6 + x * 0.02);
    const pool = ctx.createRadialGradient(x + w / 2, y + h * 0.7, 6, x + w / 2, y + h * 0.7, w * 0.9);
    pool.addColorStop(0, `rgba(0, 245, 212, ${(0.34 * pulse).toFixed(2)})`);
    pool.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.arc(x + w / 2, y + h * 0.7, w * 0.9, 0, Math.PI * 2);
    ctx.fill();

    const topY = snap(y - heightZ);
    ctx.fillStyle = '#334155';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(snap(x), snap(y + h * 0.35), snap(w), snap(h * 0.65), 8);
    ctx.fill();
    ctx.stroke();

    const tankGrad = ctx.createLinearGradient(x, topY, x + w, topY + heightZ);
    tankGrad.addColorStop(0, 'rgba(8, 145, 178, 0.78)');
    tankGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.55)');
    tankGrad.addColorStop(1, 'rgba(6, 95, 70, 0.78)');
    ctx.fillStyle = tankGrad;
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(snap(x + 6), topY + 12, snap(w - 12), snap(heightZ + h * 0.32), 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#a5f3fc';
    ctx.beginPath();
    ctx.roundRect(snap(x + w * 0.34), topY + 20, snap(w * 0.32), snap(heightZ + h * 0.14), 8);
    ctx.fill();

    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    ctx.roundRect(snap(x + 2), topY, snap(w - 4), 18, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#67e8f9';
    ctx.fillRect(snap(x + w * 0.28), topY + 6, snap(w * 0.44), 4);
    ctx.restore();
    return;
  }

  if (variant === 'server_rack') {
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.78);
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x + w - 2, topY + 24);
    ctx.lineTo(x + w + 10, topY + 24);
    ctx.lineTo(x + w + 10, topY + totalH - 8);
    ctx.stroke();

    ctx.fillStyle = '#18212f';
    ctx.strokeStyle = '#0b1018';
    ctx.lineWidth = 2.4;
    ctx.fillRect(snap(x), topY, snap(w), totalH);
    ctx.strokeRect(snap(x), topY, snap(w), totalH);
    ctx.fillStyle = '#334155';
    ctx.fillRect(snap(x + 2), topY + 2, snap(w - 4), 12);

    const bayCount = 4;
    const bayW = (w - 14) / bayCount;
    for (let b = 0; b < bayCount; b++) {
      const bx = x + 6 + b * bayW;
      ctx.fillStyle = '#0f1623';
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1;
      ctx.fillRect(bx, topY + 18, bayW - 3, totalH - 24);
      ctx.strokeRect(bx, topY + 18, bayW - 3, totalH - 24);
      for (let row = 0; row < 6; row++) {
        const ly = topY + 23 + row * 10;
        const on = Math.sin(timeSec * 6 + b * 1.9 + row * 1.3) > -0.2;
        ctx.fillStyle = on ? (row % 2 === 0 ? '#00f5d4' : '#38bdf8') : '#1e293b';
        ctx.fillRect(bx + 3, ly, 4, 4);
      }
    }
    ctx.restore();
    return;
  }

  if (variant === 'turret_console') {
    const topY = snap(y - heightZ);
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.fillRect(snap(x - 6), snap(y + 4), snap(w + 12), snap(h * 0.72));
    ctx.strokeRect(snap(x - 6), snap(y + 4), snap(w + 12), snap(h * 0.72));

    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#0f172a';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(snap(x + w * 0.2), snap(y - 14), snap(w * 0.6), snap(h * 0.65), 6);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.roundRect(snap(x + w * 0.14), topY, snap(w * 0.72), 28, 7);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = '#0f172a';
    ctx.fillRect(snap(x + w * 0.24), topY + 9, snap(w * 0.52), 10);
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(snap(x + w * 0.28), topY + 11, 8, 6);
    ctx.fillRect(snap(x + w * 0.62), topY + 11, 8, 6);
    ctx.restore();
    return;
  }

  if (
    variant === 'keycap_nvda' ||
    variant === 'keycap_openai' ||
    variant === 'keycap_spacex' ||
    variant === 'keycap_anth'
  ) {
    const palette =
      variant === 'keycap_nvda'
        ? { side: '#14532d', top: '#16a34a', rim: '#4ade80', fg: '#ffffff', tag: 'NVDA' }
        : variant === 'keycap_openai'
        ? { side: '#94a3b8', top: '#f8fafc', rim: '#10a37f', fg: '#0f172a', tag: 'OPENAI' }
        : variant === 'keycap_spacex'
        ? { side: '#1e293b', top: '#0f172a', rim: '#38bdf8', fg: '#f8fafc', tag: 'SPACEX' }
        : { side: '#0369a1', top: '#0ea5e9', rim: '#7dd3fc', fg: '#082f49', tag: 'ANTHROPIC' };

    const hover = Math.sin(timeSec * 2.5 + x * 0.01) * 2.5;
    const topY = snap(y - heightZ + hover);

    ctx.strokeStyle = 'rgba(0, 229, 255, 0.55)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.68, w * 0.58, h * 0.34, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.fillStyle = palette.side;
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.roundRect(snap(x), topY + 12, snap(w), snap(heightZ + h * 0.58), 9);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = palette.top;
    ctx.strokeStyle = palette.rim;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(snap(x + 5), topY, snap(w - 10), snap(h * 0.8), 7);
    ctx.fill();
    ctx.stroke();

    const mCx = x + w / 2;
    const mCy = topY + h * 0.34;
    if (variant === 'keycap_openai') {
      const knot = requestRawImage(ASSET_URLS.OPENAI_KNOT);
      if (knot) {
        ctx.drawImage(knot, mCx - 13, mCy - 14, 26, 26);
      }
    } else if (variant === 'keycap_nvda') {
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.ellipse(mCx, mCy - 2, 13, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
    } else if (variant === 'keycap_spacex') {
      ctx.strokeStyle = palette.fg;
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(mCx - 11, mCy - 8);
      ctx.lineTo(mCx + 11, mCy + 5);
      ctx.moveTo(mCx + 13, mCy - 9);
      ctx.lineTo(mCx - 11, mCy + 5);
      ctx.stroke();
    } else {
      ctx.fillStyle = palette.fg;
      ctx.font = '800 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.fillText('A\\', mCx, mCy + 3);
    }

    ctx.fillStyle = palette.fg;
    ctx.font = '800 9px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText(palette.tag, mCx, topY + h * 0.71);
    ctx.restore();
    return;
  }

  if (variant === 'vibevibe_tower') {
    ctx.fillStyle = '#1e293b';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.2;
    ctx.fillRect(snap(x), snap(y - heightZ), snap(w), snap(heightZ + h * 0.72));
    ctx.strokeRect(snap(x), snap(y - heightZ), snap(w), snap(heightZ + h * 0.72));

    ctx.fillStyle = '#090b10';
    ctx.fillRect(snap(x + 6), snap(y - heightZ + 10), snap(w - 12), 38);
    const vibeImg = requestRawImage(ASSET_URLS.VIBEVIBE_LOGO);
    if (vibeImg) {
      ctx.drawImage(vibeImg, snap(x + 8), snap(y - heightZ + 13), snap(w - 16), 32);
    }
    ctx.fillStyle = '#67e8f9';
    ctx.font = '800 8.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('VIBEVIBE.FUN', x + w / 2, y - heightZ + 62);
    ctx.restore();
    return;
  }

  // Sci-Fi Tactical Command Console ('crt_desk')
  ctx.fillStyle = '#1e293b';
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 2.2;
  ctx.fillRect(snap(x), snap(y - 14), snap(w), snap(h * 0.82));
  ctx.strokeRect(snap(x), snap(y - 14), snap(w), snap(h * 0.82));

  ctx.fillStyle = '#334155';
  ctx.fillRect(snap(x + 8), snap(y - heightZ), 40, 28);
  ctx.strokeRect(snap(x + 8), snap(y - heightZ), 40, 28);
  ctx.fillStyle = '#061a23';
  ctx.fillRect(snap(x + 12), snap(y - heightZ + 4), 32, 20);
  ctx.fillStyle = '#00f5d4';
  ctx.font = '700 9px "JetBrains Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('CORE', x + 28, y - heightZ + 17);

  ctx.fillStyle = '#334155';
  ctx.fillRect(snap(x + 54), snap(y - heightZ + 2), 48, 26);
  ctx.strokeRect(snap(x + 54), snap(y - heightZ + 2), 48, 26);
  ctx.fillStyle = '#061a23';
  ctx.fillRect(snap(x + 58), snap(y - heightZ + 6), 40, 18);
  ctx.restore();
}
