import { EnemyKind, PlayerSkinId } from '../types/game';

export const ASSET_URLS = {
  DEGEN_DOGE: '/assets/aistudio/ba00b145ad56d8db459007e74b7dbe77_50efa062.webp',
  DEGEN_DOGE_FULL: '/assets/aistudio/image_2cd327cb.png',
  DOGE_R_IDLE:
    '/assets/aistudio/71a7831cb46d4972be2618bdedda2ca6.jpeg_tplv-a9rns2rl98-cgen_wm0_1e6574e7.png',
  DOGE_R_STRIDE:
    '/assets/aistudio/809e5fbab73b44a6afd57653b36d0c35.jpeg_tplv-a9rns2rl98-cgen_wm0_ef82b73c.png',
  DOGE_R_STEP:
    '/assets/aistudio/9b99c69f670247e29c535a9bc1f241a8.jpeg_tplv-a9rns2rl98-cgen_wm0_fd5cfb31.png',
  DOGE_L_IDLE:
    '/assets/aistudio/bb47ee1e0e3d47f8852d0a3664734895.jpeg_tplv-a9rns2rl98-cgen_wm0_c209e18a.png',
  DOGE_L_STEP:
    '/assets/aistudio/76584d1c1dbc43f884c69c4c6c1bbfbe.jpeg_tplv-a9rns2rl98-cgen_wm0_00ec08b5.png',
  VIBER_10: '/assets/aistudio/viber-10-480_55d84239.webp',
  VIBER_31: '/assets/aistudio/viber-31-480_c7515c54.webp',
  VIBER_63: '/assets/aistudio/viber-63-480_f31f4ef4.webp',
  VIBER_42: '/assets/aistudio/viber-42-480_ed39c3b4.webp',
  VIBER_48: '/assets/aistudio/viber-48-480_82b36bc2.webp',
  VIBER_71: '/assets/aistudio/viber-71-480_680caaab.webp',
  VIBER_103: '/assets/aistudio/viber-103-480_be60e48a.webp',
  VIBER_6: '/assets/aistudio/viber-6-480_3ecae7ac.webp',
  VIBER_32: '/assets/aistudio/viber-32-480_c2762abf.webp',
  KEYCAP_HERO: '/assets/aistudio/image_ea7c7606.png',
  TRADE_ROOM: '/assets/aistudio/image_598e80ad.png',
  VIBEVIBE_LOGO: '/assets/aistudio/image_6eb33e21.png',
  OPENAI_KNOT: '/assets/aistudio/image_fb9fe75b.png',
} as const;

export const PLAYER_SKIN_META: {
  id: PlayerSkinId;
  name: string;
  spriteUrl: string;
  portraitUrl: string;
}[] = [
  {
    id: PlayerSkinId.DEGEN_ASTRO,
    name: 'Space-Suit Doge · DEGEN',
    spriteUrl: ASSET_URLS.DOGE_R_IDLE,
    portraitUrl: ASSET_URLS.DOGE_R_IDLE,
  },
  {
    id: PlayerSkinId.CIPHER_GREEN,
    name: 'Viber-10 · Cipher',
    spriteUrl: ASSET_URLS.VIBER_10,
    portraitUrl: ASSET_URLS.VIBER_10,
  },
  {
    id: PlayerSkinId.VOLT_ORANGE,
    name: 'Viber-31 · Volt',
    spriteUrl: ASSET_URLS.VIBER_31,
    portraitUrl: ASSET_URLS.VIBER_31,
  },
  {
    id: PlayerSkinId.ROTOR_TEAL,
    name: 'Viber-63 · Rotor',
    spriteUrl: ASSET_URLS.VIBER_63,
    portraitUrl: ASSET_URLS.VIBER_63,
  },
];

export interface EyeUV {
  u: number;
  v: number;
}

export interface ProcessedSprite {
  canvas: HTMLCanvasElement;
  flashCanvas: HTMLCanvasElement;
  customWeaponBaseCanvas?: HTMLCanvasElement;
  aspectRatio: number;
  topUV: number;
  bottomUV: number;
  leftEyeUV: EyeUV;
  rightEyeUV: EyeUV;
}

