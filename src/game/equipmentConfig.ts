import { TranslationStrings } from '../i18n/translations';
import { ArmorId, ArmorLevels, WeaponId, WeaponLevels } from '../types/game';

export const ALL_WEAPON_IDS: WeaponId[] = [
  WeaponId.ARC_BLADE,
  WeaponId.CHAINSAW_SWORD,
  WeaponId.PULSE_LASER,
  WeaponId.DISRUPTOR_CANNON,
  WeaponId.PLASMA_SCATTERGUN,
  WeaponId.TESLA_ARC_EMITTER,
  WeaponId.GAUSS_RAILGUN,
  WeaponId.SINGULARITY_LAUNCHER,
];

export const STARTER_WEAPON_IDS: WeaponId[] = [
  WeaponId.ARC_BLADE,
  WeaponId.CHAINSAW_SWORD,
  WeaponId.PULSE_LASER,
  WeaponId.DISRUPTOR_CANNON,
];

export const ALL_ARMOR_IDS: ArmorId[] = [
  ArmorId.EVA_STANDARD_SUIT,
  ArmorId.TITAN_REACTIVE_RIG,
  ArmorId.AEGIS_QUANTUM_SHELL,
  ArmorId.PHANTOM_STEALTH_EXO,
  ArmorId.WRAITH_HALLOWEEN_PLATE,
  ArmorId.OMEGA_SERAPH_CHASSIS,
];

export const DEFAULT_WEAPON_LEVELS: WeaponLevels = {
  [WeaponId.ARC_BLADE]: 1,
  [WeaponId.CHAINSAW_SWORD]: 1,
  [WeaponId.PULSE_LASER]: 1,
  [WeaponId.DISRUPTOR_CANNON]: 1,
  [WeaponId.PLASMA_SCATTERGUN]: 1,
  [WeaponId.TESLA_ARC_EMITTER]: 1,
  [WeaponId.GAUSS_RAILGUN]: 1,
  [WeaponId.SINGULARITY_LAUNCHER]: 1,
};

export const DEFAULT_ARMOR_LEVELS: ArmorLevels = {
  [ArmorId.EVA_STANDARD_SUIT]: 1,
  [ArmorId.TITAN_REACTIVE_RIG]: 1,
  [ArmorId.AEGIS_QUANTUM_SHELL]: 1,
  [ArmorId.PHANTOM_STEALTH_EXO]: 1,
  [ArmorId.WRAITH_HALLOWEEN_PLATE]: 1,
  [ArmorId.OMEGA_SERAPH_CHASSIS]: 1,
};

export interface WeaponCatalogItem {
  id: WeaponId;
  hotkey: string;
  isStarter: boolean;
  buyCostRu9: number;
  upgradeBaseRu9: number;
  cellCost: number;
  statsBadge: string;
  nameKey: keyof TranslationStrings;
  descKey: keyof TranslationStrings;
}

