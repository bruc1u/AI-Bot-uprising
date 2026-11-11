import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Crosshair,
  Maximize2,
  Move,
  RotateCcw,
  Settings,
  Sliders,
  Volume2,
  X,
  Zap,
} from 'lucide-react';
import { SimState, WORLD_H, WORLD_W } from '../game/engineStep';
import { WEAPON_CATALOG_CONFIG } from '../game/equipmentConfig';
import { TranslationStrings } from '../i18n/translations';
import {
  DEFAULT_TOUCH_SETTINGS,
  EnemyKind,
  TOUCH_SETTINGS_STORAGE_KEY,
  TouchControlSettings,
  WeaponId,
} from '../types/game';
import { WeaponPreviewArt } from './GameIllustrations';

interface MobileTouchControlsProps {
  t: TranslationStrings;
  simRef: React.MutableRefObject<SimState>;
  dashReady: boolean;
  forceVisible: boolean;
  onTriggerDash: () => void;
  canvasRef?: React.RefObject<HTMLCanvasElement | null>;
  ownedWeapons?: WeaponId[];
  equippedWeapon?: WeaponId;
  onSelectWeapon?: (w: WeaponId) => void;
  onCycleWeapon?: (dir: 1 | -1) => void;
  touchSettings?: TouchControlSettings;
  onUpdateTouchSettings?: (settings: TouchControlSettings) => void;
  isSettingsOpen?: boolean;
  onToggleSettings?: (open: boolean) => void;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  t,
  simRef,
  dashReady,
  forceVisible,
  onTriggerDash,
  canvasRef,
  ownedWeapons = [],
  equippedWeapon,
  onSelectWeapon,
  onCycleWeapon,
  touchSettings,
  onUpdateTouchSettings,
  isSettingsOpen,
  onToggleSettings,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState<boolean>(false);
  const [dismissedPortraitHint, setDismissedPortraitHint] = useState<boolean>(false);