interface EyeSeedConfig {
  left: EyeUV;
  right: EyeUV;
  isEnemy: boolean;
  rightIsDarkSocket?: boolean;
}

const EYE_SEEDS: Record<string, EyeSeedConfig> = {
  [ASSET_URLS.VIBER_42]: {
    left: { u: 0.25, v: 0.56 },
    right: { u: 0.481, v: 0.591 },
    isEnemy: true,
  },
  [ASSET_URLS.VIBER_48]: {
    left: { u: 0.296, v: 0.548 },
    right: { u: 0.498, v: 0.569 },
    isEnemy: true,
  },
  [ASSET_URLS.VIBER_71]: {
    left: { u: 0.273, v: 0.422 },
    right: { u: 0.535, v: 0.452 },
    isEnemy: true,
    rightIsDarkSocket: true,
  },
  [ASSET_URLS.VIBER_103]: {
    left: { u: 0.264, v: 0.498 },
    right: { u: 0.521, v: 0.531 },
    isEnemy: true,
  },
  [ASSET_URLS.VIBER_6]: {
    left: { u: 0.275, v: 0.425 },
    right: { u: 0.525, v: 0.448 },
    isEnemy: false,
  },
  [ASSET_URLS.VIBER_32]: {
    left: { u: 0.248, v: 0.458 },
    right: { u: 0.452, v: 0.478 },
    isEnemy: false,
  },
};

const DOGE_ACTION_URLS = new Set<string>([
  ASSET_URLS.DOGE_R_IDLE,
  ASSET_URLS.DOGE_R_STRIDE,
  ASSET_URLS.DOGE_R_STEP,
  ASSET_URLS.DOGE_L_IDLE,
  ASSET_URLS.DOGE_L_STEP,
]);

const spriteCache = new Map<string, ProcessedSprite>();
const rawImageCache = new Map<string, HTMLImageElement>();
const loadingSet = new Set<string>();

function buildFlashCanvas(src: HTMLCanvasElement, w: number, h: number): HTMLCanvasElement {
  const flashCanvas = document.createElement('canvas');
  flashCanvas.width = w;
  flashCanvas.height = h;
  const fCtx = flashCanvas.getContext('2d')!;
  fCtx.drawImage(src, 0, 0);
  fCtx.globalCompositeOperation = 'source-in';
  fCtx.fillStyle = '#ffffff';
  fCtx.fillRect(0, 0, w, h);
  return flashCanvas;
}

function measureOpaqueVerticalBounds(
  data: Uint8ClampedArray,
  w: number,
  h: number,
  fallbackTop = 0.05,
  fallbackBot = 0.94
): { topUV: number; bottomUV: number } {
  let minY = h;
  let maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > 180) {
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
  }
  if (maxY <= minY + 8) {
    return { topUV: fallbackTop, bottomUV: fallbackBot };
  }
  return { topUV: minY / h, bottomUV: maxY / h };
}

/**
 * Cleanly mattes the 5 original comic-inked Space-Suit Doge action frames (1536x1536)
 * without altering any of Space Doge's original limbs, suit, helmet, gloves, or boots.
 */
