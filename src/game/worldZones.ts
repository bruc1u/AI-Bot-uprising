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
  | 'flesh_hive';

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
  | 'eldritch_outdoors';

export interface ZoneMeta {
  id: ZoneId;
  isOutdoor: boolean;
  code: string;
  x: number;
  y: number;
  w: number;
  h: number;
  accent: string;
}

export const WORLD_W = 4600;
export const WORLD_H = 3200;
export const OUTDOOR_DIVIDE_X = 2680;
export const PLAYER_SPAWN_X = 1780;
export const PLAYER_SPAWN_Y = 1640;

export const WORLD_ZONES: ZoneMeta[] = [
  {
    id: 'server_vault',
    isOutdoor: false,
    code: 'SECTOR-A1 · OPENAI NEURAL VAULT',
    x: 64,
    y: 88,
    w: 1716,
    h: 892,
    accent: '#10a37f',
  },
  {
    id: 'robotics_foundry',
    isOutdoor: false,
    code: 'SECTOR-A2 · ANTHROPIC FOUNDRY',
    x: 1780,
    y: 88,
    w: 900,
    h: 892,
    accent: '#eab308',
  },
  {
    id: 'cryo_lab',
    isOutdoor: false,
    code: 'SECTOR-B1 · BIO-CRYO CONTAINMENT',
    x: 64,
    y: 980,
    w: 856,
    h: 1240,
    accent: '#00f5d4',
  },
  {
    id: 'command_hub',
    isOutdoor: false,
    code: 'SECTOR-00 · QUANTUM COMMAND HUB',
    x: 920,
    y: 980,
    w: 1760,
    h: 1240,
    accent: '#00e5ff',
  },
  {
    id: 'ordnance_hangar',
    isOutdoor: false,
    code: 'SECTOR-C1 · HEAVY ORDNANCE HANGAR',
    x: 64,
    y: 2220,
    w: 2616,
    h: 912,
    accent: '#38bdf8',
  },
  {
    id: 'eldritch_outdoors',
    isOutdoor: true,
    code: 'OUTDOOR BREACH · ELDRITCH WASTES',
    x: OUTDOOR_DIVIDE_X,
    y: 88,
    w: WORLD_W - OUTDOOR_DIVIDE_X - 64,
    h: WORLD_H - 156,
    accent: '#c026d3',
  },
];

export function getZoneAt(x: number, y: number): ZoneMeta {
  if (x >= OUTDOOR_DIVIDE_X) {
    return WORLD_ZONES[5];
  }
  for (let i = 0; i < 5; i++) {
    const z = WORLD_ZONES[i];
    if (x >= z.x && x <= z.x + z.w && y >= z.y && y <= z.y + z.h) {
      return z;
    }
  }
  return WORLD_ZONES[3];
}

/**
 * Interior Partition Bulkheads & Eastern Quarantine Blast Wall with wide open doorways (320-400px)
 * so rooms feel architecturally distinct while allowing smooth combat navigation.
 */
export const FACILITY_PARTITION_WALLS: ObstacleBlock[] = [
  // Horizontal North Wall separating Server Vault / Foundry (y = 964) from Cryo Lab / Command Hub
  // Doorway 1 (Cryo <-> Server): x = 360..660 | Doorway 2 (Command <-> Server): x = 1220..1560 | Doorway 3 (Command <-> Foundry): x = 2080..2420
  { x: 64, y: 964, w: 296, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 660, y: 964, w: 560, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 1560, y: 964, w: 520, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 2420, y: 964, w: 260, h: 34, heightZ: 52, variant: 'partition_wall' },

  // Vertical Wall between Server Vault & Robotics Foundry (x = 1764, y = 88..964) with Doorway y = 410..710
  { x: 1764, y: 88, w: 34, h: 322, heightZ: 52, variant: 'partition_wall' },
  { x: 1764, y: 710, w: 34, h: 254, heightZ: 52, variant: 'partition_wall' },

  // Vertical Wall between Bio-Cryo Lab & Quantum Command Hub (x = 904, y = 998..2204) with Doorway y = 1420..1780
  { x: 904, y: 998, w: 34, h: 422, heightZ: 52, variant: 'partition_wall' },
  { x: 904, y: 1780, w: 34, h: 424, heightZ: 52, variant: 'partition_wall' },

  // Horizontal South Wall separating Cryo / Command Hub from Heavy Ordnance Hangar (y = 2204)
  // Doorway 1 (Cryo <-> Hangar): x = 360..660 | Doorway 2 (Command <-> Hangar): x = 1600..1980
  { x: 64, y: 2204, w: 296, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 660, y: 2204, w: 940, h: 34, heightZ: 52, variant: 'partition_wall' },
  { x: 1980, y: 2204, w: 700, h: 34, heightZ: 52, variant: 'partition_wall' },

  // EASTERN QUARANTINE BLAST WALL (x = 2662) separating Indoor Facility from Outdoor Eldritch Wastes!
  // 3 Massive Breached Airlocks: North Gate (y = 400..760), Central Main Breach (y = 1400..1840), South Hangar Breach (y = 2480..2840)
  { x: 2662, y: 88, w: 40, h: 312, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 760, w: 40, h: 640, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 1840, w: 40, h: 640, heightZ: 64, variant: 'partition_wall' },
  { x: 2662, y: 2840, w: 40, h: 292, heightZ: 64, variant: 'partition_wall' },
];