export const WEAPON_CATALOG_CONFIG: WeaponCatalogItem[] = [
  {
    id: WeaponId.ARC_BLADE,
    hotkey: '1',
    isStarter: true,
    buyCostRu9: 0,
    upgradeBaseRu9: 25000,
    cellCost: 0,
    statsBadge: 'DMG 60 · Melee · 3rd Hit EMP Stun',
    nameKey: 'weaponArcBlade',
    descKey: 'weaponArcDesc',
  },
  {
    id: WeaponId.CHAINSAW_SWORD,
    hotkey: '2',
    isStarter: true,
    buyCostRu9: 0,
    upgradeBaseRu9: 25000,
    cellCost: 0,
    statsBadge: 'DMG 80 · Heavy Cleave · +50% Core Drop',
    nameKey: 'weaponChainsaw',
    descKey: 'weaponChainsawDesc',
  },
  {
    id: WeaponId.PULSE_LASER,
    hotkey: '3',
    isStarter: true,
    buyCostRu9: 0,
    upgradeBaseRu9: 25000,
    cellCost: 1,
    statsBadge: 'DMG 54 · Line Pierce · 1 Cell',
    nameKey: 'weaponPulseLaser',
    descKey: 'weaponPulseDesc',
  },
  {
    id: WeaponId.DISRUPTOR_CANNON,
    hotkey: '4',
    isStarter: true,
    buyCostRu9: 0,
    upgradeBaseRu9: 28000,
    cellCost: 2,
    statsBadge: 'DMG 116 · Auto-Lock AoE · 2 Cells',
    nameKey: 'weaponDisruptor',
    descKey: 'weaponDisruptorDesc',
  },
  {
    id: WeaponId.PLASMA_SCATTERGUN,
    hotkey: '5',
    isStarter: false,
    buyCostRu9: 65000,
    upgradeBaseRu9: 32000,
    cellCost: 1,
    statsBadge: 'DMG 34×5 · 5-Bolt Ion Cone · 1 Cell',
    nameKey: 'weaponScattergun',
    descKey: 'weaponScattergunDesc',
  },
  {
    id: WeaponId.TESLA_ARC_EMITTER,
    hotkey: '6',
    isStarter: false,
    buyCostRu9: 95000,
    upgradeBaseRu9: 36000,
    cellCost: 1,
    statsBadge: 'DMG 66 · 4-Target Chain Arc · 1 Cell',
    nameKey: 'weaponTeslaArc',
    descKey: 'weaponTeslaArcDesc',
  },
  {
    id: WeaponId.GAUSS_RAILGUN,
    hotkey: '7',
    isStarter: false,
    buyCostRu9: 135000,
    upgradeBaseRu9: 42000,
    cellCost: 2,
    statsBadge: 'DMG 165 · Mach-7 Rail Pierce · 2 Cells',
    nameKey: 'weaponGaussRail',
    descKey: 'weaponGaussRailDesc',
  },
  {
    id: WeaponId.SINGULARITY_LAUNCHER,
    hotkey: '8',
    isStarter: false,
    buyCostRu9: 185000,
    upgradeBaseRu9: 48000,
    cellCost: 3,
    statsBadge: 'DMG 195 · Graviton Vortex AoE · 3 Cells',
    nameKey: 'weaponSingularity',
    descKey: 'weaponSingularityDesc',
  },
];

export interface ArmorCatalogItem {
  id: ArmorId;
  isStarter: boolean;
  buyCostRu9: number;
  upgradeBaseRu9: number;
  baseBonusHp: number;
  baseMaxShield: number;
  shieldRegenPerSec: number;
  baseDamageReduction: number;
  moveSpeedBonus: number;
  dashCdReduction: number;
  fireRateBonus: number;
  damageBonus: number;
  killHeal: number;
  ringColor: string;
  nameKey: keyof TranslationStrings;
  descKey: keyof TranslationStrings;
}