  // Local settings fallback if not provided via props
  const [internalSettings, setInternalSettings] = useState<TouchControlSettings>(() => {
    if (touchSettings) return touchSettings;
    try {
      const saved = localStorage.getItem(TOUCH_SETTINGS_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_TOUCH_SETTINGS;
  });

  const settings = touchSettings || internalSettings;
  const updateSettings = (next: TouchControlSettings) => {
    setInternalSettings(next);
    if (onUpdateTouchSettings) {
      onUpdateTouchSettings(next);
    }
    try {
      localStorage.setItem(TOUCH_SETTINGS_STORAGE_KEY, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  // Internal modal state if not controlled externally
  const [internalModalOpen, setInternalModalOpen] = useState<boolean>(false);
  const modalOpen = isSettingsOpen !== undefined ? isSettingsOpen : internalModalOpen;
  const setModalOpen = (open: boolean) => {
    if (onToggleSettings) {
      onToggleSettings(open);
    } else {
      setInternalModalOpen(open);
    }
  };

  // Quick weapon selector wheel/tray visibility
  const [weaponWheelOpen, setWeaponWheelOpen] = useState<boolean>(false);

  // Movement Joystick State
  const [joystickOrigin, setJoystickOrigin] = useState<{ x: number; y: number } | null>(null);
  const [leftKnob, setLeftKnob] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Aim Joystick State (when in 'joystick' fire mode)
  const [rightKnob, setRightKnob] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  // Tap-to-shoot visual reticle
  const [tapReticle, setTapReticle] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const movePointerId = useRef<number | null>(null);
  const firePointerId = useRef<number | null>(null);
  const fixedMoveZoneRef = useRef<HTMLDivElement | null>(null);
  const fixedFireZoneRef = useRef<HTMLDivElement | null>(null);

  // Swipe detection for weapon quick-swap
  const swipeStartX = useRef<number | null>(null);
  const swipeStartY = useRef<number | null>(null);

  useEffect(() => {
    const checkViewport = () => {
      const hasTouch =
        typeof window !== 'undefined' &&
        ('ontouchstart' in window || navigator.maxTouchPoints > 0);
      setIsTouchDevice(hasTouch);
      setIsPortraitMobile(
        typeof window !== 'undefined' &&
          window.innerWidth < window.innerHeight &&
          window.innerWidth < 860
      );
    };

    checkViewport();
    window.addEventListener('resize', checkViewport);
    window.addEventListener('orientationchange', checkViewport);
    return () => {
      window.removeEventListener('resize', checkViewport);
      window.removeEventListener('orientationchange', checkViewport);
      simRef.current.touchMoveX = 0;
      simRef.current.touchMoveY = 0;
      simRef.current.touchAimActive = false;
    };
  }, [simRef]);

  const requestLandscapeFullscreen = async () => {
    try {
      const docEl = document.documentElement as HTMLElement & {
        webkitRequestFullscreen?: () => Promise<void>;
      };
      if (docEl.requestFullscreen) {
        await docEl.requestFullscreen();
      } else if (docEl.webkitRequestFullscreen) {
        await docEl.webkitRequestFullscreen();
      }
      const scr = window.screen as Screen & {
        orientation?: { lock?: (mode: string) => Promise<void> };
      };
      if (scr.orientation && typeof scr.orientation.lock === 'function') {
        await scr.orientation.lock('landscape');
      }
    } catch {
      // Ignore orientation lock rejection on browsers requiring physical rotation
    }
    setDismissedPortraitHint(true);
  };

  const MAX_RADIUS = 36 * (settings.joystickScale || 1.0);

  // Helper to aim at nearest enemy
  const aimAtNearestEnemy = () => {
    const s = simRef.current;
    let bestDist = 720;
    let bestAng = s.aimAngle;
    let found = false;
    for (const e of s.enemies) {
      if (
        e.hp <= 0 ||
        e.kind === EnemyKind.WILD_SCOUT_DOG ||
        e.kind === EnemyKind.WILD_CYBER_CAT ||
        e.kind === EnemyKind.WILD_PUMPKIN_SPIRIT ||
        e.kind === EnemyKind.WILD_NIGHT_BAT
      ) {
        continue;
      }
      const d = Math.hypot(e.x - s.px, e.y - s.py);
      if (d < bestDist) {
        bestDist = d;
        bestAng = Math.atan2(e.y - 32 - (s.py - 36), e.x - s.px);
        found = true;
      }
    }
    if (!found) {
      bestAng = s.facingRight ? 0 : Math.PI;
    }
    s.aimAngle = bestAng;
    s.facingRight = Math.cos(bestAng) >= 0;
    s.touchAimActive = true;
  };

  // Helper: compute aim angle from screen coordinates
  const calculateAimAngleFromScreen = (clientX: number, clientY: number): number => {
    const canvas = canvasRef?.current;
    const s = simRef.current;
    if (!canvas) {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      return Math.atan2(clientY - cy, clientX - cx);
    }
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / Math.max(1, rect.width);
    const scaleY = canvas.height / Math.max(1, rect.height);
    const mx = (clientX - rect.left) * scaleX;
    const my = (clientY - rect.top) * scaleY;
    const camX = Math.max(0, Math.min(WORLD_W - canvas.width, s.px - canvas.width / 2));
    const camY = Math.max(0, Math.min(WORLD_H - canvas.height, s.py - canvas.height / 2));
    s.mouseWorldX = camX + mx;
    s.mouseWorldY = camY + my;
    return Math.atan2(s.mouseWorldY - (s.py - 42), s.mouseWorldX - s.px);
  };

  // Move Stick handlers
  const handleMoveStart = (clientX: number, clientY: number, pointerId: number) => {
    movePointerId.current = pointerId;
    if (settings.joystickMode === 'floating') {
      setJoystickOrigin({ x: clientX, y: clientY });
      setLeftKnob({ x: 0, y: 0, active: true });
    } else {
      updateFixedMoveStick(clientX, clientY);
    }
  };

  const handleMoveUpdate = (clientX: number, clientY: number) => {
    if (settings.joystickMode === 'floating') {
      if (!joystickOrigin) return;
      const dx = clientX - joystickOrigin.x;
      const dy = clientY - joystickOrigin.y;
      const dist = Math.hypot(dx, dy);
      const clamped = Math.min(MAX_RADIUS, dist);
      const ang = Math.atan2(dy, dx);
      const kx = dist > 2 ? Math.cos(ang) * clamped : 0;
      const ky = dist > 2 ? Math.sin(ang) * clamped : 0;

      setLeftKnob({ x: kx, y: ky, active: true });
      simRef.current.touchMoveX = kx / MAX_RADIUS;
      simRef.current.touchMoveY = ky / MAX_RADIUS;
    } else {
      updateFixedMoveStick(clientX, clientY);
    }
  };

  const updateFixedMoveStick = (clientX: number, clientY: number) => {
    const el = fixedMoveZoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(MAX_RADIUS, dist);
    const ang = Math.atan2(dy, dx);
    const kx = dist > 2 ? Math.cos(ang) * clamped : 0;
    const ky = dist > 2 ? Math.sin(ang) * clamped : 0;

    setLeftKnob({ x: kx, y: ky, active: true });
    simRef.current.touchMoveX = kx / MAX_RADIUS;
    simRef.current.touchMoveY = ky / MAX_RADIUS;
  };

  const resetMoveStick = () => {
    movePointerId.current = null;
    setJoystickOrigin(null);
    setLeftKnob({ x: 0, y: 0, active: false });
    simRef.current.touchMoveX = 0;
    simRef.current.touchMoveY = 0;
  };

  // Tap-to-shoot handlers
  const handleTapShootStart = (clientX: number, clientY: number, pointerId: number) => {
    firePointerId.current = pointerId;
    const ang = calculateAimAngleFromScreen(clientX, clientY);
    const s = simRef.current;
    s.aimAngle = ang;
    s.facingRight = Math.cos(ang) >= 0;
    s.touchAimActive = true;
    s.mouseDown = true;
    setTapReticle({ x: clientX, y: clientY, active: true });
  };

  const handleTapShootUpdate = (clientX: number, clientY: number) => {
    const ang = calculateAimAngleFromScreen(clientX, clientY);
    const s = simRef.current;
    s.aimAngle = ang;
    s.facingRight = Math.cos(ang) >= 0;
    s.touchAimActive = true;
    s.mouseDown = true;
    setTapReticle({ x: clientX, y: clientY, active: true });
  };

  const resetTapShoot = () => {
    firePointerId.current = null;
    const s = simRef.current;
    s.mouseDown = false;
    s.touchAimActive = false;
    setTapReticle({ x: 0, y: 0, active: false });
  };

  // Aim Joystick Handlers (for 'joystick' mode)
  const updateAimJoystick = (clientX: number, clientY: number) => {
    const el = fixedFireZoneRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = clientX - cx;
    const dy = clientY - cy;
    const dist = Math.hypot(dx, dy);
    const clamped = Math.min(MAX_RADIUS, dist);
    const ang = Math.atan2(dy, dx);
    const kx = dist > 2 ? Math.cos(ang) * clamped : 0;
    const ky = dist > 2 ? Math.sin(ang) * clamped : 0;

    setRightKnob({ x: kx, y: ky, active: true });
    const s = simRef.current;
    s.touchAimActive = true;
    s.mouseDown = true;

    if (dist > 8) {
      s.aimAngle = ang;
      s.facingRight = Math.cos(ang) >= 0;
    } else {
      aimAtNearestEnemy();
    }
  };

  const resetAimJoystick = () => {
    firePointerId.current = null;
    setRightKnob({ x: 0, y: 0, active: false });
    simRef.current.mouseDown = false;
    simRef.current.touchAimActive = false;
  };

  // Swipe gesture detection for quick weapon switch
  const handleWeaponSwipeStart = (e: React.PointerEvent) => {
    swipeStartX.current = e.clientX;
    swipeStartY.current = e.clientY;
  };

  const handleWeaponSwipeEnd = (e: React.PointerEvent) => {
    if (swipeStartX.current === null) return;
    const dx = e.clientX - swipeStartX.current;
    const dy = e.clientY - (swipeStartY.current || e.clientY);
    swipeStartX.current = null;
    swipeStartY.current = null;

    if (Math.abs(dx) > 28 && Math.abs(dx) > Math.abs(dy)) {
      if (onCycleWeapon) {
        onCycleWeapon(dx > 0 ? -1 : 1);
      }
    }
  };

  if (!isTouchDevice && !forceVisible) {
    return null;
  }

  const isLeftHanded = settings.leftHanded;
  const btnScale = settings.buttonScale || 1.0;
  const currentWeaponMeta = WEAPON_CATALOG_CONFIG.find((w) => w.id === equippedWeapon);

  return (
    <>
      {/* Portrait Orientation Helper Bar */}
      {isPortraitMobile && !dismissedPortraitHint && (
        <div className="pointer-events-auto absolute top-11 left-2 right-2 z-40 bg-[#0b0f19]/92 border border-cyan-500/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-lg backdrop-blur-sm">
          <span className="text-[11px] text-slate-200 font-medium truncate">
            {t.landscapePrompt}
          </span>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={requestLandscapeFullscreen}
              className="min-h-[36px] px-2.5 rounded-md bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-[11px] font-bold inline-flex items-center gap-1 whitespace-nowrap"
            >
              <Maximize2 className="w-3 h-3" />
              {t.enterLandscapeBtn}
            </button>
            <button
              type="button"
              onClick={() => setDismissedPortraitHint(true)}
              aria-label="Dismiss"
              className="min-h-[36px] min-w-[36px] rounded-md bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* FLOATING RETICLE FEEDBACK (For Tap-to-Shoot mode) */}
      {tapReticle.active && (
        <div
          className="pointer-events-none fixed z-30 -translate-x-1/2 -translate-y-1/2"
          style={{ left: tapReticle.x, top: tapReticle.y }}
        >
          <div className="relative w-12 h-12 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border border-rose-400/80 animate-ping opacity-60" />
            <div className="w-8 h-8 rounded-full border-2 border-rose-500/90 flex items-center justify-center bg-rose-500/10">
              <Crosshair className="w-4 h-4 text-rose-300 animate-spin" style={{ animationDuration: '4s' }} />
            </div>
          </div>
        </div>
      )}

      {/* LEFT OR RIGHT MOVEMENT CAPTURE ZONE */}
      {settings.joystickMode === 'floating' ? (
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            handleMoveStart(e.clientX, e.clientY, e.pointerId);
          }}
          onPointerMove={(e) => {
            if (movePointerId.current === e.pointerId) {
              handleMoveUpdate(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            if (movePointerId.current === e.pointerId) {
              resetMoveStick();
            }
          }}
          onPointerCancel={(e) => {
            if (movePointerId.current === e.pointerId) {
              resetMoveStick();
            }
          }}
          className={`pointer-events-auto touch-none absolute top-12 bottom-12 z-20 w-[46%] ${
            isLeftHanded ? 'right-0' : 'left-0'
          }`}
        />
      ) : (
        /* FIXED CORNER JOYSTICK */
        <div
          ref={fixedMoveZoneRef}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            movePointerId.current = e.pointerId;
            updateFixedMoveStick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (movePointerId.current === e.pointerId) {
              updateFixedMoveStick(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            if (movePointerId.current === e.pointerId) {
              resetMoveStick();
            }
          }}
          onPointerCancel={(e) => {
            if (movePointerId.current === e.pointerId) {
              resetMoveStick();
            }
          }}
          style={{
            width: `${76 * settings.joystickScale}px`,
            height: `${76 * settings.joystickScale}px`,
          }}
          className={`pointer-events-auto touch-none absolute bottom-3 z-20 rounded-full border border-cyan-400/50 bg-[#090d16]/40 flex items-center justify-center transition-opacity ${
            isLeftHanded ? 'right-3' : 'left-3'
          } ${leftKnob.active ? 'opacity-95' : 'opacity-55 hover:opacity-85'}`}
        >
          <div
            className={`pointer-events-none w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-75 ${
              leftKnob.active
                ? 'bg-cyan-400/50 border-cyan-200'
                : 'bg-slate-900/70 border-cyan-400/60'
            }`}
            style={{
              transform: `translate(${leftKnob.x}px, ${leftKnob.y}px)`,
            }}
          >
            <Move className="w-3.5 h-3.5 text-cyan-200" />
          </div>
        </div>
      )}

      {/* DYNAMIC FLOATING JOYSTICK VISUAL BASE (Appears under thumb on drag) */}
      {settings.joystickMode === 'floating' && joystickOrigin && (
        <div
          className="pointer-events-none fixed z-20 -translate-x-1/2 -translate-y-1/2 rounded-full border border-cyan-400/60 bg-[#090d16]/55 backdrop-blur-[2px] flex items-center justify-center shadow-lg transition-opacity duration-150"
          style={{
            left: joystickOrigin.x,
            top: joystickOrigin.y,
            width: `${MAX_RADIUS * 2.1}px`,
            height: `${MAX_RADIUS * 2.1}px`,
          }}
        >
          <div
            className="w-9 h-9 rounded-full border border-cyan-200 bg-cyan-400/55 flex items-center justify-center shadow-inner"
            style={{
              transform: `translate(${leftKnob.x}px, ${leftKnob.y}px)`,
            }}
          >
            <Move className="w-3.5 h-3.5 text-cyan-950 stroke-[2.5]" />
          </div>
        </div>
      )}

      {/* AIM & ATTACK ZONE: BASED ON FIRE MODE */}
      {settings.fireMode === 'tap_to_shoot' ? (
        /* TAP-TO-SHOOT FULL-ZONE CAPTURE (Touch anywhere on the aim half to point & shoot directly!) */
        <div
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            handleTapShootStart(e.clientX, e.clientY, e.pointerId);
          }}
          onPointerMove={(e) => {
            if (firePointerId.current === e.pointerId) {
              handleTapShootUpdate(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            if (firePointerId.current === e.pointerId) {
              resetTapShoot();
            }
          }}
          onPointerCancel={(e) => {
            if (firePointerId.current === e.pointerId) {
              resetTapShoot();
            }
          }}
          className={`pointer-events-auto touch-none absolute top-12 bottom-12 z-20 w-[48%] ${
            isLeftHanded ? 'left-0' : 'right-0'
          }`}
        />
      ) : settings.fireMode === 'joystick' ? (
        /* RIGHT AIM JOYSTICK */
        <div
          ref={fixedFireZoneRef}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            firePointerId.current = e.pointerId;
            updateAimJoystick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (firePointerId.current === e.pointerId) {
              updateAimJoystick(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            if (firePointerId.current === e.pointerId) {
              resetAimJoystick();
            }
          }}
          onPointerCancel={(e) => {
            if (firePointerId.current === e.pointerId) {
              resetAimJoystick();
            }
          }}
          style={{
            width: `${76 * settings.joystickScale}px`,
            height: `${76 * settings.joystickScale}px`,
          }}
          className={`pointer-events-auto touch-none absolute bottom-3 z-20 rounded-full border border-rose-500/50 bg-[#160a12]/40 flex items-center justify-center transition-opacity ${
            isLeftHanded ? 'left-3' : 'right-3'
          } ${rightKnob.active ? 'opacity-95' : 'opacity-55 hover:opacity-85'}`}
        >
          <div
            className={`pointer-events-none w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-75 ${
              rightKnob.active
                ? 'bg-rose-500/50 border-rose-200'
                : 'bg-slate-900/70 border-rose-500/65'
            }`}
            style={{
              transform: `translate(${rightKnob.x}px, ${rightKnob.y}px)`,
            }}
          >
            <Crosshair className="w-3.5 h-3.5 text-rose-200" />
          </div>
        </div>
      ) : (
        /* AUTO-AIM FIRE BUTTON */
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            firePointerId.current = e.pointerId;
            aimAtNearestEnemy();
            simRef.current.mouseDown = true;
          }}
          onPointerUp={(e) => {
            if (firePointerId.current === e.pointerId) {
              firePointerId.current = null;
              simRef.current.mouseDown = false;
              simRef.current.touchAimActive = false;
            }
          }}
          onPointerCancel={(e) => {
            if (firePointerId.current === e.pointerId) {
              firePointerId.current = null;
              simRef.current.mouseDown = false;
              simRef.current.touchAimActive = false;
            }
          }}
          style={{
            width: `${56 * btnScale}px`,
            height: `${56 * btnScale}px`,
          }}
          className={`pointer-events-auto touch-none absolute bottom-3 z-20 rounded-full border-2 border-rose-500/80 bg-rose-950/65 active:bg-rose-600/80 active:scale-95 text-rose-100 flex flex-col items-center justify-center shadow-lg transition-transform ${
            isLeftHanded ? 'left-4' : 'right-4'
          }`}
        >
          <Crosshair className="w-5 h-5 text-rose-300" />
          <span className="text-[8px] font-mono font-black tracking-wider">FIRE</span>
        </button>
      )}

      {/* ACTION CLUSTER (Dash + Floating Quick Weapon Swap + Control Settings Gear) */}
      <div
        className={`pointer-events-none absolute bottom-3 z-30 flex flex-col items-center gap-2 ${
          isLeftHanded
            ? settings.fireMode === 'tap_to_shoot'
              ? 'left-3'
              : 'left-[92px]'
            : settings.fireMode === 'tap_to_shoot'
            ? 'right-3'
            : 'right-[92px]'
        }`}
      >
        {/* CONTROL SETTINGS GEAR BUTTON */}
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          aria-label={t.controlSettingsBtn}
          title={t.controlSettingsBtn}
          className="pointer-events-auto touch-none w-8 h-8 rounded-full bg-[#090d16]/75 border border-slate-700/80 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 flex items-center justify-center shadow backdrop-blur-sm active:scale-95 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5" />
        </button>

        {/* FLOATING QUICK-WEAPON SWAP BUTTON (Swipe or Tap to switch instantly on small mobile screen!) */}
        {settings.quickSwapWheelEnabled && ownedWeapons.length > 0 && currentWeaponMeta && (
          <div className="pointer-events-auto relative">
            <button
              type="button"
              onPointerDown={handleWeaponSwipeStart}
              onPointerUp={(e) => {
                handleWeaponSwipeEnd(e);
                if (swipeStartX.current === null) {
                  // Clean tap: cycle weapon!
                  if (onCycleWeapon) onCycleWeapon(1);
                }
              }}
              style={{
                width: `${46 * btnScale}px`,
                height: `${46 * btnScale}px`,
              }}
              aria-label={t[currentWeaponMeta.nameKey]}
              title={t.quickSwapHint}
              className="touch-none rounded-full border border-amber-500/70 bg-[#161009]/80 active:scale-95 text-amber-200 flex flex-col items-center justify-center shadow-md backdrop-blur-sm transition-transform relative group"
            >
              <WeaponPreviewArt weapon={currentWeaponMeta.id} className="w-7 h-3.5" />
              <span className="text-[7px] font-mono font-bold leading-none text-amber-300">
                SWAP
              </span>

              {/* Little side arrows indicating swipe */}
              <div className="absolute -left-1 text-[8px] text-amber-400/60 pointer-events-none">‹</div>
              <div className="absolute -right-1 text-[8px] text-amber-400/60 pointer-events-none">›</div>
            </button>

            {/* Quick Wheel Opener Icon */}
            <button
              type="button"
              onClick={() => setWeaponWheelOpen((v) => !v)}
              className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-slate-900 border border-amber-400/80 text-amber-300 flex items-center justify-center text-[8px] font-bold shadow"
              title="Expand All Weapons"
            >
              +
            </button>
          </div>
        )}

        {/* DASH BUTTON */}
        <button
          type="button"
          onPointerDown={(e) => {
            e.stopPropagation();
            onTriggerDash();
          }}
          aria-label={t.dashBtn}
          title={t.dashBtn}
          style={{
            width: `${48 * btnScale}px`,
            height: `${48 * btnScale}px`,
          }}
          className={`pointer-events-auto touch-none rounded-full border flex flex-col items-center justify-center font-mono text-[8px] font-bold shadow transition-all ${
            dashReady
              ? 'bg-[#0c1322]/80 border-[#d9ff00]/85 text-[#d9ff00] active:scale-95'
              : 'bg-[#090d16]/50 border-slate-700/70 text-slate-500 opacity-45'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>DASH</span>
        </button>
      </div>

      {/* QUICK WEAPON WHEEL / RADIAL POPUP FOR MOBILE */}
      {weaponWheelOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0b0f19] border border-amber-500/60 rounded-xl max-w-sm w-full p-4 shadow-2xl animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <span className="font-mono text-xs font-bold text-amber-300">
                {t.backpackTitle} · QUICK SWAP
              </span>
              <button
                type="button"
                onClick={() => setWeaponWheelOpen(false)}
                className="text-slate-400 hover:text-white p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2 mt-3 max-h-[55vh] overflow-y-auto">
              {ownedWeapons.map((wId) => {
                const w = WEAPON_CATALOG_CONFIG.find((item) => item.id === wId);
                if (!w) return null;
                const isCurrent = equippedWeapon === wId;
                return (
                  <button
                    key={wId}
                    type="button"
                    onClick={() => {
                      if (onSelectWeapon) onSelectWeapon(wId);
                      setWeaponWheelOpen(false);
                    }}
                    className={`p-2 rounded-lg border text-left flex flex-col items-start gap-1 transition-all ${
                      isCurrent
                        ? 'bg-amber-950/60 border-amber-400 text-amber-100 shadow'
                        : 'bg-slate-900/80 border-slate-700 hover:border-slate-500 text-slate-300'
                    }`}
                  >
                    <div className="w-full flex items-center justify-between text-[9px] font-mono">
                      <span className="font-bold text-amber-400">[{w.hotkey}]</span>
                      {isCurrent && <span className="text-emerald-400 font-bold">EQUIPPED</span>}
                    </div>
                    <div className="w-full flex justify-center py-1">
                      <WeaponPreviewArt weapon={w.id} className="w-16 h-7" />
                    </div>
                    <span className="text-[10px] font-semibold truncate w-full">
                      {t[w.nameKey]}
                    </span>
                  </button>
                );
              })}
            </div>

            <div className="mt-3 pt-2 border-t border-slate-800 flex justify-end">
              <button
                type="button"
                onClick={() => setWeaponWheelOpen(false)}
                className="px-3 py-1.5 rounded-md bg-slate-800 text-slate-200 text-xs font-mono hover:bg-slate-700"
              >
                {t.closeControlsBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CONTROLS CUSTOMIZATION SETTINGS MODAL */}
      {modalOpen && (
        <div className="pointer-events-auto fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-3 sm:p-5">
          <div className="bg-[#0b0f19] border border-cyan-500/50 rounded-2xl max-w-md w-full p-4 sm:p-5 shadow-2xl flex flex-col gap-4 text-slate-100 animate-in fade-in zoom-in-95 max-h-[92vh] overflow-y-auto font-sans">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Sliders className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-bold tracking-wide font-mono text-cyan-200">
                  {t.controlSettingsTitle}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Movement Joystick Mode */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono font-semibold text-cyan-300">
                {t.joystickModeLabel}
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ ...settings, joystickMode: 'floating' })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                    settings.joystickMode === 'floating'
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-100 font-semibold shadow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Move className="w-3.5 h-3.5 text-cyan-300" />
                    {t.joystickFloating.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.joystickFloating.includes('(') ? `(${t.joystickFloating.split('(')[1]}` : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ ...settings, joystickMode: 'fixed' })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                    settings.joystickMode === 'fixed'
                      ? 'bg-cyan-950/70 border-cyan-400 text-cyan-100 font-semibold shadow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-cyan-300" />
                    {t.joystickFixed}
                  </span>
                  <span className="text-[10px] text-slate-400">Fixed corner anchor</span>
                </button>
              </div>
            </div>

            {/* Attack & Firing Mode */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-mono font-semibold text-rose-300">
                {t.fireModeLabel}
              </span>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => updateSettings({ ...settings, fireMode: 'tap_to_shoot' })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                    settings.fireMode === 'tap_to_shoot'
                      ? 'bg-rose-950/70 border-rose-400 text-rose-100 font-semibold shadow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-rose-300" />
                    {t.fireModeTap.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.fireModeTap.includes('(') ? `(${t.fireModeTap.split('(')[1]}` : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ ...settings, fireMode: 'joystick' })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                    settings.fireMode === 'joystick'
                      ? 'bg-rose-950/70 border-rose-400 text-rose-100 font-semibold shadow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-rose-300" />
                    {t.fireModeJoystick.split('(')[0]}
                  </span>
                  <span className="text-[10px] text-slate-400">
                    {t.fireModeJoystick.includes('(') ? `(${t.fireModeJoystick.split('(')[1]}` : ''}
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() => updateSettings({ ...settings, fireMode: 'auto_aim_button' })}
                  className={`p-2.5 rounded-lg border text-left text-xs transition-colors flex flex-col gap-0.5 ${
                    settings.fireMode === 'auto_aim_button'
                      ? 'bg-rose-950/70 border-rose-400 text-rose-100 font-semibold shadow'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold flex items-center gap-1">
                    <Crosshair className="w-3.5 h-3.5 text-rose-300" />
                    {t.fireModeAutoAim}
                  </span>
                </button>
              </div>
            </div>

            {/* Sliders: Joystick Scale & Button Scale */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-slate-800">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{t.joystickScaleLabel}</span>
                  <span className="text-cyan-400 font-bold">
                    {Math.round(settings.joystickScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={settings.joystickScale}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      joystickScale: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-cyan-400 cursor-pointer"
                />
              </div>

              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-300">{t.buttonScaleLabel}</span>
                  <span className="text-rose-400 font-bold">
                    {Math.round(settings.buttonScale * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.4"
                  step="0.05"
                  value={settings.buttonScale}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      buttonScale: parseFloat(e.target.value),
                    })
                  }
                  className="w-full accent-rose-400 cursor-pointer"
                />
              </div>
            </div>

            {/* Toggles: Quick-Swap Wheel & Left-Handed Mode */}
            <div className="flex flex-col gap-2 pt-2 border-t border-slate-800">
              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-xs text-slate-200 font-medium">
                  {t.quickSwapWheelLabel}
                </span>
                <input
                  type="checkbox"
                  checked={settings.quickSwapWheelEnabled}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      quickSwapWheelEnabled: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-amber-400 rounded cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-2 rounded-lg bg-slate-900/60 border border-slate-800 cursor-pointer hover:border-slate-700">
                <span className="text-xs text-slate-200 font-medium">
                  {t.leftHandedLabel}
                </span>
                <input
                  type="checkbox"
                  checked={settings.leftHanded}
                  onChange={(e) =>
                    updateSettings({
                      ...settings,
                      leftHanded: e.target.checked,
                    })
                  }
                  className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                />
              </label>
            </div>

            {/* Helpful Hints for PC & Mobile */}
            <div className="p-2.5 rounded-lg bg-slate-950/70 border border-slate-800 text-[10px] text-slate-400 flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-cyan-300 font-mono">
                <span>🖱️</span>
                <span>{t.mouseWheelHint}</span>
              </div>
              <div className="flex items-center gap-1.5 text-amber-300 font-mono">
                <span>👆</span>
                <span>{t.quickSwapHint}</span>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-between pt-2 border-t border-slate-800">
              <button
                type="button"
                onClick={() => updateSettings(DEFAULT_TOUCH_SETTINGS)}
                className="px-3 py-1.5 rounded-lg border border-slate-700 text-slate-400 hover:text-white text-xs font-mono inline-flex items-center gap-1 hover:bg-slate-800 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                {t.resetControlsBtn}
              </button>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="px-5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold font-mono shadow transition-colors"
              >
                {t.closeControlsBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
