import React from 'react';
import { WeaponId } from '../types/game';

export const WeaponPreviewArt: React.FC<{ weapon: WeaponId; className?: string }> = ({
  weapon,
  className = 'w-full h-20',
}) => {
  if (weapon === WeaponId.ARC_BLADE) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="arcEdge" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        {/* Subtle blueprint grid line */}
        <line x1="12" y1="42" x2="208" y2="42" stroke="#1e293b" strokeDasharray="3 3" />
        {/* Tactical wrapped grip */}
        <g transform="rotate(-11 110 42)">
          <rect x="20" y="37" width="44" height="12" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <path d="M27 37L32 49M37 37L42 49M47 37L52 49" stroke="#475569" strokeWidth="2" />
          {/* EMP Capacitor Guard */}
          <rect x="62" y="27" width="14" height="32" rx="3" fill="#334155" stroke="#090a0f" strokeWidth="2" />
          <circle cx="69" cy="34" r="3" fill="#38bdf8" />
          <circle cx="69" cy="52" r="3" fill="#38bdf8" />
          {/* Dark Titanium Spine */}
          <polygon points="76,35 182,35 204,44 76,45" fill="#1e293b" stroke="#090a0f" strokeWidth="2" />
          {/* Glowing High-Frequency Plasma Edge */}
          <polygon points="76,44 204,44 190,51 76,50" fill="url(#arcEdge)" />
          {/* Electric EMP Lightning Arcs */}
          <polyline
            points="92,31 108,24 120,33 142,23 158,32 178,26"
            stroke="#7dd3fc"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </g>
      </svg>
    );
  }

  if (weapon === WeaponId.CHAINSAW_SWORD) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="moltenChain" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#ea580c" />
            <stop offset="60%" stopColor="#fb923c" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>
        <g transform="rotate(-9 110 44)">
          {/* Rear D-Handle & Engine Housing */}
          <rect x="16" y="33" width="48" height="24" rx="4" fill="#7c2d12" stroke="#090a0f" strokeWidth="2.5" />
          <rect x="22" y="38" width="16" height="14" rx="2" fill="#090a0f" />
          {/* Hazard Stripes */}
          <rect x="44" y="35" width="16" height="20" fill="#f59e0b" />
          <path d="M46 35L52 55M53 35L59 55" stroke="#090a0f" strokeWidth="3" />
          {/* Molten Serrated Teeth Top & Bottom */}
          <path
            d="M66 30 L74 23 L80 30 L88 23 L94 30 L102 23 L108 30 L116 23 L122 30 L130 23 L136 30 L144 23 L150 30 L158 23 L164 30 L172 23 L178 30 L186 23 L194 32"
            fill="url(#moltenChain)"
            stroke="#7c2d12"
            strokeWidth="1.2"
          />
          <path
            d="M66 54 L74 61 L80 54 L88 61 L94 54 L102 61 L108 54 L116 61 L122 54 L130 61 L136 54 L144 61 L150 54 L158 61 L164 54 L172 61 L178 54 L186 61 L194 52"
            fill="url(#moltenChain)"
            stroke="#7c2d12"
            strokeWidth="1.2"
          />
          {/* Heavy Guide Bar */}
          <path d="M64 31 H190 A11 11 0 0 1 190 53 H64 Z" fill="#27272a" stroke="#090a0f" strokeWidth="2.2" />
          {/* Superheated Core Slit */}
          <rect x="74" y="40" width="108" height="4" rx="2" fill="url(#moltenChain)" />
        </g>
      </svg>
    );
  }

  if (weapon === WeaponId.PULSE_LASER) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="laserCore" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#be123c" />
            <stop offset="65%" stopColor="#f43f5e" />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
        </defs>
        {/* Stock & Bullpup Receiver */}
        <polygon points="18,34 62,30 62,54 24,58 18,48" fill="#1e293b" stroke="#090a0f" strokeWidth="2.2" />
        {/* Grip & Angled Energy Cell Mag */}
        <polygon points="64,48 76,48 70,68 58,68" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        <polygon points="88,48 104,48 110,69 94,69" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.8" />
        {/* Holographic Red-Eye Optic Sight */}
        <rect x="74" y="18" width="28" height="10" rx="2" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        <rect x="82" y="21" width="12" height="4" fill="#f43f5e" />
        {/* Segmented Accelerator Barrel Shroud */}
        <rect x="60" y="28" width="124" height="20" rx="3" fill="#27303f" stroke="#090a0f" strokeWidth="2.2" />
        {/* Glowing Coherent Laser Chamber */}
        <rect x="70" y="36" width="128" height="5" rx="2" fill="url(#laserCore)" />
        {/* Muzzle Emitter Prisms */}
        <rect x="184" y="29" width="18" height="6" fill="#475569" stroke="#090a0f" strokeWidth="1.8" />
        <rect x="184" y="42" width="18" height="6" fill="#475569" stroke="#090a0f" strokeWidth="1.8" />
      </svg>
    );
  }

  // DISRUPTOR_CANNON
  return (
    <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="cannonChamber" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#9f1239" />
          <stop offset="50%" stopColor="#ff1744" />
          <stop offset="100%" stopColor="#fde047" />
        </linearGradient>
      </defs>
      {/* Heavy Shoulder Brace & Recoil Buffer */}
      <rect x="14" y="24" width="32" height="36" rx="4" fill="#18181b" stroke="#090a0f" strokeWidth="2.5" />
      {/* Drum Warhead Magazine */}
      <rect x="54" y="48" width="42" height="24" rx="6" fill="#27272a" stroke="#e11d48" strokeWidth="2" />
      {/* Main Heavy Siege Barrel */}
      <rect x="42" y="18" width="136" height="34" rx="5" fill="#1f2937" stroke="#090a0f" strokeWidth="2.5" />
      {/* Target-Lock Radar Pod */}
      <rect x="78" y="8" width="42" height="12" rx="3" fill="#334155" stroke="#090a0f" strokeWidth="2" />
      <circle cx="112" cy="14" r="3.5" fill="#ff1744" />
      {/* Glowing Anti-Optic Plasma Core */}
      <rect x="58" y="30" width="114" height="10" rx="4" fill="url(#cannonChamber)" />
      {/* Heat Sink Fins */}
      <path d="M126 18V52M138 18V52M150 18V52" stroke="#090a0f" strokeWidth="3" />
      {/* Heavy Muzzle Brake */}
      <polygon points="178,15 204,20 204,50 178,55" fill="#374151" stroke="#090a0f" strokeWidth="2.5" />
      <circle cx="201" cy="35" r="5" fill="#ff1744" />
    </svg>
  );
};