function matteSpaceDogeActionFrame(img: HTMLImageElement, url: string): ProcessedSprite {
  const size = 240;
  const isLeftFrame = url === ASSET_URLS.DOGE_L_IDLE || url === ASSET_URLS.DOGE_L_STEP;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, size, size);

  let topUV = 0.05;
  let bottomUV = 0.94;

  try {
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    const cIdx = (3 * size + 3) * 4;
    const bgR = data[cIdx];
    const bgG = data[cIdx + 1];
    const bgB = data[cIdx + 2];

    // Step 1: Border flood-fill stopping strictly at Space Doge's black comic ink outline
    const visited = new Uint8Array(size * size);
    const queue = new Int32Array(size * size);
    let head = 0;
    let tail = 0;

    const push = (x: number, y: number) => {
      if (x < 0 || x >= size || y < 0 || y >= size) return;
      const p = y * size + x;
      if (visited[p]) return;
      visited[p] = 1;
      queue[tail++] = p;
    };

    for (let x = 0; x < size; x++) {
      push(x, 0);
      push(x, size - 1);
    }
    for (let y = 0; y < size; y++) {
      push(0, y);
      push(size - 1, y);
    }

    while (head < tail) {
      const p = queue[head++];
      const idx = p * 4;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];

      // Black comic ink outline around suit, boots, helmet, and gun has b < 28
      if (r < 28 && g < 28 && b < 32) continue;

      const dr = r - bgR;
      const dg = g - bgG;
      const db = b - bgB;
      const distSq = dr * dr + dg * dg + db * db;
      const isNavyBg = b >= 38 && b - r >= 20 && r < 40 && g < 52;

      if (distSq <= 1850 || isNavyBg) {
        data[idx + 3] = 0;
        const x = p % size;
        const y = (p - x) / size;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      } else if (distSq <= 3000 && b > r + 16) {
        data[idx + 3] = Math.min(data[idx + 3], 90);
      }
    }

    // Step 2: Clear enclosed dark-navy gaps (inside trigger guard / between arm & rifle underside)
    for (let y = Math.floor(size * 0.32); y < Math.ceil(size * 0.62); y++) {
      for (let x = Math.floor(size * 0.24); x < Math.ceil(size * 0.76); x++) {
        const idx = (y * size + x) * 4;
        if (data[idx + 3] === 0) continue;
        // Protect small blue collar LED on Space Doge's neck ring
        if (y < size * 0.345 && x > size * 0.44 && x < size * 0.56) continue;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        if (r < 28 && g < 39 && b >= 50 && b - r >= 28 && b - g >= 19) {
          data[idx + 3] = 0;
        }
      }
    }

    const bounds = measureOpaqueVerticalBounds(data, size, size, 0.05, 0.94);
    topUV = bounds.topUV;
    bottomUV = bounds.bottomUV;
    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Fallback if canvas taint occurs
  }

  // Build alternate weapon base canvas: keeps 100% of Space Doge's helmet, suit, arms, gloves, legs & boots
  // intact, masking ONLY the protruding front rifle barrel outside his front white glove!
  const customWeaponBaseCanvas = document.createElement('canvas');
  customWeaponBaseCanvas.width = size;
  customWeaponBaseCanvas.height = size;
  const cwCtx = customWeaponBaseCanvas.getContext('2d')!;
  cwCtx.drawImage(canvas, 0, 0);
  try {
    const cwImg = cwCtx.getImageData(0, 0, size, size);
    const cwData = cwImg.data;
    for (let y = Math.floor(size * 0.29); y <= Math.ceil(size * 0.51); y++) {
      for (let x = 0; x < size; x++) {
        const nx = x / size;
        const inFrontBarrelZone = isLeftFrame ? nx < 0.298 : nx > 0.704;
        if (!inFrontBarrelZone) continue;
        const idx = (y * size + x) * 4;
        if (cwData[idx + 3] === 0) continue;
        const r = cwData[idx];
        const g = cwData[idx + 1];
        const b = cwData[idx + 2];
        // Preserve any white glove pixels just in case; remove dark gun shroud & red strip beyond glove
        const isWhiteSuitOrGlove = r > 180 && g > 180 && b > 180;
        if (!isWhiteSuitOrGlove) {
          cwData[idx + 3] = 0;
        }
      }
    }
    cwCtx.putImageData(cwImg, 0, 0);
  } catch {
    // Ignore taint fallback
  }

  return {
    canvas,
    flashCanvas: buildFlashCanvas(canvas, size, size),
    customWeaponBaseCanvas,
    aspectRatio: 1,
    topUV,
    bottomUV,
    leftEyeUV: { u: isLeftFrame ? 0.45 : 0.46, v: 0.17 },
    rightEyeUV: { u: isLeftFrame ? 0.55 : 0.54, v: 0.17 },
  };
}

