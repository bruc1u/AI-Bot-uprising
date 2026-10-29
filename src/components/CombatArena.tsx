import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  ArrowUp,
  Backpack,
  Gamepad2,
  Heart,
  LayoutGrid,
  Map as MapIcon,
  Pause,
  Play,
  RotateCcw,
  Shield,
  Skull,
  Terminal,
  Volume2,
  VolumeX,
  X,
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
  MECHA_WASTELAND_DIVIDE_X,
  OUTDOOR_DIVIDE_X,
  PLAYER_SPAWN_X,
  PLAYER_SPAWN_Y,
  renderWorld25D,
  WORLD_H,
  WORLD_W,
} from '../game/engineStep';
import { isEldritchEnemyKind } from '../game/eldritchSprites';
import { isMechaOrChimeraKind, isWorldBossKind } from '../game/mechChimeraSprites';
import { ActiveBossHudState, findLockedTarget, stepCombatPhysics } from '../game/physicsTick';
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
import { MobileTouchControls } from './MobileTouchControls';

interface CombatArenaProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  isBackpackOpen: boolean;
  topBarHidden: boolean;
  onToggleTopBar: () => void;
  onPlayingStateChange: (isPlaying: boolean) => void;
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
  topBarHidden,
  onToggleTopBar,
  onPlayingStateChange,
  onOpenBackpack,
  onSelectSkin,
  onSelectWeapon,
  onUpgradeWeapon,
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
  const [activeBoss, setActiveBoss] = useState<ActiveBossHudState | null>(null);
  const lastBossSignatureRef = useRef<string>('');
  const [forceTouchPad, setForceTouchPad] = useState<boolean>(false);

  // Minimap Radar is HIDDEN by default so the combat screen stays wide open; toggle with [M] or Map icon!
  const [showRadar, setShowRadar] = useState<boolean>(false);
  const showRadarRef = useRef<boolean>(false);
  showRadarRef.current = showRadar;

  const [zoneBadge, setZoneBadge] = useState<{
    label: string;
    isOutdoor: boolean;
    isMechaWasteland: boolean;
  }>({
    label: 'SECTOR-00 · QUANTUM COMMAND HUB',
    isOutdoor: false,
    isMechaWasteland: false,
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
    onPlayingStateChange(gameState === GameState.PLAYING);
    return () => {
      onPlayingStateChange(false);
    };
  }, [gameState, onPlayingStateChange]);

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
      s.hp = Math.min(MAX_PLAYER_HP, s.hp + 55);
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
    setActiveBoss(null);
    lastBossSignatureRef.current = '';
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

  const triggerDash = useCallback(() => {
    if (gameStateRef.current !== GameState.PLAYING) return;
    const s = simRef.current;
    if (s.dashCooldown <= 0) {
      s.dashCooldown = 0.85;
      s.dashActiveTimer = 0.17;
      s.invulnTimer = 0.35;
      let dx = s.touchMoveX || 0;
      let dy = s.touchMoveY || 0;
      if (s.keys.has('KeyW') || s.keys.has('ArrowUp')) dy -= 1;
      if (s.keys.has('KeyS') || s.keys.has('ArrowDown')) dy += 1;
      if (s.keys.has('KeyA') || s.keys.has('ArrowLeft')) dx -= 1;
      if (s.keys.has('KeyD') || s.keys.has('ArrowRight')) dx += 1;
      const angle =
        Math.hypot(dx, dy) > 0.1
          ? Math.atan2(dy, dx)
          : s.touchAimActive
          ? s.aimAngle
          : s.facingRight
          ? 0
          : Math.PI;
      s.dashVx = Math.cos(angle) * 780;
      s.dashVy = Math.sin(angle) * 780;
      setDashReady(false);
      soundFX.playArcSlash(false);
    }
  }, []);

  const throwMasterPrism = useCallback(() => {
    const p = portfolioRef.current;
    const s = simRef.current;
    if (gameStateRef.current !== GameState.PLAYING || p.masterSpheres <= 0) return;

    const ownsDog = p.companions.some((c) => c.kind === CompanionKind.SCOUT_DOG);
    const ownsCat = p.companions.some((c) => c.kind === CompanionKind.CYBER_CAT);

    let angle = s.aimAngle;
    let bestDist = 580;
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
      text: 'PET UPGRADED!',
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

      if (e.code === 'KeyM') {
        e.preventDefault();
        setShowRadar((v) => !v);
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
        triggerDash();
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
    triggerDash,
    useCompanionPatch,
    useEnergyPack,
    useMedkit,
  ]);

  // 60fps World + On-Demand Collapsible 3-Biome Radar Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      // Wider camera field-of-view on compact landscape screens so battlefield never feels cramped
      const viewScale = rect.height < 500 ? 1.35 : rect.width < 960 ? 1.18 : 1;
      canvas.width = Math.max(640, Math.floor(rect.width * viewScale));
      canvas.height = Math.max(400, Math.floor(rect.height * viewScale));
    };
    resize();
    window.addEventListener('resize', resize);

    if (simRef.current.enemies.length === 0) {
      const preview = buildWaveEnemies(1);
      simRef.current.enemies = preview.enemies.slice(0, 8);
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
          setActiveBoss: (boss) => {
            const sig = boss ? `${boss.kind}:${boss.hp}:${boss.armor}` : '';
            if (sig !== lastBossSignatureRef.current) {
              lastBossSignatureRef.current = sig;
              setActiveBoss(boss);
            }
          },
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
      const isMecha = Boolean(zNow.isMechaWasteland);
      setZoneBadge((prev) =>
        prev.label === zNow.code &&
        prev.isOutdoor === zNow.isOutdoor &&
        prev.isMechaWasteland === isMecha
          ? prev
          : { label: zNow.code, isOutdoor: zNow.isOutdoor, isMechaWasteland: isMecha }
      );

      // Only draw Radar when expanded by user
      if (showRadarRef.current) {
        const rCanvas = radarCanvasRef.current;
        if (rCanvas) {
          const rCtx = rCanvas.getContext('2d');
          if (rCtx) {
            const rw = rCanvas.width;
            const rh = rCanvas.height;
            const divRx = (OUTDOOR_DIVIDE_X / WORLD_W) * rw;
            const mechaRx = (MECHA_WASTELAND_DIVIDE_X / WORLD_W) * rw;

            rCtx.fillStyle = '#0d1524';
            rCtx.fillRect(0, 0, divRx, rh);
            rCtx.fillStyle = '#1b0921';
            rCtx.fillRect(divRx, 0, mechaRx - divRx, rh);
            rCtx.fillStyle = '#221307';
            rCtx.fillRect(mechaRx, 0, rw - mechaRx, rh);

            rCtx.strokeStyle = 'rgba(249, 115, 22, 0.45)';
            rCtx.lineWidth = 1;
            rCtx.beginPath();
            rCtx.moveTo(mechaRx, 0);
            rCtx.lineTo(mechaRx, rh);
            rCtx.stroke();

            for (const w of FACILITY_PARTITION_WALLS) {
              const wx = (w.x / WORLD_W) * rw;
              const wy = (w.y / WORLD_H) * rh;
              const ww = Math.max(1.2, (w.w / WORLD_W) * rw);
              const wh = Math.max(1.2, (w.h / WORLD_H) * rh);
              rCtx.fillStyle =
                Math.abs(w.x - (OUTDOOR_DIVIDE_X - 18)) < 30
                  ? 'rgba(232, 121, 249, 0.8)'
                  : 'rgba(56, 189, 248, 0.48)';
              rCtx.fillRect(wx, wy, ww, wh);
            }

            rCtx.strokeStyle = isMecha
              ? 'rgba(249, 115, 22, 0.75)'
              : zNow.isOutdoor
              ? 'rgba(232, 121, 249, 0.7)'
              : 'rgba(0, 229, 255, 0.5)';
            rCtx.lineWidth = 1.2;
            rCtx.strokeRect(0.5, 0.5, rw - 1, rh - 1);

            for (const c of s.chests) {
              if (c.opened) continue;
              rCtx.fillStyle = '#eab308';
              rCtx.fillRect((c.x / WORLD_W) * rw - 1.2, (c.y / WORLD_H) * rh - 1.2, 2.4, 2.4);
            }

            for (const e of s.enemies) {
              const isWild =
                e.kind === EnemyKind.WILD_SCOUT_DOG || e.kind === EnemyKind.WILD_CYBER_CAT;
              const boss = isWorldBossKind(e.kind);
              const eld = isEldritchEnemyKind(e.kind);
              const mech = isMechaOrChimeraKind(e.kind);
              rCtx.fillStyle = boss
                ? '#fde047'
                : isWild
                ? '#a78bfa'
                : mech
                ? '#fb923c'
                : eld
                ? '#e879f9'
                : '#ff1744';
              const blipSz = boss ? 4.4 : 2.3;
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
            rCtx.arc((s.px / WORLD_W) * rw, (s.py / WORLD_H) * rh, 2.7, 0, Math.PI * 2);
            rCtx.fill();
          }
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

  // Trigger resize recalculation when topBarHidden toggles so canvas smoothly fills 100dvh
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const rect = container.getBoundingClientRect();
    const viewScale = rect.height < 500 ? 1.35 : rect.width < 960 ? 1.18 : 1;
    canvas.width = Math.max(640, Math.floor(rect.width * viewScale));
    canvas.height = Math.max(400, Math.floor(rect.height * viewScale));
  }, [topBarHidden]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const s = simRef.current;
    if (s.touchAimActive) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const mx = (e.clientX - rect.left) * scaleX;
    const my = (e.clientY - rect.top) * scaleY;
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

  const getBossDisplayName = (kind: EnemyKind): string => {
    if (kind === EnemyKind.BOSS_IRON_COLOSSUS_TITAN) return t.bossTitanName;
    if (kind === EnemyKind.BOSS_OMEGA_CHIMERA_AMALGAM) return t.bossChimeraName;
    return t.bossCthulhuName;
  };

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

  const quickItems = [
    {
      hotkey: 'G',
      kind: 'sphere' as const,
      count: portfolio.masterSpheres,
      label: t.itemSphere.replace(/\[.\]/g, '').trim(),
      onTrigger: throwMasterPrism,
    },
    {
      hotkey: 'H',
      kind: 'medkit' as const,
      count: portfolio.medkits,
      label: t.itemMedkit.replace(/\[.\]/g, '').trim(),
      onTrigger: useMedkit,
    },
    {
      hotkey: 'R',
      kind: 'ammo' as const,
      count: portfolio.energyPacks,
      label: t.itemAmmo.replace(/\[.\]/g, '').trim(),
      onTrigger: useEnergyPack,
    },
    {
      hotkey: 'F',
      kind: 'patch' as const,
      count: portfolio.firmwarePatches,
      label: t.itemPatch.replace(/\[.\]/g, '').trim(),
      onTrigger: useCompanionPatch,
    },
  ];

  return (
    <div
      ref={containerRef}
      className={`relative w-full ${
        topBarHidden ? 'h-dvh' : 'h-[calc(100dvh-40px)]'
      } min-h-[280px] bg-[#141b26] overflow-hidden select-none`}
    >
      {/* 2.5D Open-World & Multi-Room Facility Canvas */}
      <canvas
        ref={canvasRef}
        onMouseMove={handleMouseMove}
        onMouseDown={(e) => {
          if (e.button === 0 && gameState === GameState.PLAYING) {
            simRef.current.touchAimActive = false;
            simRef.current.mouseDown = true;
            simRef.current.facingRight = Math.cos(simRef.current.aimAngle) >= 0;
          }
        }}
        onMouseUp={() => {
          if (!simRef.current.touchAimActive) {
            simRef.current.mouseDown = false;
          }
        }}
        onMouseLeave={() => {
          if (!simRef.current.touchAimActive) {
            simRef.current.mouseDown = false;
          }
        }}
        className="block w-full h-full cursor-crosshair touch-none"
      />

      {/* TOP-CENTER WORLD BOSS HEALTH BAR (Only when near a Boss) */}
      {gameState === GameState.PLAYING && activeBoss && (
        <div className="pointer-events-none absolute top-1.5 left-1/2 -translate-x-1/2 z-20 w-[min(320px,42vw)] bg-[#0b0812]/80 border border-rose-500/65 rounded-lg px-2.5 py-1 backdrop-blur-sm">
          <div className="flex items-center justify-between gap-2 text-[10px] font-mono tabular-nums mb-0.5">
            <span className="inline-flex items-center gap-1 font-bold text-amber-300 truncate">
              <Skull className="w-3 h-3 text-rose-500 shrink-0" />
              {getBossDisplayName(activeBoss.kind)}
            </span>
            <span className="text-rose-200 font-semibold shrink-0">
              {activeBoss.hp}/{activeBoss.maxHp}
              {activeBoss.armor > 0 && (
                <span className="text-cyan-300 ml-1 inline-flex items-center gap-0.5">
                  <Shield className="w-2.5 h-2.5 inline" />
                  {activeBoss.armor}
                </span>
              )}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-950 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-rose-600 via-orange-500 to-amber-400 transition-all duration-100"
              style={{
                width: `${Math.max(0, Math.min(100, (activeBoss.hp / activeBoss.maxHp) * 100))}%`,
              }}
            />
          </div>
        </div>
      )}

      {/* ULTRA-SLIM TOP-LEFT MICRO STATUS STRIP (HP + Cells + Core Counts + Tiny Pet Icons) */}
      <div className="pointer-events-none absolute top-1.5 left-2 z-10 flex items-center gap-1.5 flex-wrap max-w-[48vw]">
        <div className="bg-[#090d16]/75 border border-slate-700/70 rounded-md px-2 py-1 backdrop-blur-sm flex items-center gap-2">
          <Heart className="w-3 h-3 text-rose-500 shrink-0" />
          <div className="w-20 sm:w-24 h-1.5 bg-slate-900 rounded-full overflow-hidden">
            <div
              className="h-full bg-rose-500 transition-all duration-150"
              style={{ width: `${Math.max(0, Math.min(100, (playerHp / MAX_PLAYER_HP) * 100))}%` }}
            />
          </div>
          <span className="text-[10px] font-mono tabular-nums font-semibold text-slate-200">
            {playerHp}
          </span>
          <span className="text-slate-600 text-[10px]">·</span>
          <span className="text-[10px] font-mono tabular-nums text-cyan-300">
            ⚡{portfolio.ammoCells}
          </span>
        </div>

        {/* Tiny inline Core readout when top header is auto-hidden */}
        {topBarHidden && (
          <div className="hidden sm:flex items-center gap-2 bg-[#090d16]/70 border border-slate-700/60 rounded-md px-2 py-1 text-[10px] font-mono tabular-nums backdrop-blur-sm">
            <span className="inline-flex items-center gap-1 text-white">
              <ItemPreviewArt kind="oCore" className="w-3.5 h-3.5" />
              {portfolio.oCores}
            </span>
            <span className="inline-flex items-center gap-1 text-cyan-300">
              <ItemPreviewArt kind="aCore" className="w-3.5 h-3.5" />
              {portfolio.aCores}
            </span>
          </div>
        )}

        {portfolio.companions.map((comp) => (
          <div
            key={comp.id}
            className="bg-[#090d16]/75 border border-sky-500/45 rounded-md px-1.5 py-0.5 flex items-center gap-1 backdrop-blur-sm"
          >
            <ItemPreviewArt
              kind={comp.kind === CompanionKind.SCOUT_DOG ? 'roboDog' : 'roboCat'}
              className="w-4 h-4 shrink-0"
            />
            <span className="font-mono tabular-nums text-[9px] text-sky-300">
              L{comp.level}
            </span>
          </div>
        ))}
      </div>

      {/* ULTRA-SLIM TOP-RIGHT MICRO CONTROLS + COLLAPSIBLE MINIMAP RADAR ([M]) */}
      <div className="absolute top-1.5 right-2 z-20 flex flex-col items-end gap-1">
        <div className="flex items-center gap-1">
          <div className="pointer-events-none h-7 px-2 rounded-md bg-[#090d16]/75 border border-slate-700/70 backdrop-blur-sm flex items-center gap-1.5 text-[10px] font-mono tabular-nums">
            <span className="text-slate-100 font-semibold">
              W{waveNumber} · {hostilesCount}
            </span>
            {swapComboActive && (
              <span className="text-emerald-400 font-semibold">+30%</span>
            )}
          </div>

          {/* Toggle Collapsible Minimap Radar ([M]) */}
          <button
            type="button"
            onClick={() => setShowRadar((v) => !v)}
            title="Map [M]"
            className={`h-7 px-1.5 inline-flex items-center gap-1 rounded-md border text-[10px] font-mono transition-colors ${
              showRadar
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-200'
                : 'bg-[#090d16]/75 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">M</span>
          </button>

          {/* Toggle Virtual Touch Sticks */}
          <button
            type="button"
            onClick={() => setForceTouchPad((v) => !v)}
            title={t.touchControlsLabel}
            className={`h-7 w-7 inline-flex items-center justify-center rounded-md border transition-colors ${
              forceTouchPad
                ? 'bg-cyan-950/90 border-cyan-400 text-cyan-300'
                : 'bg-[#090d16]/75 border-slate-700/80 text-slate-300 hover:text-white'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
          </button>

          {/* Toggle Audio */}
          <button
            type="button"
            onClick={toggleSound}
            title={muted ? t.soundOff : t.soundOn}
            className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-[#090d16]/75 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
          >
            {muted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
          </button>

          {/* Show / Hide Top Navigation Header */}
          {gameState === GameState.PLAYING && (
            <button
              type="button"
              onClick={onToggleTopBar}
              title={t.navArena}
              className={`h-7 w-7 inline-flex items-center justify-center rounded-md border transition-colors ${
                !topBarHidden
                  ? 'bg-rose-950/80 border-rose-500/70 text-rose-200'
                  : 'bg-[#090d16]/75 border-slate-700/80 text-slate-300 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          )}

          {/* Pause */}
          {gameState === GameState.PLAYING && (
            <button
              type="button"
              onClick={() => {
                simRef.current.mouseDown = false;
                simRef.current.touchMoveX = 0;
                simRef.current.touchMoveY = 0;
                simRef.current.touchAimActive = false;
                setGameState(GameState.PAUSED);
              }}
              title={t.pause}
              className="h-7 w-7 inline-flex items-center justify-center rounded-md bg-[#090d16]/75 border border-slate-700/80 text-slate-300 hover:text-white transition-colors"
            >
              <Pause className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* COLLAPSIBLE MINIMAP DRAWER (Hidden unless user clicks Map / presses M) */}
        {showRadar && (
          <div className="bg-[#090d16]/90 border border-cyan-500/45 rounded-lg p-1.5 backdrop-blur-md shadow-xl flex flex-col items-end gap-1">
            <div className="w-full flex items-center justify-between gap-2 text-[9px] font-mono">
              <span
                className={`truncate max-w-[125px] font-semibold ${
                  zoneBadge.isMechaWasteland
                    ? 'text-orange-400'
                    : zoneBadge.isOutdoor
                    ? 'text-fuchsia-400'
                    : 'text-cyan-300'
                }`}
              >
                {zoneBadge.label}
              </span>
              <button
                type="button"
                onClick={() => setShowRadar(false)}
                className="text-slate-400 hover:text-white p-0.5"
                aria-label="Hide Map"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
            <canvas
              ref={radarCanvasRef}
              width={144}
              height={88}
              className="rounded border border-slate-700/80"
            />
          </div>
        )}
      </div>

      {/* MOBILE LANDSCAPE TRANSLUCENT CORNER STICKS */}
      {gameState === GameState.PLAYING && (
        <MobileTouchControls
          t={t}
          simRef={simRef}
          dashReady={dashReady}
          forceVisible={forceTouchPad}
          onTriggerDash={triggerDash}
        />
      )}

      {/* UNIFIED ULTRA-COMPACT BOTTOM-CENTER HOTBAR (36px tall — Weapons [1-4] + Items [G/H/R/F] + Backpack [B]) */}
      <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1 bg-[#090d16]/78 border border-slate-700/75 rounded-lg p-1 backdrop-blur-sm shadow-lg max-w-[calc(100vw-180px)] overflow-x-auto">
        {/* 4 Micro Weapon Slots */}
        {weaponCatalog.map((w) => {
          const isEquipped = portfolio.equippedWeapon === w.id;
          const lvl = portfolio.weaponLevels[w.id] || 1;
          const isMax = lvl >= 5;
          const canUpgrade = !isMax && portfolio[w.coreKey] >= lvl;

          return (
            <div key={w.id} className="relative shrink-0">
              <button
                type="button"
                onClick={() => switchWeapon(w.id)}
                title={`${w.name} [${w.key}] · Lv.${lvl}`}
                className={`w-[44px] h-[30px] rounded flex flex-col items-center justify-between px-1 py-0.5 border transition-colors ${
                  isEquipped
                    ? 'bg-rose-950/55 border-rose-500 text-white'
                    : 'bg-[#0d1322]/85 border-slate-800 hover:border-slate-600 text-slate-400'
                }`}
              >
                <div className="w-full flex items-center justify-between text-[7px] font-mono leading-none">
                  <span className={isEquipped ? 'text-rose-300 font-bold' : 'text-slate-500'}>
                    {w.key}
                  </span>
                  <span className="text-slate-300">L{lvl}</span>
                </div>
                <WeaponPreviewArt weapon={w.id} className="w-8 h-3.5" />
              </button>

              {canUpgrade && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpgradeWeapon(w.id);
                  }}
                  title={`${t.upgradeBtn} (${(25 * lvl).toFixed(0)}k $RU9 + ${lvl} ${w.coreLabel})`}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-amber-400 hover:bg-amber-300 text-slate-950 flex items-center justify-center shadow"
                >
                  <ArrowUp className="w-2.5 h-2.5 stroke-[3]" />
                </button>
              )}
            </div>
          );
        })}

        <div className="w-px h-5 bg-slate-700/80 mx-0.5 shrink-0" />

        {/* 4 Micro Quick-Item Slots */}
        {quickItems.map((slot) => (
          <button
            key={slot.hotkey}
            type="button"
            onClick={slot.onTrigger}
            title={`${slot.label} [${slot.hotkey}]`}
            className="relative w-[30px] h-[30px] shrink-0 rounded bg-[#0d1322]/85 hover:bg-slate-800 border border-slate-800 hover:border-slate-600 flex items-center justify-center transition-colors"
          >
            <span className="absolute top-0.5 left-0.5 text-[7px] font-mono leading-none text-slate-500">
              {slot.hotkey}
            </span>
            <ItemPreviewArt kind={slot.kind} className="w-4 h-4" />
            <span
              className={`absolute bottom-0 right-0.5 text-[8px] font-mono leading-none font-bold ${
                slot.count > 0 ? 'text-slate-100' : 'text-slate-600'
              }`}
            >
              {slot.count}
            </span>
          </button>
        ))}

        {/* Micro Backpack Button [B] */}
        <button
          type="button"
          onClick={onOpenBackpack}
          title={t.backpackBtn}
          className="relative w-[30px] h-[30px] shrink-0 rounded bg-[#131a2e]/90 hover:bg-slate-800 border border-slate-700 hover:border-[#d9ff00] flex items-center justify-center transition-colors"
        >
          <Backpack className="w-3.5 h-3.5 text-[#d9ff00]" />
        </button>
      </div>

      {/* CENTER OVERLAY: ENCRYPTED "EMERGENCY HACKED TERMINAL" FEED */}
      {gameState === GameState.TITLE_MENU && (
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[2px] flex items-center justify-center p-3 sm:p-6 overflow-y-auto z-30">
          <div className="w-full max-w-3xl my-auto bg-[#090c14]/95 border border-rose-500/50 rounded-xl shadow-2xl shadow-slate-950/60 overflow-hidden">
            <div className="bg-rose-950/45 border-b border-rose-500/40 px-4 sm:px-5 py-2 flex flex-wrap items-center justify-between gap-3">
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

            <div className="p-4 sm:p-6 space-y-4">
              <div className="bg-[#06080f] border border-rose-900/60 rounded-lg p-3 font-mono text-xs space-y-1.5">
                <div className="flex items-center gap-2 text-rose-400 font-semibold">
                  <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                  <span>{t.heroKicker}</span>
                </div>
                <p className="text-slate-300 leading-relaxed">{t.heroSubcopy}</p>
                <div className="pt-0.5 text-[11px] text-cyan-300/95 tabular-nums">
                  {t.heroZonesSummary}
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
                    <div className="text-xs font-semibold text-slate-300 mb-1.5">
                      {t.chooseOperative}
                    </div>
                    <div className="grid grid-cols-4 gap-2">
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
                              className="w-10 h-12 sm:w-11 sm:h-14 rounded-md object-contain bg-slate-900/90 p-0.5 mb-1"
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

                <div className="md:col-span-5 hidden md:block">
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
                    className="inline-flex items-center gap-2 px-6 py-2 min-h-[42px] rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors shadow-lg shadow-rose-950/50 whitespace-nowrap"
                  >
                    <Play className="w-4 h-4 fill-current" />
                    {t.startGame}
                  </button>
                  <button
                    type="button"
                    onClick={onOpenBackpack}
                    className="inline-flex items-center gap-2 px-4 py-2 min-h-[42px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
                  >
                    <Backpack className="w-4 h-4 text-[#d9ff00]" />
                    {t.backpackBtn}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={onExtractToSanctuary}
                  className="text-xs font-mono text-slate-300 hover:text-[#d9ff00] underline underline-offset-4 transition-colors whitespace-nowrap py-1.5"
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
        <div className="absolute inset-0 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 z-30">
          <div className="w-full max-w-md bg-[#0b0f19] border border-slate-800 rounded-xl p-6 text-center shadow-2xl">
            <h2 className="text-2xl font-bold text-slate-100">{t.pause}</h2>
            <p className="mt-1.5 text-xs text-slate-400">{t.controlsHint}</p>
            <div className="mt-5 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => setGameState(GameState.PLAYING)}
                className="w-full py-2.5 px-4 min-h-[42px] rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors"
              >
                {t.resumeGame}
              </button>
              <button
                type="button"
                onClick={onOpenBackpack}
                className="w-full py-2.5 px-4 min-h-[42px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors"
              >
                {t.backpackBtn}
              </button>
              <button
                type="button"
                onClick={onExtractToSanctuary}
                className="w-full py-2.5 px-4 min-h-[42px] rounded-lg bg-slate-950 hover:bg-slate-900 border border-slate-800 text-slate-300 text-sm font-medium transition-colors"
              >
                {t.extractSanctuary}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* OVERLAY: WAVE CLEARED / GAME OVER */}
      {(gameState === GameState.ROUND_SUMMARY || gameState === GameState.GAME_OVER) && (
        <div className="absolute inset-0 bg-slate-950/72 backdrop-blur-sm flex items-center justify-center p-4 z-30">
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
                  className="flex-1 py-2.5 px-4 min-h-[42px] rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  {t.nextWave} ({waveNumber + 1})
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => startWave(1, true)}
                  className="flex-1 inline-flex items-center justify-center gap-2 py-2.5 px-4 min-h-[42px] rounded-lg bg-rose-600 hover:bg-rose-500 text-white text-sm font-semibold transition-colors whitespace-nowrap"
                >
                  <RotateCcw className="w-4 h-4" />
                  {t.playAgain}
                </button>
              )}
              <button
                type="button"
                onClick={onExtractToSanctuary}
                className="py-2.5 px-4 min-h-[42px] rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 text-sm font-medium transition-colors whitespace-nowrap"
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
