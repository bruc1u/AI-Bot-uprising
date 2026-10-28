import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUpCircle,
  Backpack,
  Heart,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Terminal,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  ASSET_URLS,
  PLAYER_SKIN_META,
  preloadAllGameSprites,
} from '../game/assetLoader';
import {
  buildWaveEnemies,
  createInitialSimState,
  MAX_PLAYER_HP,
  OUTDOOR_DIVIDE_X,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  renderWorld25D,
  WORLD_H,
  WORLD_W,
} from '../game/engineStep';
import { isEldritchEnemyKind } from '../game/eldritchSprites';
import { findLockedTarget, stepCombatPhysics } from '../game/physicsTick';
import { soundFX } from '../game/sound';
import { FACILITY_PARTITION_WALLS, getZoneAt } from '../game/worldZones';
import { TranslationStrings } from '../i18n/translations';
import {
  CompanionKind,
  EnemyKind,
  GameState,
  PlayerPortfolio,
  PlayerSkinId,
  WeaponId,
} from '../types/game';
import { ItemPreviewArt, WeaponPreviewArt } from './GameIllustrations';

interface CombatArenaProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  isBackpackOpen: boolean;
  onOpenBackpack: () => void;
  onSelectSkin: (skin: PlayerSkinId) => void;
  onSelectWeapon: (weapon: WeaponId) => void;
  onUpgradeWeapon: (weapon: WeaponId) => void;
  onBuySupply: (item: 'sphere' | 'ammo' | 'medkit' | 'patch') => void;
  onLootCollected: (delta: {
    ru9?: number;
    oCores?: number;
    aCores?: number;
    ammoCells?: number;
    masterSpheres?: number;
    medkits?: number;
    energyPacks?: number;
    firmwarePatches?: number;
    kills?: number;
    waveReached?: number;
  }) => void;
  onCompanionCaptured: (kind: CompanionKind) => void;
  onCompanionStateSync: (id: string, hp: number, rebelling: boolean) => void;
  onExtractToSanctuary: () => void;
}

const WEAPON_ORDER: WeaponId[] = [
  WeaponId.ARC_BLADE,
  WeaponId.CHAINSAW_SWORD,
  WeaponId.PULSE_LASER,
  WeaponId.DISRUPTOR_CANNON,
];