function matteFullBodySpaceDoge(img: HTMLImageElement): ProcessedSprite {
  const h = 240;
  const ratio = img.naturalWidth > 0 && img.naturalHeight > 0 ? img.naturalWidth / img.naturalHeight : 0.58;
  const w = Math.max(120, Math.round(h * ratio));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, w, h);
  return {
    canvas,
    flashCanvas: buildFlashCanvas(canvas, w, h),
    aspectRatio: w / h,
    topUV: 0.02,
    bottomUV: 0.98,
    leftEyeUV: { u: 0.49, v: 0.17 },
    rightEyeUV: { u: 0.63, v: 0.17 },
  };
}

/**
 * Flood-fills outer pastel background, measures exact topUV/bottomUV for height calibration,
 * and locates + recolors enemy pupils into glowing crimson.
 */
function matteViberSprite(img: HTMLImageElement, url: string, size = 160): ProcessedSprite {
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(img, 0, 0, size, size);

  const seed = EYE_SEEDS[url];
  let leftEyeUV: EyeUV = seed ? { ...seed.left } : { u: 0.27, v: 0.52 };
  let rightEyeUV: EyeUV = seed ? { ...seed.right } : { u: 0.5, v: 0.54 };
  let topUV = 0.065;
  let bottomUV = 0.935;

  try {
    const imgData = ctx.getImageData(0, 0, size, size);
    const data = imgData.data;

    const cIdx = (2 * size + 2) * 4;
    const bgR = data[cIdx];
    const bgG = data[cIdx + 1];
    const bgB = data[cIdx + 2];

    const visited = new Uint8Array(size * size);
    const queue = new Int32Array(size * size);
    let head = 0;
    let tail = 0;

    const push = (x: number, y: number) => {
      if (x < 0 || x >= size || y < 0 || y >= size) return;
      const p = y * size + x;
      if (visited[p]) return;
      visited[p] = 1;
      queue[tail++] = p;
    };

    for (let x = 0; x < size; x++) {
      push(x, 0);
      push(x, size - 1);
    }
    for (let y = 0; y < size; y++) {
      push(0, y);
      push(size - 1, y);
    }

    while (head < tail) {
      const p = queue[head++];
      const idx = p * 4;
      const dr = data[idx] - bgR;
      const dg = data[idx + 1] - bgG;
      const db = data[idx + 2] - bgB;
      const distSq = dr * dr + dg * dg + db * db;

      if (distSq <= 2704) {
        data[idx + 3] = 0;
        const x = p % size;
        const y = (p - x) / size;
        push(x + 1, y);
        push(x - 1, y);
        push(x, y + 1);
        push(x, y - 1);
      } else if (distSq <= 4900) {
        data[idx + 3] = Math.min(data[idx + 3], 95);
      }
    }

    const bounds = measureOpaqueVerticalBounds(data, size, size, 0.065, 0.935);
    topUV = bounds.topUV;
    bottomUV = bounds.bottomUV;

    if (seed && seed.isEnemy) {
      const refineAndTintPupil = (center: EyeUV, isDarkSocket = false): EyeUV => {
        if (isDarkSocket) {
          const cx = Math.round(center.u * size);
          const cy = Math.round(center.v * size);
          for (let py = cy - 4; py <= cy + 4; py++) {
            for (let px = cx - 4; px <= cx + 4; px++) {
              if (px < 0 || px >= size || py < 0 || py >= size) continue;
              const idx = (py * size + px) * 4;
              if (data[idx + 3] < 200) continue;
              data[idx] = 255;
              data[idx + 1] = 32;
              data[idx + 2] = 72;
            }
          }
          return center;
        }

        const minX = Math.max(4, Math.floor((center.u - 0.052) * size));
        const maxX = Math.min(size - 5, Math.ceil((center.u + 0.052) * size));
        const minY = Math.max(4, Math.floor((center.v - 0.052) * size));
        const maxY = Math.min(size - 5, Math.ceil((center.v + 0.052) * size));

        let sumX = 0;
        let sumY = 0;
        let count = 0;

        for (let py = minY; py <= maxY; py++) {
          for (let px = minX; px <= maxX; px++) {
            const idx = (py * size + px) * 4;
            if (data[idx + 3] < 200) continue;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];

            const isCyanPupil = b > r + 40 && g > 190 && b > 190;
            const isNeutralWhitePupil =
              r > 205 && g > 205 && b > 195 && Math.abs(r - g) < 32 && g - b < 35;

            if (isCyanPupil || isNeutralWhitePupil) {
              sumX += px;
              sumY += py;
              count++;
              data[idx] = 255;
              data[idx + 1] = 36;
              data[idx + 2] = 76;
            }
          }
        }

        if (count >= 4) {
          return {
            u: sumX / count / size,
            v: sumY / count / size,
          };
        }
        return center;
      };

      leftEyeUV = refineAndTintPupil(seed.left, false);
      rightEyeUV = refineAndTintPupil(seed.right, Boolean(seed.rightIsDarkSocket));
    }

    ctx.putImageData(imgData, 0, 0);
  } catch {
    // Fallback if canvas taint occurs
  }

  return {
    canvas,
    flashCanvas: buildFlashCanvas(canvas, size, size),
    aspectRatio: 1,
    topUV,
    bottomUV,
    leftEyeUV,
    rightEyeUV,
  };
}