export const ROOM_LANDMARK_OBSTACLES: ObstacleBlock[] = [
  // ROOM 1: Central Quantum Command Hub (x: 920..2660, y: 980..2200)
  { x: 1470, y: 1420, w: 88, h: 56, heightZ: 74, variant: 'vibevibe_tower' },
  { x: 2002, y: 1420, w: 88, h: 56, heightZ: 74, variant: 'vibevibe_tower' },
  { x: 1180, y: 1200, w: 112, h: 58, heightZ: 42, variant: 'crt_desk' },
  { x: 2260, y: 1200, w: 112, h: 58, heightZ: 42, variant: 'crt_desk' },
  { x: 1180, y: 1940, w: 88, h: 58, heightZ: 46, variant: 'turret_console' },
  { x: 2290, y: 1940, w: 88, h: 58, heightZ: 46, variant: 'turret_console' },

  // ROOM 2: OpenAI Neural Server Vault (x: 64..1760, y: 88..960)
  { x: 260, y: 250, w: 132, h: 64, heightZ: 72, variant: 'server_rack' },
  { x: 430, y: 250, w: 132, h: 64, heightZ: 72, variant: 'server_rack' },
  { x: 1180, y: 250, w: 132, h: 64, heightZ: 72, variant: 'server_rack' },
  { x: 1350, y: 250, w: 132, h: 64, heightZ: 72, variant: 'server_rack' },
  { x: 840, y: 490, w: 98, h: 74, heightZ: 58, variant: 'keycap_openai' },
  { x: 290, y: 660, w: 96, h: 74, heightZ: 54, variant: 'keycap_nvda' },

  // ROOM 3: Anthropic Robotics Foundry (x: 1798..2660, y: 88..960)
  { x: 2020, y: 260, w: 98, h: 74, heightZ: 56, variant: 'keycap_anth' },
  { x: 2350, y: 260, w: 88, h: 58, heightZ: 48, variant: 'turret_console' },
  { x: 2160, y: 680, w: 112, h: 58, heightZ: 44, variant: 'crt_desk' },

  // ROOM 4: Bio-Cryo Anomaly Containment Lab (x: 64..900, y: 998..2200)
  { x: 240, y: 1180, w: 102, h: 70, heightZ: 78, variant: 'cryo_core' },
  { x: 560, y: 1180, w: 102, h: 70, heightZ: 78, variant: 'cryo_core' },
  { x: 240, y: 1840, w: 102, h: 70, heightZ: 78, variant: 'cryo_core' },
  { x: 560, y: 1840, w: 112, h: 58, heightZ: 42, variant: 'crt_desk' },

  // ROOM 5: South Heavy Ordnance Hangar (x: 64..2660, y: 2238..3120)
  { x: 460, y: 2620, w: 96, h: 74, heightZ: 56, variant: 'keycap_spacex' },
  { x: 1180, y: 2560, w: 132, h: 64, heightZ: 68, variant: 'server_rack' },
  { x: 1180, y: 2860, w: 88, h: 58, heightZ: 46, variant: 'turret_console' },
  { x: 2180, y: 2560, w: 102, h: 70, heightZ: 76, variant: 'cryo_core' },
  { x: 2180, y: 2860, w: 88, h: 58, heightZ: 46, variant: 'turret_console' },

  // OUTDOOR ZONE: Crimson Eldritch Cthulhu-AI Wastes (x: 2702..4520, y: 88..3120)
  { x: 3140, y: 460, w: 106, h: 76, heightZ: 96, variant: 'eldritch_obelisk' },
  { x: 3960, y: 520, w: 126, h: 86, heightZ: 76, variant: 'flesh_hive' },
  { x: 3460, y: 1180, w: 126, h: 86, heightZ: 78, variant: 'flesh_hive' },
  { x: 4140, y: 1560, w: 116, h: 82, heightZ: 108, variant: 'eldritch_obelisk' },
  { x: 3160, y: 2140, w: 106, h: 76, heightZ: 96, variant: 'eldritch_obelisk' },
  { x: 3880, y: 2380, w: 128, h: 86, heightZ: 80, variant: 'flesh_hive' },
  { x: 4220, y: 2780, w: 108, h: 76, heightZ: 98, variant: 'eldritch_obelisk' },
];

export const ARENA_OBSTACLES: ObstacleBlock[] = [
  ...FACILITY_PARTITION_WALLS,
  ...ROOM_LANDMARK_OBSTACLES,
];
