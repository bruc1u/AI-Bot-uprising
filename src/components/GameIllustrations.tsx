import React from 'react';
import { ArmorId, CompanionKind, WeaponId } from '../types/game';

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
        <line x1="12" y1="42" x2="208" y2="42" stroke="#1e293b" strokeDasharray="3 3" />
        <g transform="rotate(-11 110 42)">
          <rect x="20" y="37" width="44" height="12" rx="2" fill="#1e293b" stroke="#0f172a" strokeWidth="2" />
          <path d="M27 37L32 49M37 37L42 49M47 37L52 49" stroke="#475569" strokeWidth="2" />
          <rect x="62" y="27" width="14" height="32" rx="3" fill="#334155" stroke="#090a0f" strokeWidth="2" />
          <circle cx="69" cy="34" r="3" fill="#38bdf8" />
          <circle cx="69" cy="52" r="3" fill="#38bdf8" />
          <polygon points="76,35 182,35 204,44 76,45" fill="#1e293b" stroke="#090a0f" strokeWidth="2" />
          <polygon points="76,44 204,44 190,51 76,50" fill="url(#arcEdge)" />
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
          <rect x="16" y="33" width="48" height="24" rx="4" fill="#7c2d12" stroke="#090a0f" strokeWidth="2.5" />
          <rect x="22" y="38" width="16" height="14" rx="2" fill="#090a0f" />
          <rect x="44" y="35" width="16" height="20" fill="#f59e0b" />
          <path d="M46 35L52 55M53 35L59 55" stroke="#090a0f" strokeWidth="3" />
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
          <path d="M64 31 H190 A11 11 0 0 1 190 53 H64 Z" fill="#27272a" stroke="#090a0f" strokeWidth="2.2" />
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
        <polygon points="18,34 62,30 62,54 24,58 18,48" fill="#1e293b" stroke="#090a0f" strokeWidth="2.2" />
        <polygon points="64,48 76,48 70,68 58,68" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        <polygon points="88,48 104,48 110,69 94,69" fill="#0f172a" stroke="#f43f5e" strokeWidth="1.8" />
        <rect x="74" y="18" width="28" height="10" rx="2" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        <rect x="82" y="21" width="12" height="4" fill="#f43f5e" />
        <rect x="60" y="28" width="124" height="20" rx="3" fill="#27303f" stroke="#090a0f" strokeWidth="2.2" />
        <rect x="70" y="36" width="128" height="5" rx="2" fill="url(#laserCore)" />
        <rect x="184" y="29" width="18" height="6" fill="#475569" stroke="#090a0f" strokeWidth="1.8" />
        <rect x="184" y="42" width="18" height="6" fill="#475569" stroke="#090a0f" strokeWidth="1.8" />
      </svg>
    );
  }

  if (weapon === WeaponId.PLASMA_SCATTERGUN) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="scatterIon" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="55%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#67e8f9" />
          </linearGradient>
        </defs>
        {/* Tactical Shock-Absorbing Buttstock */}
        <polygon points="14,38 52,29 56,52 18,62" fill="#1e293b" stroke="#090a0f" strokeWidth="2.2" />
        <polygon points="56,48 68,48 62,69 50,69" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        {/* Heavy Twin-Chamber Breacher Receiver */}
        <rect x="50" y="22" width="122" height="28" rx="4" fill="#1f2937" stroke="#090a0f" strokeWidth="2.4" />
        {/* Top Picatinny Rail & Reflex Sight */}
        <rect x="66" y="13" width="32" height="9" rx="2" fill="#334155" stroke="#090a0f" strokeWidth="1.8" />
        <rect x="74" y="16" width="16" height="3.5" fill="#34d399" />
        {/* Twin Ionized Plasma Tubes */}
        <rect x="62" y="27" width="102" height="5" rx="2" fill="url(#scatterIon)" />
        <rect x="62" y="36" width="102" height="5" rx="2" fill="url(#scatterIon)" />
        {/* Ribbed Pump-Action Forend */}
        <rect x="102" y="45" width="54" height="12" rx="3" fill="#0f172a" stroke="#10b981" strokeWidth="1.6" />
        <path d="M112 45V57M122 45V57M132 45V57M142 45V57" stroke="#34d399" strokeWidth="1.6" />
        {/* Wide Slotted Twin Choke Muzzle + Scatter Cone */}
        <polygon points="172,19 196,16 196,53 172,50" fill="#374151" stroke="#090a0f" strokeWidth="2.2" />
        <line x1="198" y1="24" x2="212" y2="17" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
        <line x1="199" y1="34" x2="215" y2="34" stroke="#67e8f9" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="198" y1="45" x2="212" y2="52" stroke="#6ee7b7" strokeWidth="2" strokeLinecap="round" />
      </svg>
    );
  }

  if (weapon === WeaponId.TESLA_ARC_EMITTER) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="teslaCore" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2563eb" />
            <stop offset="55%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#e0f2fe" />
          </linearGradient>
        </defs>
        {/* Insulated Capacitor Stock & Battery Cell */}
        <rect x="14" y="30" width="42" height="24" rx="4" fill="#1e1b4b" stroke="#090a0f" strokeWidth="2.2" />
        <rect x="64" y="49" width="32" height="20" rx="4" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
        {/* Main Induction Spine */}
        <rect x="52" y="26" width="118" height="24" rx="4" fill="#1e293b" stroke="#090a0f" strokeWidth="2.2" />
        <rect x="60" y="35" width="118" height="6" rx="3" fill="url(#teslaCore)" />
        {/* 3 Copper-Titanium High-Voltage Toroid Rings */}
        <rect x="88" y="18" width="12" height="40" rx="3" fill="#d97706" stroke="#090a0f" strokeWidth="2" />
        <rect x="116" y="18" width="12" height="40" rx="3" fill="#f59e0b" stroke="#090a0f" strokeWidth="2" />
        <rect x="144" y="18" width="12" height="40" rx="3" fill="#fbbf24" stroke="#090a0f" strokeWidth="2" />
        {/* Spherical Muzzle Tesla Electrode & Chain Lightning */}
        <circle cx="184" cy="38" r="11" fill="#0284c7" stroke="#e0f2fe" strokeWidth="2.2" />
        <circle cx="184" cy="38" r="4.5" fill="#ffffff" />
        <polyline
          points="194,32 204,22 208,30 216,20"
          stroke="#7dd3fc"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="194,44 205,53 210,46 217,55"
          stroke="#c084fc"
          strokeWidth="1.8"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (weapon === WeaponId.GAUSS_RAILGUN) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <linearGradient id="gaussRailBeam" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="55%" stopColor="#00e5ff" />
            <stop offset="100%" stopColor="#fef08a" />
          </linearGradient>
        </defs>
        {/* Precision Thumbhole Chassis Stock */}
        <polygon points="10,33 56,28 56,52 18,58 10,46" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.8" />
        <polygon points="56,48 68,48 63,68 51,68" fill="#1e293b" stroke="#090a0f" strokeWidth="2" />
        {/* Long-Range Digital Ballistic Scope */}
        <rect x="58" y="12" width="52" height="11" rx="2.5" fill="#1e293b" stroke="#090a0f" strokeWidth="2" />
        <rect x="64" y="15" width="16" height="5" fill="#00e5ff" />
        <line x1="72" y1="23" x2="72" y2="28" stroke="#475569" strokeWidth="3" />
        <line x1="98" y1="23" x2="98" y2="28" stroke="#475569" strokeWidth="3" />
        {/* Split-Rail Hypervelocity Magnetic Barrels */}
        <rect x="52" y="27" width="154" height="7" rx="1.5" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        <rect x="52" y="42" width="154" height="7" rx="1.5" fill="#334155" stroke="#090a0f" strokeWidth="2" />
        {/* Exposed Central Plasma Accelerator Channel */}
        <rect x="60" y="36" width="154" height="4" rx="2" fill="url(#gaussRailBeam)" />
        {/* 4 Magnetic Accelerator Stage Bridges */}
        <rect x="96" y="25" width="7" height="26" rx="1.5" fill="#f59e0b" stroke="#090a0f" strokeWidth="1.5" />
        <rect x="126" y="25" width="7" height="26" rx="1.5" fill="#f59e0b" stroke="#090a0f" strokeWidth="1.5" />
        <rect x="156" y="25" width="7" height="26" rx="1.5" fill="#f59e0b" stroke="#090a0f" strokeWidth="1.5" />
        <rect x="186" y="25" width="7" height="26" rx="1.5" fill="#fde047" stroke="#090a0f" strokeWidth="1.5" />
      </svg>
    );
  }

  if (weapon === WeaponId.SINGULARITY_LAUNCHER) {
    return (
      <svg viewBox="0 0 220 84" className={className} fill="none" aria-hidden="true">
        <defs>
          <radialGradient id="voidOrb" cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor="#05020a" />
            <stop offset="55%" stopColor="#6b21a8" />
            <stop offset="85%" stopColor="#c084fc" />
            <stop offset="100%" stopColor="#00e5ff" />
          </radialGradient>
        </defs>
        {/* Heavy Counterweight Shoulder Housing */}
        <rect x="12" y="22" width="38" height="38" rx="5" fill="#1e1b4b" stroke="#090a0f" strokeWidth="2.4" />
        {/* Dark-Matter Containment Drum */}
        <ellipse cx="86" cy="56" rx="20" ry="12" fill="#2e1065" stroke="#a855f7" strokeWidth="2" />
        {/* Main Graviton Shroud */}
        <rect x="46" y="18" width="112" height="36" rx="6" fill="#18181b" stroke="#a855f7" strokeWidth="2.2" />
        <rect x="58" y="31" width="94" height="10" rx="5" fill="#581c87" />
        <line x1="62" y1="36" x2="148" y2="36" stroke="#e879f9" strokeWidth="2.5" strokeDasharray="6 4" />
        {/* Magnetic Containment Claws */}
        <path d="M158 20 L186 12 L192 22" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M158 52 L186 60 L192 50" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
        {/* Suspended Miniature Event-Horizon Core */}
        <circle cx="188" cy="36" r="14" fill="url(#voidOrb)" />
        <ellipse cx="188" cy="36" rx="20" ry="6" transform="rotate(-22 188 36)" stroke="#00e5ff" strokeWidth="1.8" />
        <circle cx="188" cy="36" r="5.5" fill="#030108" stroke="#f0abfc" strokeWidth="1.4" />
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
      <rect x="14" y="24" width="32" height="36" rx="4" fill="#18181b" stroke="#090a0f" strokeWidth="2.5" />
      <rect x="54" y="48" width="42" height="24" rx="6" fill="#27272a" stroke="#e11d48" strokeWidth="2" />
      <rect x="42" y="18" width="136" height="34" rx="5" fill="#1f2937" stroke="#090a0f" strokeWidth="2.5" />
      <rect x="78" y="8" width="42" height="12" rx="3" fill="#334155" stroke="#090a0f" strokeWidth="2" />
      <circle cx="112" cy="14" r="3.5" fill="#ff1744" />
      <rect x="58" y="30" width="114" height="10" rx="4" fill="url(#cannonChamber)" />
      <path d="M126 18V52M138 18V52M150 18V52" stroke="#090a0f" strokeWidth="3" />
      <polygon points="178,15 204,20 204,50 178,55" fill="#374151" stroke="#090a0f" strokeWidth="2.5" />
      <circle cx="201" cy="35" r="5" fill="#ff1744" />
    </svg>
  );
};