export type ItemIconKind =
  | 'sphere'
  | 'medkit'
  | 'ammo'
  | 'patch'
  | 'oCore'
  | 'aCore'
  | 'ru9'
  | 'stock'
  | 'oaiStock'
  | 'anthStock'
  | 'roboDog'
  | 'roboCat';

export const ItemPreviewArt: React.FC<{ kind: ItemIconKind; className?: string }> = ({
  kind,
  className = 'w-9 h-9',
}) => {
  switch (kind) {
    case 'sphere':
      // Spherical Cyber Neon AI Master Orb (100% circular, original futuristic cyber rings)
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <defs>
            <radialGradient id="cyberOrbShell" cx="35%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#e0f2fe" />
              <stop offset="40%" stopColor="#38bdf8" />
              <stop offset="78%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#1e1b4b" />
            </radialGradient>
          </defs>
          {/* Outer Circular Energy Halo */}
          <circle cx="24" cy="24" r="20.5" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4 2.5" />
          {/* Main Glossy Circular Sphere Body */}
          <circle cx="24" cy="24" r="17" fill="url(#cyberOrbShell)" stroke="#e0f2fe" strokeWidth="2" />
          {/* Tilted Neon Gyro Latitude & Longitude Rings */}
          <ellipse cx="24" cy="24" rx="16.5" ry="6.2" transform="rotate(-24 24 24)" stroke="#ff2a85" strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="16.5" ry="6.2" transform="rotate(36 24 24)" stroke="#00e5ff" strokeWidth="1.8" />
          {/* Glowing Cyber Capture Core Lens */}
          <circle cx="24" cy="24" r="5.5" fill="#0f172a" stroke="#d9ff00" strokeWidth="2" />
          <circle cx="24" cy="24" r="2.5" fill="#00e5ff" />
          {/* Specular Glass Highlight */}
          <ellipse cx="18" cy="15.5" rx="4.5" ry="2.3" transform="rotate(-28 18 15.5)" fill="#ffffff" fillOpacity="0.72" />
        </svg>
      );

    case 'medkit':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="8" y="12" width="32" height="26" rx="5" fill="#064e3b" stroke="#10b981" strokeWidth="2.2" />
          <rect x="18" y="7" width="12" height="6" rx="2" fill="#065f46" stroke="#10b981" strokeWidth="1.8" />
          <path d="M24 18V32M17 25H31" stroke="#34d399" strokeWidth="4" strokeLinecap="round" />
        </svg>
      );

    case 'ammo':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="12" y="10" width="24" height="30" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="2.2" />
          <rect x="18" y="5" width="12" height="5" rx="1.5" fill="#38bdf8" />
          <path d="M26 15L19 25H25L22 35L29 24H23L26 15Z" fill="#7dd3fc" />
        </svg>
      );

    case 'patch':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="11" y="11" width="26" height="26" rx="4" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2.2" />
          <path d="M16 6V11M24 6V11M32 6V11M16 37V42M24 37V42M32 37V42M6 16H11M6 24H11M6 32H11M37 16H42M37 24H42M37 32H42" stroke="#818cf8" strokeWidth="2" />
          <rect x="18" y="18" width="12" height="12" rx="2" fill="#38bdf8" />
        </svg>
      );

    case 'oCore':
      // Authentic OpenAI Logo Skin (Glossy White Keycap Badge featuring exact OpenAI 6-fold knot logo)
      return (
        <span className={`inline-flex items-center justify-center rounded-lg bg-[#f4f4f0] border-2 border-[#10a37f] p-1 shadow-sm overflow-hidden ${className}`}>
          <img
            src="/assets/aistudio/image_fb9fe75b.png"
            alt="OpenAI Core"
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain rounded-sm"
          />
        </span>
      );

    case 'aCore':
      // Anthropic 'A\' Logo Core Badge
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="9" fill="#061826" stroke="#00e5ff" strokeWidth="2.2" />
          <rect x="8" y="8" width="32" height="32" rx="6" stroke="#0284c7" strokeWidth="1.2" strokeDasharray="4 2" />
          <path
            d="M12.5 34L20 14H24L31.5 34H27.3L25.7 29.4H18.3L16.7 34H12.5ZM19.5 25.8H24.5L22 18.6L19.5 25.8Z"
            fill="#e0f2fe"
          />
          <path d="M30.5 14H34.5L40 34H36L30.5 14Z" fill="#00e5ff" />
        </svg>
      );

    case 'ru9':
      // Cyber Crypto-Token Coin for $RU9
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <circle cx="24" cy="24" r="19" fill="#451a03" stroke="#fbbf24" strokeWidth="2.6" />
          <polygon
            points="24,8 37.5,16 37.5,32 24,40 10.5,32 10.5,16"
            fill="#78350f"
            stroke="#fde047"
            strokeWidth="1.6"
          />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="#fef08a"
            fontSize="11"
            fontWeight="800"
            fontFamily="monospace"
          >
            $RU9
          </text>
        </svg>
      );

    case 'oaiStock':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="6" width="40" height="36" rx="8" fill="#f8fafc" stroke="#10a37f" strokeWidth="2.2" />
          <polyline points="10,27 18,21 25,24 37,13" stroke="#10a37f" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="37" cy="13" r="2.8" fill="#10a37f" />
          <text x="24" y="37" textAnchor="middle" fill="#0f172a" fontSize="7.4" fontWeight="800" fontFamily="monospace">
            OpenAI
          </text>
        </svg>
      );

    case 'anthStock':
    case 'stock':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="6" width="40" height="36" rx="8" fill="#082f49" stroke="#00e5ff" strokeWidth="2.2" />
          <polyline points="10,28 18,21 25,24 37,13" stroke="#38bdf8" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="37" cy="13" r="2.8" fill="#00e5ff" />
          <text x="24" y="37" textAnchor="middle" fill="#e0f2fe" fontSize="6.6" fontWeight="800" fontFamily="monospace">
            {kind === 'anthStock' ? 'Anthropic' : 'EQUITY'}
          </text>
        </svg>
      );

    case 'roboDog':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#0b1528" stroke="#38bdf8" strokeWidth="2" />
          {/* Quadruped Blue-Eyed Partner Cyber-Hound */}
          <rect x="15" y="21" width="20" height="10" rx="2" fill="#334155" stroke="#090a0f" strokeWidth="1.8" />
          <rect x="9" y="14" width="12" height="10" rx="2" fill="#475569" stroke="#090a0f" strokeWidth="1.8" />
          <polygon points="11,14 13,8 16,14" fill="#38bdf8" />
          {/* Glowing Blue Partner Eye */}
          <rect x="10.5" y="17" width="4.5" height="3" rx="1" fill="#00b4ff" />
          <rect x="16" y="31" width="4" height="8" fill="#1e293b" />
          <rect x="29" y="31" width="4" height="8" fill="#1e293b" />
          <path d="M35 22L40 16" stroke="#38bdf8" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'roboCat':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#0b1528" stroke="#00e5ff" strokeWidth="2" />
          {/* Sleek Blue-Eyed Partner Cyber-Cat */}
          <rect x="16" y="22" width="17" height="9" rx="3" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.6" />
          <rect x="10" y="15" width="11" height="10" rx="3" fill="#312e81" stroke="#38bdf8" strokeWidth="1.6" />
          <polygon points="10,15 12,9 15,15" fill="#00e5ff" />
          <polygon points="16,15 19,9 21,15" fill="#00e5ff" />
          {/* Glowing Blue Partner Eye */}
          <rect x="11.5" y="18" width="4.5" height="3" rx="1" fill="#00b4ff" />
          <rect x="17" y="31" width="3.5" height="7" fill="#38bdf8" />
          <rect x="28" y="31" width="3.5" height="7" fill="#38bdf8" />
          <path d="M33 24C39 22 39 14 36 12" stroke="#00e5ff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
  }
};

