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
  ELDRITCH_TENTACLE_WEAVER = 'ELDRITCH_TENTACLE_WEAVER',
  SHOGGOTH_CORE_AMALGAM = 'SHOGGOTH_CORE_AMALGAM',
  CTHULHU_LEVIATHAN_PRIME = 'CTHULHU_LEVIATHAN_PRIME',
}

export enum CompanionKind {
  SCOUT_DOG = 'SCOUT_DOG',
  CYBER_CAT = 'CYBER_CAT',
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
  nameKey: 'oaiEquityName' | 'anthEquityName';
  coreType: 'oCore' | 'aCore';
  priceRu9: number;
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

export interface WeaponLevels {
  [WeaponId.ARC_BLADE]: number;
  [WeaponId.CHAINSAW_SWORD]: number;
  [WeaponId.PULSE_LASER]: number;
  [WeaponId.DISRUPTOR_CANNON]: number;
}

export interface PlayerPortfolio {
  selectedSkin: PlayerSkinId;
  equippedWeapon: WeaponId;
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
  companions: CompanionInstance[];
  activeCompanionId: string | null;
  highestWave: number;
  totalKills: number;
  txHistory: ChainTransaction[];
}