export const ArmorPreviewArt: React.FC<{ armor: ArmorId; className?: string }> = ({
  armor,
  className = 'w-full h-20',
}) => {
  if (armor === ArmorId.TITAN_REACTIVE_RIG) {
    return (
      <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
        {/* Heavy Tungsten-Amber Siege Pauldrons */}
        <polygon points="18,32 52,18 58,52 24,60" fill="#78350f" stroke="#f59e0b" strokeWidth="2.2" />
        <polygon points="162,32 128,18 122,52 156,60" fill="#78350f" stroke="#f59e0b" strokeWidth="2.2" />
        {/* Sloped ERA Chest Cuirass */}
        <polygon points="52,22 128,22 118,78 62,78" fill="#27272a" stroke="#fbbf24" strokeWidth="2.4" />
        <polygon points="60,28 120,28 113,54 67,54" fill="#3f3f46" stroke="#090a0f" strokeWidth="1.8" />
        {/* Reactive ERA Bricks */}
        <rect x="64" y="58" width="22" height="12" rx="2" fill="#d97706" stroke="#090a0f" strokeWidth="1.5" />
        <rect x="94" y="58" width="22" height="12" rx="2" fill="#d97706" stroke="#090a0f" strokeWidth="1.5" />
        {/* Molten Fusion Core */}
        <polygon points="90,32 102,42 90,52 78,42" fill="#fef08a" stroke="#ea580c" strokeWidth="2" />
      </svg>
    );
  }

  if (armor === ArmorId.AEGIS_QUANTUM_SHELL) {
    return (
      <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
        {/* Outer Projected Hex Shield Halo */}
        <ellipse cx="90" cy="48" rx="74" ry="38" stroke="#38bdf8" strokeWidth="1.6" strokeDasharray="5 3" />
        {/* Floating Shield Pylon Shoulders */}
        <polygon points="24,26 56,16 58,48 30,56" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.2" />
        <polygon points="156,26 124,16 122,48 150,56" fill="#0c4a6e" stroke="#38bdf8" strokeWidth="2.2" />
        {/* Quantum Lattice Breastplate */}
        <polygon points="56,20 124,20 114,78 66,78" fill="#0f172a" stroke="#00e5ff" strokeWidth="2.2" />
        <path d="M68 34H112M72 62H108" stroke="#0284c7" strokeWidth="2" />
        {/* Hexagonal Hard-Light Core */}
        <polygon points="90,29 103,37 103,51 90,59 77,51 77,37" fill="#0284c7" stroke="#e0f2fe" strokeWidth="2" />
        <circle cx="90" cy="44" r="5" fill="#ffffff" />
      </svg>
    );
  }

  if (armor === ArmorId.PHANTOM_STEALTH_EXO) {
    return (
      <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
        {/* Swept Cyber-Blade Pauldrons */}
        <polygon points="14,22 58,24 52,50 26,48" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
        <polygon points="166,22 122,24 128,50 154,48" fill="#064e3b" stroke="#10b981" strokeWidth="2" />
        {/* Matte-Obsidian Agile Exo-Torso */}
        <polygon points="56,22 124,22 108,80 72,80" fill="#111827" stroke="#34d399" strokeWidth="2.2" />
        {/* Optical Camo Neural Conduits */}
        <path d="M66 28L82 48L76 74M114 28L98 48L104 74" stroke="#10b981" strokeWidth="2.2" strokeLinecap="round" />
        <circle cx="90" cy="44" r="8" fill="#065f46" stroke="#6ee7b7" strokeWidth="2" />
        <circle cx="90" cy="44" r="3.5" fill="#a7f3d0" />
      </svg>
    );
  }

  if (armor === ArmorId.WRAITH_HALLOWEEN_PLATE) {
    return (
      <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
        {/* Haunted Gothic Cyber-Spiked Pauldrons */}
        <polygon points="14,18 56,22 54,54 22,58" fill="#3b0764" stroke="#c084fc" strokeWidth="2.2" />
        <polygon points="166,18 124,22 126,54 158,58" fill="#3b0764" stroke="#c084fc" strokeWidth="2.2" />
        {/* Blood-Moon Reaper Cuirass */}
        <polygon points="54,22 126,22 114,80 66,80" fill="#1e102f" stroke="#fb923c" strokeWidth="2.2" />
        {/* Mechanical Ribcage Plating */}
        <path d="M68 58H112M72 67H108" stroke="#a855f7" strokeWidth="2.4" strokeLinecap="round" />
        {/* Glowing Cyber Jack-o'-Core Sternum */}
        <ellipse cx="90" cy="41" rx="14" ry="11" fill="#ea580c" stroke="#fde047" strokeWidth="1.8" />
        <polygon points="83,39 87,36 86,41" fill="#fef08a" />
        <polygon points="97,39 93,36 94,41" fill="#fef08a" />
        <path d="M83 45L87 47L90 45L93 47L97 45" stroke="#fef08a" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    );
  }

  if (armor === ArmorId.OMEGA_SERAPH_CHASSIS) {
    return (
      <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
        {/* 4 Deployed Hard-Light Seraph Wing-Fins */}
        <polygon points="8,14 52,26 46,38 14,30" fill="#f43f5e" fillOpacity="0.85" />
        <polygon points="14,44 50,42 46,54 20,58" fill="#fbbf24" fillOpacity="0.8" />
        <polygon points="172,14 128,26 134,38 166,30" fill="#f43f5e" fillOpacity="0.85" />
        <polygon points="166,44 130,42 134,54 160,58" fill="#fbbf24" fillOpacity="0.8" />
        {/* Apex Valkyrie Command Cuirass */}
        <polygon points="52,18 128,18 114,82 66,82" fill="#1f121d" stroke="#fde047" strokeWidth="2.4" />
        <polygon points="62,24 118,24 108,58 72,58" fill="#881337" stroke="#fb7185" strokeWidth="1.8" />
        {/* Singularity Seraph Core */}
        <circle cx="90" cy="42" r="10" fill="#ffe4e6" stroke="#f43f5e" strokeWidth="2.4" />
        <polygon points="90,33 95,42 90,51 85,42" fill="#f59e0b" />
      </svg>
    );
  }

  // EVA_STANDARD_SUIT
  return (
    <svg viewBox="0 0 180 96" className={className} fill="none" aria-hidden="true">
      {/* Frontier EVA Shoulder Thruster Pods */}
      <rect x="28" y="24" width="28" height="32" rx="6" fill="#cbd5e1" stroke="#334155" strokeWidth="2.2" />
      <rect x="124" y="24" width="28" height="32" rx="6" fill="#cbd5e1" stroke="#334155" strokeWidth="2.2" />
      {/* Pressurized White/Slate EVA Torso */}
      <rect x="54" y="20" width="72" height="58" rx="10" fill="#e2e8f0" stroke="#1e293b" strokeWidth="2.4" />
      {/* Chest Life-Support Telemetry Box */}
      <rect x="68" y="34" width="44" height="24" rx="4" fill="#0f172a" stroke="#00e5ff" strokeWidth="2" />
      <rect x="74" y="40" width="18" height="5" rx="1" fill="#00e5ff" />
      <circle cx="101" cy="43" r="4" fill="#22c55e" />
      <rect x="74" y="49" width="32" height="4" rx="1" fill="#38bdf8" />
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
  | 'roboCat'
  | 'pumpkinPet'
  | 'batPet'
  | 'candy'
  | 'witchHat';

export function getCompanionIconKind(kind: CompanionKind): ItemIconKind {
  switch (kind) {
    case CompanionKind.CYBER_CAT:
      return 'roboCat';
    case CompanionKind.PUMPKIN_SPIRIT:
      return 'pumpkinPet';
    case CompanionKind.NIGHT_BAT:
      return 'batPet';
    default:
      return 'roboDog';
  }
}

export const ItemPreviewArt: React.FC<{ kind: ItemIconKind; className?: string }> = ({
  kind,
  className = 'w-9 h-9',
}) => {
  switch (kind) {
    case 'sphere':
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
          <circle cx="24" cy="24" r="20.5" stroke="#00e5ff" strokeWidth="1.5" strokeDasharray="4 2.5" />
          <circle cx="24" cy="24" r="17" fill="url(#cyberOrbShell)" stroke="#e0f2fe" strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="16.5" ry="6.2" transform="rotate(-24 24 24)" stroke="#ff2a85" strokeWidth="2" />
          <ellipse cx="24" cy="24" rx="16.5" ry="6.2" transform="rotate(36 24 24)" stroke="#00e5ff" strokeWidth="1.8" />
          <circle cx="24" cy="24" r="5.5" fill="#0f172a" stroke="#d9ff00" strokeWidth="2" />
          <circle cx="24" cy="24" r="2.5" fill="#00e5ff" />
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
          <rect x="4" y="6" width="40" height="36" rx="8" fill="#071f18" stroke="#10a37f" strokeWidth="2.2" />
          <polyline points="10,27 18,21 25,24 37,13" stroke="#10b981" strokeWidth="2.6" strokeLinecap="round" />
          <circle cx="37" cy="13" r="2.8" fill="#34d399" />
          <text x="24" y="37" textAnchor="middle" fill="#a7f3d0" fontSize="6.8" fontWeight="800" fontFamily="monospace">
            $OPENAI
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
          <text x="24" y="37" textAnchor="middle" fill="#e0f2fe" fontSize="7.2" fontWeight="800" fontFamily="monospace">
            {kind === 'anthStock' ? '$ANTH' : 'STOCK'}
          </text>
        </svg>
      );

    case 'roboDog':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#0b1528" stroke="#38bdf8" strokeWidth="2" />
          <polygon points="15,20 35,20 38,24 35,31 15,31" fill="#334155" stroke="#090a0f" strokeWidth="1.6" />
          <polygon points="9,14 21,14 22,24 9,24" fill="#475569" stroke="#090a0f" strokeWidth="1.6" />
          <polygon points="11,14 13,8 16,14" fill="#38bdf8" />
          <rect x="10.5" y="17" width="5" height="3" rx="1" fill="#00e5ff" />
          <rect x="22" y="23" width="8" height="3" rx="1" fill="#00e5ff" />
          <rect x="16" y="31" width="4.5" height="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <rect x="29" y="31" width="4.5" height="8" fill="#1e293b" stroke="#38bdf8" strokeWidth="1" />
          <path d="M35 22L40 16" stroke="#00e5ff" strokeWidth="2.4" strokeLinecap="round" />
        </svg>
      );

    case 'roboCat':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#0b1528" stroke="#00e5ff" strokeWidth="2" />
          <rect x="16" y="22" width="17" height="9" rx="2.5" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.6" />
          <rect x="10" y="15" width="11" height="10" rx="2.5" fill="#312e81" stroke="#38bdf8" strokeWidth="1.6" />
          <polygon points="10,15 12,8 15,15" fill="#00e5ff" />
          <polygon points="16,15 19,8 21,15" fill="#00e5ff" />
          <rect x="11.5" y="18" width="5" height="3" rx="1" fill="#00e5ff" />
          <rect x="17" y="31" width="3.5" height="7" fill="#38bdf8" />
          <rect x="28" y="31" width="3.5" height="7" fill="#38bdf8" />
          <path d="M33 24C39 22 39 14 36 12" stroke="#00e5ff" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );

    case 'pumpkinPet':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#1b0e07" stroke="#fb923c" strokeWidth="2" />
          <path d="M18 32 Q24 41 32 34 Q27 30 22 32 Z" fill="#a855f7" fillOpacity="0.65" />
          <polygon points="12,24 18,15 30,15 36,24 31,34 17,34" fill="#ea580c" stroke="#431407" strokeWidth="1.8" />
          <polygon points="15,15 33,15 27,8 23,5 20,11" fill="#3b0764" stroke="#f59e0b" strokeWidth="1.4" />
          <polygon points="18,21 22,19 21,23" fill="#00e5ff" />
          <polygon points="30,21 26,19 27,23" fill="#00e5ff" />
          <path d="M18 27 L21 29 L24 27 L27 29 L30 27" stroke="#fde047" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );

    case 'batPet':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#140924" stroke="#c084fc" strokeWidth="2" />
          <path
            d="M24 23 L8 14 L11 26 L17 24 L19 29 L24 26 L29 29 L31 24 L37 26 L40 14 Z"
            fill="#4c1d95"
            stroke="#e879f9"
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <polygon points="20,18 18,10 23,16" fill="#a855f7" />
          <polygon points="28,18 30,10 25,16" fill="#a855f7" />
          <circle cx="24" cy="22" r="5.5" fill="#1e1b4b" stroke="#38bdf8" strokeWidth="1.5" />
          <circle cx="22" cy="21.5" r="1.5" fill="#00e5ff" />
          <circle cx="26" cy="21.5" r="1.5" fill="#00e5ff" />
          <path d="M19 34 Q24 38 29 34" stroke="#00e5ff" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );

    case 'candy':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#1c0d26" stroke="#f97316" strokeWidth="2" />
          <polygon points="9,18 16,24 9,30" fill="#e879f9" />
          <polygon points="39,18 32,24 39,30" fill="#e879f9" />
          <ellipse cx="24" cy="24" rx="9.5" ry="7.5" fill="#fb923c" stroke="#fde047" strokeWidth="1.8" />
          <path d="M20 18 L23 30 M25 18 L28 30" stroke="#a855f7" strokeWidth="2.2" />
        </svg>
      );

    case 'witchHat':
      return (
        <svg viewBox="0 0 48 48" className={className} fill="none" aria-hidden="true">
          <rect x="4" y="4" width="40" height="40" rx="8" fill="#140921" stroke="#f59e0b" strokeWidth="2" />
          <ellipse cx="24" cy="33" rx="16" ry="4.5" fill="#3b0764" stroke="#a855f7" strokeWidth="1.8" />
          <polygon points="13,32 35,32 27,13 21,9 19,17" fill="#4c1d95" stroke="#c084fc" strokeWidth="1.6" />
          <rect x="15.5" y="27.5" width="17" height="3.5" rx="1" fill="#ea580c" />
          <rect x="22" y="27" width="4" height="4.5" rx="0.8" fill="#fde047" />
        </svg>
      );
  }
};
