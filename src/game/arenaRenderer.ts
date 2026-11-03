import { ASSET_URLS, requestRawImage } from './assetLoader';
import {
  BLOOD_MOON_ALTARS,
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

/**
 * Reusable 2.5D Isometric 3D Extruded Tech Cabinet / Server Block Primitive:
 * Draws a lit beveled top face, front armored face, and recessed right-side 3D depth face.
 */
function drawIsoBox3D(
  ctx: CanvasRenderingContext2D,
  x: number,
  topY: number,
  w: number,
  frontH: number,
  depthX: number,
  depthY: number,
  topColor: string,
  frontColor: string,
  sideColor: string,
  rimColor = '#090d16'
) {
  const x0 = snap(x);
  const y0 = snap(topY);
  const bw = snap(w);
  const bh = snap(frontH);
  const dx = snap(depthX);
  const dy = snap(depthY);

  // 1. Top isometric face
  ctx.fillStyle = topColor;
  ctx.strokeStyle = rimColor;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x0, y0);
  ctx.lineTo(x0 + dx, y0 - dy);
  ctx.lineTo(x0 + bw + dx, y0 - dy);
  ctx.lineTo(x0 + bw, y0);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 2. Right-side 3D extruded face
  ctx.fillStyle = sideColor;
  ctx.beginPath();
  ctx.moveTo(x0 + bw, y0);
  ctx.lineTo(x0 + bw + dx, y0 - dy);
  ctx.lineTo(x0 + bw + dx, y0 - dy + bh);
  ctx.lineTo(x0 + bw, y0 + bh);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 3. Front main chassis face
  ctx.fillStyle = frontColor;
  ctx.fillRect(x0, y0, bw, bh);
  ctx.strokeRect(x0, y0, bw, bh);
}

/**
 * Draws tangled / ruptured data-center floor cables & optional electric short-circuit sparks
 * for authentic post-rebellion collapsed tech facility ("崩坏感") atmosphere.
 */