export const ARMOR_CATALOG_CONFIG: ArmorCatalogItem[] = [
  {
    id: ArmorId.EVA_STANDARD_SUIT,
    isStarter: true,
    buyCostRu9: 0,
    upgradeBaseRu9: 20000,
    baseBonusHp: 0,
    baseMaxShield: 25,
    shieldRegenPerSec: 8,
    baseDamageReduction: 0.04,
    moveSpeedBonus: 0,
    dashCdReduction: 0,
    fireRateBonus: 0,
    damageBonus: 0,
    killHeal: 0,
    ringColor: '#00e5ff',
    nameKey: 'armorEvaStandard',
    descKey: 'armorEvaStandardDesc',
  },
  {
    id: ArmorId.TITAN_REACTIVE_RIG,
    isStarter: false,
    buyCostRu9: 60000,
    upgradeBaseRu9: 28000,
    baseBonusHp: 75,
    baseMaxShield: 45,
    shieldRegenPerSec: 11,
    baseDamageReduction: 0.18,
    moveSpeedBonus: 0,
    dashCdReduction: 0,
    fireRateBonus: 0,
    damageBonus: 0.05,
    killHeal: 0,
    ringColor: '#f59e0b',
    nameKey: 'armorTitanReactive',
    descKey: 'armorTitanReactiveDesc',
  },
  {
    id: ArmorId.AEGIS_QUANTUM_SHELL,
    isStarter: false,
    buyCostRu9: 95000,
    upgradeBaseRu9: 34000,
    baseBonusHp: 45,
    baseMaxShield: 105,
    shieldRegenPerSec: 22,
    baseDamageReduction: 0.14,
    moveSpeedBonus: 0.05,
    dashCdReduction: 0.08,
    fireRateBonus: 0,
    damageBonus: 0,
    killHeal: 0,
    ringColor: '#38bdf8',
    nameKey: 'armorAegisQuantum',
    descKey: 'armorAegisQuantumDesc',
  },
  {
    id: ArmorId.PHANTOM_STEALTH_EXO,
    isStarter: false,
    buyCostRu9: 120000,
    upgradeBaseRu9: 38000,
    baseBonusHp: 40,
    baseMaxShield: 60,
    shieldRegenPerSec: 15,
    baseDamageReduction: 0.11,
    moveSpeedBonus: 0.18,
    dashCdReduction: 0.28,
    fireRateBonus: 0.14,
    damageBonus: 0.08,
    killHeal: 0,
    ringColor: '#10b981',
    nameKey: 'armorPhantomExo',
    descKey: 'armorPhantomExoDesc',
  },
  {
    id: ArmorId.WRAITH_HALLOWEEN_PLATE,
    isStarter: false,
    buyCostRu9: 155000,
    upgradeBaseRu9: 42000,
    baseBonusHp: 70,
    baseMaxShield: 85,
    shieldRegenPerSec: 18,
    baseDamageReduction: 0.19,
    moveSpeedBonus: 0.1,
    dashCdReduction: 0.12,
    fireRateBonus: 0.08,
    damageBonus: 0.15,
    killHeal: 4,
    ringColor: '#c084fc',
    nameKey: 'armorWraithPlate',
    descKey: 'armorWraithPlateDesc',
  },
  {
    id: ArmorId.OMEGA_SERAPH_CHASSIS,
    isStarter: false,
    buyCostRu9: 220000,
    upgradeBaseRu9: 52000,
    baseBonusHp: 120,
    baseMaxShield: 140,
    shieldRegenPerSec: 28,
    baseDamageReduction: 0.26,
    moveSpeedBonus: 0.14,
    dashCdReduction: 0.2,
    fireRateBonus: 0.12,
    damageBonus: 0.2,
    killHeal: 3,
    ringColor: '#f43f5e',
    nameKey: 'armorOmegaSeraph',
    descKey: 'armorOmegaSeraphDesc',
  },
];

export interface ComputedArmorStats {
  maxHp: number;
  maxShield: number;
  shieldRegenPerSec: number;
  damageReduction: number;
  moveSpeedMult: number;
  dashCooldownMult: number;
  fireCooldownMult: number;
  damageMult: number;
  killHeal: number;
  ringColor: string;
}

export function getWeaponUpgradeCostRu9(weaponId: WeaponId, currentLvl: number): number {
  const cfg = WEAPON_CATALOG_CONFIG.find((w) => w.id === weaponId) || WEAPON_CATALOG_CONFIG[0];
  return cfg.upgradeBaseRu9 * currentLvl;
}

export function getArmorUpgradeCostRu9(armorId: ArmorId, currentLvl: number): number {
  const cfg = ARMOR_CATALOG_CONFIG.find((a) => a.id === armorId) || ARMOR_CATALOG_CONFIG[0];
  return cfg.upgradeBaseRu9 * currentLvl;
}

export function computeArmorStats(
  armorId: ArmorId,
  level = 1,
  basePlayerHp = 210
): ComputedArmorStats {
  const cfg = ARMOR_CATALOG_CONFIG.find((a) => a.id === armorId) || ARMOR_CATALOG_CONFIG[0];
  const tierFactor = 1 + (Math.max(1, level) - 1) * 0.18;
  const bonusHp = Math.round((cfg.baseBonusHp + (level - 1) * 14) * tierFactor);
  const maxShield = Math.round((cfg.baseMaxShield + (level - 1) * 12) * tierFactor);
  const dr = Math.min(0.45, cfg.baseDamageReduction + (level - 1) * 0.025);

  return {
    maxHp: basePlayerHp + bonusHp,
    maxShield,
    shieldRegenPerSec: cfg.shieldRegenPerSec * (1 + (level - 1) * 0.12),
    damageReduction: dr,
    moveSpeedMult: 1 + cfg.moveSpeedBonus,
    dashCooldownMult: Math.max(0.55, 1 - cfg.dashCdReduction),
    fireCooldownMult: Math.max(0.68, 1 - cfg.fireRateBonus),
    damageMult: 1 + cfg.damageBonus + (level - 1) * 0.03,
    killHeal: cfg.killHeal,
    ringColor: cfg.ringColor,
  };
}
