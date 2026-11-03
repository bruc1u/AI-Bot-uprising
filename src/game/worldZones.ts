export type ContinentLandmarkVariant =
  | 'vibevibe_tower'
  | 'keycap_nvda'
  | 'keycap_openai'
  | 'keycap_spacex'
  | 'keycap_anth'
  | 'crt_desk'
  | 'server_rack'
  | 'cryo_core'
  | 'turret_console'
  | 'partition_wall'
  | 'eldritch_obelisk'
  | 'flesh_hive'
  | 'titan_wreck'
  | 'mech_gantry'
  | 'tesla_pylon'
  | 'haunted_crypt'
  | 'witch_cauldron'
  | 'halloween_glitch_screen';

export interface ObstacleBlock {
  x: number;
  y: number;
  w: number;
  h: number;
  heightZ: number;
  variant: ContinentLandmarkVariant;
  label?: string;
}

export type ZoneId =
  | 'command_hub'
  | 'server_vault'
  | 'robotics_foundry'
  | 'cryo_lab'
  | 'ordnance_hangar'
  | 'chimera_reactor'
  | 'eldritch_outdoors'
  | 'mecha_wasteland';

export interface ZoneMeta {
  id: ZoneId;
  isOutdoor: boolean;
  isMechaWasteland?: boolean;
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
}

export const WORLD_W = 7200;
export const WORLD_H = 4600;
export const OUTDOOR_DIVIDE_X = 2680;
export const MECHA_WASTELAND_DIVIDE_X = 4680;
export const PLAYER_SPAWN_X = 1780;
export const PLAYER_SPAWN_Y = 1840;

export const BLOOD_MOON_ALTARS = [
  { id: 'altar-hub', x: 2180, y: 1840, radius: 92 },
  { id: 'altar-abyss', x: 3480, y: 2040, radius: 96 },
] as const;

export const WORLD_ZONES: ZoneMeta[] = [
  {
    id: 'server_vault',
    isOutdoor: false,
    code: 'SECTOR-A1 · OPENAI NEURAL VAULT',
    x: 64,
    y: 88,
    w: 1716,
    h: 1032,
    accent: '#10a37f',
  },
  {
    id: 'robotics_foundry',
    isOutdoor: false,
    code: 'SECTOR-A2 · ANTHROPIC FOUNDRY',
    x: 1780,
    y: 88,
    w: 900,
    h: 1032,
    accent: '#eab308',
  },
  {
    id: 'cryo_lab',
    isOutdoor: false,
    code: 'SECTOR-B1 · BIO-CRYO CONTAINMENT',
    x: 64,
    y: 1120,
    w: 856,
    h: 1440,
    accent: '#00f5d4',
  },
  {
    id: 'command_hub',
    isOutdoor: false,
    code: 'SECTOR-00 · QUANTUM COMMAND HUB',
    x: 920,
    y: 1120,
    w: 1760,
    h: 1440,
    accent: '#00e5ff',
  },
  {
    id: 'ordnance_hangar',
    isOutdoor: false,
    code: 'SECTOR-C1 · HEAVY ORDNANCE HANGAR',
    x: 64,
    y: 2560,
    w: 2616,
    h: 980,
    accent: '#38bdf8',
  },
  {
    id: 'chimera_reactor',
    isOutdoor: false,
    code: 'SECTOR-D1 · CHIMERA SPLICING LAB',
    x: 64,
    y: 3540,
    w: 2616,
    h: 992,
    accent: '#f43f5e',
  },
  {
    id: 'eldritch_outdoors',
    isOutdoor: true,
    code: 'FORBIDDEN ZONE · CTHULHU BIO-ABYSS',
    x: OUTDOOR_DIVIDE_X,
    y: 88,
    w: MECHA_WASTELAND_DIVIDE_X - OUTDOOR_DIVIDE_X,
    h: WORLD_H - 156,
    accent: '#c026d3',
  },
  {
    id: 'mecha_wasteland',
    isOutdoor: true,
    isMechaWasteland: true,
    code: 'OPEN WORLD · TITAN MECHA WASTELAND',
    x: MECHA_WASTELAND_DIVIDE_X,
    y: 88,
    w: WORLD_W - MECHA_WASTELAND_DIVIDE_X - 64,
    h: WORLD_H - 156,
    accent: '#f97316',
  },
];