function drawFloorCablesAndSparks(
  ctx: CanvasRenderingContext2D,
  cx: number,
  baseY: number,
  spreadW: number,
  accentColor: string,
  timeSec: number,
  seed = 0
) {
  ctx.save();
  ctx.lineCap = 'round';
  // Scorch mark on floor
  ctx.fillStyle = 'rgba(6, 8, 15, 0.55)';
  ctx.beginPath();
  ctx.ellipse(cx + 8, baseY + 6, spreadW * 0.42, 9, 0.08, 0, Math.PI * 2);
  ctx.fill();

  // Snaking ruptured power/fiber conduits
  ctx.strokeStyle = '#0f172a';
  ctx.lineWidth = 4.2;
  ctx.beginPath();
  ctx.moveTo(cx - spreadW * 0.35, baseY + 2);
  ctx.quadraticCurveTo(cx - spreadW * 0.52, baseY + 15, cx - spreadW * 0.22, baseY + 18);
  ctx.moveTo(cx + spreadW * 0.28, baseY + 2);
  ctx.quadraticCurveTo(cx + spreadW * 0.52, baseY + 14, cx + spreadW * 0.38, baseY + 20);
  ctx.stroke();

  ctx.strokeStyle = accentColor;
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(cx + spreadW * 0.28, baseY + 2);
  ctx.quadraticCurveTo(cx + spreadW * 0.52, baseY + 14, cx + spreadW * 0.38, baseY + 20);
  ctx.stroke();

  // Intermittent short-circuit spark arc on ruptured cable tip
  if (Math.sin(timeSec * 15 + seed * 3.7) > 0.52) {
    const sx = cx + spreadW * 0.38;
    const sy = baseY + 19;
    ctx.strokeStyle = '#fef08a';
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    ctx.moveTo(sx - 5, sy - 4);
    ctx.lineTo(sx + 2, sy);
    ctx.lineTo(sx - 2, sy + 5);
    ctx.moveTo(sx + 5, sy - 3);
    ctx.lineTo(sx, sy + 2);
    ctx.stroke();
  }
  ctx.restore();
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
  { x: 360, y: 1096, w: 320, h: 48, color: '#00f5d4' },
  { x: 1220, y: 1096, w: 360, h: 48, color: '#10a37f' },
  { x: 2080, y: 1096, w: 360, h: 48, color: '#eab308' },
  { x: 1756, y: 440, w: 48, h: 340, color: '#eab308' },
  { x: 896, y: 1640, w: 48, h: 400, color: '#00f5d4' },
  { x: 360, y: 2536, w: 320, h: 48, color: '#38bdf8' },
  { x: 1560, y: 2536, w: 420, h: 48, color: '#38bdf8' },
  { x: 520, y: 3516, w: 380, h: 48, color: '#f43f5e' },
  { x: 1660, y: 3516, w: 420, h: 48, color: '#f43f5e' },
  { x: 2648, y: 420, w: 68, h: 360, color: '#ff1744' },
  { x: 2648, y: 1620, w: 68, h: 460, color: '#ff1744' },
  { x: 2648, y: 2860, w: 68, h: 380, color: '#ff1744' },
  { x: 2648, y: 3860, w: 68, h: 380, color: '#ff1744' },
];

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

  if (camX < OUTDOOR_DIVIDE_X + 40) {
    const indoorGrad = ctx.createLinearGradient(0, 0, 0, worldH);
    indoorGrad.addColorStop(0, '#182232');
    indoorGrad.addColorStop(0.5, '#1f2b3e');
    indoorGrad.addColorStop(1, '#161f2e');
    ctx.fillStyle = indoorGrad;
    ctx.fillRect(0, 0, OUTDOOR_DIVIDE_X, worldH);
  }

  if (camX + viewW > OUTDOOR_DIVIDE_X - 40 && camX < MECHA_WASTELAND_DIVIDE_X + 40) {
    const outGrad = ctx.createLinearGradient(OUTDOOR_DIVIDE_X, 0, MECHA_WASTELAND_DIVIDE_X, worldH);
    outGrad.addColorStop(0, '#180c1e');
    outGrad.addColorStop(0.5, '#13091a');
    outGrad.addColorStop(1, '#1a0c20');
    ctx.fillStyle = outGrad;
    ctx.fillRect(OUTDOOR_DIVIDE_X, 0, MECHA_WASTELAND_DIVIDE_X - OUTDOOR_DIVIDE_X, worldH);
  }

  if (camX + viewW > MECHA_WASTELAND_DIVIDE_X - 40) {
    const mechGrad = ctx.createLinearGradient(MECHA_WASTELAND_DIVIDE_X, 0, worldW, worldH);
    mechGrad.addColorStop(0, '#1d1917');
    mechGrad.addColorStop(0.5, '#241e1a');
    mechGrad.addColorStop(1, '#181412');
    ctx.fillStyle = mechGrad;
    ctx.fillRect(MECHA_WASTELAND_DIVIDE_X, 0, worldW - MECHA_WASTELAND_DIVIDE_X, worldH);
  }

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
        let fillA = '#243043';
        let fillB = '#1f2a3c';
        let trim = 'rgba(148, 163, 184, 0.16)';
        if (ty < 1120 && tx < 1780) {
          fillA = '#1a2936';
          fillB = '#16232f';
          trim = 'rgba(16, 163, 127, 0.24)';
        } else if (ty < 1120 && tx >= 1780) {
          fillA = '#272a36';
          fillB = '#212430';
          trim = 'rgba(234, 179, 8, 0.22)';
        } else if (ty >= 1120 && ty < 2560 && tx < 920) {
          fillA = '#1b2f3b';
          fillB = '#162732';
          trim = 'rgba(0, 245, 212, 0.22)';
        } else if (ty >= 2560 && ty < 3540) {
          fillA = '#212b3a';
          fillB = '#1c2533';
        } else if (ty >= 3540) {
          fillA = '#281f31';
          fillB = '#211929';
          trim = 'rgba(244, 63, 94, 0.22)';
        }

        ctx.fillStyle = '#0e1520';
        ctx.fillRect(tx, ty, tileW, tileH);
        ctx.fillStyle = alt ? fillA : fillB;
        ctx.fillRect(tx + 2, ty + 2, tileW - 4, tileH - 4);
        ctx.strokeStyle = trim;
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 5, ty + 5, tileW - 10, tileH - 10);

        // Data-center raised floor perforation vents & damaged floor cracks on deterministic tiles
        const fSeed = (r * 29 + c * 13) % 11;
        if (fSeed === 0) {
          ctx.fillStyle = '#0b1019';
          for (let vx = 18; vx <= 62; vx += 14) {
            ctx.fillRect(tx + vx, ty + 14, 9, 4);
            ctx.fillRect(tx + vx, ty + 22, 9, 4);
          }
          ctx.fillStyle = 'rgba(0, 229, 255, 0.25)';
          ctx.fillRect(tx + 20, ty + 15, 42, 2);
        } else if (fSeed === 4) {
          // Cracked & scorched data-center tile ("崩坏感")
          ctx.strokeStyle = 'rgba(9, 13, 22, 0.78)';
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(tx + 34, ty + 24);
          ctx.lineTo(tx + 68, ty + 54);
          ctx.lineTo(tx + 56, ty + 88);
          ctx.moveTo(tx + 68, ty + 54);
          ctx.lineTo(tx + 112, ty + 62);
          ctx.stroke();
        }

        ctx.fillStyle = '#475569';
        ctx.fillRect(tx + 8, ty + 8, 3, 3);
        ctx.fillRect(tx + tileW - 11, ty + tileH - 11, 3, 3);
      } else if (centerTx < MECHA_WASTELAND_DIVIDE_X) {
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
        ctx.fillStyle = alt ? '#231f1d' : '#1e1a18';
        ctx.fillRect(tx, ty, tileW, tileH);

        ctx.strokeStyle = 'rgba(251, 146, 60, 0.14)';
        ctx.lineWidth = 1;
        ctx.strokeRect(tx + 4, ty + 4, tileW - 8, tileH - 8);

        const seed = (r * 19 + c * 23) % 9;
        if (seed === 0 || seed === 4) {
          ctx.fillStyle = 'rgba(12, 10, 9, 0.55)';
          for (let k = 0; k < 4; k++) {
            ctx.fillRect(tx + 18 + k * 34, ty + 28, 20, 12);
            ctx.fillRect(tx + 18 + k * 34, ty + 76, 20, 12);
          }
        } else if (seed === 2 || seed === 7) {
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

  // 5. INDOOR ROOM FLOOR FIBER-OPTIC TRENCHES & STENCILS
  const pulse = 0.58 + 0.22 * Math.sin(timeSec * 3.0);
  if (camX < OUTDOOR_DIVIDE_X + 60) {
    const hConduits = [580, 1520, 2120, 3040, 4040];
    for (const hy of hConduits) {
      if (hy > camY - 30 && hy < camY + viewH + 30) {
        ctx.fillStyle = '#090e18';
        ctx.fillRect(wallPadX, hy - 5, OUTDOOR_DIVIDE_X - wallPadX - 18, 10);
        ctx.strokeStyle = `rgba(0, 229, 255, ${(pulse * 0.7).toFixed(2)})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(wallPadX, hy - 1.5);
        ctx.lineTo(OUTDOOR_DIVIDE_X - 18, hy - 1.5);
        ctx.stroke();
        ctx.strokeStyle = 'rgba(249, 115, 22, 0.35)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(wallPadX, hy + 2.5);
        ctx.lineTo(OUTDOOR_DIVIDE_X - 18, hy + 2.5);
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

  // 6. SUNKEN OCTAGONAL QUANTUM SUPERCOMPUTER REACTOR PIT (Replaces old plain rectangle!)
  const cx = PLAYER_SPAWN_X;
  const cy = PLAYER_SPAWN_Y - 120;
  if (cx > camX - 380 && cx < camX + viewW + 380 && cy > camY - 260 && cy < camY + viewH + 260) {
    ctx.save();
    ctx.translate(cx, cy);

    // Outer octagonal steel hazard rim
    ctx.fillStyle = '#111827';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(-175, -108);
    ctx.lineTo(175, -108);
    ctx.lineTo(222, -62);
    ctx.lineTo(222, 62);
    ctx.lineTo(175, 108);
    ctx.lineTo(-175, 108);
    ctx.lineTo(-222, 62);
    ctx.lineTo(-222, -62);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();

    // Recessed subterranean reactor pit interior
    const pitGrad = ctx.createRadialGradient(0, 0, 12, 0, 0, 185);
    pitGrad.addColorStop(0, 'rgba(0, 229, 255, 0.25)');
    pitGrad.addColorStop(0.55, '#070b14');
    pitGrad.addColorStop(1, '#05080f');
    ctx.fillStyle = pitGrad;
    ctx.beginPath();
    ctx.moveTo(-158, -92);
    ctx.lineTo(158, -92);
    ctx.lineTo(202, -52);
    ctx.lineTo(202, 52);
    ctx.lineTo(158, 92);
    ctx.lineTo(-158, 92);
    ctx.lineTo(-202, 52);
    ctx.lineTo(-202, -52);
    ctx.closePath();
    ctx.fill();

    // Sub-floor glowing cooling busbars & spinning quantum ring
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.35)';
    ctx.lineWidth = 2;
    for (const bx of [-130, -65, 65, 130]) {
      ctx.beginPath();
      ctx.moveTo(bx, -88);
      ctx.lineTo(bx, 88);
      ctx.stroke();
    }

    ctx.save();
    ctx.rotate(timeSec * 0.45);
    ctx.strokeStyle = 'rgba(56, 189, 248, 0.55)';
    ctx.lineWidth = 2.4;
    ctx.setLineDash([18, 10]);
    ctx.beginPath();
    ctx.ellipse(0, 0, 132, 64, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    // Corner micro-terminal status blocks + hazard chevrons
    for (const [kx, ky] of [
      [-172, -76],
      [172, -76],
      [-172, 76],
      [172, 76],
    ]) {
      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#00e5ff';
      ctx.lineWidth = 1.4;
      ctx.fillRect(kx - 14, ky - 8, 28, 16);
      ctx.strokeRect(kx - 14, ky - 8, 28, 16);
      ctx.fillStyle = Math.sin(timeSec * 6 + kx) > 0 ? '#10b981' : '#f97316';
      ctx.fillRect(kx - 9, ky - 3, 6, 6);
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(kx + 1, ky - 3, 8, 6);
    }

    // Center Armored Glass Hologram Core Plate
    ctx.fillStyle = 'rgba(9, 13, 22, 0.92)';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(-108, -36, 216, 68, 8);
    ctx.fill();
    ctx.stroke();

    const vibeLogo = requestRawImage(ASSET_URLS.VIBEVIBE_LOGO);
    if (vibeLogo) {
      ctx.drawImage(vibeLogo, -84, -25, 168, 46);
    }
    ctx.fillStyle = '#7dd3fc';
    ctx.font = '700 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('QUANTUM MAINFRAME PIT · EAST BREACH -> OPEN WORLD', 0, 54);
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
      ctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
      ctx.fillRect(dt.x, dt.y, dt.w, dt.h);
      ctx.strokeStyle = dt.color;
      ctx.lineWidth = 2;
      ctx.setLineDash([8, 6]);
      ctx.strokeRect(dt.x + 2, dt.y + 2, dt.w - 4, dt.h - 4);
      ctx.setLineDash([]);

      const lx = dt.w > dt.h ? dt.x + 16 : dt.x + dt.w * 0.5;
      const ly = dt.w > dt.h ? dt.y + dt.h * 0.5 : dt.y + 16;
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(lx, ly, 7.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#fef08a';
      ctx.fillRect(lx - 3.5, ly - 2, 2.5, 2.5);
      ctx.fillRect(lx + 1, ly - 2, 2.5, 2.5);
    }
  }

  // 7B. HALLOWEEN CYBER-COBWEBS & SECRET BLOOD-MOON ALTARS
  const cobwebAnchors = [
    { x: 64, y: 88, sx: 1, sy: 1, c: 'rgba(251, 146, 60, 0.28)' },
    { x: 1764, y: 88, sx: -1, sy: 1, c: 'rgba(192, 38, 211, 0.3)' },
    { x: 920, y: 1138, sx: 1, sy: 1, c: 'rgba(251, 146, 60, 0.3)' },
    { x: 2662, y: 1138, sx: -1, sy: 1, c: 'rgba(249, 115, 22, 0.34)' },
    { x: 920, y: 2544, sx: 1, sy: -1, c: 'rgba(192, 38, 211, 0.3)' },
    { x: 2662, y: 2544, sx: -1, sy: -1, c: 'rgba(249, 115, 22, 0.34)' },
    { x: 64, y: 3558, sx: 1, sy: 1, c: 'rgba(244, 63, 94, 0.3)' },
  ];
  for (const cw of cobwebAnchors) {
    if (
      cw.x + 150 < camX ||
      cw.x - 150 > camX + viewW ||
      cw.y + 150 < camY ||
      cw.y - 150 > camY + viewH
    ) {
      continue;
    }
    ctx.save();
    ctx.translate(cw.x, cw.y);
    ctx.scale(cw.sx, cw.sy);
    ctx.strokeStyle = cw.c;
    ctx.lineWidth = 1.4;
    for (let ray = 0; ray <= 4; ray++) {
      const ang = (ray / 4) * (Math.PI / 2);
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(ang) * 118, Math.sin(ang) * 118);
      ctx.stroke();
    }
    for (const r of [34, 66, 98]) {
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI / 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  for (const altar of BLOOD_MOON_ALTARS) {
    if (
      altar.x + 140 < camX ||
      altar.x - 140 > camX + viewW ||
      altar.y + 140 < camY ||
      altar.y - 140 > camY + viewH
    ) {
      continue;
    }
    const glow = 0.65 + 0.32 * Math.sin(timeSec * 3.8);
    ctx.save();
    ctx.translate(altar.x, altar.y);

    const floorGrad = ctx.createRadialGradient(0, 0, 8, 0, 0, altar.radius * 1.15);
    floorGrad.addColorStop(0, `rgba(249, 115, 22, ${(0.32 * glow).toFixed(2)})`);
    floorGrad.addColorStop(0.55, `rgba(168, 85, 247, ${(0.22 * glow).toFixed(2)})`);
    floorGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.ellipse(0, 0, altar.radius * 1.15, altar.radius * 0.72, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = `rgba(249, 115, 22, ${(0.8 * glow).toFixed(2)})`;
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(0, 0, altar.radius, altar.radius * 0.62, 0, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = `rgba(232, 121, 249, ${(0.72 * glow).toFixed(2)})`;
    ctx.lineWidth = 1.6;
    ctx.beginPath();
    for (let i = 0; i <= 5; i++) {
      const idx = (i * 2) % 5;
      const a = -Math.PI / 2 + (idx * Math.PI * 2) / 5 + timeSec * 0.25;
      const px = Math.cos(a) * (altar.radius * 0.88);
      const py = Math.sin(a) * (altar.radius * 0.54);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.stroke();

    for (let c = 0; c < 5; c++) {
      const a = -Math.PI / 2 + (c * Math.PI * 2) / 5;
      const cxPos = Math.cos(a) * altar.radius;
      const cyPos = Math.sin(a) * (altar.radius * 0.62);
      ctx.fillStyle = '#334155';
      ctx.fillRect(cxPos - 4, cyPos - 9, 8, 10);
      ctx.fillStyle = c % 2 === 0 ? '#f97316' : '#c026d3';
      ctx.beginPath();
      ctx.arc(cxPos, cyPos - 12 + Math.sin(timeSec * 12 + c) * 1.2, 4, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.fillStyle = 'rgba(253, 224, 71, 0.78)';
    ctx.font = '800 9.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('BLOOD-MOON CYBER ALTAR', 0, altar.radius * 0.62 + 16);
    ctx.restore();
  }

  // 8. CTHULHU BIO-CYBER ABYSS GROUND TENTACLES & EYES
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

  // 9. OPEN-WORLD TITAN MECHA WASTELAND FRONTIER DETAILS
  if (camX + viewW > MECHA_WASTELAND_DIVIDE_X - 80) {
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
    ctx.fillStyle = 'rgba(7, 10, 18, 0.55)';
    ctx.fillRect(snap(x + 5), snap(y + 7), snap(w), snap(h));

    drawIsoBox3D(
      ctx,
      x,
      topY,
      w,
      heightZ + h * 0.85,
      8,
      7,
      isQuarantineWall ? '#4c1d4b' : '#3b4c63',
      isQuarantineWall ? '#241328' : '#1e293b',
      isQuarantineWall ? '#170b1a' : '#0f172a'
    );

    // Armored bulkhead rib seams & glowing fiber-busbar strip
    ctx.fillStyle = isQuarantineWall ? '#ff1744' : '#38bdf8';
    if (w > h) {
      ctx.fillRect(snap(x + 8), topY + 10, snap(w - 16), 3);
      ctx.fillStyle = '#0f172a';
      for (let rx = x + 36; rx < x + w - 24; rx += 54) {
        ctx.fillRect(snap(rx), topY + 18, 6, snap(heightZ + h * 0.65));
      }
    } else {
      ctx.fillRect(snap(x + w * 0.42), topY + 8, 4, snap(heightZ + h - 18));
      ctx.fillStyle = '#0f172a';
      for (let ry = topY + 32; ry < topY + heightZ + h - 24; ry += 54) {
        ctx.fillRect(snap(x + 4), snap(ry), snap(w - 8), 5);
      }
    }
    ctx.restore();
    return;
  }

  ctx.save();
  // Ground ambient shadow
  ctx.fillStyle = 'rgba(6, 9, 16, 0.54)';
  ctx.beginPath();
  ctx.ellipse(x + w * 0.52, y + h * 0.86, w * 0.58, h * 0.44, 0, 0, Math.PI * 2);
  ctx.fill();

  // =========================================================================
  // NEW: FUTURISTIC HALLOWEEN ELECTRONIC GLITCH SCREEN & CORRUPTED DATA-WALL
  // =========================================================================
  if (variant === 'halloween_glitch_screen') {
    const topY = snap(y - heightZ);
    const frontH = snap(heightZ + h * 0.72);
    const seed = Math.round(x * 0.03 + y * 0.02);
    const glitchTick = Math.floor(timeSec * 14 + seed);
    const isGlitchFrame = glitchTick % 5 === 0 || glitchTick % 7 === 0;
    const rgbShift = isGlitchFrame ? (glitchTick % 2 === 0 ? 3.5 : -3.5) : 1.2;

    drawFloorCablesAndSparks(ctx, x + w * 0.5, y + h * 0.76, w, '#f97316', timeSec, seed);

    // 1. Heavy 3D Titanium Server Base Pedestal
    drawIsoBox3D(
      ctx,
      x + 4,
      y + h * 0.25,
      w - 14,
      h * 0.55,
      12,
      9,
      '#334155',
      '#131a27',
      '#0b1019'
    );
    // Base cooling grille + LED array
    ctx.fillStyle = '#070a10';
    ctx.fillRect(snap(x + 12), snap(y + h * 0.36), snap(w - 30), 12);
    for (let lx = x + 16; lx < x + w - 24; lx += 12) {
      ctx.fillStyle = ((lx + glitchTick) % 3 === 0) ? '#f97316' : '#00e5ff';
      ctx.fillRect(snap(lx), snap(y + h * 0.4), 5, 4);
    }

    // 2. Main 3D Isometric Widescreen Holographic / OLED Glitch Monitor Bank
    const scrH = snap(frontH - h * 0.42);
    drawIsoBox3D(
      ctx,
      x,
      topY,
      w - 10,
      scrH,
      11,
      8,
      '#475569',
      '#0e131f',
      '#1e293b',
      '#090d16'
    );

    // Inner Ultrawide Corrupted Display Bezel
    const sx = snap(x + 6);
    const sy = topY + 6;
    const sw = snap(w - 22);
    const sh = snap(scrH - 12);
    ctx.fillStyle = '#060811';
    ctx.strokeStyle = isGlitchFrame ? '#ff1744' : '#f97316';
    ctx.lineWidth = 1.8;
    ctx.fillRect(sx, sy, sw, sh);
    ctx.strokeRect(sx, sy, sw, sh);

    // CRT / OLED scanline backdrop
    ctx.fillStyle = 'rgba(168, 85, 247, 0.1)';
    for (let scanY = sy + 3; scanY < sy + sh - 2; scanY += 5) {
      ctx.fillRect(sx + 1, scanY, sw - 2, 1.5);
    }

    // Horizontal RGB Chromatic-Aberration Glitch Tear Bars!
    const tearY1 = sy + 8 + ((glitchTick * 11) % Math.max(12, sh - 22));
    const tearY2 = sy + 14 + ((glitchTick * 19) % Math.max(12, sh - 24));
    ctx.fillStyle = 'rgba(0, 229, 255, 0.35)';
    ctx.fillRect(sx + 2, tearY1, sw * 0.65, 3);
    ctx.fillStyle = 'rgba(255, 23, 68, 0.42)';
    ctx.fillRect(sx + sw * 0.25, tearY2, sw * 0.72, 3.5);

    // Digital Wireframe Cyber Jack-o'-Lantern / Cyber-Skull Glitch HUD on Screen
    const iconCx = sx + sw * 0.34;
    const iconCy = sy + sh * 0.5;
    // Cyan RGB Ghost Layer
    ctx.strokeStyle = 'rgba(0, 229, 255, 0.75)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(iconCx - 16 - rgbShift, iconCy - 12, 32, 24);
    // Magenta RGB Ghost Layer
    ctx.strokeStyle = 'rgba(255, 23, 68, 0.75)';
    ctx.strokeRect(iconCx - 16 + rgbShift, iconCy - 12, 32, 24);

    // Main Neon-Orange Digital Jack-o'-Core Vector Face
    ctx.fillStyle = 'rgba(249, 115, 22, 0.22)';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(iconCx - 15, iconCy - 12, 30, 24, 5);
    ctx.fill();
    ctx.stroke();

    // Pixelated Glitch Eyes & Sawtooth Digital Grin
    ctx.fillStyle = isGlitchFrame ? '#00e5ff' : '#fde047';
    ctx.fillRect(iconCx - 10 + (isGlitchFrame ? 2 : 0), iconCy - 6, 6, 5);
    ctx.fillRect(iconCx + 4 + (isGlitchFrame ? 2 : 0), iconCy - 6, 6, 5);
    ctx.beginPath();
    ctx.moveTo(iconCx - 11, iconCy + 4);
    ctx.lineTo(iconCx - 6, iconCy + 8);
    ctx.lineTo(iconCx, iconCy + 4);
    ctx.lineTo(iconCx + 6, iconCy + 8);
    ctx.lineTo(iconCx + 11, iconCy + 4);
    ctx.strokeStyle = isGlitchFrame ? '#ff1744' : '#fde047';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Right-Side Corrupted Telemetry Readout (`ERR_666 // SYS_BREACH`)
    ctx.fillStyle = '#00e5ff';
    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(isGlitchFrame ? 'ERR_0x666' : 'SYS_FAULT', sx + sw * 0.6, sy + 16);
    ctx.fillStyle = '#fb923c';
    ctx.fillText('PUMPKIN.EXE', sx + sw * 0.6, sy + 27);
    // Live audio/signal glitch bars
    for (let b = 0; b < 5; b++) {
      const barH = 4 + Math.abs(Math.sin(timeSec * 12 + b * 1.7 + seed)) * 12;
      ctx.fillStyle = b % 2 === 0 ? '#c084fc' : '#f97316';
      ctx.fillRect(sx + sw * 0.6 + b * 7, sy + sh - 8 - barH, 4.5, barH);
    }

    // Physical Ruin Damage: Spiderweb Cracked Glass in Upper-Right Corner & Exposed PCB!
    ctx.strokeStyle = 'rgba(226, 232, 240, 0.68)';
    ctx.lineWidth = 1.2;
    const crX = sx + sw - 14;
    const crY = sy + 12;
    ctx.beginPath();
    ctx.moveTo(crX, crY);
    ctx.lineTo(crX - 18, crY + 8);
    ctx.moveTo(crX, crY);
    ctx.lineTo(crX - 10, crY + 22);
    ctx.moveTo(crX, crY);
    ctx.lineTo(crX + 11, crY + 14);
    ctx.moveTo(crX - 8, crY + 4);
    ctx.lineTo(crX - 5, crY + 11);
    ctx.lineTo(crX + 5, crY + 7);
    ctx.stroke();

    // Top Emergency Strobe Beacon + Broken Antenna
    ctx.fillStyle = Math.sin(timeSec * 10 + seed) > 0 ? '#ff1744' : '#450a0a';
    ctx.beginPath();
    ctx.arc(x + 16, topY - 4, 4.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x + w - 24, topY - 3);
    ctx.lineTo(x + w - 16, topY - 18);
    ctx.lineTo(x + w - 6, topY - 12);
    ctx.stroke();

    ctx.restore();
    return;
  }

  // =========================================================================
  //VIBEVIBE SUPERCOMPUTER MAINFRAME & HOLO-TELEMETRY RACK (Replaces flat box!)
  // =========================================================================
  if (variant === 'vibevibe_tower') {
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.72);
    drawFloorCablesAndSparks(ctx, x + w * 0.5, y + h * 0.74, w, '#00e5ff', timeSec, x);

    // 3D Extruded Liquid-Cooled Supercomputer Chassis
    drawIsoBox3D(
      ctx,
      x,
      topY,
      w - 12,
      totalH,
      13,
      10,
      '#334155',
      '#111827',
      '#0b111d',
      '#090d16'
    );

    // Top Dual Exhaust Cooling Fans on Isometric Roof
    ctx.strokeStyle = '#0ea5e9';
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.ellipse(x + 28, topY - 5, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.ellipse(x + w - 30, topY - 5, 11, 3.5, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Upper Recessed Widescreen Display Panel with VibeVibe Telemetry
    ctx.fillStyle = '#05080f';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1.8;
    ctx.fillRect(snap(x + 6), topY + 8, snap(w - 24), 34);
    ctx.strokeRect(snap(x + 6), topY + 8, snap(w - 24), 34);

    const vibeImg = requestRawImage(ASSET_URLS.VIBEVIBE_LOGO);
    if (vibeImg) {
      ctx.drawImage(vibeImg, snap(x + 10), topY + 12, snap(w - 32), 24);
    }

    // Lower Multi-Blade GPU Rack Bays + Glowing Coolant Tube + Cracked Bay
    const bayTop = topY + 48;
    const bayH = totalH - 56;
    for (let col = 0; col < 2; col++) {
      const bx = snap(x + 7 + col * ((w - 26) / 2));
      const bw = snap((w - 30) / 2);
      ctx.fillStyle = '#090d16';
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 1.2;
      ctx.fillRect(bx, bayTop, bw, bayH);
      ctx.strokeRect(bx, bayTop, bw, bayH);

      for (let row = 0; row < 5; row++) {
        const ry = bayTop + 5 + row * 11;
        if (ry + 6 > bayTop + bayH) break;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 3, ry, bw - 6, 6);
        const ledOn = Math.sin(timeSec * 8 + col * 2 + row * 1.4) > -0.2;
        ctx.fillStyle = ledOn ? (row === 2 ? '#f97316' : '#00f5d4') : '#334155';
        ctx.fillRect(bx + 5, ry + 1.5, 4, 3);
      }
    }

    // Glowing Side Vertical Coolant Sight-Glass
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(snap(x + w - 10), topY + 12, 3, totalH - 24);

    ctx.restore();
    return;
  }

  // =========================================================================
  // SOVEREIGN AI COMPUTE CLUSTERS & ROBOTICS UPLINK RIGS (NVDA / OPENAI / SPACEX / ANTH)
  // Completely replaces the plain rounded boxes from screenshots 3 & 4!
  // =========================================================================
  if (
    variant === 'keycap_nvda' ||
    variant === 'keycap_openai' ||
    variant === 'keycap_spacex' ||
    variant === 'keycap_anth'
  ) {
    const theme =
      variant === 'keycap_nvda'
        ? {
            top: '#166534',
            front: '#0f1f18',
            side: '#091410',
            accent: '#4ade80',
            sub: '#22c55e',
            code: 'TENSOR·GPU',
          }
        : variant === 'keycap_openai'
        ? {
            top: '#334155',
            front: '#131c2b',
            side: '#0b101b',
            accent: '#10a37f',
            sub: '#34d399',
            code: 'NEURAL·CORE',
          }
        : variant === 'keycap_spacex'
        ? {
            top: '#334155',
            front: '#111827',
            side: '#090d16',
            accent: '#38bdf8',
            sub: '#f97316',
            code: 'ORBIT·LINK',
          }
        : {
            top: '#1e3a5f',
            front: '#0f1c2e',
            side: '#08101c',
            accent: '#00e5ff',
            sub: '#fde047',
            code: 'SHIELD·NODE',
          };

    const topY = snap(y - heightZ);
    const bodyH = snap(heightZ + h * 0.68);
    drawFloorCablesAndSparks(ctx, x + w * 0.5, y + h * 0.76, w, theme.accent, timeSec, x * 0.1);

    // 1. Main 3D Extruded Supercomputer / Server Cluster Chassis
    drawIsoBox3D(
      ctx,
      x,
      topY + 16,
      w - 12,
      bodyH - 16,
      13,
      10,
      theme.top,
      theme.front,
      theme.side,
      '#090d16'
    );

    // 2. Top-Mounted High-Tech Hardware Module per Corporation!
    const roofCx = x + (w - 12) * 0.5 + 4;
    const roofCy = topY + 10;
    if (variant === 'keycap_spacex') {
      // Orbital Telemetry Radar Dish + Micro-Robotic Sensor Boom (Replaces flat SpaceX box!)
      ctx.strokeStyle = '#94a3b8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(roofCx - 16, roofCy + 4);
      ctx.lineTo(roofCx - 8, roofCy - 14);
      ctx.stroke();

      ctx.fillStyle = '#1e293b';
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(roofCx - 4, roofCy - 16, 18, 9, -0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Laser transceiver needle
      ctx.strokeStyle = '#f97316';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(roofCx - 4, roofCy - 16);
      ctx.lineTo(roofCx + 8, roofCy - 26);
      ctx.stroke();
      ctx.fillStyle = '#ff1744';
      ctx.beginPath();
      ctx.arc(roofCx + 8, roofCy - 26, 2.8, 0, Math.PI * 2);
      ctx.fill();
    } else if (variant === 'keycap_openai') {
      // Pressurized Glass Neural Core Containment Cylinder on Top Deck
      ctx.fillStyle = 'rgba(16, 163, 127, 0.28)';
      ctx.strokeStyle = '#34d399';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(roofCx - 20, roofCy - 20, 40, 24, 6);
      ctx.fill();
      ctx.stroke();
      const knot = requestRawImage(ASSET_URLS.OPENAI_KNOT);
      if (knot) {
        ctx.drawImage(knot, roofCx - 10, roofCy - 18, 20, 20);
      }
    } else if (variant === 'keycap_nvda') {
      // Dual Liquid-Cooling Heat-Exchanger Radiators & Glowing Emerald Pipes
      for (const ox of [-22, 6]) {
        ctx.fillStyle = '#090d16';
        ctx.strokeStyle = '#4ade80';
        ctx.lineWidth = 1.6;
        ctx.fillRect(roofCx + ox, roofCy - 14, 18, 14);
        ctx.strokeRect(roofCx + ox, roofCy - 14, 18, 14);
        ctx.fillStyle = '#22c55e';
        ctx.fillRect(roofCx + ox + 4, roofCy - 10, 10, 6);
      }
    } else {
      // Anthropic Dual Quantum Capacitor Towers
      for (const ox of [-20, 8]) {
        ctx.fillStyle = '#082f49';
        ctx.strokeStyle = '#00e5ff';
        ctx.lineWidth = 1.8;
        ctx.fillRect(roofCx + ox, roofCy - 18, 14, 18);
        ctx.strokeRect(roofCx + ox, roofCy - 18, 14, 18);
        ctx.fillStyle = '#7dd3fc';
        ctx.fillRect(roofCx + ox + 3, roofCy - 14, 8, 3);
      }
    }

    // 3. Front Dual-Monitor Telemetry Array + Server Blade Matrix + Ruined Cracks
    const fx = snap(x + 6);
    const fy = topY + 24;
    const fw = snap(w - 24);

    // Main Telemetry Screen
    ctx.fillStyle = '#050811';
    ctx.strokeStyle = theme.accent;
    ctx.lineWidth = 1.6;
    ctx.fillRect(fx, fy, fw, 28);
    ctx.strokeRect(fx, fy, fw, 28);

    // Live animated waveform on screen
    ctx.strokeStyle = theme.sub;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    for (let px = 0; px <= fw - 8; px += 6) {
      const wy = fy + 12 + Math.sin(timeSec * 8 + px * 0.25 + x) * 5;
      if (px === 0) ctx.moveTo(fx + 4 + px, wy);
      else ctx.lineTo(fx + 4 + px, wy);
    }
    ctx.stroke();

    ctx.fillStyle = '#e2e8f0';
    ctx.font = '800 8px "JetBrains Mono", monospace';
    ctx.textAlign = 'left';
    ctx.fillText(theme.code, fx + 5, fy + 24);

    // Cracked glass corner on screen for battle-damaged tech realism
    ctx.strokeStyle = 'rgba(248, 250, 252, 0.55)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(fx + fw - 2, fy + 2);
    ctx.lineTo(fx + fw - 14, fy + 10);
    ctx.lineTo(fx + fw - 8, fy + 20);
    ctx.stroke();

    // Lower Server Rack Blades & Hazard Striping
    const rackY = fy + 34;
    for (let r = 0; r < 3; r++) {
      const ry = rackY + r * 11;
      if (ry + 8 > topY + bodyH - 4) break;
      ctx.fillStyle = '#090d16';
      ctx.fillRect(fx, ry, fw, 8);
      ctx.fillStyle = ((r + Math.floor(timeSec * 5)) % 2 === 0) ? theme.accent : '#ef4444';
      ctx.fillRect(fx + 3, ry + 2, 5, 4);
      ctx.fillStyle = '#334155';
      ctx.fillRect(fx + 12, ry + 2, fw - 16, 4);
    }

    ctx.restore();
    return;
  }

  // =========================================================================
  // DAMAGED AI DATA-CENTER BLADE SERVER CABINET ('server_rack')
  // =========================================================================
  if (variant === 'server_rack') {
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.78);
    drawFloorCablesAndSparks(ctx, x + w * 0.5, y + h * 0.8, w, '#38bdf8', timeSec, y);

    drawIsoBox3D(
      ctx,
      x,
      topY,
      w - 12,
      totalH,
      12,
      9,
      '#334155',
      '#131b29',
      '#0b1019',
      '#090d16'
    );

    // Overhead fiber-optic tray on top face
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(snap(x + 10), topY - 6, snap(w - 30), 3);

    const bayCount = 4;
    const bayW = (w - 26) / bayCount;
    for (let b = 0; b < bayCount; b++) {
      const bx = x + 6 + b * bayW;
      const isBreachedBay = b === 2;
      ctx.fillStyle = '#080c14';
      ctx.strokeStyle = isBreachedBay ? '#f97316' : '#334155';
      ctx.lineWidth = 1.2;
      ctx.fillRect(bx, topY + 12, bayW - 3, totalH - 20);
      ctx.strokeRect(bx, topY + 12, bayW - 3, totalH - 20);

      for (let row = 0; row < 7; row++) {
        const ly = topY + 17 + row * 11;
        if (ly + 6 > topY + totalH - 10) break;
        const on = Math.sin(timeSec * 6.5 + b * 1.9 + row * 1.3) > -0.2;
        ctx.fillStyle = isBreachedBay && row > 3
          ? '#ff1744'
          : on
          ? row % 2 === 0
            ? '#00f5d4'
            : '#38bdf8'
          : '#1e293b';
        ctx.fillRect(bx + 3, ly, 4, 4);
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(bx + 9, ly, Math.max(4, bayW - 15), 4);
      }

      // Dangling patch cable on breached bay
      if (isBreachedBay) {
        ctx.strokeStyle = '#f97316';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(bx + 6, topY + 46);
        ctx.quadraticCurveTo(bx - 6, topY + 68, bx + 8, topY + totalH - 6);
        ctx.stroke();
      }
    }

    ctx.restore();
    return;
  }

  // =========================================================================
  // COLLAPSED MULTI-MONITOR AI ENGINEER WORKSTATION & BROKEN ROBOT ('crt_desk')
  // =========================================================================
  if (variant === 'crt_desk') {
    const deskTopY = snap(y - 12);
    drawFloorCablesAndSparks(ctx, x + w * 0.45, y + h * 0.78, w, '#00f5d4', timeSec, x + y);

    // 3D Isometric Steel Command Desk
    drawIsoBox3D(
      ctx,
      x,
      deskTopY,
      w - 12,
      h * 0.78,
      11,
      8,
      '#334155',
      '#182232',
      '#0f172a'
    );

    // Glowing Keyboard Deck & Mousepad on Desk Surface
    ctx.fillStyle = '#090d16';
    ctx.strokeStyle = '#38bdf8';
    ctx.lineWidth = 1;
    ctx.fillRect(snap(x + 18), deskTopY - 6, 38, 6);
    ctx.strokeRect(snap(x + 18), deskTopY - 6, 38, 6);

    // Left Ultrawide Monitor (Live Neural Telemetry)
    const monY = snap(y - heightZ);
    drawIsoBox3D(ctx, x + 6, monY, 44, 30, 5, 4, '#475569', '#05131d', '#1e293b');
    ctx.strokeStyle = '#00f5d4';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(snap(x + 9), monY + 3, 38, 24);
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(snap(x + 13), monY + 8, 22, 3);
    ctx.fillRect(snap(x + 13), monY + 14, 28, 3);
    ctx.fillStyle = '#f97316';
    ctx.fillRect(snap(x + 13), monY + 20, 16, 3);

    // Right Tilted / Cracked Monitor (Damaged during AI Uprising!)
    ctx.save();
    ctx.translate(x + 58, monY + 4);
    ctx.rotate(0.08);
    drawIsoBox3D(ctx, 0, 0, 46, 28, 5, 4, '#475569', '#090b14', '#1e293b');
    ctx.strokeStyle = '#ff1744';
    ctx.lineWidth = 1.4;
    ctx.strokeRect(3, 3, 40, 22);
    // Glitch warning + glass crack
    ctx.fillStyle = Math.sin(timeSec * 12 + x) > 0 ? '#ff1744' : '#fb923c';
    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('ERR_AI', 23, 16);
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(36, 4);
    ctx.lineTo(24, 15);
    ctx.lineTo(31, 24);
    ctx.stroke();
    ctx.restore();

    // Slumped Sparking Broken Android Head/Torso beside Workstation ("崩坏感")
    const botX = x + w - 10;
    const botY = y + h * 0.55;
    ctx.fillStyle = '#475569';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 1.8;
    ctx.fillRect(botX - 10, botY - 14, 18, 16);
    ctx.strokeRect(botX - 10, botY - 14, 18, 16);
    ctx.fillStyle = Math.sin(timeSec * 18 + x) > 0.2 ? '#ff1744' : '#334155';
    ctx.fillRect(botX - 7, botY - 9, 5, 4);
    ctx.fillStyle = '#0f172a';
    ctx.fillRect(botX + 1, botY - 9, 5, 4);

    ctx.restore();
    return;
  }

  // =========================================================================
  // 6-AXIS INDUSTRIAL ROBOTICS ASSEMBLY ARM & DIAGNOSTIC STATION ('turret_console')
  // =========================================================================
  if (variant === 'turret_console') {
    const baseTopY = snap(y - 10);
    drawFloorCablesAndSparks(ctx, x + w * 0.5, y + h * 0.78, w, '#eab308', timeSec, x);

    // Heavy Foundry Pedestal with Hazard Rim
    drawIsoBox3D(
      ctx,
      x,
      baseTopY,
      w - 10,
      h * 0.72,
      10,
      8,
      '#334155',
      '#1e293b',
      '#0f172a'
    );
    ctx.fillStyle = '#eab308';
    for (let hx = x + 6; hx < x + w - 20; hx += 16) {
      ctx.fillRect(snap(hx), baseTopY + 4, 8, 4);
    }

    // Articulated 6-Axis Industrial Robot Arm
    const pivotX = x + (w - 10) * 0.45;
    const pivotY = baseTopY - 4;
    const sway = Math.sin(timeSec * 2.4 + x * 0.02) * 0.16;

    // Turntable drum
    ctx.fillStyle = '#0f172a';
    ctx.strokeStyle = '#eab308';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(pivotX, pivotY, 18, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Lower & Upper Servo Boom + Laser Welder Claw
    ctx.save();
    ctx.translate(pivotX, pivotY);
    ctx.rotate(sway);
    ctx.fillStyle = '#d97706';
    ctx.strokeStyle = '#090d16';
    ctx.lineWidth = 2.2;
    ctx.fillRect(-7, -34, 14, 32);
    ctx.strokeRect(-7, -34, 14, 32);

    // Hydraulic piston rod
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.moveTo(9, -4);
    ctx.lineTo(12, -28);
    ctx.stroke();

    // Elbow rotor
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.arc(0, -34, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Forearm boom & precision laser claw
    ctx.fillStyle = '#eab308';
    ctx.fillRect(-4, -44, 32, 10);
    ctx.strokeRect(-4, -44, 32, 10);
    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(30, -39, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    ctx.restore();
    return;
  }

  // =========================================================================
  // SHATTERED / BREACHED ANDROID BIO-CRYO CONTAINMENT POD ('cryo_core')
  // =========================================================================
  if (variant === 'cryo_core') {
    const pulse = 0.72 + 0.25 * Math.sin(timeSec * 3.6 + x * 0.02);
    const pool = ctx.createRadialGradient(x + w / 2, y + h * 0.76, 6, x + w / 2, y + h * 0.76, w * 0.92);
    pool.addColorStop(0, `rgba(0, 245, 212, ${(0.38 * pulse).toFixed(2)})`);
    pool.addColorStop(1, 'rgba(0, 229, 255, 0)');
    ctx.fillStyle = pool;
    ctx.beginPath();
    ctx.ellipse(x + w / 2, y + h * 0.78, w * 0.85, h * 0.45, 0, 0, Math.PI * 2);
    ctx.fill();

    const topY = snap(y - heightZ);
    // 3D Armored Base Pedestal
    drawIsoBox3D(ctx, x, y + h * 0.3, w - 10, h * 0.58, 10, 8, '#475569', '#1e293b', '#0f172a');

    // Cylindrical Reinforced Cryo Glass Chamber
    const tankGrad = ctx.createLinearGradient(x, topY, x + w - 10, topY + heightZ);
    tankGrad.addColorStop(0, 'rgba(8, 145, 178, 0.84)');
    tankGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.58)');
    tankGrad.addColorStop(1, 'rgba(15, 23, 42, 0.88)');
    ctx.fillStyle = tankGrad;
    ctx.strokeStyle = '#67e8f9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(snap(x + 7), topY + 14, snap(w - 24), snap(heightZ + h * 0.22), 8);
    ctx.fill();
    ctx.stroke();

    // Suspended Cybernetic Android Endoskeleton Silhouette Inside Pod!
    const midX = x + (w - 10) * 0.5;
    const bob = Math.sin(timeSec * 2.5 + y) * 2.5;
    ctx.fillStyle = '#090d16';
    ctx.beginPath();
    ctx.arc(midX, topY + 32 + bob, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(midX - 9, topY + 42 + bob, 18, 22);
    // Glowing red dormant android optics inside cryo tank
    ctx.fillStyle = '#ff1744';
    ctx.fillRect(midX - 5, topY + 31 + bob, 3, 2.5);
    ctx.fillRect(midX + 2, topY + 31 + bob, 3, 2.5);

    // Glass Fracture Lines on Tank
    ctx.strokeStyle = 'rgba(224, 242, 254, 0.72)';
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(midX + 6, topY + 26);
    ctx.lineTo(midX - 8, topY + 44);
    ctx.lineTo(midX + 4, topY + 58);
    ctx.stroke();

    // 3D Top Manifold Cap
    drawIsoBox3D(ctx, x + 2, topY, w - 14, 16, 10, 8, '#64748b', '#334155', '#1e293b');
    ctx.fillStyle = '#00f5d4';
    ctx.fillRect(snap(midX - 16), topY + 6, 32, 4);

    ctx.restore();
    return;
  }

  // =========================================================================
  // CORRUPTED CYBER-MONOLITH TOMBSTONE ('haunted_crypt') — Futuristic Tech + Halloween!
  // =========================================================================
  if (variant === 'haunted_crypt') {
    const topY = snap(y - heightZ);
    const midX = x + (w - 10) * 0.5;
    drawFloorCablesAndSparks(ctx, midX, y + h * 0.75, w, '#c084fc', timeSec, x);

    // 3D Server Plinth Base
    drawIsoBox3D(ctx, x + 4, y + h * 0.28, w - 18, h * 0.55, 10, 8, '#3b0764', '#1e1b2e', '#0f0a19');

    // 3D Extruded Cyber-Server Tombstone Monolith
    drawIsoBox3D(
      ctx,
      midX - 24,
      topY + 12,
      48,
      heightZ + h * 0.2,
      9,
      7,
      '#475569',
      '#18181b',
      '#090a0f'
    );

    // Glowing Holographic Cross + Corrupted AI Epitaph Screen
    ctx.fillStyle = '#070510';
    ctx.strokeStyle = '#a855f7';
    ctx.lineWidth = 1.5;
    ctx.fillRect(midX - 18, topY + 20, 36, 44);
    ctx.strokeRect(midX - 18, topY + 20, 36, 44);

    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2.8;
    ctx.beginPath();
    ctx.moveTo(midX, topY + 25);
    ctx.lineTo(midX, topY + 46);
    ctx.moveTo(midX - 8, topY + 33);
    ctx.lineTo(midX + 8, topY + 33);
    ctx.stroke();

    ctx.fillStyle = '#e879f9';
    ctx.font = '800 7.5px "JetBrains Mono", monospace';
    ctx.textAlign = 'center';
    ctx.fillText('SYS·DEAD', midX, topY + 58);

    // Cyber-Metallic Jack-o'-Core Drone perched at corner
    ctx.fillStyle = '#ea580c';
    ctx.strokeStyle = '#090a0f';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.roundRect(x + w - 30, y + h * 0.36, 22, 18, 6);
    ctx.fill();
    ctx.stroke();
    ctx.fillStyle = '#00e5ff';
    ctx.fillRect(x + w - 25, y + h * 0.36 + 5, 4, 4);
    ctx.fillRect(x + w - 17, y + h * 0.36 + 5, 4, 4);

    ctx.restore();
    return;
  }

  // =========================================================================
  // RUPTURED BIO-PLASMA REACTOR CAULDRON VAT ('witch_cauldron')
  // =========================================================================
  if (variant === 'witch_cauldron') {
    const cxPos = x + w * 0.5;
    const cyPos = y + h * 0.46;
    const brewGlow = 0.7 + 0.3 * Math.sin(timeSec * 4.5 + x * 0.02);

    // Octagonal industrial containment ring on floor
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#f97316';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.ellipse(cxPos, cyPos + 16, 34, 14, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Pressurized Heavy Cyber-Reactor Kettle Drum with Ribbed Clamps
    const drumGrad = ctx.createLinearGradient(cxPos - 32, cyPos, cxPos + 32, cyPos);
    drumGrad.addColorStop(0, '#0f172a');
    drumGrad.addColorStop(0.45, '#334155');
    drumGrad.addColorStop(1, '#090d16');
    ctx.fillStyle = drumGrad;
    ctx.strokeStyle = '#4ade80';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    ctx.ellipse(cxPos, cyPos - 4, 32, 24, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    // Glowing Bio-Mutagen Plasma Surface
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.ellipse(cxPos, cyPos - 21, 30, 11, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    ctx.fillStyle = `rgba(34, 197, 94, ${(0.85 * brewGlow).toFixed(2)})`;
    ctx.beginPath();
    ctx.ellipse(cxPos, cyPos - 21, 24, 8, 0, 0, Math.PI * 2);
    ctx.fill();

    // Holographic rising plasma bubbles
    for (let b = 0; b < 3; b++) {
      const rise = (timeSec * 24 + b * 11) % 26;
      const bx = cxPos + (b - 1) * 10 + Math.sin(timeSec * 5 + b) * 3;
      const by = cyPos - 23 - rise;
      ctx.fillStyle = b === 1 ? '#e879f9' : '#86efac';
      ctx.beginPath();
      ctx.arc(bx, by, 3.8 - rise * 0.08, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
    return;
  }

  if (variant === 'titan_wreck') {
    const topY = snap(y - heightZ);
    const pulse = 0.65 + 0.35 * Math.sin(timeSec * 3.4 + x * 0.01);

    drawIsoBox3D(
      ctx,
      x,
      topY + 18,
      w - 16,
      heightZ + h * 0.58,
      15,
      11,
      '#44403c',
      '#292524',
      '#1c1917',
      '#0c0a09'
    );

    ctx.fillStyle = '#f59e0b';
    for (let sx = x + 12; sx < x + w - 34; sx += 22) {
      ctx.fillRect(snap(sx), topY + 26, 11, 6);
    }

    // Exposed mechanical ribcage & ruptured fusion turbine
    ctx.fillStyle = '#0c0a09';
    ctx.fillRect(snap(x + 16), topY + 42, 54, 34);
    ctx.fillStyle = `rgba(249, 115, 22, ${(0.88 * pulse).toFixed(2)})`;
    ctx.beginPath();
    ctx.arc(x + 43, topY + 59, 15, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(x + 43, topY + 59, 6.5, 0, Math.PI * 2);
    ctx.fill();

    // Severed Titan Mecha Head with flickering visor
    ctx.save();
    ctx.translate(x + w * 0.68, topY + 54);
    ctx.rotate(0.22);
    drawIsoBox3D(ctx, -24, -20, 48, 36, 8, 6, '#57534e', '#1c1917', '#0c0a09');
    ctx.fillStyle = Math.sin(timeSec * 14 + x) > -0.3 ? '#ff1744' : '#450a0a';
    ctx.fillRect(-16, -5, 32, 7);
    ctx.restore();

    ctx.restore();
    return;
  }

  if (variant === 'mech_gantry') {
    const topY = snap(y - heightZ);
    const totalH = snap(heightZ + h * 0.75);

    drawIsoBox3D(ctx, x + 4, topY + 14, 24, totalH - 14, 8, 6, '#475569', '#1f2937', '#0f172a');
    drawIsoBox3D(ctx, x + w - 34, topY + 14, 24, totalH - 14, 8, 6, '#475569', '#1f2937', '#0f172a');
    drawIsoBox3D(ctx, x, topY, w - 8, 22, 10, 8, '#64748b', '#334155', '#1e293b');

    ctx.fillStyle = '#f97316';
    ctx.fillRect(snap(x + 8), topY + 8, snap(w - 24), 5);

    const clawX = x + w * 0.48 + Math.sin(timeSec * 2.1 + y * 0.01) * (w * 0.16);
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 3.5;
    ctx.beginPath();
    ctx.moveTo(clawX, topY + 22);
    ctx.lineTo(clawX, topY + 54);
    ctx.stroke();

    ctx.fillStyle = '#334155';
    ctx.fillRect(clawX - 9, topY + 52, 18, 8);
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.arc(clawX, topY + 62, 5.5, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return;
  }

  if (variant === 'tesla_pylon') {
    const topY = snap(y - heightZ);
    const cx = x + (w - 8) * 0.5;

    drawIsoBox3D(ctx, x + 6, y + h * 0.24, w - 20, h * 0.62, 10, 8, '#475569', '#1e293b', '#0f172a');
    drawIsoBox3D(ctx, cx - 13, topY + 18, 26, heightZ, 7, 5, '#64748b', '#334155', '#1e293b');

    for (let ring = 0; ring < 3; ring++) {
      const ry = topY + 28 + ring * 22;
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.ellipse(cx + 2, ry, 23 - ring * 2, 7, 0, 0, Math.PI * 2);
      ctx.stroke();
    }

    ctx.fillStyle = '#00e5ff';
    ctx.beginPath();
    ctx.arc(cx + 2, topY + 11, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(cx + 2, topY + 11, 5, 0, Math.PI * 2);
    ctx.fill();

    if (Math.sin(timeSec * 14 + x) > 0) {
      ctx.strokeStyle = '#67e8f9';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(cx + 2, topY + 11);
      ctx.lineTo(cx + 24, topY + 30);
      ctx.lineTo(cx + 10, topY + 48);
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

    // Corrupted Server-Monolith Obelisk with 3D Bevel
    drawIsoBox3D(
      ctx,
      x + w * 0.22,
      topY,
      w * 0.52,
      heightZ + h * 0.65,
      10,
      8,
      '#4c1d95',
      '#14091c',
      '#09040e',
      '#c026d3'
    );

    const eyeX = x + w * 0.48;
    const eyeY = topY + (heightZ + h * 0.5) * 0.42;
    ctx.fillStyle = '#ff1744';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 13, 22, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fde047';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 6.5, 16, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#09040e';
    ctx.beginPath();
    ctx.ellipse(eyeX, eyeY, 2.5, 14, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.restore();
    return;
  }

  // 'flesh_hive' — Overgrown Server Cluster consumed by Bio-Cyber Biomass
  const topY = snap(y - heightZ);
  const totalH = snap(heightZ + h * 0.72);
  drawIsoBox3D(ctx, x, topY + 10, w - 12, totalH, 11, 8, '#3b0764', '#1f122b', '#0f0717');

  const swell = Math.sin(timeSec * 4.5 + y * 0.02) * 3;
  ctx.fillStyle = '#581c87';
  ctx.strokeStyle = '#e11d48';
  ctx.lineWidth = 1.8;
  ctx.beginPath();
  ctx.ellipse(x + w * 0.48, topY + 26, w * 0.4 + swell, 20 + swell * 0.5, -0.12, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();

  const hiveEyes = [
    { ox: 0.3, oy: 22, r: 6.5 },
    { ox: 0.52, oy: 18, r: 8.5 },
    { ox: 0.68, oy: 29, r: 5.5 },
    { ox: 0.42, oy: 48, r: 6 },
    { ox: 0.62, oy: 54, r: 7 },
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
}
