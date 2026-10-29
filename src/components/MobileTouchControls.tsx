import React, { useEffect, useRef, useState } from 'react';
import { Crosshair, Maximize2, Move, X, Zap } from 'lucide-react';
import { SimState } from '../game/engineStep';
import { TranslationStrings } from '../i18n/translations';
import { EnemyKind } from '../types/game';

interface MobileTouchControlsProps {
  t: TranslationStrings;
  simRef: React.MutableRefObject<SimState>;
  dashReady: boolean;
  forceVisible: boolean;
  onTriggerDash: () => void;
}

export const MobileTouchControls: React.FC<MobileTouchControlsProps> = ({
  t,
  simRef,
  dashReady,
  forceVisible,
  onTriggerDash,
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
      // Ignore orientation lock rejection on browsers requiring physical rotation
    }
    setDismissedPortraitHint(true);
  };

  if (!isTouchDevice && !forceVisible) {
    return null;
  }

  const MAX_RADIUS = 30;

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

    if (dist > 9) {
      s.aimAngle = ang;
      s.facingRight = Math.cos(ang) >= 0;
    } else {
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
      {/* Portrait Orientation Helper Bar */}
      {isPortraitMobile && !dismissedPortraitHint && (
        <div className="pointer-events-auto absolute top-11 left-2 right-2 z-30 bg-[#0b0f19]/92 border border-cyan-500/60 rounded-lg px-2.5 py-1.5 flex items-center justify-between gap-2 shadow-lg backdrop-blur-sm">
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

      {/* COMPACT TRANSLUCENT LEFT THUMBSTICK (Tucked into Bottom-Left Corner) */}
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
        className={`pointer-events-auto touch-none absolute bottom-3 left-3 z-20 w-[78px] h-[78px] rounded-full border border-cyan-400/40 bg-[#090d16]/35 flex items-center justify-center transition-opacity ${
          leftKnob.active ? 'opacity-95' : 'opacity-50 hover:opacity-80'
        }`}
      >
        <div
          className={`pointer-events-none w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-75 ${
            leftKnob.active
              ? 'bg-cyan-400/45 border-cyan-200'
              : 'bg-slate-900/65 border-cyan-400/60'
          }`}
          style={{
            transform: `translate(${leftKnob.x}px, ${leftKnob.y}px)`,
          }}
        >
          <Move className="w-3.5 h-3.5 text-cyan-200" />
        </div>
      </div>

      {/* COMPACT ROUND DASH BUTTON + TRANSLUCENT RIGHT THUMBSTICK (Bottom-Right Corner) */}
      <button
        type="button"
        onPointerDown={(e) => {
          e.stopPropagation();
          onTriggerDash();
        }}
        aria-label={t.dashBtn}
        title={t.dashBtn}
        className={`pointer-events-auto touch-none absolute bottom-14 right-[96px] z-20 w-11 h-11 rounded-full border flex flex-col items-center justify-center font-mono text-[8px] font-bold transition-all ${
          dashReady
            ? 'bg-[#0c1322]/70 border-[#d9ff00]/80 text-[#d9ff00] opacity-75 active:scale-95 active:opacity-100'
            : 'bg-[#090d16]/45 border-slate-700/70 text-slate-500 opacity-45'
        }`}
      >
        <Zap className="w-3.5 h-3.5" />
        <span>DASH</span>
      </button>

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
        className={`pointer-events-auto touch-none absolute bottom-3 right-3 z-20 w-[78px] h-[78px] rounded-full border border-rose-500/45 bg-[#160a12]/35 flex items-center justify-center transition-opacity ${
          rightKnob.active ? 'opacity-95' : 'opacity-50 hover:opacity-80'
        }`}
      >
        <div
          className={`pointer-events-none w-9 h-9 rounded-full border flex items-center justify-center transition-transform duration-75 ${
            rightKnob.active
              ? 'bg-rose-500/50 border-rose-200'
              : 'bg-slate-900/65 border-rose-500/65'
          }`}
          style={{
            transform: `translate(${rightKnob.x}px, ${rightKnob.y}px)`,
          }}
        >
          <Crosshair className="w-3.5 h-3.5 text-rose-200" />
        </div>
      </div>
    </>
  );
};