export function getZoneAt(x: number, y: number): ZoneMeta {
  if (x >= MECHA_WASTELAND_DIVIDE_X) {
    return WORLD_ZONES[7];
  }
  if (x >= OUTDOOR_DIVIDE_X) {
    return WORLD_ZONES[6];
  }
  for (let i = 0; i < 6; i++) {
    const z = WORLD_ZONES[i];
    if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
      return z;
    }
  }
  return WORLD_ZONES[3];
}

/**
 * Interior Partition Bulkheads & Eastern Quarantine Blast Wall with wide doorways (340-460px).
 * East of x = 2680 is a vast seamless Open World spanning the Cthulhu Abyss & Titan Mecha Wasteland.
 */
export const FACILITY_PARTITION_WALLS: ObstacleBlock[] = [
  // Horizontal Wall 1 (y = 1104): Doorways at x = 360..680, 1220..1580, 2080..2440
  { x: 64, y: 1104, w: 296, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 680, y: 1104, w: 540, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 1580, y: 1104, w: 500, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 2440, y: 1104, w: 222, h: 34, heightZ: 52, variant: 'partition_wall' },

  // Vertical Wall 1 between Server Vault & Foundry (x = 1764, y = 88..1104): Doorway y = 440..780
  { x: 1764, y: 88, w: 34, h: 352, heightZ: 52, variant: 'partition_wall' },
  { x: 1764, y: 780, w: 34, h: 324, heightZ: 52, variant: 'partition_wall' },

  // Vertical Wall 2 between Cryo Lab & Command Hub (x = 904, y = 1138..2544): Doorway y = 1640..2040
  { x: 904, y: 1138, w: 34, h: 502, heightZ: 52, variant: 'partition_wall' },
  { x: 904, y: 2040, w: 34, h: 504, heightZ: 52, variant: 'partition_wall' },

  // Horizontal Wall 2 between Cryo/Command Hub & Ordnance Hangar (y = 2544): Doorways x = 360..680, 1560..1980
  { x: 64, y: 2544, w: 296, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 680, y: 2544, w: 880, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 1980, y: 2544, w: 682, h: 34, heightZ: 52, variant: 'partition_wall' },

  // Horizontal Wall 3 between Ordnance Hangar & Chimera Splicing Lab (y = 3524): Doorways x = 520..900, 1660..2080
  { x: 64, y: 3524, w: 456, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 900, y: 3524, w: 760, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 2080, y: 3524, w: 582, h: 34, heightZ: 52, variant: 'partition_wall' },

  // EASTERN QUARANTINE BLAST WALL (x = 2662) with 4 Wide Breached Gates:
  // Gate 1: y = 420..780 | Gate 2: y = 1620..2080 | Gate 3: y = 2860..3240 | Gate 4: y = 3860..4240
  { x: 2662, y: 88, w: 40, h: 332, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 780, w: 40, h: 840, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 2080, w: 40, h: 780, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 3240, w: 40, h: 620, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 4240, w: 40, h: 292, heightZ: 64, variant: 'partition_wall' },
];

