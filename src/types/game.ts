export enum Language {
  EN = 'en',
  TR = 'tr',
  JA = 'ja',
  KO = 'ko',
  ZH = 'zh',
}

export enum ActiveTab {
  ARENA = 'arena',
  MARKET = 'market',
  TERMINAL = 'terminal',
  COMPANIONS = 'companions',
  MANUAL = 'manual',
}

export enum GameState {
  TITLE_MENU = 'TITLE_MENU',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  ROUND_SUMMARY = 'ROUND_SUMMARY',
  GAME_OVER = 'GAME_OVER',
}

export enum WeaponId {
  ARC_BLADE = 'ARC_BLADE',
  CHAINSAW_SWORD = 'CHAINSAW_SWORD',
  PULSE_LASER = 'PULSE_LASER',
  DISRUPTOR_CANNON = 'DISRUPTOR_CANNON',
  PLASMA_SCATTERGUN = 'PLASMA_SCATTERGUN',
  TESLA_ARC_EMITTER = 'TESLA_ARC_EMITTER',
  GAUSS_RAILGUN = 'GAUSS_RAILGUN',
  SINGULARITY_LAUNCHER = 'SINGULARITY_LAUNCHER',
}

export enum ArmorId {
  EVA_STANDARD_SUIT = 'EVA_STANDARD_SUIT',
  TITAN_REACTIVE_RIG = 'TITAN_REACTIVE_RIG',
  AEGIS_QUANTUM_SHELL = 'AEGIS_QUANTUM_SHELL',
  PHANTOM_STEALTH_EXO = 'PHANTOM_STEALTH_EXO',
  WRAITH_HALLOWEEN_PLATE = 'WRAITH_HALLOWEEN_PLATE',
  OMEGA_SERAPH_CHASSIS = 'OMEGA_SERAPH_CHASSIS',
}

export enum PlayerSkinId {
  DEGEN_ASTRO = 'DEGEN_ASTRO',
  CIPHER_GREEN = 'CIPHER_GREEN',
  VOLT_ORANGE = 'VOLT_ORANGE',
  ROTOR_TEAL = 'ROTOR_TEAL',
}

export enum EnemyKind {
  OPENAI_STALKER = 'OPENAI_STALKER',
  OPENAI_VIPER = 'OPENAI_VIPER',
  ANTHROPIC_BULWARK = 'ANTHROPIC_BULWARK',
  LOGIC_WEAVER_ELITE = 'LOGIC_WEAVER_ELITE',
  WILD_SCOUT_DOG = 'WILD_SCOUT_DOG',
  WILD_CYBER_CAT = 'WILD_CYBER_CAT',
  WILD_PUMPKIN_SPIRIT = 'WILD_PUMPKIN_SPIRIT',
  WILD_NIGHT_BAT = 'WILD_NIGHT_BAT',
  ELDRITCH_TENTACLE_WEAVER = 'ELDRITCH_TENTACLE_WEAVER',
  SHOGGOTH_CORE_AMALGAM = 'SHOGGOTH_CORE_AMALGAM',
  CTHULHU_LEVIATHAN_PRIME = 'CTHULHU_LEVIATHAN_PRIME',
  MECH_SPIDER_ARACHNID = 'MECH_SPIDER_ARACHNID',
  MUTATED_EXCAVATOR_BEHEMOTH = 'MUTATED_EXCAVATOR_BEHEMOTH',
  CHIMERA_HOUND_WEAVER = 'CHIMERA_HOUND_WEAVER',
  ELITE_CHIMERA_JUGGERNAUT = 'ELITE_CHIMERA_JUGGERNAUT',
  BOSS_IRON_COLOSSUS_TITAN = 'BOSS_IRON_COLOSSUS_TITAN',
  BOSS_OMEGA_CHIMERA_AMALGAM = 'BOSS_OMEGA_CHIMERA_AMALGAM',
  PUMPKIN_SCYTHE_REAPER = 'PUMPKIN_SCYTHE_REAPER',
  SPECTRAL_BANSHEE_WRAITH = 'SPECTRAL_BANSHEE_WRAITH',
  FRANKEN_STITCH_JUGGERNAUT = 'FRANKEN_STITCH_JUGGERNAUT',
  BOSS_HEADLESS_DOOM_RIDER = 'BOSS_HEADLESS_DOOM_RIDER',
}

export enum CompanionKind {
  SCOUT_DOG = 'SCOUT_DOG',
  CYBER_CAT = 'CYBER_CAT',
  PUMPKIN_SPIRIT = 'PUMPKIN_SPIRIT',
  NIGHT_BAT = 'NIGHT_BAT',
}

export interface CompanionInstance {
  id: string;
  kind: CompanionKind;
  nickname: string;
  hp: number;
  maxHp: number;
  rebelling: boolean;
  level: number;
}

export interface EquityTicker {
  symbol: 'OpenAI' | 'Anthropic';
  tokenTicker: '$OPENAI' | '$ANTH';
  nameKey: 'oaiEquityName' | 'anthEquityName';
  coreType: 'oCore' | 'aCore';
  navUsd: number;
  coreToShareRatio: number;
  change24h: number;
  history: number[];
}

export interface ChainTransaction {
  id: string;
  hash: string;
  timestamp: string;
  action: string;
  detail: string;
  amountLabel: string;
  platform: 'Robinhood Chain' | 'vibevibe.fun';
}

export type WeaponLevels = Record<WeaponId, number>;
export type ArmorLevels = Record<ArmorId, number>;

export interface TouchControlSettings {
  joystickMode: 'floating' | 'fixed';
  fireMode: 'tap_to_shoot' | 'joystick' | 'auto_aim_button';
  joystickScale: number; // 0.8 to 1.4
  buttonScale: number; // 0.8 to 1.4
  quickSwapWheelEnabled: boolean;
  leftHanded: boolean;
}

export const DEFAULT_TOUCH_SETTINGS: TouchControlSettings = {
  joystickMode: 'floating',
  fireMode: 'joystick',
  joystickScale: 1.05,
  buttonScale: 1.2,
  quickSwapWheelEnabled: true,
  leftHanded: false,
};

export const TOUCH_SETTINGS_STORAGE_KEY = 'ai_uprising_touch_settings_v1';

export interface PlayerPortfolio {
  selectedSkin: PlayerSkinId;
  equippedWeapon: WeaponId;
  equippedArmor: ArmorId;
  ownedWeapons: WeaponId[];
  ownedArmors: ArmorId[];
  halloweenHat?: boolean;
  ru9: number;
  oCores: number;
  aCores: number;
  oaiShares: number;
  anthShares: number;
  masterSpheres: number;
  ammoCells: number;
  energyPacks: number;
  medkits: number;
  firmwarePatches: number;
  weaponLevels: WeaponLevels;
  armorLevels: ArmorLevels;
  companions: CompanionInstance[];
  activeCompanionId: string | null;
  highestWave: number;
  totalKills: number;
  txHistory: ChainTransaction[];
}