export const CombatArena: React.FC<CombatArenaProps> = ({
  t,
  portfolio,
  isBackpackOpen,
  onOpenBackpack,
  onSelectSkin,
  onSelectWeapon,
  onUpgradeWeapon,
  onBuySupply,
  onLootCollected,
  onCompanionCaptured,
  onCompanionStateSync,
  onExtractToSanctuary,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const radarCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const simRef = useRef(createInitialSimState());

  const [gameState, setGameState] = useState<GameState>(GameState.TITLE_MENU);
  const [playerHp, setPlayerHp] = useState<number>(MAX_PLAYER_HP);
  const [dashReady, setDashReady] = useState<boolean>(true);
  const [swapComboActive, setSwapComboActive] = useState<boolean>(false);
  const [hostilesCount, setHostilesCount] = useState<number>(0);
  const [waveNumber, setWaveNumber] = useState<number>(1);
  const [zoneBadge, setZoneBadge] = useState<{ label: string; isOutdoor: boolean }>({
    label: 'SECTOR 01 · COMMAND HUB',
    isOutdoor: false,
  });
  const [muted, setMuted] = useState<boolean>(soundFX.muted);
  const [sessionLoot, setSessionLoot] = useState<{ oCores: number; aCores: number; ru9: number }>({
    oCores: 0,
    aCores: 0,
    ru9: 0,
  });
  const [dataSyncMap, setDataSyncMap] = useState<Record<WeaponId, number>>({
    [WeaponId.ARC_BLADE]: 0,
    [WeaponId.CHAINSAW_SWORD]: 0,
    [WeaponId.PULSE_LASER]: 0,
    [WeaponId.DISRUPTOR_CANNON]: 0,
  });

  const portfolioRef = useRef(portfolio);
  portfolioRef.current = portfolio;

  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;

  useEffect(() => {
    preloadAllGameSprites();
  }, []);

  useEffect(() => {
    const s = simRef.current;
    if (s.weapon !== portfolio.equippedWeapon) {
      s.weapon = portfolio.equippedWeapon;
      s.swapComboTimer = 3.0;
      setSwapComboActive(true);
    }
  }, [portfolio.equippedWeapon]);

  useEffect(() => {
    if (isBackpackOpen && gameStateRef.current === GameState.PLAYING) {
      simRef.current.mouseDown = false;
      simRef.current.keys.clear();
      setGameState(GameState.PAUSED);
    }
  }, [isBackpackOpen]);

  const startWave = useCallback((targetWave: number, resetPlayer: boolean) => {
    const s = simRef.current;
    if (resetPlayer) {
      const fresh = createInitialSimState();
      fresh.weapon = portfolioRef.current.equippedWeapon;
      Object.assign(s, fresh);
      setPlayerHp(MAX_PLAYER_HP);
      setSessionLoot({ oCores: 0, aCores: 0, ru9: 0 });
      setDataSyncMap({
        [WeaponId.ARC_BLADE]: 0,
        [WeaponId.CHAINSAW_SWORD]: 0,
        [WeaponId.PULSE_LASER]: 0,
        [WeaponId.DISRUPTOR_CANNON]: 0,
      });
    } else {
      s.px = PLAYER_SPAWN_X;
      s.py = PLAYER_SPAWN_Y;
      s.hp = Math.min(MAX_PLAYER_HP, s.hp + 45);
      setPlayerHp(Math.round(s.hp));
      s.logicMines = [];
      s.projectiles = [];
    }

    s.waveNum = targetWave;
    const spawned = buildWaveEnemies(targetWave);
    s.enemies = spawned.enemies;
    s.chests = spawned.chests;
    const hostileOnly = spawned.enemies.filter(
      (e) => e.kind !== EnemyKind.WILD_SCOUT_DOG && e.kind !== EnemyKind.WILD_CYBER_CAT
    ).length;
    setWaveNumber(targetWave);
    setHostilesCount(hostileOnly);
    setGameState(GameState.PLAYING);
  }, []);

  const switchWeapon = useCallback(
    (nextW: WeaponId) => {
      const s = simRef.current;
      if (s.weapon !== nextW) {
        s.weapon = nextW;
        s.swapComboTimer = 3.0;
        setSwapComboActive(true);
        onSelectWeapon(nextW);
      }
    },
    [onSelectWeapon]
  );

  const throwMasterPrism = useCallback(() => {
    const p = portfolioRef.current;
    const s = simRef.current;
    if (gameStateRef.current !== GameState.PLAYING || p.masterSpheres <= 0) return;

    const ownsDog = p.companions.some((c) => c.kind === CompanionKind.SCOUT_DOG);
    const ownsCat = p.companions.some((c) => c.kind === CompanionKind.CYBER_CAT);

    let angle = s.aimAngle;
    let bestDist = 560;
    for (const e of s.enemies) {
      const isDog = e.kind === EnemyKind.WILD_SCOUT_DOG;
      const isCat = e.kind === EnemyKind.WILD_CYBER_CAT;
      if ((isDog && !ownsDog) || (isCat && !ownsCat)) {
        const d = Math.hypot(e.x - s.px, e.y - s.py);
        if (d < bestDist) {
          bestDist = d;
          angle = Math.atan2(e.y - 14 - (s.py - 36), e.x - s.px);
        }
      }
    }

    onLootCollected({ masterSpheres: -1 });
    soundFX.playPulseLaser();

    s.projectiles.push({
      id: `mp-${Date.now()}`,
      x: s.px + Math.cos(angle) * 20,
      y: s.py - 36 + Math.sin(angle) * 20,
      vx: Math.cos(angle) * 540,
      vy: Math.sin(angle) * 540,
      fromPlayer: true,
      kind: 'master_sphere',
      damage: 0,
      life: 1.5,
    });
    s.floatTexts.push({
      x: s.px,
      y: s.py - 62,
      text: 'AI MASTER ORB THROWN!',
      color: '#38bdf8',
      life: 0.85,
    });
  }, [onLootCollected]);

  const useMedkit = useCallback(() => {
    const p = portfolioRef.current;
    const s = simRef.current;
    if (p.medkits <= 0 || s.hp >= MAX_PLAYER_HP) return;
    onLootCollected({ medkits: -1 });
    s.hp = Math.min(MAX_PLAYER_HP, s.hp + 55);
    setPlayerHp(Math.round(s.hp));
    soundFX.playLootPickup(true);
    s.floatTexts.push({ x: s.px, y: s.py - 56, text: '+55 HP', color: '#22ff88', life: 0.85 });
  }, [onLootCollected]);

  const useEnergyPack = useCallback(() => {
    const p = portfolioRef.current;
    const s = simRef.current;
    if (p.energyPacks <= 0) return;
    onLootCollected({ energyPacks: -1, ammoCells: 24 });
    for (const w of WEAPON_ORDER) {
      s.syncMap[w] = Math.max(0, s.syncMap[w] - 50);
    }
    setDataSyncMap({ ...s.syncMap });
    soundFX.playLootPickup(true);
    s.floatTexts.push({
      x: s.px,
      y: s.py - 56,
      text: '+24 CELLS · SYNC -50%',
      color: '#38bdf8',
      life: 0.95,
    });
  }, [onLootCollected]);

  const useCompanionPatch = useCallback(() => {
    const p = portfolioRef.current;
    const s = simRef.current;
    if (p.companions.length === 0 || p.firmwarePatches <= 0) return;
    onLootCollected({ firmwarePatches: -1 });
    for (const comp of p.companions) {
      onCompanionStateSync(comp.id, comp.maxHp, false);
    }
    soundFX.playCaptureResult(true);
    s.floatTexts.push({
      x: s.px,
      y: s.py - 58,
      text: 'ALLY OVERCLOCKED!',
      color: '#38bdf8',
      life: 0.95,
    });
  }, [onCompanionStateSync, onLootCollected]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (isBackpackOpen) return;

      if (e.code === 'Escape') {
        if (gameStateRef.current === GameState.PLAYING) {
          simRef.current.mouseDown = false;
          setGameState(GameState.PAUSED);
        } else if (gameStateRef.current === GameState.PAUSED) {
          setGameState(GameState.PLAYING);
        }
        return;
      }

      if (e.code === 'KeyB') {
        e.preventDefault();
        onOpenBackpack();
        return;
      }

      if (gameStateRef.current !== GameState.PLAYING) return;

      simRef.current.keys.add(e.code);

      if (e.code === 'Digit1') switchWeapon(WeaponId.ARC_BLADE);
      else if (e.code === 'Digit2') switchWeapon(WeaponId.CHAINSAW_SWORD);
      else if (e.code === 'Digit3') switchWeapon(WeaponId.PULSE_LASER);
      else if (e.code === 'Digit4') switchWeapon(WeaponId.DISRUPTOR_CANNON);
      else if (e.code === 'KeyQ') {
        const idx = WEAPON_ORDER.indexOf(simRef.current.weapon);
        switchWeapon(WEAPON_ORDER[(idx + 1) % WEAPON_ORDER.length]);
      } else if (e.code === 'Space') {
        e.preventDefault();
        const s = simRef.current;
        if (s.dashCooldown <= 0) {
          s.dashCooldown = 0.85;
          s.dashActiveTimer = 0.17;
          s.invulnTimer = 0.35;
          let dx = 0;
          let dy = 0;
          if (s.keys.has('KeyW') || s.keys.has('ArrowUp')) dy -= 1;
          if (s.keys.has('KeyS') || s.keys.has('ArrowDown')) dy += 1;
          if (s.keys.has('KeyA') || s.keys.has('ArrowLeft')) dx -= 1;
          if (s.keys.has('KeyD') || s.keys.has('ArrowRight')) dx += 1;
          const angle = dx !== 0 || dy !== 0 ? Math.atan2(dy, dx) : s.facingRight ? 0 : Math.PI;
          s.dashVx = Math.cos(angle) * 780;
          s.dashVy = Math.sin(angle) * 780;
          setDashReady(false);
          soundFX.playArcSlash(false);
        }
      } else if (e.code === 'KeyG') {
        throwMasterPrism();
      } else if (e.code === 'KeyH') {
        useMedkit();
      } else if (e.code === 'KeyR') {
        useEnergyPack();
      } else if (e.code === 'KeyF') {
        useCompanionPatch();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      simRef.current.keys.delete(e.code);
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
    };
  }, [
    isBackpackOpen,
    onOpenBackpack,
    switchWeapon,
    throwMasterPrism,
    useCompanionPatch,
    useEnergyPack,
    useMedkit,
  ]);

  // 60fps World + Sci-Fi Sector Minimap Radar Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = Math.max(640, Math.floor(rect.width));
      canvas.height = Math.max(440, Math.floor(rect.height));
    };
    resize();
    window.addEventListener('resize', resize);

    if (simRef.current.enemies.length === 0) {
      const preview = buildWaveEnemies(1);
      simRef.current.enemies = preview.enemies.slice(0, 6);
      simRef.current.chests = preview.chests;
    }

    let rafId = 0;
    let lastTs = performance.now();

    const frame = (ts: number) => {
      const dt = Math.min(0.05, Math.max(0.001, (ts - lastTs) / 1000));
      lastTs = ts;
      const s = simRef.current;
      const pState = portfolioRef.current;
      const activeComp = pState.companions.find((c) => c.id === pState.activeCompanionId);

      if (gameStateRef.current === GameState.PLAYING) {
        stepCombatPhysics(s, dt, ts / 1000, {
          pState,
          activeComp,
          setPlayerHp,
          setDashReady,
          setSwapComboActive,
          setDataSyncMap,
          setHostilesCount,
          setGameState,
          onLootCollected,
          onSessionLootDelta: (d) =>
            setSessionLoot((prev) => ({
              oCores: prev.oCores + (d.oCores || 0),
              aCores: prev.aCores + (d.aCores || 0),
              ru9: prev.ru9 + (d.ru9 || 0),
            })),
          onCompanionCaptured,
          onCompanionStateSync,
        });
      }

      const ctx = canvas.getContext('2d');
      if (ctx) {
        const locked =
          s.weapon === WeaponId.DISRUPTOR_CANNON ? findLockedTarget(s)?.id : undefined;
        renderWorld25D(
          ctx,
          s,
          canvas.width,
          canvas.height,
          ts / 1000,
          pState.selectedSkin,
          activeComp,
          pState.companions,
          locked
        );
      }

      const zNow = getZoneAt(s.px, s.py);
      setZoneBadge((prev) =>
        prev.label === zNow.code && prev.isOutdoor === zNow.isOutdoor
          ? prev
          : { label: zNow.code, isOutdoor: zNow.isOutdoor }
      );

      // Update Multi-Room & Outdoor Quarantine Mini-Radar
      const rCanvas = radarCanvasRef.current;
      if (rCanvas) {
        const rCtx = rCanvas.getContext('2d');
        if (rCtx) {
          const rw = rCanvas.width;
          const rh = rCanvas.height;
          const divRx = (OUTDOOR_DIVIDE_X / WORLD_W) * rw;

          // Indoor floor vs Outdoor Cthulhu Abyss tint
          rCtx.fillStyle = '#0d1524';
          rCtx.fillRect(0, 0, divRx, rh);
          rCtx.fillStyle = '#1b0921';
          rCtx.fillRect(divRx, 0, rw - divRx, rh);

          // Facility room partition walls (openings show doorways & breach gates)
          for (const w of FACILITY_PARTITION_WALLS) {
            const wx = (w.x / WORLD_W) * rw;
            const wy = (w.y / WORLD_H) * rh;
            const ww = Math.max(1.2, (w.w / WORLD_W) * rw);
            const wh = Math.max(1.2, (w.h / WORLD_H) * rh);
            rCtx.fillStyle =
              Math.abs(w.x - (OUTDOOR_DIVIDE_X - 22)) < 30
                ? 'rgba(232, 121, 249, 0.78)'
                : 'rgba(56, 189, 248, 0.45)';
            rCtx.fillRect(wx, wy, ww, wh);
          }

          rCtx.strokeStyle = zNow.isOutdoor ? 'rgba(232, 121, 249, 0.7)' : 'rgba(0, 229, 255, 0.5)';
          rCtx.lineWidth = 1.2;
          rCtx.strokeRect(0.5, 0.5, rw - 1, rh - 1);

          for (const c of s.chests) {
            if (c.opened) continue;
            rCtx.fillStyle = '#eab308';
            rCtx.fillRect((c.x / WORLD_W) * rw - 1.3, (c.y / WORLD_H) * rh - 1.3, 2.6, 2.6);
          }

          for (const e of s.enemies) {
            const isWild =
              e.kind === EnemyKind.WILD_SCOUT_DOG || e.kind === EnemyKind.WILD_CYBER_CAT;
            const isEldritch = isEldritchEnemyKind(e.kind);
            rCtx.fillStyle = isWild ? '#a78bfa' : isEldritch ? '#e879f9' : '#ff1744';
            const blipSz = e.kind === EnemyKind.CTHULHU_LEVIATHAN_PRIME ? 3.8 : 2.6;
            rCtx.fillRect(
              (e.x / WORLD_W) * rw - blipSz * 0.5,
              (e.y / WORLD_H) * rh - blipSz * 0.5,
              blipSz,
              blipSz
            );
          }

          if (pState.companions.some((c) => c.kind === CompanionKind.SCOUT_DOG)) {
            rCtx.fillStyle = '#38bdf8';
            rCtx.beginPath();
            rCtx.arc((s.dogX / WORLD_W) * rw, (s.dogY / WORLD_H) * rh, 2.1, 0, Math.PI * 2);
            rCtx.fill();
          }
          if (pState.companions.some((c) => c.kind === CompanionKind.CYBER_CAT)) {
            rCtx.fillStyle = '#38bdf8';
            rCtx.beginPath();
            rCtx.arc((s.catX / WORLD_W) * rw, (s.catY / WORLD_H) * rh, 2.1, 0, Math.PI * 2);
            rCtx.fill();
          }

          rCtx.fillStyle = '#22ff88';
          rCtx.beginPath();
          rCtx.arc((s.px / WORLD_W) * rw, (s.py / WORLD_H) * rh, 2.6, 0, Math.PI * 2);
          rCtx.fill();
        }
      }

      rafId = requestAnimationFrame(frame);
    };

    rafId = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', resize);
    };
  }, [onCompanionCaptured, onCompanionStateSync, onLootCollected]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const s = simRef.current;
    const camX = Math.max(0, Math.min(WORLD_W - canvas.width, s.px - canvas.width / 2));
    const camY = Math.max(0, Math.min(WORLD_H - canvas.height, s.py - canvas.height / 2));
    s.mouseWorldX = camX + mx;
    s.mouseWorldY = camY + my;
    s.aimAngle = Math.atan2(s.mouseWorldY - (s.py - 42), s.mouseWorldX - s.px);
    if (!s.isMoving || s.mouseDown) {
      s.facingRight = Math.cos(s.aimAngle) >= 0;
    }
  };

  const toggleSound = () => {
    soundFX.muted = !soundFX.muted;
    setMuted(soundFX.muted);
  };

  const currentWeaponSync = Math.round(dataSyncMap[portfolio.equippedWeapon] || 0);

  const weaponCatalog: {
    id: WeaponId;
    key: string;
    name: string;
    coreKey: 'oCores' | 'aCores';
    coreLabel: string;
  }[] = [
    {
      id: WeaponId.ARC_BLADE,
      key: '1',
      name: t.weaponArcBlade,
      coreKey: 'oCores',
      coreLabel: 'OpenAI Core',
    },
    {
      id: WeaponId.CHAINSAW_SWORD,
      key: '2',
      name: t.weaponChainsaw,
      coreKey: 'aCores',
      coreLabel: 'Anthropic Core',
    },
    {
      id: WeaponId.PULSE_LASER,
      key: '3',
      name: t.weaponPulseLaser,
      coreKey: 'oCores',
      coreLabel: 'OpenAI Core',
    },
    {
      id: WeaponId.DISRUPTOR_CANNON,
      key: '4',
      name: t.weaponDisruptor,
      coreKey: 'aCores',
      coreLabel: 'Anthropic Core',
    },
  ];

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[calc(100vh-80px)] min-h-[540px] bg-[#141b26] overflow-hidden select-none"
    >
      {/* 2.5D Futuristic Sci-Fi Core Facility Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          if (e.button === 0 && gameState === GameState.PLAYING) {
            simRef.current.mouseDown = true;
            simRef.current.facingRight = Math.cos(simRef.current.aimAngle) >= 0;
          }
        }}
        onMouseUp={() => {
          simRef.current.mouseDown = false;
        }}
        onMouseLeave={() => {
          simRef.current.mouseDown = false;
        }}
        className="block w-full h-full cursor-crosshair"
      />

      {/* COMPACT TOP-LEFT HUD: Hull, Dash, Cells & Slim Partner Pills */}
      <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col gap-1.5 max-w-[230px]">
        <div className="pointer-events-auto bg-[#0b0f19]/85 border border-slate-700/80 rounded-lg px-2.5 py-1.5 backdrop-blur-sm shadow-md">
          <div className="flex items-center justify-between gap-3 text-[11px] text-slate-200 mb-1">
            <span className="inline-flex items-center gap-1 font-semibold">
              <Heart className="w-3 h-3 text-rose-500" />
              {t.hpLabel}
            </span>
            <span className="font-mono tabular-nums font-semibold">
              {playerHp}/{MAX_PLAYER_HP}
            </span>
          </div>
          <div className="w-44 h-1.5 bg-slate-900 rounded overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-150"
              style={{ width: `${Math.max(0, Math.min(100, (playerHp / MAX_PLAYER_HP) * 100))}%` }}
            />
          </div>
          <div className="mt-1 flex items-center justify-between text-[10px] font-mono tabular-nums text-slate-400">
            <span className={dashReady ? 'text-[#d9ff00]' : 'text-slate-500'}>
              {dashReady ? t.dashReady : t.dashCooldown}
            </span>
            <span className="text-cyan-300">
              {t.ammoLabel}: {portfolio.ammoCells}
            </span>
          </div>
        </div>

        {portfolio.companions.map((comp) => (
          <div
            key={comp.id}
            className="bg-[#0b0f19]/85 border border-sky-500/50 rounded-md px-2 py-1 flex items-center gap-2 backdrop-blur-sm"
          >
            <ItemPreviewArt
              kind={comp.kind === CompanionKind.SCOUT_DOG ? 'roboDog' : 'roboCat'}
              className="w-5 h-5 shrink-0"
            />
            <span className="text-[10px] font-semibold text-white truncate flex-1">
              {comp.nickname}
            </span>
            <span className="font-mono tabular-nums text-[9px] text-sky-300">
              {t.levelLabel}.{comp.level}
            </span>
          </div>
        ))}
      </div>

      {/* COMPACT TOP-RIGHT HUD: Mini Sci-Fi Radar + Wave / Sync + Audio / Pause */}
      <div className="absolute top-2.5 right-2.5 flex items-start gap-1.5">
        <div className="pointer-events-none bg-[#0b0f19]/85 border border-slate-700/80 rounded-lg p-1.5 backdrop-blur-sm flex items-center gap-2 shadow-md">
          <canvas
            ref={radarCanvasRef}
            width={104}
            height={72}
            className="rounded border border-cyan-500/40"
          />
          <div className="text-right pr-0.5 font-mono tabular-nums">
            <div className="text-[11px] text-slate-100 font-semibold">
              {t.waveLabel} {waveNumber} · {hostilesCount}
            </div>
            <div
              className={`text-[9px] mt-0.5 font-semibold truncate max-w-[128px] ${
                zoneBadge.isOutdoor ? 'text-fuchsia-400' : 'text-cyan-300/90'
              }`}
            >
              {zoneBadge.label}
            </div>
            <div className="text-[10px] mt-0.5">
              {swapComboActive ? (
                <span className="text-emerald-400 font-semibold">{t.protocolDesync}</span>
              ) : (
                <span className={currentWeaponSync >= 55 ? 'text-rose-400' : 'text-slate-400'}>
                  {t.dataSyncLabel}: {currentWeaponSync}%
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={toggleSound}
          title={muted ? t.soundOff : t.soundOn}
          className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#0b0f19]/85 border border-slate-700 text-slate-300 hover:text-white transition-colors"
        >
          {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
        </button>

        {gameState === GameState.PLAYING && (
          <button
            type="button"
            onClick={() => {
              simRef.current.mouseDown = false;
              setGameState(GameState.PAUSED);
            }}
            title={t.pause}
            className="h-8 w-8 inline-flex items-center justify-center rounded-lg bg-[#0b0f19]/85 border border-slate-700 text-slate-300 hover:text-white transition-colors"
          >
            <Pause className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* COMPACT BOTTOM-LEFT HUD: Slim Weapon Bar [1-4] with Matching Preview Art */}
      <div className="absolute bottom-2.5 left-2.5 flex items-end gap-1.5 max-w-[56vw] overflow-x-auto">
        {weaponCatalog.map((w) => {
          const isEquipped = portfolio.equippedWeapon === w.id;
          const syncPct = Math.round(dataSyncMap[w.id] || 0);
          const lvl = portfolio.weaponLevels[w.id] || 1;
          const isMax = lvl >= 5;
          const upgRu9 = 25000 * lvl;
          const upgCore = lvl;
          const canUpgrade = !isMax && portfolio[w.coreKey] >= upgCore;

          return (
            <div
              key={w.id}
              className={`flex flex-col w-[108px] rounded-lg border transition-all backdrop-blur-sm ${
                isEquipped
                  ? 'bg-[#12192b]/92 border-rose-500 shadow-md shadow-rose-950/40'
                  : 'bg-[#0b0f19]/85 border-slate-700/80 hover:border-slate-500'
              }`}
            >
              <button
                type="button"
                onClick={() => switchWeapon(w.id)}
                title={w.name}
                className="px-1.5 pt-1.5 pb-1 text-left w-full"
              >
                <div className="flex items-center justify-between text-[9px] font-mono tabular-nums mb-0.5">
                  <span className={isEquipped ? 'text-rose-400 font-bold' : 'text-slate-300'}>
                    [{w.key}] {t.levelLabel}.{lvl}
                  </span>
                  <span className={syncPct >= 60 ? 'text-rose-400' : 'text-slate-400'}>
                    {syncPct > 0 ? `${syncPct}%` : `+${(lvl - 1) * 22}%`}
                  </span>
                </div>
                <div className="w-full h-7 flex items-center justify-center bg-[#070a12]/90 border border-slate-800/70 rounded px-1 mb-1">
                  <WeaponPreviewArt weapon={w.id} className="w-full h-6" />
                </div>
                <div className="text-[10px] font-medium text-slate-100 truncate">{w.name}</div>
              </button>

              <div className="px-1.5 pb-1.5">
                <button
                  type="button"
                  disabled={isMax || !canUpgrade}
                  onClick={() => onUpgradeWeapon(w.id)}
                  title={`${t.upgradeBtn}: ${upgRu9.toLocaleString()} $RU9 + ${upgCore} ${w.coreLabel}`}
                  className="w-full py-0.5 px-1 rounded text-[9px] font-mono tabular-nums font-semibold flex items-center justify-center gap-0.5 bg-slate-900/90 hover:bg-slate-800 disabled:opacity-35 border border-slate-700/70 text-amber-300 transition-colors whitespace-nowrap"
                >
                  <ArrowUpCircle className="w-2.5 h-2.5 shrink-0" />
                  {isMax ? t.maxLevel : `${(upgRu9 / 1000).toFixed(0)}k+${upgCore}`}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* COMPACT BOTTOM-RIGHT HUD: Unobtrusive Quick Item Bar [G/H/R/F/B] */}
      <div className="absolute bottom-2.5 right-2.5 flex items-end gap-1">
        {[
          {
            hotkey: 'G',
            kind: 'sphere' as const,
            supplyKey: 'sphere' as const,
            cost: 2500,
            count: portfolio.masterSpheres,
            label: t.itemSphere.replace(/\[.\]/g, '').trim(),
            onTrigger: throwMasterPrism,
          },
          {
            hotkey: 'H',
            kind: 'medkit' as const,
            supplyKey: 'medkit' as const,
            cost: 1800,
            count: portfolio.medkits,
            label: t.itemMedkit.replace(/\[.\]/g, '').trim(),
            onTrigger: useMedkit,
          },
          {
            hotkey: 'R',
            kind: 'ammo' as const,
            supplyKey: 'ammo' as const,
            cost: 1200,
            count: portfolio.energyPacks,
            label: t.itemAmmo.replace(/\[.\]/g, '').trim(),
            onTrigger: useEnergyPack,
          },
          {
            hotkey: 'F',
            kind: 'patch' as const,
            supplyKey: 'patch' as const,
            cost: 2000,
            count: portfolio.firmwarePatches,
            label: t.itemPatch.replace(/\[.\]/g, '').trim(),
            onTrigger: useCompanionPatch,
          },
        ].map((slot) => (
          <div
            key={slot.hotkey}
            className="flex flex-col items-center w-[50px] rounded-lg bg-[#0b0f19]/85 border border-slate-700/80 p-1 backdrop-blur-sm"
          >
            <button
              type="button"
              onClick={slot.onTrigger}
              title={`${slot.label} [${slot.hotkey}]`}
              className="w-full flex flex-col items-center"
            >
              <div className="w-full flex items-center justify-between text-[9px] font-mono tabular-nums text-slate-400">
                <span>{slot.hotkey}</span>
                <span className={slot.count > 0 ? 'text-slate-100 font-semibold' : 'text-slate-600'}>
                  x{slot.count}
                </span>
              </div>
              <ItemPreviewArt kind={slot.kind} className="w-5 h-5 my-0.5" />
            </button>
            <button
              type="button"
              onClick={() => onBuySupply(slot.supplyKey)}
              title={`${t.buyBtn} (${slot.cost.toLocaleString()} $RU9)`}
              className="mt-0.5 w-full py-0.5 rounded bg-slate-900/90 hover:bg-sky-950/70 border border-slate-700/70 text-[8px] font-mono tabular-nums text-amber-300 flex items-center justify-center gap-0.5 transition-colors"
            >
              <Plus className="w-2 h-2" />
              {(slot.cost / 1000).toFixed(1)}k
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={onOpenBackpack}
          title={t.backpackBtn}
          className="flex flex-col items-center justify-center w-[50px] h-[68px] p-1 rounded-lg bg-[#131826]/90 border border-slate-700 hover:border-[#d9ff00] text-slate-100 transition-colors backdrop-blur-sm"
        >
          <span className="text-[9px] font-mono text-[#d9ff00]">[B]</span>
          <Backpack className="w-4 h-4 my-1 text-[#d9ff00]" />
          <span className="text-[9px] font-semibold truncate w-full text-center">
            {t.backpackBtn.replace(/\[.\]/g, '').trim()}
          </span>
        </button>
      </div>

      {/* CENTER OVERLAY: ENCRYPTED "EMERGENCY HACKED TERMINAL" FEED */}
      {gameState === GameState.TITLE_MENU && (
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
          <div className="w-full max-w-3xl bg-[#090c14]/95 border border-rose-500/50 rounded-xl shadow-2xl shadow-slate-950/60 overflow-hidden">
            <div className="bg-rose-950/45 border-b border-rose-500/40 px-5 py-2.5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-rose-400 font-mono text-xs font-bold tracking-wider">
                <Terminal className="w-4 h-4 text-rose-500 shrink-0" />
                <span>{t.emergencyTerminalTag}</span>
              </div>
              <div className="flex items-center gap-3">
                <img
                  src={ASSET_URLS.VIBEVIBE_LOGO}
                  alt="vibe/vibe"
                  referrerPolicy="no-referrer"
                  className="h-5 w-auto rounded bg-black px-1.5 py-0.5 object-contain border border-zinc-800"
                />
                <span className="text-[11px] font-mono text-[#d9ff00]">ROBINHOOD L2 #7999</span>
              </div>
            </div>

            <div className="p-5 md:p-6 space-y-4">
              <div className="bg-[#06080f] border border-rose-900/60 rounded-lg p-3.5 font-mono text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>[RED_EYE_DIRECTIVE :: SIGNAL INTERCEPTED — YEAR 2035]</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{t.heroSubcopy}</p>
                <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-sky-300/95 tabular-nums">
                  <span>DROPS: OpenAI Core · Anthropic Core · $RU9 (1,000,000 AUTO-REFRESH)</span>
                  <span>·</span>
                  <span className="text-[#d9ff00]">{t.speciesLimitHint}</span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
                <div className="md:col-span-7 space-y-2.5">
                  <h1
                    className="text-2xl sm:text-3xl font-bold text-white tracking-tight"
                    style={{ fontFamily: "'Barlow Condensed', sans-serif", textWrap: 'balance' }}
                  >
                    {t.heroHeadline}
                  </h1>
                  <p className="text-xs text-slate-400 font-mono">{t.controlsHint}</p>

                  <div className="pt-1">
                    <div className="text-xs font-semibold text-slate-300 mb-2">
                      {t.chooseOperative}
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {PLAYER_SKIN_META.map((skin) => {
                        const active = portfolio.selectedSkin === skin.id;
                        return (
                          <button
                            key={skin.id}
                            type="button"
                            onClick={() => onSelectSkin(skin.id)}
                            className={`flex flex-col items-center p-1.5 rounded-lg border text-center transition-all ${
                              active
                                ? 'bg-[#141928] border-[#d9ff00] text-white'
                                : 'bg-[#070a12] border-slate-800 text-slate-400 hover:border-slate-600'
                            }`}
                          >
                            <img
                              src={skin.portraitUrl}
                              alt={skin.name}
                              referrerPolicy="no-referrer"
                              className="w-11 h-14 rounded-md object-contain bg-slate-900/90 p-0.5 mb-1"
                            />
                            <span className="text-[10px] font-medium leading-tight line-clamp-1">
                              {skin.name.split('·')[0].trim()}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="md:col-span-5">
                  <div className="rounded-lg overflow-hidden border border-slate-800 bg-black relative">
                    <img
                      src={ASSET_URLS.KEYCAP_HERO}
                      alt="Core Liquidation"
                      referrerPolicy="no-referrer"
                      className="w-full h-40 object-cover"
                    />
                    <div className="px-3 py-1.5 bg-[#090c14]/95 border-t border-slate-800 flex items-center justify-between text-[10px] font-mono">
                      <span className="text-slate-300">QUANTUM CORE FACILITY</span>
                      <span className="text-emerald-400">OpenAI Core · Anthropic Core</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-800/90 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={() => startWave(1, true)}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-950/50 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {t.startGame}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenBackpack}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    <Backpack className="w-4 h-4 text-[#d9ff00]" />
                    {t.backpackBtn}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onExtractToSanctuary}
                  className="text-xs font-mono text-slate-300 hover:text-[#d9ff00] underline underline-offset-4 transition-colors whitespace-nowrap"
                >
                  {t.extractSanctuary} →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: PAUSED */}
      {gameState === GameState.PAUSED && !isBackpackOpen && (
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-xl p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100">{t.pause}</h2>
            <p className="mt-1.5 text-xs text-slate-400">{t.controlsHint}</p>
            <div className="mt-6 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setGameState(GameState.PLAYING)}
                className="w-full py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
              >
                {t.resumeGame}
              </button>
              <button
                type="button"
                onClick={onOpenBackpack}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                {t.backpackBtn}
              </button>
              <button
                type="button"
                onClick={onExtractToSanctuary}
                className="w-full py-2.5 px-4 rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium transition-colors"
              >
                {t.extractSanctuary}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: WAVE CLEARED / GAME OVER */}
      {(gameState === GameState.ROUND_SUMMARY || gameState === GameState.GAME_OVER) && (
        <div className="absolute inset-0 bg-slate-950/72 backdrop-blur-sm flex items-center justify-center p-6">
          <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-xl p-6 shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-50">
              {gameState === GameState.ROUND_SUMMARY ? t.summaryVictory : t.summaryDefeat}
            </h2>
            <div className="mt-4 py-3 border-y border-slate-800 space-y-2 text-sm font-mono tabular-nums">
              <div className="flex justify-between text-slate-300">
                <span>{t.summaryCoresLooted}</span>
                <span className="text-sky-300 font-semibold">
                  {sessionLoot.oCores} OpenAI Core · {sessionLoot.aCores} Anthropic Core
                </span>
              </div>
              <div className="flex justify-between text-slate-300">
                <span>{t.summaryRu9Earned}</span>
                <span className="text-amber-400">
                  {Math.round(portfolio.ru9).toLocaleString()} $RU9
                </span>
              </div>
            </div>

            <div className="mt-5 flex flex-wrap gap-2.5">
              {gameState === GameState.ROUND_SUMMARY ? (
                <button
                  type="button"
                  onClick={() => startWave(waveNumber + 1, false)}
                  className="flex-1 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {t.nextWave} ({waveNumber + 1})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startWave(1, true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.playAgain}
                </button>
              )}
              <button
                type="button"
                onClick={onExtractToSanctuary}
                className="py-2.5 px-4 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
              >
                {t.extractSanctuary}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