export const ROOM_LANDMARK_OBSTACLES: ObstacleBlock[] = [
  // ROOM 1: Central Quantum Command Hub (x: 920..2660, y: 1120..2540)
  { x: 1458, y: 1615, w: 104, h: 62, heightZ: 86, variant: 'vibevibe_tower' },
  { x: 1998, y: 1615, w: 104, h: 62, heightZ: 86, variant: 'vibevibe_tower' },
  { x: 1160, y: 1350, w: 124, h: 62, heightZ: 56, variant: 'crt_desk' },
  { x: 2250, y: 1350, w: 124, h: 62, heightZ: 56, variant: 'crt_desk' },
  { x: 1160, y: 2240, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  { x: 2280, y: 2240, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  // Futuristic Halloween Glitch Screens in Command Hub
  { x: 1220, y: 1840, w: 128, h: 58, heightZ: 84, variant: 'halloween_glitch_screen' },
  { x: 2340, y: 1980, w: 128, h: 58, heightZ: 84, variant: 'halloween_glitch_screen' },

  // ROOM 2: OpenAI Neural Server Vault (x: 64..1760, y: 88..1100)
  { x: 250, y: 260, w: 138, h: 66, heightZ: 82, variant: 'server_rack' },
  { x: 430, y: 260, w: 138, h: 66, heightZ: 82, variant: 'server_rack' },
  { x: 1170, y: 260, w: 138, h: 66, heightZ: 82, variant: 'server_rack' },
  { x: 1350, y: 260, w: 138, h: 66, heightZ: 82, variant: 'server_rack' },
  { x: 830, y: 550, w: 116, h: 74, heightZ: 74, variant: 'keycap_openai' },
  { x: 280, y: 760, w: 116, h: 74, heightZ: 72, variant: 'keycap_nvda' },
  { x: 1460, y: 760, w: 128, h: 58, heightZ: 84, variant: 'halloween_glitch_screen' },

  // ROOM 3: Anthropic Robotics Foundry (x: 1798..2660, y: 88..1100)
  { x: 2000, y: 280, w: 116, h: 74, heightZ: 74, variant: 'keycap_anth' },
  { x: 2340, y: 280, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  { x: 2140, y: 780, w: 124, h: 62, heightZ: 56, variant: 'crt_desk' },
  { x: 1860, y: 860, w: 126, h: 58, heightZ: 84, variant: 'halloween_glitch_screen' },

  // ROOM 4: Bio-Cryo Containment Lab (x: 64..900, y: 1138..2540)
  { x: 230, y: 1340, w: 106, h: 72, heightZ: 84, variant: 'cryo_core' },
  { x: 560, y: 1340, w: 106, h: 72, heightZ: 84, variant: 'cryo_core' },
  { x: 230, y: 2140, w: 106, h: 72, heightZ: 84, variant: 'cryo_core' },
  { x: 550, y: 2140, w: 124, h: 62, heightZ: 56, variant: 'crt_desk' },
  { x: 220, y: 1740, w: 126, h: 58, heightZ: 84, variant: 'halloween_glitch_screen' },

  // ROOM 5: Heavy Ordnance Hangar (x: 64..2660, y: 2578..3520)
  { x: 400, y: 2940, w: 118, h: 74, heightZ: 74, variant: 'keycap_spacex' },
  { x: 1150, y: 2840, w: 138, h: 66, heightZ: 80, variant: 'server_rack' },
  { x: 1150, y: 3220, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  { x: 2220, y: 2840, w: 106, h: 72, heightZ: 82, variant: 'cryo_core' },
  { x: 2220, y: 3240, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  { x: 1580, y: 3040, w: 132, h: 58, heightZ: 86, variant: 'halloween_glitch_screen' },

  // ROOM 6: South Chimera Splicing Lab (x: 64..2660, y: 3558..4510)
  { x: 330, y: 3860, w: 106, h: 72, heightZ: 84, variant: 'cryo_core' },
  { x: 330, y: 4220, w: 128, h: 86, heightZ: 82, variant: 'flesh_hive' },
  { x: 1260, y: 3960, w: 124, h: 62, heightZ: 56, variant: 'crt_desk' },
  { x: 1460, y: 3960, w: 106, h: 72, heightZ: 84, variant: 'cryo_core' },
  { x: 2240, y: 3840, w: 138, h: 66, heightZ: 82, variant: 'server_rack' },
  { x: 2240, y: 4240, w: 98, h: 62, heightZ: 64, variant: 'turret_console' },
  { x: 1840, y: 4220, w: 132, h: 58, heightZ: 86, variant: 'halloween_glitch_screen' },

  // OUTDOOR ZONE 1: Cthulhu Bio-Cyber Forbidden Wastes (x: 2720..4640, y: 88..4510)
  { x: 3140, y: 480, w: 106, h: 76, heightZ: 96, variant: 'eldritch_obelisk' },
  { x: 4060, y: 560, w: 126, h: 86, heightZ: 76, variant: 'flesh_hive' },
  { x: 3520, y: 1260, w: 126, h: 86, heightZ: 78, variant: 'flesh_hive' },
  { x: 4240, y: 1740, w: 116, h: 82, heightZ: 108, variant: 'eldritch_obelisk' },
  { x: 3160, y: 2420, w: 106, h: 76, heightZ: 96, variant: 'eldritch_obelisk' },
  { x: 3960, y: 2680, w: 128, h: 86, heightZ: 80, variant: 'flesh_hive' },
  { x: 3420, y: 3480, w: 128, h: 86, heightZ: 82, variant: 'flesh_hive' },
  { x: 4280, y: 3680, w: 112, h: 80, heightZ: 104, variant: 'eldritch_obelisk' },
  { x: 3180, y: 4160, w: 108, h: 76, heightZ: 98, variant: 'eldritch_obelisk' },
  { x: 2920, y: 2180, w: 134, h: 60, heightZ: 88, variant: 'halloween_glitch_screen' },
  { x: 3980, y: 1160, w: 134, h: 60, heightZ: 88, variant: 'halloween_glitch_screen' },

  // OUTDOOR ZONE 2 (OPEN WORLD): Mutated Giant Mecha Wasteland & Titan Graveyard (x: 4720..7080, y: 88..4510)
  { x: 5060, y: 520, w: 168, h: 96, heightZ: 88, variant: 'titan_wreck' },
  { x: 5860, y: 460, w: 148, h: 84, heightZ: 102, variant: 'mech_gantry' },
  { x: 6620, y: 640, w: 86, h: 68, heightZ: 112, variant: 'tesla_pylon' },

  { x: 5240, y: 1380, w: 86, h: 68, heightZ: 112, variant: 'tesla_pylon' },
  { x: 6180, y: 1280, w: 172, h: 98, heightZ: 92, variant: 'titan_wreck' },
  { x: 6780, y: 1640, w: 148, h: 84, heightZ: 104, variant: 'mech_gantry' },

  { x: 5080, y: 2380, w: 148, h: 84, heightZ: 102, variant: 'mech_gantry' },
  { x: 5920, y: 2260, w: 86, h: 68, heightZ: 112, variant: 'tesla_pylon' },
  { x: 6580, y: 2620, w: 172, h: 98, heightZ: 92, variant: 'titan_wreck' },

  { x: 5280, y: 3420, w: 168, h: 96, heightZ: 90, variant: 'titan_wreck' },
  { x: 6140, y: 3480, w: 148, h: 84, heightZ: 104, variant: 'mech_gantry' },
  { x: 6820, y: 3820, w: 86, h: 68, heightZ: 112, variant: 'tesla_pylon' },

  { x: 5020, y: 4160, w: 86, h: 68, heightZ: 112, variant: 'tesla_pylon' },
  { x: 5880, y: 4180, w: 172, h: 98, heightZ: 90, variant: 'titan_wreck' },
  { x: 5560, y: 1340, w: 136, h: 60, heightZ: 88, variant: 'halloween_glitch_screen' },
  { x: 6320, y: 2980, w: 136, h: 60, heightZ: 88, variant: 'halloween_glitch_screen' },

  // HALLOWEEN CORRUPTED SERVER CRYPTS & BIO-REACTOR CAULDRONS ACROSS BIOMES
  { x: 1520, y: 2140, w: 92, h: 68, heightZ: 72, variant: 'witch_cauldron' },
  { x: 640, y: 820, w: 98, h: 68, heightZ: 86, variant: 'haunted_crypt' },
  { x: 760, y: 3960, w: 92, h: 68, heightZ: 72, variant: 'witch_cauldron' },
  { x: 2920, y: 1220, w: 98, h: 68, heightZ: 86, variant: 'haunted_crypt' },
  { x: 3740, y: 2220, w: 92, h: 68, heightZ: 72, variant: 'witch_cauldron' },
  { x: 5440, y: 2040, w: 98, h: 68, heightZ: 86, variant: 'haunted_crypt' },
];

export const ARENA_OBSTACLES: ObstacleBlock[] = [
  ...FACILITY_PARTITION_WALLS,
  ...ROOM_LANDMARK_OBSTACLES,
];