export function requestSprite(url: string): ProcessedSprite | undefined {
  const existing = spriteCache.get(url);
  if (existing) return existing;

  if (!loadingSet.has(url) && typeof Image !== 'undefined') {
    loadingSet.add(url);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      rawImageCache.set(url, img);
      if (DOGE_ACTION_URLS.has(url)) {
        spriteCache.set(url, matteSpaceDogeActionFrame(img, url));
      } else if (url === ASSET_URLS.DEGEN_DOGE_FULL || url === ASSET_URLS.DEGEN_DOGE) {
        spriteCache.set(url, matteFullBodySpaceDoge(img));
      } else {
        spriteCache.set(url, matteViberSprite(img, url, 160));
      }
    };
    img.src = url;
  }
  return undefined;
}

export function requestRawImage(url: string): HTMLImageElement | undefined {
  const existing = rawImageCache.get(url);
  if (existing) return existing;

  if (!loadingSet.has(`raw:${url}`) && typeof Image !== 'undefined') {
    loadingSet.add(`raw:${url}`);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      rawImageCache.set(url, img);
    };
    img.src = url;
  }
  return undefined;
}

/**
 * Selects the exact original comic-inked Space Doge sprite frame for standing/walking
 * Left or Right, along with the measured rifle muzzle UV & hand grip UV.
 */
