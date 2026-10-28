import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Maximize2, Move, X, Zap } from 'lucide-react';
import { SimState } from '../game/engineStep';
import { TranslationStrings } from '../i18n/translations';
import { EnemyKind, PlayerPortfolio } from '../types/game';

interface MobileTouchControlsProps {
  t: TranslationStrings;
  simRef: React.MutableRefObject<SimState>;
  portfolio: PlayerPortfolio;
  dashReady: boolean;
  forceVisible: boolean;
  onTriggerDash: () => void;
  onThrowOrb: () => void;
  onUseMedkit: () => void;
  onUseEnergyPack: () => void;
  onUsePetChip: () => void;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  t,
  simRef,
  portfolio,
  dashReady,
  forceVisible,
  onTriggerDash,
  onThrowOrb,
  onUseMedkit,
  onUseEnergyPack,
  onUsePetChip,
}) => {
  const [isTouchDevice, setIsTouchDevice] = useState<boolean>(false);
  const [isPortraitMobile, setIsPortraitMobile] = useState<boolean>(false);
  const [dismissedPortraitHint, setDismissedPortraitHint] = useState<boolean>(false);

  const [leftKnob, setLeftKnob] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });
  const [rightKnob, setRightKnob] = useState<{ x: number; y: number; active: boolean }>({
    x: 0,
    y: 0,
    active: false,
  });

  const leftZoneRef = useRef<HTMLDivElement | null>(null);
  const rightZoneRef = useRef<HTMLDivElement | null>(null);
  const leftPointerId = useRef<number | null>(null);
  const rightPointerId = useRef<number | null>(null);

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
      // iOS Safari & framed browsers require physical device rotation; ignore lock rejection cleanly
    }
    setDismissedPortraitHint(true);
  };

  if (!isTouchDevice && !forceVisible) {
    return null;
  }

  const MAX_RADIUS = 42;

  const updateLeftStick = (clientX: number, clientY: number) => {
    const el = leftZoneRef.current;
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

  const resetLeftStick = () => {
    leftPointerId.current = null;
    setLeftKnob({ x: 0, y: 0, active: false });
    simRef.current.touchMoveX = 0;
    simRef.current.touchMoveY = 0;
  };

  const updateRightStick = (clientX: number, clientY: number) => {
    const el = rightZoneRef.current;
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

    if (dist > 10) {
      s.aimAngle = ang;
      s.facingRight = Math.cos(ang) >= 0;
    } else {
      // Quick center tap auto-locks onto nearest hostile monster within 560px!
      let bestDist = 560;
      let bestAng = s.aimAngle;
      for (const e of s.enemies) {
        if (
          e.hp <= 0 ||
          e.kind === EnemyKind.WILD_SCOUT_DOG ||
          e.kind === EnemyKind.WILD_CYBER_CAT
        ) {
          continue;
        }
        const d = Math.hypot(e.x - s.px, e.y - s.py);
        if (d < bestDist) {
          bestDist = d;
          bestAng = Math.atan2(e.y - 32 - (s.py - 36), e.x - s.px);
        }
      }
      s.aimAngle = bestAng;
      s.facingRight = Math.cos(bestAng) >= 0;
    }
  };

  const resetRightStick = () => {
    rightPointerId.current = null;
    setRightKnob({ x: 0, y: 0, active: false });
    simRef.current.mouseDown = false;
    simRef.current.touchAimActive = false;
  };

  return (
    <>
      {/* Portrait Orientation Landscape Helper Bar */}
      {isPortraitMobile && !dismissedPortraitHint && (
        <div className="pointer-events-auto absolute top-14 left-2.5 right-2.5 z-30 bg-[#0b0f19]/95 border border-cyan-500/60 rounded-xl px-3 py-2 flex items-center justify-between gap-2 shadow-xl backdrop-blur-md">
          <span className="text-xs text-slate-200 font-medium leading-snug">
            {t.landscapePrompt}
          </span>
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              type="button"
              onClick={requestLandscapeFullscreen}
              className="min-h-[44px] px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 text-xs font-bold inline-flex items-center gap-1.5 whitespace-nowrap transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5" />
              {t.enterLandscapeBtn}
            </button>
            <button
              type="button"
              onClick={() => setDismissedPortraitHint(true)}
              aria-label="Dismiss"
              className="min-h-[44px] min-w-[44px] rounded-lg bg-slate-900 border border-slate-700 text-slate-300 flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* LEFT VIRTUAL THUMBSTICK: 360° Analog Movement */}
      <div
        ref={leftZoneRef}
        onPointerDown={(e) => {
          e.stopPropagation();
          e.currentTarget.setPointerCapture(e.pointerId);
          leftPointerId.current = e.pointerId;
          updateLeftStick(e.clientX, e.clientY);
        }}
        onPointerMove={(e) => {
          if (leftPointerId.current === e.pointerId) {
            updateLeftStick(e.clientX, e.clientY);
          }
        }}
        onPointerUp={(e) => {
          if (leftPointerId.current === e.pointerId) {
            resetLeftStick();
          }
        }}
        onPointerCancel={(e) => {
          if (leftPointerId.current === e.pointerId) {
            resetLeftStick();
          }
        }}
        className="pointer-events-auto touch-none absolute bottom-20 sm:bottom-24 left-4 z-20 w-28 h-28 rounded-full bg-[#090d16]/55 border-2 border-cyan-400/45 backdrop-blur-[2px] flex items-center justify-center shadow-lg"
      >
        <div className="w-16 h-16 rounded-full border border-cyan-400/20 flex items-center justify-center pointer-events-none">
          {!leftKnob.active && <Move className="w-5 h-5 text-cyan-300/50" />}
        </div>
        <div
          className={`pointer-events-none absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-transform duration-75 ${
            leftKnob.active
              ? 'bg-cyan-400/40 border-cyan-300 shadow-md shadow-cyan-500/30'
              : 'bg-slate-800/75 border-cyan-400/60'
          }`}
          style={{
            transform: `translate(${leftKnob.x}px, ${leftKnob.y}px)`,
          }}
        >
          <span className="text-[9px] font-mono font-bold text-cyan-100">MOVE</span>
        </div>
      </div>

      {/* RIGHT VIRTUAL THUMBSTICK + ERGONOMIC 44px+ ACTION CLUSTER */}
      <div className="pointer-events-none absolute bottom-20 sm:bottom-24 right-4 z-20 flex items-end gap-2.5">
        {/* Tactical Quick Action Touch Buttons (>= 44px touch targets) */}
        <div className="pointer-events-auto flex flex-col gap-2">
          <button
            type="button"
            onPointerDown={(e) => {
              e.stopPropagation();
              onTriggerDash();
            }}
            className={`min-h-[46px] min-w-[58px] px-2.5 rounded-xl border-2 font-mono text-xs font-bold flex items-center justify-center gap-1 shadow-md transition-colors ${
              dashReady
                ? 'bg-[#12192b]/90 border-[#d9ff00] text-[#d9ff00] active:bg-[#d9ff00]/20'
                : 'bg-[#090d16]/75 border-slate-700 text-slate-500'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            {t.dashBtn}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                onThrowOrb();
              }}
              className="min-h-[44px] min-w-[46px] px-1.5 rounded-xl bg-[#0e1526]/90 border border-sky-400/60 text-sky-200 font-mono text-[10px] font-bold flex flex-col items-center justify-center active:bg-sky-500/30"
            >
              <span>ORB</span>
              <span className="text-[9px] text-sky-400">x{portfolio.masterSpheres}</span>
            </button>
            <button
              type="button"
              onPointerDown={(e) => {
                e.stopPropagation();
                onUseMedkit();
              }}
              className="min-h-[44px] min-w-[46px] px-1.5 rounded-xl bg-[#0e1526]/90 border border-emerald-400/60 text-emerald-200 font-mono text-[10px] font-bold flex flex-col items-center justify-center active:bg-emerald-500/30"
            >
              <span>HP</span>
              <span className="text-[9px] text-emerald-400">x{portfolio.medkits}</span>
            </button>
            {portfolio.companions.length > 0 ? (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onUsePetChip();
                }}
                className="min-h-[44px] min-w-[46px] px-1.5 rounded-xl bg-[#0e1526]/90 border border-cyan-400/60 text-cyan-200 font-mono text-[10px] font-bold flex flex-col items-center justify-center active:bg-cyan-500/30"
              >
                <span>PET</span>
                <span className="text-[9px] text-cyan-400">x{portfolio.firmwarePatches}</span>
              </button>
            ) : (
              <button
                type="button"
                onPointerDown={(e) => {
                  e.stopPropagation();
                  onUseEnergyPack();
                }}
                className="min-h-[44px] min-w-[46px] px-1.5 rounded-xl bg-[#0e1526]/90 border border-amber-400/60 text-amber-200 font-mono text-[10px] font-bold flex flex-col items-center justify-center active:bg-amber-500/30"
              >
                <span>CELL</span>
                <span className="text-[9px] text-amber-400">x{portfolio.energyPacks}</span>
              </button>
            )}
          </div>
        </div>

        {/* Right Twin-Stick Aim & Auto-Fire Pad */}
        <div
          ref={rightZoneRef}
          onPointerDown={(e) => {
            e.stopPropagation();
            e.currentTarget.setPointerCapture(e.pointerId);
            rightPointerId.current = e.pointerId;
            updateRightStick(e.clientX, e.clientY);
          }}
          onPointerMove={(e) => {
            if (rightPointerId.current === e.pointerId) {
              updateRightStick(e.clientX, e.clientY);
            }
          }}
          onPointerUp={(e) => {
            if (rightPointerId.current === e.pointerId) {
              resetRightStick();
            }
          }}
          onPointerCancel={(e) => {
            if (rightPointerId.current === e.pointerId) {
              resetRightStick();
            }
          }}
          className="pointer-events-auto touch-none relative w-28 h-28 rounded-full bg-[#1a0b14]/60 border-2 border-rose-500/55 backdrop-blur-[2px] flex items-center justify-center shadow-lg"
        >
          <div className="w-16 h-16 rounded-full border border-rose-500/25 flex items-center justify-center pointer-events-none">
            {!rightKnob.active && <Crosshair className="w-5 h-5 text-rose-400/65" />}
          </div>
          <div
            className={`pointer-events-none absolute w-12 h-12 rounded-full border-2 flex items-center justify-center transition-transform duration-75 ${
              rightKnob.active
                ? 'bg-rose-500/50 border-rose-300 shadow-md shadow-rose-500/40'
                : 'bg-slate-900/80 border-rose-500/70'
            }`}
            style={{
              transform: `translate(${rightKnob.x}px, ${rightKnob.y}px)`,
            }}
          >
            <span className="text-[9px] font-mono font-bold text-rose-100">FIRE</span>
          </div>
        </div>
      </div>
    </>
  );
};