export function getSpaceDogeActionPose(
  facingRight: boolean,
  isMoving: boolean,
  walkPhase: number
): {
  sprite: ProcessedSprite | undefined;
  mirrorX: boolean;
  muzzleUV: EyeUV;
  gripUV: EyeUV;
} {
  // 4-beat smooth walk cycle across the original hand-drawn poses
  const stepIdx = isMoving ? Math.floor((walkPhase / (Math.PI * 0.5)) % 4 + 4) % 4 : 0;

  if (facingRight) {
    if (!isMoving) {
      return {
        sprite: requestSprite(ASSET_URLS.DOGE_R_IDLE),
        mirrorX: false,
        muzzleUV: { u: 0.875, v: 0.405 },
        gripUV: { u: 0.585, v: 0.432 },
      };
    }
    if (stepIdx === 1) {
      return {
        sprite: requestSprite(ASSET_URLS.DOGE_R_STRIDE),
        mirrorX: false,
        muzzleUV: { u: 0.808, v: 0.445 },
        gripUV: { u: 0.575, v: 0.455 },
      };
    }
    if (stepIdx === 3) {
      return {
        sprite: requestSprite(ASSET_URLS.DOGE_R_STEP),
        mirrorX: false,
        muzzleUV: { u: 0.802, v: 0.402 },
        gripUV: { u: 0.585, v: 0.415 },
      };
    }
    return {
      sprite: requestSprite(ASSET_URLS.DOGE_R_IDLE),
      mirrorX: false,
      muzzleUV: { u: 0.875, v: 0.405 },
      gripUV: { u: 0.585, v: 0.432 },
    };
  }

  // Facing Left: uses the dedicated Left-Facing original frames + mirrored full-stride peak
  if (!isMoving) {
    return {
      sprite: requestSprite(ASSET_URLS.DOGE_L_IDLE),
      mirrorX: false,
      muzzleUV: { u: 0.185, v: 0.388 },
      gripUV: { u: 0.405, v: 0.398 },
    };
  }
  if (stepIdx === 1) {
    return {
      sprite: requestSprite(ASSET_URLS.DOGE_L_STEP),
      mirrorX: false,
      muzzleUV: { u: 0.175, v: 0.354 },
      gripUV: { u: 0.415, v: 0.372 },
    };
  }
  if (stepIdx === 3) {
    const rStride = requestSprite(ASSET_URLS.DOGE_R_STRIDE);
    if (rStride) {
      return {
        sprite: rStride,
        mirrorX: true,
        muzzleUV: { u: 1 - 0.808, v: 0.445 },
        gripUV: { u: 1 - 0.575, v: 0.455 },
      };
    }
  }
  return {
    sprite: requestSprite(ASSET_URLS.DOGE_L_IDLE),
    mirrorX: false,
    muzzleUV: { u: 0.185, v: 0.388 },
    gripUV: { u: 0.405, v: 0.398 },
  };
}

export function preloadAllGameSprites() {
  [
    ASSET_URLS.DOGE_R_IDLE,
    ASSET_URLS.DOGE_R_STRIDE,
    ASSET_URLS.DOGE_R_STEP,
    ASSET_URLS.DOGE_L_IDLE,
    ASSET_URLS.DOGE_L_STEP,
    ASSET_URLS.DEGEN_DOGE_FULL,
    ASSET_URLS.VIBER_10,
    ASSET_URLS.VIBER_31,
    ASSET_URLS.VIBER_63,
    ASSET_URLS.VIBER_42,
    ASSET_URLS.VIBER_48,
    ASSET_URLS.VIBER_71,
    ASSET_URLS.VIBER_103,
    ASSET_URLS.VIBER_6,
    ASSET_URLS.VIBER_32,
  ].forEach((url) => requestSprite(url));

  [
    ASSET_URLS.VIBEVIBE_LOGO,
    ASSET_URLS.OPENAI_KNOT,
    ASSET_URLS.KEYCAP_HERO,
    ASSET_URLS.TRADE_ROOM,
  ].forEach((url) => requestRawImage(url));
}

export function getPlayerSkinSpriteUrl(skin: PlayerSkinId): string {
  switch (skin) {
    case PlayerSkinId.DEGEN_ASTRO:
      return ASSET_URLS.DOGE_R_IDLE;
    case PlayerSkinId.CIPHER_GREEN:
      return ASSET_URLS.VIBER_10;
    case PlayerSkinId.VOLT_ORANGE:
      return ASSET_URLS.VIBER_31;
    case PlayerSkinId.ROTOR_TEAL:
      return ASSET_URLS.VIBER_63;
  }
}

export function getEnemySpriteUrl(kind: EnemyKind): string {
  switch (kind) {
    case EnemyKind.OPENAI_STALKER:
      return ASSET_URLS.VIBER_42;
    case EnemyKind.OPENAI_VIPER:
      return ASSET_URLS.VIBER_48;
    case EnemyKind.ANTHROPIC_BULWARK:
      return ASSET_URLS.VIBER_71;
    case EnemyKind.LOGIC_WEAVER_ELITE:
      return ASSET_URLS.VIBER_103;
    case EnemyKind.WILD_SCOUT_DOG:
      return ASSET_URLS.VIBER_6;
    case EnemyKind.WILD_CYBER_CAT:
      return ASSET_URLS.VIBER_32;
    default:
      return ASSET_URLS.VIBER_103;
  }
}
