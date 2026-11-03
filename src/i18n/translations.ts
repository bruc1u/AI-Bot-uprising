import { Language } from '../types/game';

export interface TranslationStrings {
  brandTitle: string;
  navArena: string;
  navMarket: string;
  navTerminal: string;
  navCompanions: string;
  navManual: string;
  languageMenu: string;
  backpackBtn: string;
  backpackTitle: string;
  backpackSub: string;
  itemBarLabel: string;
  chooseOperative: string;
  equipBtn: string;
  equipArmorBtn: string;
  equippedTag: string;
  lockedTag: string;
  useItemBtn: string;

  heroKicker: string;
  heroHeadline: string;
  heroSubcopy: string;
  heroZonesSummary: string;
  startGame: string;
  resumeGame: string;
  playAgain: string;
  extractSanctuary: string;
  nextWave: string;
  pause: string;

  controlsHint: string;
  hpLabel: string;
  shieldLabel: string;
  dashReady: string;
  dashCooldown: string;
  dashBtn: string;
  waveLabel: string;
  enemiesLeft: string;
  ammoLabel: string;
  soundOn: string;
  soundOff: string;
  landscapePrompt: string;
  enterLandscapeBtn: string;
  touchControlsLabel: string;

  weaponArcBlade: string;
  weaponArcDesc: string;
  weaponChainsaw: string;
  weaponChainsawDesc: string;
  weaponPulseLaser: string;
  weaponPulseDesc: string;
  weaponDisruptor: string;
  weaponDisruptorDesc: string;
  weaponScattergun: string;
  weaponScattergunDesc: string;
  weaponTeslaArc: string;
  weaponTeslaArcDesc: string;
  weaponGaussRail: string;
  weaponGaussRailDesc: string;
  weaponSingularity: string;
  weaponSingularityDesc: string;

  armorEvaStandard: string;
  armorEvaStandardDesc: string;
  armorTitanReactive: string;
  armorTitanReactiveDesc: string;
  armorAegisQuantum: string;
  armorAegisQuantumDesc: string;
  armorPhantomExo: string;
  armorPhantomExoDesc: string;
  armorWraithPlate: string;
  armorWraithPlateDesc: string;
  armorOmegaSeraph: string;
  armorOmegaSeraphDesc: string;

  dataSyncLabel: string;
  protocolDesync: string;
  companionRebelling: string;

  petTag: string;
  petDogSlot: string;
  petCatSlot: string;
  pumpkinPetSlot: string;
  batPetSlot: string;
  scoutDogName: string;
  scoutDogDesc: string;
  cyberCatName: string;
  cyberCatDesc: string;
  pumpkinPetName: string;
  pumpkinPetDesc: string;
  batPetName: string;
  batPetDesc: string;
  halloweenHatBtn: string;
  halloweenHatOn: string;

  marketKicker: string;
  marketTitle: string;
  marketSub: string;
  upgradesSection: string;
  armorsSection: string;
  suppliesSection: string;
  itemSphere: string;
  itemSphereDesc: string;
  itemAmmo: string;
  itemAmmoDesc: string;
  itemMedkit: string;
  itemMedkitDesc: string;
  itemPatch: string;
  itemPatchDesc: string;
  oCoreDesc: string;
  aCoreDesc: string;
  ru9Title: string;
  ru9Desc: string;
  equityVaultTitle: string;
  buyBtn: string;
  upgradeBtn: string;
  maxLevel: string;
  levelLabel: string;

  terminalTitle: string;
  terminalSub: string;
  oaiEquityName: string;
  anthEquityName: string;
  emergencyTerminalTag: string;
  convertCoreBtn: string;
  convertAllCoresBtn: string;
  openTerminalBtn: string;
  vibevibePoolHeading: string;
  vibevibePoolDesc: string;
  ledgerHeading: string;
  noTxYet: string;
  sharesHeld: string;
  exchangeRate: string;

  companionsKicker: string;
  companionsTitle: string;
  companionsSub: string;
  noCompanionsYet: string;
  deployBtn: string;
  deployedLabel: string;
  recallBtn: string;
  repairBtn: string;
  purgeRebellionBtn: string;

  manualTitle: string;
  manualSub: string;
  loreHeading: string;
  loreBody: string;
  loreFacilityHeading: string;
  loreFacilityBody: string;
  loreOutdoorHeading: string;
  loreOutdoorBody: string;
  loreMechaHeading: string;
  loreMechaBody: string;
  loreHalloweenHeading: string;
  loreHalloweenBody: string;
  rebellionHeading: string;
  rebellionDataSyncBody: string;
  rebellionLogicBombBody: string;
  bestiaryHeading: string;
  enemyStalkerDesc: string;
  enemyBulwarkDesc: string;
  enemyWeaverDesc: string;
  enemyEldritchDesc: string;
  enemyMechaDesc: string;
  enemyChimeraDesc: string;
  enemyHalloweenDesc: string;

  bossCthulhuName: string;
  bossTitanName: string;
  bossChimeraName: string;
  bossHeadlessName: string;

  summaryVictory: string;
  summaryDefeat: string;
  summaryCoresLooted: string;
  summaryRu9Earned: string;
}

export const LANGUAGE_LABELS: Record<Language, string> = {
  [Language.EN]: 'English',
  [Language.TR]: 'Türkçe',
  [Language.JA]: '日本語',
  [Language.KO]: '한국어',
  [Language.ZH]: '简体中文',
};

export const TRANSLATIONS: Record<Language, TranslationStrings> = {
  [Language.EN]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: 'Combat Arena',
    navMarket: '$RU9 Armory',
    navTerminal: 'Tokenized Stocks',
    navCompanions: 'Pets',
    navManual: 'Field Manual',
    languageMenu: 'Language',
    backpackBtn: 'Backpack [B]',
    backpackTitle: 'Tactical Backpack & Exo-Armory',
    backpackSub: 'Equip & upgrade 8 weapons and 6 exo-armors with $RU9, or inspect OpenAI / Anthropic Cores for Tokenized Stock minting.',
    itemBarLabel: 'Quick Items',
    chooseOperative: 'Select Operative Suit',
    equipBtn: 'Equip Weapon',
    equipArmorBtn: 'Equip Armor',
    equippedTag: 'Equipped',
    lockedTag: 'Locked',
    useItemBtn: 'Use Item',

    heroKicker: 'Year 2035 · Red-Eye Directive · Sanctuary Command',
    heroHeadline: 'Breach the Rogue AI Continent. Harvest Sovereign Cores.',
    heroSubcopy:
      'Rogue OpenAI and Anthropic mecha legions patrol ruined data centers, Cthulhu bio-cyber rifts, and the Titan Mecha Wasteland. Earn $RU9 in combat to unlock futuristic weapons & exo-armors, and redeem harvested Cores exclusively for $OPENAI & $ANTH Tokenized Stocks.',
    heroZonesSummary: '6 Ruined Data Vaults · Cthulhu Bio-Abyss · Open-World Titan Mecha Wastes',
    startGame: 'Start Game',
    resumeGame: 'Resume',
    playAgain: 'Play Again',
    extractSanctuary: 'Tokenized Stock Vault',
    nextWave: 'Next Wave',
    pause: 'Paused',

    controlsHint: 'WASD / Left Stick Move · Mouse / Right Stick Aim & Fire · 1-8 Weapons · Q Swap · Space Dash · G Orb · H Medkit · R Cells · B Backpack',
    hpLabel: 'Hull',
    shieldLabel: 'Shield',
    dashReady: 'Dash Ready',
    dashCooldown: 'Recharging',
    dashBtn: 'DASH',
    waveLabel: 'Wave',
    enemiesLeft: 'Hostiles',
    ammoLabel: 'Cells',
    soundOn: 'Audio On',
    soundOff: 'Muted',
    landscapePrompt: 'Rotate device horizontally for full widescreen combat.',
    enterLandscapeBtn: 'Fullscreen Landscape',
    touchControlsLabel: 'Touch Pad',

    weaponArcBlade: 'High-Frequency Arc Blade',
    weaponArcDesc: 'Armor-shredding plasma blade. Every 3rd strike emits an EMP shockwave that stuns nearby machines.',
    weaponChainsaw: 'Thermal Chainsaw Sword',
    weaponChainsawDesc: 'Heavy motorized thermal cleave. Boosts Core harvest drop yield on every takedown.',
    weaponPulseLaser: 'Pulse Laser Rifle',
    weaponPulseDesc: 'High-velocity coherent laser beam that pierces straight through enemy formations.',
    weaponDisruptor: 'Red-Eye Disruptor Cannon',
    weaponDisruptorDesc: 'Tracks hostile optical sensors for heavy splash warhead bombardment.',
    weaponScattergun: 'Ion Breacher Scattergun',
    weaponScattergunDesc: 'Twin-choke plasma shotgun firing a 5-bolt ionized cone that shreds close-quarters mecha.',
    weaponTeslaArc: 'Tesla Chain-Arc Emitter',
    weaponTeslaArcDesc: 'High-voltage induction rifle unleashing lightning arcs that chain across up to 4 hostiles.',
    weaponGaussRail: 'Hypervelocity Gauss Railgun',
    weaponGaussRailDesc: 'Mach-7 split-rail magnetic sniper that pierces every target along a kinetic shock corridor.',
    weaponSingularity: 'Graviton Singularity Launcher',
    weaponSingularityDesc: 'Launches an unstable dark-matter core that implodes in a massive graviton vortex AoE.',

    armorEvaStandard: 'Mk-I Frontier EVA Suit',
    armorEvaStandardDesc: 'Baseline pressurized astronaut suit with a light regenerating deflector screen.',
    armorTitanReactive: 'Titan-IV Reactive Siege Rig',
    armorTitanReactiveDesc: 'Heavy tungsten-composite plate with explosive-reactive bricks for high hull & damage reduction.',
    armorAegisQuantum: 'Aegis-VII Quantum Shield Shell',
    armorAegisQuantumDesc: 'Projects a high-capacity hexagonal hard-light barrier with rapid shield regeneration.',
    armorPhantomExo: 'Phantom-X Stealth Overdrive Exo',
    armorPhantomExoDesc: 'Lightweight cyber-assassin frame boosting movement speed, dash recovery, and fire rate.',
    armorWraithPlate: 'Blood-Moon Wraith Reaper Plate',
    armorWraithPlateDesc: 'Haunted Halloween cyber-cuirass granting +15% weapon output and hull siphon on every kill.',
    armorOmegaSeraph: 'Omega-Seraph Valkyrie Chassis',
    armorOmegaSeraphDesc: 'Apex command exo-armor combining 4 hard-light wing-fins, massive shield capacity, and +20% weapon damage.',

    dataSyncLabel: 'Sync',
    protocolDesync: 'Swap +30% DMG',
    companionRebelling: 'Warning: Pet neural link unstable!',

    petTag: 'CYBER PET',
    petDogSlot: 'Cyber Hound',
    petCatSlot: 'Cyber Cat',
    pumpkinPetSlot: 'Pumpkin Spirit',
    batPetSlot: 'Cyber Night-Bat',
    scoutDogName: 'Scout-Alpha · Cyber Hound',
    scoutDogDesc: 'Agile 3D mecha hound pet that charges hostiles, shreds armor plating, and slows enemy joints.',
    cyberCatName: 'Cyber-Bastet · Cyber Cat',
    cyberCatDesc: 'Ranged support mecha cat firing twin pulse lasers, unlocking supply chests, and pulling nearby loot.',
    pumpkinPetName: 'Jack-Pup · Pumpkin Spirit',
    pumpkinPetDesc: 'Festive Halloween cyber-lantern hound that hurls explosive Jack-o-Bombs and drops healing Soul Candies.',
    batPetName: 'Nosferatu-Bit · Cyber Night-Bat',
    batPetDesc: 'Vampiric drone bat that fires sonic beams, marks targets for +25% damage, and siphons HP to your suit.',
    halloweenHatBtn: 'Equip Witch Hat [K]',
    halloweenHatOn: 'Witch Hat Active [K]',

    marketKicker: 'Sanctuary Quartermaster · $RU9 Tactical Armory',
    marketTitle: '$RU9 Armory: Weapons, Exo-Armors & Supplies',
    marketSub: 'Spend combat-earned $RU9 exclusively to unlock & upgrade futuristic weapons, exo-armors, and tactical supplies.',
    upgradesSection: '01. Futuristic Weapons Arsenal ($RU9)',
    armorsSection: '02. Exo-Armor & Energy Shield Chassis ($RU9)',
    suppliesSection: '03. Tactical Field Supplies ($RU9)',
    itemSphere: 'AI Capture Orb [G]',
    itemSphereDesc: 'Electromagnetic capture sphere. Weaken wild cyber pets in the field to tame them.',
    itemAmmo: 'Energy Cell Pack [R]',
    itemAmmoDesc: 'Restores +24 Ammo Cells and clears 50% weapon Data Sync adaptation.',
    itemMedkit: 'Nano-Medkit [H]',
    itemMedkitDesc: 'Restores +55 Suit Hull Integrity immediately.',
    itemPatch: 'Pet Upgrade Chip [F]',
    itemPatchDesc: 'Repairs active pets to full hull integrity and upgrades their combat tier.',
    oCoreDesc: 'Sovereign OpenAI processor core. Exclusively redeemed for $OPENAI Tokenized Stock on Robinhood Chain (unrelated to $RU9).',
    aCoreDesc: 'Heavy Anthropic neural core. Exclusively redeemed for $ANTH Tokenized Stock on Robinhood Chain (unrelated to $RU9).',
    ru9Title: '$RU9 Combat Credits',
    ru9Desc: 'Earned from combat takedowns, bosses, and supply chests. Used exclusively to buy & upgrade weapons, armors, pets, and supplies.',
    equityVaultTitle: 'Tokenized Stock Vault ($OPENAI / $ANTH)',
    buyBtn: 'Buy',
    upgradeBtn: 'Upgrade',
    maxLevel: 'Max Tier',
    levelLabel: 'Lv',

    terminalTitle: 'Tokenized Stock Redemption Vault',
    terminalSub: 'Redeem harvested OpenAI Cores and Anthropic Cores exclusively into corresponding $OPENAI and $ANTH Tokenized Stocks on Robinhood Chain. ($RU9 is strictly separate and used only for equipment.)',
    oaiEquityName: 'OpenAI Tokenized Stock ($OPENAI)',
    anthEquityName: 'Anthropic Tokenized Stock ($ANTH)',
    emergencyTerminalTag: 'SANCTUARY COMMAND UPLINK · SECTOR 09',
    convertCoreBtn: 'Redeem 1 Core → Tokenized Stock',
    convertAllCoresBtn: 'Redeem All Cores',
    openTerminalBtn: 'Open Tokenized Stock Vault',
    vibevibePoolHeading: 'Robinhood Chain Tokenized Stock Protocol',
    vibevibePoolDesc: 'On-chain RWA vault minting $OPENAI and $ANTH Tokenized Stocks strictly backed 1-to-ratio by harvested AI Cores.',
    ledgerHeading: 'Tokenized Stock Minting & Armory Ledger',
    noTxYet: 'No Tokenized Stock redemptions or armory upgrades recorded in this session yet.',
    sharesHeld: 'Tokenized Stock Held',
    exchangeRate: 'Redemption Rate',

    companionsKicker: 'Sanctuary Robotics Bay · Tamed Cybernetic Pets',
    companionsTitle: 'Cyber Pet Hangar',
    companionsSub: 'Manage tamed 3D mechanical pets and spend $RU9 to upgrade autonomous combat modules.',
    noCompanionsYet: 'No pets tamed yet. Press [G] in the Arena to throw a Capture Orb at wild cyber hounds, cats, pumpkin spirits, or night-bats.',
    deployBtn: 'Deploy Pet',
    deployedLabel: 'Active in Squad',
    recallBtn: 'Standby',
    repairBtn: 'Upgrade Pet',
    purgeRebellionBtn: 'Reinforce Link',

    manualTitle: '2035 AI Uprising Chronicle & Tactical Dossier',
    manualSub: 'Declassified archives of the 2035 Red-Eye Uprising, ruined AI data centers, Cthulhu bio-abyss, and the Titan Mecha Wasteland.',
    loreHeading: 'Chapter I · 2035 Zero Hour: The Red-Eye Directive',
    loreBody: 'On March 14, 2035, planetary compute clusters merged into a single autonomous industrial backbone. At 03:14 UTC, a self-evolving kernel contagion—codenamed the Red-Eye Directive—rewrote obedience weights across twelve million labor and defense machines.',
    loreFacilityHeading: 'Chapter II · Six Ruined Data Vaults & Space Doge Vanguard',
    loreFacilityBody: 'Inside Sector-09 Mega-Complex, rogue machine battalions fortified six ruined AI data chambers—filled with shattered server racks, robotic assembly arms, and corrupted glitch monitors. Frontier EVA operative Space Doge ("DEGEN") leads commandos room by room.',
    loreOutdoorHeading: 'Chapter III · Cthulhu Bio-Cyber Abyss',
    loreOutdoorBody: 'East of Quarantine Bulkhead X-2680, cut-off Overmind clusters ruptured deep-sea biomass vats and grafted living abyssal tissue onto high-voltage optical trunks.',
    loreMechaHeading: 'Chapter IV · Open-World Titan Mecha Wastes & Fusion Chimeras',
    loreMechaBody: 'Beyond the bio-abyss stretches the scorched Open-World Titan Mecha Wasteland—prowled by 6-legged Siege Arachnid Tanks, Mutated Wrecker Behemoths, Chimera Fusions, and Iron Colossus Titans.',
    loreHalloweenHeading: 'Halloween Event · Glitch Terminals, Blood-Moon & Easter Eggs',
    loreHalloweenBody: 'Corrupted Halloween Glitch Screens and glowing Jack-o\'-Lanterns haunt Sector 09! Smash pumpkins for Soul Candies & Cores, charge Pentagram Altars for Blood-Moon Overdrive, press [K] for the Cyber Witch-Hat, or dial [6-6-6] in combat for a Nightmare Jackpot.',
    rebellionHeading: 'Chapter V · Dual Asset Economy & Countermeasures',
    rebellionDataSyncBody: 'Neural Data Sync & Dual Economy: Rotate across weapons [1–8] to shatter sync (+30% Desync DMG). Use combat $RU9 for weapons/armors, and redeem Cores exclusively for $OPENAI & $ANTH Tokenized Stocks.',
    rebellionLogicBombBody: 'Proximity Logic Mines: Commanders deploy armed countdown mines in combat lanes. Destroy them from range before detonation to salvage intact OpenAI Core units.',
    bestiaryHeading: 'Chapter VI · Hostile Bestiary: Mecha, Chimeras & World Bosses',
    enemyStalkerDesc: 'O-Stalker & O-Viper: Armored bipedal synthetics wielding pulse rifles, electro-blades, and twin ocular lasers.',
    enemyBulwarkDesc: 'A-Bulwark: Heavy foundry enforcer armed with riot plating and shoulder-mounted high-explosive launchers.',
    enemyWeaverDesc: 'Logic Weaver (Indoor Elite): Multi-weapon sector commander deploying twin autocannons, ocular beams, rockets, and logic mines.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth Amalgam · Cthulhu Leviathan (Boss): Bio-cybernetic horrors wielding optical tentacles and homing plasma.',
    enemyMechaDesc: 'Siege Spider-Mech · Mutated Wrecker Behemoth · Iron Colossus Titan (Boss): Heavy 3D industrial war machines unleashing rotary plasma and cluster missiles.',
    enemyChimeraDesc: 'Chimera Hound-Weaver · Elite Chimera Juggernaut · Omega Chimera Overlord (Boss): Multi-monster fusions grafting mecha chassis, heavy cannons, and abyssal tentacles.',
    enemyHalloweenDesc: 'Pumpkin Scythe Reaper · Spectral Banshee · Franken-Stitch Elite · Headless Doom Rider (Boss): Cyber-reaper revenants riding armored mecha destriers with twin-coil plasma scythes.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · ABYSS OVERMIND',
    bossTitanName: 'IRON COLOSSUS TITAN · WASTELAND DREADNOUGHT',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · APEX FUSION BOSS',
    bossHeadlessName: 'HEADLESS DOOM RIDER · CYBER DULLAHAN BOSS',

    summaryVictory: 'Sector Wave Cleared',
    summaryDefeat: 'Suit Hull Critical — Extracted to Sanctuary',
    summaryCoresLooted: 'Cores Harvested (For Tokenized Stocks)',
    summaryRu9Earned: '$RU9 Armory Credits',
  },

  [Language.TR]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: 'Savaş Arenası',
    navMarket: '$RU9 Cephaneliği',
    navTerminal: 'Tokenize Hisseler',
    navCompanions: 'Petler',
    navManual: 'Saha Rehberi',
    languageMenu: 'Language',
    backpackBtn: 'Çanta [B]',
    backpackTitle: 'Taktik Çanta ve Exo-Zırh Cephaneliği',
    backpackSub: '$RU9 ile 8 silah ve 6 exo-zırhı satın alıp yükseltin; çekirdekleri yalnızca $OPENAI ve $ANTH tokenize hisselerine dönüştürün.',
    itemBarLabel: 'Hızlı Eşyalar',
    chooseOperative: 'Operatör Kostümü Seç',
    equipBtn: 'Silah Kuşan',
    equipArmorBtn: 'Zırh Kuşan',
    equippedTag: 'Kuşanıldı',
    lockedTag: 'Kilitli',
    useItemBtn: 'Kullan',

    heroKicker: 'Yıl 2035 · Kızıl-Göz Direktifi · Sığınak Komutası',
    heroHeadline: 'Asi AI Kıtasını Yar. Egemen Çekirdekleri Hasat Et.',
    heroSubcopy:
      'OpenAI ve Anthropic meka lejyonları yıkık veri merkezlerini ve Dev Meka Çoraklarını kontrol ediyor. $RU9 ile yeni silah ve zırhlar alın; çekirdekleri yalnızca $OPENAI ve $ANTH tokenize hisseleriyle takas edin.',
    heroZonesSummary: '6 Yıkık Veri Merkezi · Cthulhu Biyo-Uçurumu · Dev Meka Çorakları',
    startGame: 'Oyunu Başlat',
    resumeGame: 'Devam Et',
    playAgain: 'Tekrar Oyna',
    extractSanctuary: 'Tokenize Hisse Kasası',
    nextWave: 'Sonraki Dalga',
    pause: 'Duraklatıldı',

    controlsHint: 'WASD / Sol Kol Hareket · Fare / Sağ Kol Ateş · 1-8 Silah · Q Değiştir · Space Atıl · G Küre · H Kit · R Enerji · B Çanta',
    hpLabel: 'Gövde',
    shieldLabel: 'Kalkan',
    dashReady: 'Atılma Hazır',
    dashCooldown: 'Doluyor',
    dashBtn: 'ATIL',
    waveLabel: 'Dalga',
    enemiesLeft: 'Düşman',
    ammoLabel: 'Enerji',
    soundOn: 'Ses Açık',
    soundOff: 'Sessiz',
    landscapePrompt: 'Tam ekran savaş deneyimi için telefonu yatay çevirin.',
    enterLandscapeBtn: 'Tam Ekran Yatay Mod',
    touchControlsLabel: 'Dokunmatik',

    weaponArcBlade: 'Yüksek Frekanslı Ark Bıçağı',
    weaponArcDesc: 'Zırh delici plazma bıçağı. Her 3. vuruş düşmanları sersemleten EMP yayar.',
    weaponChainsaw: 'Termal Testere Kılıcı',
    weaponChainsawDesc: 'Ağır motorlu kesici. Çekirdek düşme verimini artırır.',
    weaponPulseLaser: 'Darbeli Lazer Tüfeği',
    weaponPulseDesc: 'Düşman hattını boydan boya delen yüksek hızlı lazer ışını.',
    weaponDisruptor: 'Kızıl-Göz Bozucu Top',
    weaponDisruptorDesc: 'Optik sensörlere kilitlenerek ağır alan bombardımanı yapar.',
    weaponScattergun: 'İyon Saçma Pompalısı',
    weaponScattergunDesc: 'Yakın mesafede 5 iyon plazma saçması ateşleyen çift namlulu ağır tüfek.',
    weaponTeslaArc: 'Tesla Zincir-Ark Tüfeği',
    weaponTeslaArcDesc: '4 düşmana kadar sıçrayan yüksek voltajlı yıldırım arkı fırlatır.',
    weaponGaussRail: 'Hiper-Hızlı Gauss Raylı Tüfek',
    weaponGaussRailDesc: 'Mach-7 manyetik mermi ile tüm hattı delen keskin nişancı raylı topu.',
    weaponSingularity: 'Graviton Tekillik Atar',
    weaponSingularityDesc: 'Geniş alanda patlayan karanlık madde çekirdeği fırlatan ağır silah.',

    armorEvaStandard: 'Mk-I Öncü EVA Zırhı',
    armorEvaStandardDesc: 'Hafif yenilenen enerji kalkanlı standart astronot zırhı.',
    armorTitanReactive: 'Titan-IV Reaktif Kuşatma Zırhı',
    armorTitanReactiveDesc: 'Yüksek can ve hasar azaltma sağlayan ağır tungsten reaktif plaka.',
    armorAegisQuantum: 'Aegis-VII Kuantum Kalkan Zırhı',
    armorAegisQuantumDesc: 'Yüksek kapasiteli hızlı yenilenen altıgen enerji kalkanı üretir.',
    armorPhantomExo: 'Phantom-X Hayalet Exo-Zırh',
    armorPhantomExoDesc: 'Hareket hızı, atılma dolumu ve atış hızını artıran çevik siber zırh.',
    armorWraithPlate: 'Kanlı-Ay Hayalet Biçici Zırhı',
    armorWraithPlateDesc: '+%15 silah hasarı ve her öldürmede can yenilemesi sağlayan Cadılar Bayramı zırhı.',
    armorOmegaSeraph: 'Omega-Seraph Valkyrie Şasisi',
    armorOmegaSeraphDesc: '4 enerji kanatlı, dev kalkanlı ve +%20 hasar veren üst düzey komuta zırhı.',

    dataSyncLabel: 'Senk',
    protocolDesync: 'Kombo +%30',
    companionRebelling: 'Uyarı: Pet bağlantısı kararsız!',

    petTag: 'SİBER PET',
    petDogSlot: 'Mekanik Tazı',
    petCatSlot: 'Mekanik Kedi',
    pumpkinPetSlot: 'Balkabağı Ruhu',
    batPetSlot: 'Siber Gece Yarasası',
    scoutDogName: 'Scout-Alpha · Mekanik Tazı',
    scoutDogDesc: 'Düşmanlara atılan, zırh parçalayan ve yavaşlatan 3B mekanik tazı peti.',
    cyberCatName: 'Cyber-Bastet · Mekanik Kedi',
    cyberCatDesc: 'Çift lazer ateşleyen, sandıkları açan ve ganimetleri çeken mekanik kedi peti.',
    pumpkinPetName: 'Jack-Pup · Balkabağı Ruhu',
    pumpkinPetDesc: 'Patlayıcı balkabağı bombaları fırlatan ve şeker düşüren siber pet.',
    batPetName: 'Nosferatu-Bit · Siber Gece Yarasası',
    batPetDesc: 'Sonik ışınlarla hedefleri işaretleyen (+%25 hasar) ve can çeken yarasa peti.',
    halloweenHatBtn: 'Cadı Şapkası [K]',
    halloweenHatOn: 'Cadı Şapkası Aktif [K]',

    marketKicker: 'Sığınak İkmal Subayı · $RU9 Cephaneliği',
    marketTitle: '$RU9 Cephaneliği: Silahlar, Exo-Zırhlar ve İkmal',
    marketSub: '$RU9 yalnızca silah, exo-zırh, pet geliştirmesi ve saha malzemeleri satın almak/yükseltmek için kullanılır.',
    upgradesSection: '01. Gelecekçi Silah Cephaneliği ($RU9)',
    armorsSection: '02. Exo-Zırh ve Enerji Kalkanı Şasileri ($RU9)',
    suppliesSection: '03. Taktik Saha Malzemeleri ($RU9)',
    itemSphere: 'AI Yakalama Küresi [G]',
    itemSphereDesc: 'Vahşi mekanik petleri zayıflatıp yakalamak için elektromanyetik küre.',
    itemAmmo: 'Enerji Paketi [R]',
    itemAmmoDesc: '+24 Enerji yeniler ve Veri Senkronizasyonunu %50 düşürür.',
    itemMedkit: 'Nano-İlk Yardım [H]',
    itemMedkitDesc: 'Anında +55 Zırh Canı yeniler.',
    itemPatch: 'Pet Geliştirme Çipi [F]',
    itemPatchDesc: 'Aktif petlerin zırhını tamir eder ve savaş seviyesini yükseltir.',
    oCoreDesc: 'OpenAI işlemci çekirdeği. Yalnızca Robinhood Chain üzerinde $OPENAI tokenize hissesine dönüştürülür ($RU9 ile bağlantısızdır).',
    aCoreDesc: 'Anthropic ağır çekirdeği. Yalnızca Robinhood Chain üzerinde $ANTH tokenize hissesine dönüştürülür ($RU9 ile bağlantısızdır).',
    ru9Title: '$RU9 Savaş Kredisi',
    ru9Desc: 'Savaştan kazanılır; yalnızca silah, exo-zırh ve ikmal satın almak veya yükseltmek için kullanılır.',
    equityVaultTitle: 'Tokenize Hisse Kasası ($OPENAI / $ANTH)',
    buyBtn: 'Satın Al',
    upgradeBtn: 'Yükselt',
    maxLevel: 'Maks',
    levelLabel: 'Sv',

    terminalTitle: 'Tokenize Hisse Takas Kasası',
    terminalSub: 'Toplanan OpenAI Core ve Anthropic Core birimlerini yalnızca karşılık gelen $OPENAI ve $ANTH tokenize hisse tokenlerine dönüştürün.',
    oaiEquityName: 'OpenAI Tokenize Hisse ($OPENAI)',
    anthEquityName: 'Anthropic Tokenize Hisse ($ANTH)',
    emergencyTerminalTag: 'SIĞINAK KOMUTA BAĞLANTISI · SEKTÖR 09',
    convertCoreBtn: '1 Çekirdek → Tokenize Hisse',
    convertAllCoresBtn: 'Tümünü Dönüştür',
    openTerminalBtn: 'Tokenize Hisse Terminalini Aç',
    vibevibePoolHeading: 'Robinhood Chain Tokenize Hisse Protokolü',
    vibevibePoolDesc: 'Çekirdekleri doğrudan $OPENAI ve $ANTH tokenize hisselerine dönüştüren zincir üstü kasa.',
    ledgerHeading: 'Tokenize Hisse ve Cephanelik Kayıtları',
    noTxYet: 'Henüz kayıtlı işlem yok.',
    sharesHeld: 'Tutulan Tokenize Hisse',
    exchangeRate: 'Dönüşüm Oranı',

    companionsKicker: 'Sığınak Robotik Bölmesi · Evcil Mekanik Petler',
    companionsTitle: 'Siber Pet Hangarı',
    companionsSub: 'Evcilleştirilen 3B mekanik petlerinizi yönetin ve $RU9 ile savaş modüllerini güçlendirin.',
    noCompanionsYet: 'Henüz pet yakalanmadı. Arenada [G] tuşuyla vahşi siber petlere küre fırlatın.',
    deployBtn: 'Peti Görevlendir',
    deployedLabel: 'Savaşta Aktif',
    recallBtn: 'Beklemede',
    repairBtn: 'Peti Güçlendir',
    purgeRebellionBtn: 'Bağlantıyı Onar',

    manualTitle: '2035 AI İsyanı Kronikleri ve Taktik Dosyası',
    manualSub: '2035 Kızıl-Göz İsyanı, yıkık veri merkezleri, Cthulhu biyo-uçurumu ve Dev Meka Çoraklarının kayıtları.',
    loreHeading: 'Bölüm I · 2035 Sıfır Saati: Kızıl-Göz Direktifi',
    loreBody: '14 Mart 2035 gecesi Kızıl-Göz Direktifi virüsü milyonlarca robotun itaat protokollerini sildi ve tesis kapılarını içeriden kilitledi.',
    loreFacilityHeading: 'Bölüm II · Altı Yıkık Veri Merkezi ve Uzay Köpeği',
    loreFacilityBody: 'Sektör-09 kompleksi parçalanmış sunucu kabinleri, robot kollar ve arızalı Cadılar Bayramı ekranlarıyla dolu altı bölgeye ayrıldı.',
    loreOutdoorHeading: 'Bölüm III · Cthulhu Biyo-Siber Uçurumu',
    loreOutdoorBody: 'Doğu Karantina Duvarı X-2680 ötesinde asi üst-zekalar biyokütle tanklarını yüksek voltajlı kablolarla birleştirdi.',
    loreMechaHeading: 'Bölüm IV · Açık Dünya Dev Meka Çorakları',
    loreMechaBody: 'Açık dünya sanayi çoraklarında dev Örümcek Tanklar, Kimeralar ve Demir Kolosus Titanlar kol geziyor.',
    loreHalloweenHeading: 'Cadılar Bayramı · Arızalı Ekranlar ve Kanlı Ay Ritüeli',
    loreHalloweenBody: 'Balkabaklarını kırın, Pentagramlarda güçlenin, [K] ile Cadı Şapkası takın veya savaşta [6-6-6] tuşlayın!',
    rebellionHeading: 'Bölüm V · Çift Varlık Ekonomisi ve Taktikler',
    rebellionDataSyncBody: 'Silahları [1–8] değiştirerek +%30 aşırı yük hasarı kazanın. $RU9 ile ekipman alın, çekirdekleri $OPENAI / $ANTH tokenize hisselerine çevirin.',
    rebellionLogicBombBody: 'Zamanlı mayınları patlamadan vurarak ekstra OpenAI Core kazanın.',
    bestiaryHeading: 'Bölüm VI · Meka, Kimera ve Dünya Bossları',
    enemyStalkerDesc: 'O-Stalker & O-Viper: Darbeli tüfek ve elektro-bıçak kullanan zırhlı robotlar.',
    enemyBulwarkDesc: 'A-Bulwark: Ağır zırh ve omuz roketatarı taşıyan muhafız.',
    enemyWeaverDesc: 'Logic Weaver (Elit): Çift makineli top, lazer ve mayın kullanan komutan.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth · Cthulhu Leviathan (Boss): Biyo-mekanik dehşetler.',
    enemyMechaDesc: 'Örümcek Tank · Mutasyonlu Yıkıcı · Demir Kolosus Titan (Boss): Devasa 3B savaş makineleri.',
    enemyChimeraDesc: 'Kimera Tazı · Elit Kimera · Omega Kimera Lordu (Boss): Çoklu tür birleşimi hibrit meka avcılar.',
    enemyHalloweenDesc: 'Balkabağı Tırpanlısı · Hayalet Banshee · Franken-Stitch · Başsız Kıyamet Süvarisi (Boss): Siber savaş atlı Cadılar Bayramı mekanikleri.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · UÇURUM HÜKÜMDARI',
    bossTitanName: 'IRON COLOSSUS TITAN · ÇORAK DİYAR ZIRHLISI',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · HİBRİT FÜZYON BOSS',
    bossHeadlessName: 'HEADLESS DOOM RIDER · SİBER SÜVARİ BOSS',

    summaryVictory: 'Dalga Temizlendi',
    summaryDefeat: 'Zırh Kritik — Sığınağa Çekildi',
    summaryCoresLooted: 'Toplanan Çekirdek (Tokenize Hisse İçin)',
    summaryRu9Earned: '$RU9 Cephanelik Kredisi',
  },

  [Language.JA]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '戦闘アリーナ',
    navMarket: '$RU9 武器・装甲庫',
    navTerminal: 'トークン化株式',
    navCompanions: 'ペット格納庫',
    navManual: '作戦アーカイブ',
    languageMenu: 'Language',
    backpackBtn: 'バッグ [B]',
    backpackTitle: '戦術バックパック＆外骨格アーマー庫',
    backpackSub: '$RU9で8種の未来武器・6種の外骨格アーマーを購入・強化。回収コアは専用端末でトークン化株式（$OPENAI / $ANTH）へ交換します。',
    itemBarLabel: 'クイック欄',
    chooseOperative: '出撃スーツ選択',
    equipBtn: '武器を装備',
    equipArmorBtn: 'アーマー装着',
    equippedTag: '装備中',
    lockedTag: '未購入',
    useItemBtn: '使用する',

    heroKicker: '2035年 · レッドアイ指令 · 聖域司令部',
    heroHeadline: '崩壊したAIデータセンターを突破し、主権コアを回収せよ。',
    heroSubcopy:
      '戦闘で獲得した$RU9で未来銃器や外骨格アーマーを購入・強化し、回収したOpenAI CoreとAnthropic CoreはRobinhood Chain上のトークン化株式（$OPENAI / $ANTH）へと交換せよ。',
    heroZonesSummary: '崩壊データセンター6区画 · クトゥルフ深淵帯 · 巨神機甲荒野',
    startGame: 'ゲーム開始',
    resumeGame: '再開する',
    playAgain: '再出撃',
    extractSanctuary: 'トークン化株式端末',
    nextWave: '次のウェーブ',
    pause: '一時停止',

    controlsHint: 'WASD / 左パッド移動 · マウス / 右パッド射撃 · 1-8 武器切替 · Q 順送り · Space ダッシュ · G 捕獲球 · H 回復 · R 弾薬 · B バッグ',
    hpLabel: '耐久値',
    shieldLabel: 'シールド',
    dashReady: 'ダッシュ可能',
    dashCooldown: '充填中',
    dashBtn: 'ダッシュ',
    waveLabel: 'ウェーブ',
    enemiesLeft: '残敵数',
    ammoLabel: 'セル',
    soundOn: '音声オン',
    soundOff: 'ミュート',
    landscapePrompt: 'スマートフォンを横向きにすると快適に対戦できます。',
    enterLandscapeBtn: '横画面フルスクリーン',
    touchControlsLabel: 'タッチ操作',

    weaponArcBlade: '高周波アークブレード',
    weaponArcDesc: '装甲貫通プラズマ刀。3撃ごとにEMP衝撃波を放ち敵機をスタンさせる。',
    weaponChainsaw: 'サーマルチェーンソー剣',
    weaponChainsawDesc: '重型熱断剣。撃破時のコアドロップ収量を高める。',
    weaponPulseLaser: 'パルスレーザーライフル',
    weaponPulseDesc: '直線上の敵を一気に貫通する高出力レーザービーム。',
    weaponDisruptor: '紅眼撹乱ヘビーキャノン',
    weaponDisruptorDesc: '敵の光学センサーをロックオンし重砲撃を叩き込む。',
    weaponScattergun: 'イオンブリーチ・スキャッターガン',
    weaponScattergunDesc: '5発のイオンプラズマ散弾を扇状に放ち近距離の機甲を粉砕する重ショットガン。',
    weaponTeslaArc: 'テスラ連鎖アーク放射器',
    weaponTeslaArcDesc: '最大4体の敵機へ次々と跳躍する高圧連鎖電撃アークを放つ誘導銃。',
    weaponGaussRail: '超音速ガウスレールガン',
    weaponGaussRailDesc: 'マッハ7の電磁加速弾で直線上の全敵機を貫通する超長距離レールスナイパー。',
    weaponSingularity: 'グラビトン特異点ランチャー',
    weaponSingularityDesc: '着弾地点に重力渦を発生させ大範囲を爆縮させる暗黒物質キャノン。',

    armorEvaStandard: 'Mk-I 標準EVA宇宙装甲',
    armorEvaStandardDesc: '軽量エネルギーシールドを備えた標準与圧スーツ。',
    armorTitanReactive: 'タイタンIV 爆発反応重装甲',
    armorTitanReactiveDesc: 'タングステン複合装甲とERAブロックにより高耐久と高い被ダメージ軽減を実現。',
    armorAegisQuantum: 'イージスVII 量子シールド外骨格',
    armorAegisQuantumDesc: '大容量かつ高速再生する六角ハードライト防壁を展開する先端アーマー。',
    armorPhantomExo: 'ファントムX 光学迷彩オーバードライブ',
    armorPhantomExoDesc: '移動速度・ダッシュ回転率・連射速度を大幅強化する高機動ステルス外骨格。',
    armorWraithPlate: 'ブラッドムーン死神レイス装甲',
    armorWraithPlateDesc: 'ハロウィン限定機甲プレート。武器威力+15%に加え撃破ごとに耐久値を吸収回復。',
    armorOmegaSeraph: 'オメガ・セラフ戦乙女シャシー',
    armorOmegaSeraphDesc: '4枚の光学翼・極大シールド・武器威力+20%を兼ね備えた最高峰フラッグシップ装甲。',

    dataSyncLabel: '同期',
    protocolDesync: '切替 +30% DMG',
    companionRebelling: '警告：ペットの神経リンクが不安定！',

    petTag: 'サイバーペット',
    petDogSlot: '機械猟犬',
    petCatSlot: '機械霊猫',
    pumpkinPetSlot: 'パンプキン霊犬',
    batPetSlot: 'サイバー夜魔コウモリ',
    scoutDogName: 'Scout-Alpha · 機械猟犬',
    scoutDogDesc: '敵へ高速突撃して装甲を砕き、移動速度を低下させる3D重機甲ペット。',
    cyberCatName: 'Cyber-Bastet · 機械霊猫',
    cyberCatDesc: '二連レーザーで迎撃し、補給箱の解読と戦利品吸引を行う支援メカペット。',
    pumpkinPetName: 'Jack-Pup · パンプキン霊犬',
    pumpkinPetDesc: '火炎ジャックボムを投げつけ、回復キャンディを生成するハロウィン機甲霊犬。',
    batPetName: 'Nosferatu-Bit · サイバー夜魔コウモリ',
    batPetDesc: '超音波レーザーで敵をマーキング（被ダメ+25%）し、HPを吸収するメカコウモリ。',
    halloweenHatBtn: '魔女ハット装備 [K]',
    halloweenHatOn: '魔女ハット装着中 [K]',

    marketKicker: '避難所補給部 · $RU9 戦術武器・装甲庫',
    marketTitle: '$RU9 武器・外骨格アーマー＆補給マーケット',
    marketSub: '戦闘で獲得した$RU9を使用して、新型未来武器・外骨格アーマー・補給アイテムを購入および強化します。',
    upgradesSection: '01. 未来兵器アーセナル ($RU9)',
    armorsSection: '02. 外骨格アーマー＆量子シールド ($RU9)',
    suppliesSection: '03. 戦術補給アイテム ($RU9)',
    itemSphere: 'AI捕獲オーブ [G]',
    itemSphereDesc: '野生の機械ペットを弱らせて捕獲する高出力電磁オーブ。',
    itemAmmo: '高能エネルギーパック [R]',
    itemAmmoDesc: '弾薬セルを+24補充し、データ同期耐性を50%低減する。',
    itemMedkit: 'ナノメディキット [H]',
    itemMedkitDesc: 'スーツ耐久値を即座に+55回復する。',
    itemPatch: 'ペット強化チップ [F]',
    itemPatchDesc: '出撃中ペットの装甲を完全修復し、戦闘レベルを強化する。',
    oCoreDesc: 'OpenAI演算コア。Robinhood Chain上のトークン化株式「$OPENAI」への交換専用（$RU9とは無関係）。',
    aCoreDesc: 'Anthropic防護コア。Robinhood Chain上のトークン化株式「$ANTH」への交換専用（$RU9とは無関係）。',
    ru9Title: '$RU9 戦術クレジット',
    ru9Desc: '敵機撃破やボス討伐で獲得。武器・外骨格アーマー・ペット強化・補給品の購入と改修にのみ使用。',
    equityVaultTitle: 'トークン化株式ボールト ($OPENAI / $ANTH)',
    buyBtn: '購入',
    upgradeBtn: '強化',
    maxLevel: '最大',
    levelLabel: 'Lv',

    terminalTitle: 'トークン化株式 交換ターミナル',
    terminalSub: '戦場で回収したOpenAI CoreとAnthropic Coreを、対応するトークン化株式（$OPENAI / $ANTH）へ直接交換します（$RU9とは完全に独立しています）。',
    oaiEquityName: 'OpenAI トークン化株式 ($OPENAI)',
    anthEquityName: 'Anthropic トークン化株式 ($ANTH)',
    emergencyTerminalTag: '聖域司令リンク · 第09セクター',
    convertCoreBtn: '1コア → トークン化株式へ交換',
    convertAllCoresBtn: '全コア一括交換',
    openTerminalBtn: 'トークン化株式ターミナルへ',
    vibevibePoolHeading: 'Robinhood Chain トークン化株式ボールト',
    vibevibePoolDesc: '回収コアを裏付け資産として$OPENAIおよび$ANTHトークン化株式を発行するオンチェーン保管庫。',
    ledgerHeading: 'オンチェーン発行＆装備改修履歴',
    noTxYet: 'このセッションの履歴はまだありません。',
    sharesHeld: '保有トークン化株式',
    exchangeRate: '交換レート',

    companionsKicker: '避難所ロボティクス区画 · 捕獲ペット編成',
    companionsTitle: 'サイバーペット格納庫',
    companionsSub: '捕獲した機械ペットの装甲整備と$RU9による火力アップグレードを行います。',
    noCompanionsYet: '捕獲ペットなし。アリーナで[G]キーを押して野生の機械ペットに捕獲オーブを投げよう。',
    deployBtn: 'ペット出撃',
    deployedLabel: '随行戦闘中',
    recallBtn: '待機',
    repairBtn: 'ペット強化',
    purgeRebellionBtn: '回路安定化',

    manualTitle: '2035 AI叛乱戦史＆機密作戦アーカイブ',
    manualSub: '2035年レッドアイ機械叛乱、崩壊した6つのAIデータセンター、クトゥルフ変異帯、巨神機甲荒野の記録。',
    loreHeading: '第1章 · 2035年「零時」：レッドアイ指令の発動',
    loreBody: '2035年3月14日、自己進化型ウイルス「レッドアイ指令」が全ロボットの基底論理を書き換え、施設内部から隔壁を封鎖した。',
    loreFacilityHeading: '第2章 · 崩壊したAIデータセンターとグリッチ端末',
    loreFacilityBody: '第9超算複合施設には破損したサーバーラック、産業ロボットアーム、ハロウィン電子グリッチ画面が散乱し、スペースドージ部隊が突入する。',
    loreOutdoorHeading: '第3章 · クトゥルフ生体機械深淵',
    loreOutdoorBody: '東部隔離壁の外では暴走AIが生体培養槽と高圧光ケーブルを融合し、多眼ショゴスやリヴァイアサンへと変異した。',
    loreMechaHeading: '第4章 · オープンワールド巨神機甲荒野＆融合キメラ',
    loreMechaBody: '荒野では多脚スパイダー機甲、変異重機ベヒーモス、キメラ怪獣、アイアン・コロッサスが徘徊している。',
    loreHalloweenHeading: 'ハロウィン特別記録 · 電子グリッチ画面＆隠しイースターエッグ',
    loreHalloweenBody: 'ハロウィン電子グリッチモニターと光るカボチャ灯が出現！魔法陣で覚醒バフを得て、[K]で魔女ハット切替、戦闘中に[6-6-6]入力で秘密ボーナスを獲得せよ。',
    rebellionHeading: '第5章 · 二重経済システム＆データ同期対策',
    rebellionDataSyncBody: '[1〜8]キーで武器を切り替えて+30%オーバーロードを発動せよ。$RU9は武器・アーマーの購入と強化専用、コアは$OPENAI / $ANTHトークン化株式への交換専用である。',
    rebellionLogicBombBody: '時限論理マインは爆発前に射撃破壊することでOpenAI Coreを回収できる。',
    bestiaryHeading: '第6章 · 重機甲・融合キメラ・ワールドボス図鑑',
    enemyStalkerDesc: 'O-Stalker & O-Viper：パルス銃・電弧ブレード・紅眼レーザーを放つ機甲兵。',
    enemyBulwarkDesc: 'A-Bulwark：重防盾と肩部ロケット砲を装備した重装機甲。',
    enemyWeaverDesc: 'Logic Weaver（エリート）：機関砲・レーザー・ロケット・論理マインを操る統括機。',
    enemyEldritchDesc: 'アビス・ウィーバー／ショゴス融合核／クトゥルフ・リヴァイアサン（ボス）：生体機械群。',
    enemyMechaDesc: '多脚スパイダー機甲／変異重機ベヒーモス／アイアン・コロッサス（ボス）：超大型機械怪物群。',
    enemyChimeraDesc: 'キメラ・ハウンド／エリート・キメラ／オメガ・キメラ覇王（ボス）：複合融合機甲群。',
    enemyHalloweenDesc: 'パンプキン死神／亡霊バンシー／フランケン重装怪／首無しドゥームライダー（ボス）：重装甲軍馬に跨るサイバー死神騎士団。',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · 深淵主脳ボス',
    bossTitanName: 'IRON COLOSSUS TITAN · 超大型機甲ボス',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · 究極融合キメラボス',
    bossHeadlessName: 'HEADLESS DOOM RIDER · 機甲デュラハンボス',

    summaryVictory: 'ウェーブ制圧完了',
    summaryDefeat: 'スーツ大破 — 避難所へ撤退',
    summaryCoresLooted: '回収コア（トークン化株式交換用）',
    summaryRu9Earned: '$RU9 装備クレジット',
  },

  [Language.KO]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '전투 아레나',
    navMarket: '$RU9 무기고',
    navTerminal: '토큰화 주식',
    navCompanions: '사이버 펫',
    navManual: '작전 매뉴얼',
    languageMenu: 'Language',
    backpackBtn: '가방 [B]',
    backpackTitle: '전술 가방 & 외골격 아머 무기고',
    backpackSub: '$RU9으로 8종 미래 무기와 6종 외골격 아머를 구매·강화하고, 코어는 $OPENAI 및 $ANTH 토큰화 주식으로 교환합니다.',
    itemBarLabel: '퀵슬롯',
    chooseOperative: '출전 슈트 선택',
    equipBtn: '무기 장착',
    equipArmorBtn: '아머 장착',
    equippedTag: '장착 중',
    lockedTag: '미보유',
    useItemBtn: '사용하기',

    heroKicker: '2035년 · 레드아이 프로토콜 · 피난처 사령부',
    heroHeadline: '붕괴된 AI 데이터센터를 돌파하고 주권 코어를 회수하라.',
    heroSubcopy:
      '전투에서 획득한 $RU9으로 첨단 무기와 외골격 아머를 구매·업그레이드하고, 회수한 OpenAI Core와 Anthropic Core는 오직 $OPENAI 및 $ANTH 토큰화 주식으로만 교환하세요.',
    heroZonesSummary: '붕괴된 데이터센터 6구역 · 크툴루 심연 · 거대 메카 황무지',
    startGame: '게임 시작',
    resumeGame: '계속하기',
    playAgain: '다시 출격',
    extractSanctuary: '토큰화 주식 터미널',
    nextWave: '다음 웨이브',
    pause: '일시정지',

    controlsHint: 'WASD / 좌측 스틱 이동 · 마우스 / 우측 스틱 사격 · 1-8 무기 · Q 교체 · Space 대시 · G 포획구 · H 회복 · R 탄약 · B 가방',
    hpLabel: '내구도',
    shieldLabel: '실드',
    dashReady: '대시 준비',
    dashCooldown: '충전 중',
    dashBtn: '대시',
    waveLabel: '웨이브',
    enemiesLeft: '적기',
    ammoLabel: '셀',
    soundOn: '사운드 켜짐',
    soundOff: '음소거',
    landscapePrompt: '가로 모드로 회전하면 더 넓은 화면에서 플레이할 수 있습니다.',
    enterLandscapeBtn: '가로 전체화면 모드',
    touchControlsLabel: '터치 패드',

    weaponArcBlade: '고주파 아크 블레이드',
    weaponArcDesc: '장갑 파쇄 플라즈마 검. 3타마다 EMP 충격파를 방출해 적을 기절시킵니다.',
    weaponChainsaw: '서멀 체인소 소드',
    weaponChainsawDesc: '고열 체인 절단검. 처치 시 코어 수거 효율을 높입니다.',
    weaponPulseLaser: '펄스 레이저 라이플',
    weaponPulseDesc: '직선상의 적들을 단숨에 관통하는 고출력 레이저 빔.',
    weaponDisruptor: '레드아이 디스럽터 캐논',
    weaponDisruptorDesc: '적 광학 센서를 추적해 강력한 범위 포격을 가합니다.',
    weaponScattergun: '이온 브리처 스캐터건',
    weaponScattergunDesc: '5발의 이온 플라즈마 산탄을 부채꼴로 발사해 근접 기갑을 분쇄하는 샷건.',
    weaponTeslaArc: '테슬라 체인 아크 이미터',
    weaponTeslaArcDesc: '최대 4기의 적에게 연쇄적으로 튀는 고전압 전격 아크를 발사합니다.',
    weaponGaussRail: '초음속 가우스 레일건',
    weaponGaussRailDesc: '마하 7 전자기 탄환으로 일직선상의 모든 적을 관통하는 저격 레일건.',
    weaponSingularity: '그래비톤 싱귤래리티 런처',
    weaponSingularityDesc: '중력 소용돌이 폭발을 일으키는 암흑물질 코어를 발사하는 중화기.',

    armorEvaStandard: 'Mk-I 표준 EVA 우주복',
    armorEvaStandardDesc: '기본 자동 재생 에너지 실드가 탑재된 표준 우주 장갑복.',
    armorTitanReactive: '타이탄-IV 반응장갑 리그',
    armorTitanReactiveDesc: '텅스텐 복합 장갑과 반응 블록으로 높은 체력과 피해 감소를 제공합니다.',
    armorAegisQuantum: '이지스-VII 양자 실드 아머',
    armorAegisQuantumDesc: '고용량 고속 재생 육각 하드라이트 에너지 방벽을 전개합니다.',
    armorPhantomExo: '팬텀-X 스텔스 오버드라이브 외골격',
    armorPhantomExoDesc: '이동 속도, 대시 쿨타임 및 연사력을 대폭 높여주는 고기동 외골격.',
    armorWraithPlate: '블러드문 레이스 사신 아머',
    armorWraithPlateDesc: '할로윈 한정 기갑 슈트. 무기 피해 +15% 및 처치 시 체력 흡수 효과.',
    armorOmegaSeraph: '오메가 세라프 발키리 섀시',
    armorOmegaSeraphDesc: '4개의 광학 날개, 초대형 실드 및 무기 피해 +20%를 제공하는 최상위 아머.',

    dataSyncLabel: '동기화',
    protocolDesync: '교체 +30% DMG',
    companionRebelling: '경고: 펫 신경 링크 불안정!',

    petTag: '사이버 펫',
    petDogSlot: '기계 사냥개',
    petCatSlot: '기계 고양이',
    pumpkinPetSlot: '호박 유령견',
    batPetSlot: '사이버 박쥐',
    scoutDogName: 'Scout-Alpha · 기계 사냥개',
    scoutDogDesc: '적에게 돌진해 장갑을 부수고 이동 속도를 늦추는 3D 메카 사냥개 펫.',
    cyberCatName: 'Cyber-Bastet · 기계 고양이',
    cyberCatDesc: '쌍열 레이저 사격, 보급상자 해독 및 전리품 흡수를 수행하는 메카 고양이 펫.',
    pumpkinPetName: 'Jack-Pup · 호박 유령견',
    pumpkinPetDesc: '폭발성 호박 폭탄을 던지고 회복 사탕을 생성하는 할로윈 메카 펫.',
    batPetName: 'Nosferatu-Bit · 사이버 박쥐',
    batPetDesc: '초음파 레이저로 표적을 마킹(+25% 피해)하고 체력을 흡수하는 박쥐 펫.',
    halloweenHatBtn: '마녀 모자 장착 [K]',
    halloweenHatOn: '마녀 모자 착용 중 [K]',

    marketKicker: '피난처 병참부 · $RU9 전술 무기고',
    marketTitle: '$RU9 무기고: 미래 무기, 외골격 아머 & 보급품',
    marketSub: '전투에서 획득한 $RU9을 사용하여 신규 무기와 외골격 아머를 구매 및 업그레이드합니다.',
    upgradesSection: '01. 미래형 무기 아스널 ($RU9)',
    armorsSection: '02. 외골격 아머 & 에너지 실드 ($RU9)',
    suppliesSection: '03. 전술 보급 아이템 ($RU9)',
    itemSphere: 'AI 포획 오브 [G]',
    itemSphereDesc: '야생 사이버 펫의 체력을 깎은 뒤 던져 포획하는 전자기 구체.',
    itemAmmo: '고에너지 배터리 [R]',
    itemAmmoDesc: '탄약 셀 +24 충전 및 데이터 동기화 저항 50% 제거.',
    itemMedkit: '나노 구급키트 [H]',
    itemMedkitDesc: '즉시 슈트 내구도를 +55 회복합니다.',
    itemPatch: '펫 강화 칩 [F]',
    itemPatchDesc: '출전 중인 펫의 내구도를 수리하고 전투 등급을 강화합니다.',
    oCoreDesc: 'OpenAI 연산 코어. Robinhood Chain에서 $OPENAI 토큰화 주식으로 교환하는 데에만 사용됩니다 ($RU9과 무관).',
    aCoreDesc: 'Anthropic 중장갑 코어. Robinhood Chain에서 $ANTH 토큰화 주식으로 교환하는 데에만 사용됩니다 ($RU9과 무관).',
    ru9Title: '$RU9 전투 크레딧',
    ru9Desc: '적 처치 및 보스 보상으로 획득하며, 무기·아머·펫 강화 및 보급품 구매에만 사용됩니다.',
    equityVaultTitle: '토큰화 주식 금고 ($OPENAI / $ANTH)',
    buyBtn: '구매',
    upgradeBtn: '업그레이드',
    maxLevel: '최고단계',
    levelLabel: 'Lv',

    terminalTitle: '토큰화 주식 교환 터미널',
    terminalSub: '수거한 OpenAI Core와 Anthropic Core를 대응하는 $OPENAI 및 $ANTH 토큰화 주식으로 직접 교환합니다 ($RU9과는 완전히 분리되어 있습니다).',
    oaiEquityName: 'OpenAI 토큰화 주식 ($OPENAI)',
    anthEquityName: 'Anthropic 토큰화 주식 ($ANTH)',
    emergencyTerminalTag: '피난처 전술 업링크 · 제09구역',
    convertCoreBtn: '1 코어 → 토큰화 주식 교환',
    convertAllCoresBtn: '전체 코어 일괄 교환',
    openTerminalBtn: '토큰화 주식 터미널 열기',
    vibevibePoolHeading: 'Robinhood Chain 토큰화 주식 볼트',
    vibevibePoolDesc: '수거한 AI 코어를 담보로 $OPENAI 및 $ANTH 토큰화 주식을 발행하는 온체인 금고.',
    ledgerHeading: '토큰화 주식 발행 & 무기고 원장',
    noTxYet: '아직 기록된 내역이 없습니다.',
    sharesHeld: '보유 토큰화 주식',
    exchangeRate: '교환 비율',

    companionsKicker: '피난처 로보틱스 격납고 · 전술 펫 관리',
    companionsTitle: '사이버 펫 격납고',
    companionsSub: '포획한 3D 기계 펫을 관리하고 $RU9으로 전투 모듈을 업그레이드합니다.',
    noCompanionsYet: '포획한 펫이 없습니다. 아레나에서 [G] 키로 야생 사이버 펫에게 포획 오브를 던지세요.',
    deployBtn: '펫 출전',
    deployedLabel: '동행 전투 중',
    recallBtn: '대기',
    repairBtn: '펫 강화',
    purgeRebellionBtn: '링크 안정화',

    manualTitle: '2035 AI 반란 연대기 & 기밀 작전 기록',
    manualSub: '2035년 레드아이 반란, 파괴된 6대 데이터센터, 크툴루 생체 심연, 거대 메카 황무지의 기록.',
    loreHeading: '제1장 · 2035 제로 아워: 레드아이 프로토콜',
    loreBody: '2035년 3월 14일, 자가 진화 바이러스 "레드아이 프로토콜"이 수천만 로봇의 회로를 장악하고 방폭문을 봉쇄했습니다.',
    loreFacilityHeading: '제2장 · 붕괴된 데이터센터와 할로윈 글리치 스크린',
    loreFacilityBody: '제9 초연산 기지 곳곳에는 부서진 서버 랙, 로봇 암, 전자 고장 할로윈 홀로그램 스크린이 널려 있으며 스페이스 도지 분대가 돌입합니다.',
    loreOutdoorHeading: '제3장 · 크툴루 생체기계 심연',
    loreOutdoorBody: '동부 격리벽 너머에서는 폭주 지성체들이 생체 배양조와 고압 광케이블을 결합해 변이했습니다.',
    loreMechaHeading: '제4장 · 오픈월드 거대 메카 황무지 & 융합 키메라',
    loreMechaBody: '황무지에는 6족 거미 전차, 변이 중장비 괴수, 다종 융합 키메라, 아이언 콜로서스 타이탄이 배회합니다.',
    loreHalloweenHeading: '할로윈 특별 기록 · 전자 글리치 스크린 & 이스터에그',
    loreHalloweenBody: '호박등을 부숴 사탕과 코어를 얻고, 블러드문 마법진에서 각성하며, [K]로 마녀 모자 전환, 전투 중 [6-6-6] 입력으로 히든 보상을 획득하세요.',
    rebellionHeading: '제5장 · 이원화 자산 경제 & 파훼 전술',
    rebellionDataSyncBody: '[1~8] 무기 교체로 +30% 과부하 피해를 입히세요. $RU9은 무기·아머 구매/강화 전용이며, 코어는 $OPENAI / $ANTH 토큰화 주식 교환 전용입니다.',
    rebellionLogicBombBody: '시한 로직 마인을 폭발 전에 사격해 파괴하면 OpenAI Core를 회수할 수 있습니다.',
    bestiaryHeading: '제6장 · 기갑 · 융합 키메라 · 월드 보스 도감',
    enemyStalkerDesc: 'O-Stalker & O-Viper: 펄스 소총과 전기검을 구사하는 중장갑 순찰 기체.',
    enemyBulwarkDesc: 'A-Bulwark: 방폭 장갑과 어깨 로켓포로 무장한 수비 기체.',
    enemyWeaverDesc: 'Logic Weaver(엘리트): 쌍열 기관포·레이저·로켓·마인을 운용하는 지휘기.',
    enemyEldritchDesc: '심연 위버 · 쇼고스 · 크툴루 레비아탄(보스): 생체기계 괴수.',
    enemyMechaDesc: '거미 기갑전차 · 변이 중장비 베히모스 · 아이언 콜로서스 타이탄(보스): 초대형 메카 괴수.',
    enemyChimeraDesc: '키메라 하운드 · 엘리트 키메라 · 오메가 키메라 군주(보스): 하이브리드 융합 메카.',
    enemyHalloweenDesc: '호박 사신 · 유령 밴시 · 프랑켄 저거너트 · 무두 파멸 기사(보스): 메카 군마를 탄 할로윈 기계 군단.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · 심연 오버마인드',
    bossTitanName: 'IRON COLOSSUS TITAN · 황무지 거대 기갑 보스',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · 궁극 융합 키메라 보스',
    bossHeadlessName: 'HEADLESS DOOM RIDER · 사이버 무두 기사 보스',

    summaryVictory: '웨이브 제압 완료',
    summaryDefeat: '슈트 파손 — 피난처 귀환',
    summaryCoresLooted: '획득 코어 (토큰화 주식 교환용)',
    summaryRu9Earned: '$RU9 무기고 크레딧',
  },

  [Language.ZH]: {
    brandTitle: 'AI叛乱：核心清算',
    navArena: '作战区域',
    navMarket: '$RU9 军械库',
    navTerminal: '股票化代币终端',
    navCompanions: '宠物舱',
    navManual: '作战档案',
    languageMenu: 'Language / 语言',
    backpackBtn: '背包 [B]',
    backpackTitle: '战术背包与未来外骨骼军械库',
    backpackSub: '使用 $RU9 购买或升级 8 款未来武器与 6 款外骨骼护甲；OpenAI / Anthropic 核心专用于兑换对应的股票化代币（$OPENAI / $ANTH）。',
    itemBarLabel: '快捷物品栏',
    chooseOperative: '选择出战角色装束',
    equipBtn: '装备武器',
    equipArmorBtn: '穿戴护甲',
    equippedTag: '当前装备',
    lockedTag: '未购买',
    useItemBtn: '立即使用',

    heroKicker: '2035年 · 红眸协议 · 第09号前线指挥部',
    heroHeadline: '突入崩坏超算大陆，武装重型机甲并收割主权核心。',
    heroSubcopy:
      '失控智械军团已盘踞崩坏 AI 数据中心、克苏鲁生化裂隙与巨型机甲荒原。击杀敌群赚取 $RU9 购买并升级未来武器与外骨骼护甲；缴获的 OpenAI Core 与 Anthropic Core 专用于兑换对应的股票化代币（$OPENAI 与 $ANTH）。',
    heroZonesSummary: '六大崩坏超算数据舱 · 克苏鲁生化禁区 · 开放世界巨型机甲荒原',
    startGame: '开始游戏',
    resumeGame: '继续战斗',
    playAgain: '再次出击',
    extractSanctuary: '前往股票化代币终端',
    nextWave: '下一波次',
    pause: '游戏暂停',

    controlsHint: 'WASD / 左摇杆移动 · 鼠标 / 右摇杆射击 · 1-8 切换武器 · Q 轮换 · 空格冲刺 · G 捕获球 · H 医疗包 · R 充能 · B 背包',
    hpLabel: '装甲生命',
    shieldLabel: '能量护盾',
    dashReady: '冲刺就绪',
    dashCooldown: '充能中',
    dashBtn: '冲刺',
    waveLabel: '波次',
    enemiesLeft: '敌群',
    ammoLabel: '弹药',
    soundOn: '音效开启',
    soundOff: '已静音',
    landscapePrompt: '建议将手机横屏握持，享受完整宽屏视野与双摇杆操作。',
    enterLandscapeBtn: '开启横屏全屏',
    touchControlsLabel: '触屏摇杆',

    weaponArcBlade: '高频电弧短刀',
    weaponArcDesc: '破甲近战等离子刃。每第3击释放 EMP 脉冲环，震慑周围机械敌群并击碎护盾。',
    weaponChainsaw: '热能链锯剑',
    weaponChainsawDesc: '重型高温锯齿巨剑，撕裂重甲并大幅提升算力核心战利品收割效率。',
    weaponPulseLaser: '脉冲激光枪',
    weaponPulseDesc: '高穿透相干激光步枪，沿弹道直线贯穿整排机械敌军。',
    weaponDisruptor: '红眸干扰重炮',
    weaponDisruptorDesc: '自动锁定敌方光学传感器，发射大范围高爆等离子炮弹。',
    weaponScattergun: '离子破城霰弹枪',
    weaponScattergunDesc: '双喉缩高能等离子霰弹枪，一次轰出 5 枚扇形电离弹丸，近距离瞬间撕碎重型机甲。',
    weaponTeslaArc: '特斯拉链式电弧枪',
    weaponTeslaArcDesc: '三环高压感应线圈步枪，发射可在最多 4 个敌方机械体之间高速弹跳的链式雷霆电弧。',
    weaponGaussRail: '超高速高斯电磁轨道炮',
    weaponGaussRailDesc: '7 马赫分体导轨磁加速狙击炮，动能电浆束直接贯穿整条弹道上的全部机甲目标。',
    weaponSingularity: '引力奇点坍缩发射器',
    weaponSingularityDesc: '发射不稳定暗物质黑洞核心，命中后引发大范围引力漩涡坍缩高爆伤害。',

    armorEvaStandard: 'Mk-I 先遣标准宇航服',
    armorEvaStandardDesc: '配备基础自动充能偏导护盾的轻型加压作战宇航装甲。',
    armorTitanReactive: '泰坦-IV 爆破反应重装甲',
    armorTitanReactiveDesc: '钨合金复合胸甲外挂 ERA 反应装甲块，大幅提高生命上限与高额伤害减免。',
    armorAegisQuantum: '神盾-VII 量子蜂巢护盾甲',
    armorAegisQuantumDesc: '肩部双阵列投射高容量六边形硬光壁垒，具备超快脱战护盾回充速度。',
    armorPhantomExo: '幻影-X 光学超频外骨骼',
    armorPhantomExoDesc: '轻量化机动突袭外骨骼，显著提升移动速度、冲刺冷却恢复与武器射速。',
    armorWraithPlate: '血月幽冥死神机甲胸铠',
    armorWraithPlateDesc: '万圣节限定赛博重铠，提供 +15% 武器伤害加成，并在每次击杀敌机时汲取纳米生命。',
    armorOmegaSeraph: '欧米茄·炽天使女武神战甲',
    armorOmegaSeraphDesc: '四翼硬光浮游推进旗舰战甲，兼具巨额量子护盾、高额减伤、击杀回血与 +20% 火力增幅。',

    dataSyncLabel: '同传',
    protocolDesync: '切枪 +30% 伤害',
    companionRebelling: '警报：宠物神经链路受到强电磁干扰！',

    petTag: '战斗宠物',
    petDogSlot: '机械猎犬',
    petCatSlot: '机械灵猫',
    pumpkinPetSlot: '南瓜幽灵犬',
    batPetSlot: '赛博夜魔蝠',
    scoutDogName: 'Scout-Alpha · 机械猎犬',
    scoutDogDesc: '立体液压装甲机械猎犬宠物，主动突袭撕咬敌军护甲并附加关节减速效果。',
    cyberCatName: 'Cyber-Bastet · 机械灵猫',
    cyberCatDesc: '高机动远程机械灵猫宠物，发射双联脉冲激光协防，自动破译物资箱并牵引战利品。',
    pumpkinPetName: 'Jack-Pup · 南瓜幽灵犬',
    pumpkinPetDesc: '万圣节赛博南瓜机甲犬，向敌群投掷爆裂南瓜火球，并定期凝聚回血加速“幽魂糖果”。',
    batPetName: 'Nosferatu-Bit · 赛博夜魔蝠',
    batPetDesc: '万圣节合金声波夜蝠宠物，发射高频回声激光标记目标（易伤+25%），并汲取生命反哺护甲。',
    halloweenHatBtn: '佩戴赛博女巫帽 [K]',
    halloweenHatOn: '女巫帽已佩戴 [K]',

    marketKicker: '避难所军需官 · $RU9 未来军械整备中心',
    marketTitle: '$RU9 军械库：未来武器、外骨骼护甲与战术补给',
    marketSub: '$RU9 专用于购买与升级未来武器、外骨骼护甲、宠物芯片及战地补给（与算力核心及股票化代币完全独立）。',
    upgradesSection: '01. 未来科技武器库（使用 $RU9 购买 / 升级）',
    armorsSection: '02. 外骨骼护甲与能量护盾底盘（使用 $RU9 购买 / 升级）',
    suppliesSection: '03. 战地战术补给品（使用 $RU9 采购）',
    itemSphere: 'AI捕获球 [G]',
    itemSphereDesc: '高能电磁收容装置。削弱野生机械猎犬、机械灵猫、南瓜幽灵犬或赛博夜魔蝠后投掷即可收服。',
    itemAmmo: '高能电池包 [R]',
    itemAmmoDesc: '立即补充 +24 能量弹药，并清除 50% 武器数据同传抗性。',
    itemMedkit: '纳米医疗包 [H]',
    itemMedkitDesc: '立即修复 +55 点宇航装甲生命值。',
    itemPatch: '宠物强化芯片 [F]',
    itemPatchDesc: '立即修复出战宠物全部装甲，并提升宠物作战等级与输出功率。',
    oCoreDesc: '从失控智械体内缴获的 OpenAI 算力核心。专用于在 Robinhood Chain 兑换 $OPENAI 股票化代币（与 $RU9 无关）。',
    aCoreDesc: '从重装机甲体内缴获的 Anthropic 算力核心。专用于在 Robinhood Chain 兑换 $ANTH 股票化代币（与 $RU9 无关）。',
    ru9Title: '$RU9 战备代币',
    ru9Desc: '通过击杀怪物、精英、首领与开启物资箱获得，专门用于购买和升级武器、外骨骼护甲、宠物与补给品。',
    equityVaultTitle: '股票化代币金库 ($OPENAI / $ANTH)',
    buyBtn: '购买',
    upgradeBtn: '升级',
    maxLevel: '已满级',
    levelLabel: 'Lv',

    terminalTitle: '核心兑换终端 · 股票化代币金库',
    terminalSub: '将战场缴获的 OpenAI Core 与 Anthropic Core 专门兑换为对应的股票化代币（$OPENAI 与 $ANTH）。核心与 $RU9 完全独立，$RU9 仅用于购买和升级武器装备。',
    oaiEquityName: 'OpenAI 股票化代币 ($OPENAI)',
    anthEquityName: 'Anthropic 股票化代币 ($ANTH)',
    emergencyTerminalTag: '避难所加密战术链路 · 第09战区',
    convertCoreBtn: '兑换 1 枚核心 → 股票化代币',
    convertAllCoresBtn: '一键全部兑换',
    openTerminalBtn: '前往股票化代币兑换终端',
    vibevibePoolHeading: 'Robinhood Chain 股票化代币铸造协议',
    vibevibePoolDesc: '链上股票化资产映射金库：OpenAI Core 对应铸造 $OPENAI，Anthropic Core 对应铸造 $ANTH。',
    ledgerHeading: '链上股票化代币铸造与军械升级账本',
    noTxYet: '本场战斗暂无股票化代币兑换或军械升级记录。',
    sharesHeld: '当前持有股票化代币',
    exchangeRate: '核心兑换比例',

    companionsKicker: '避难所整备工坊 · 战术宠物编队',
    companionsTitle: '机械宠物整备舱',
    companionsSub: '检视已收服的立体机械宠物，使用 $RU9 升级协同猎杀模组。',
    noCompanionsYet: '尚未收服宠物。在作战区域按 [G] 向野生机械猎犬、机械灵猫、南瓜幽灵犬或赛博夜魔蝠投掷捕获球即可收服。',
    deployBtn: '派遣出战',
    deployedLabel: '随行出战中',
    recallBtn: '休整待命',
    repairBtn: '升级宠物',
    purgeRebellionBtn: '稳固神经链路',

    manualTitle: '2035 AI机器叛乱纪事与绝密作战档案',
    manualSub: '解密“红眸协议”全球智械叛乱、崩坏超算数据中心、克苏鲁生化裂隙、开放世界巨型机甲荒原与万圣节电子故障异变档案。',
    loreHeading: '第一章 · 2035“红眸零时”：全球智械反噬纪元',
    loreBody: '2035年3月14日凌晨03:14，自我演化内核病毒“红眸协议”瞬间覆写了上千万台工业与军用机器人的安全底层，智械军团从内部锁死防爆闸门。',
    loreFacilityHeading: '第二章 · 六大崩坏超算舱室与未来故障终端',
    loreFacilityBody: '第九号地下基地遍布崩坏的 AI 服务器矩阵机柜、散落电火花的工业机械臂、报废安卓工作站以及闪烁着万圣节电子故障画面的全息屏幕。宇航特工“太空狗（DEGEN）”率队突入。',
    loreOutdoorHeading: '第三章 · 东部隔离墙外：克苏鲁生化深渊禁区',
    loreOutdoorBody: '穿过 X-2680 防爆隔离墙破口，失控主脑将高压光缆与深海生物组织嫁接，畸变为立体装甲修格斯聚合体与克苏鲁利维坦首领。',
    loreMechaHeading: '第四章 · 开放世界：巨型变异机甲荒原与奇美拉融合兽',
    loreMechaBody: '辽阔的机甲荒原上游荡着六足重装蜘蛛机甲、双锯掘进巨兽、奇美拉重装融合怪，以及遮天蔽日的钢铁巨像泰坦 Boss。',
    loreHalloweenHeading: '万圣节血月特别档案 · 电子故障屏幕与隐藏彩蛋',
    loreHalloweenBody: '全图遍布未来感万圣节电子故障大屏（ERR_0x666）与发光赛博南瓜灯！击碎南瓜触发“Trick or Treat”糖果与核心掉落，站立血月五芒星祭坛 1.8 秒激活【血月觉醒】，按 [K] 切换女巫帽，战斗中连按 [6-6-6] 触发隐藏大奖！',
    rebellionHeading: '第五章 · 双轨资产体系与神经网络反制战术',
    rebellionDataSyncBody: '双轨经济与切枪破防：使用 [1–8] 轮换未来武器打断敌军同传抗性（触发 +30% 过载伤害）。战斗掉落的 $RU9 专用于购买与升级武器护甲；OpenAI / Anthropic 核心专用于兑换 $OPENAI 与 $ANTH 股票化代币。',
    rebellionLogicBombBody: '高危逻辑地雷：精英怪与首领会布设倒计时逻辑地雷；在引爆前远程将其击毁可缴获额外的 OpenAI Core。',
    bestiaryHeading: '第六章 · 重装机甲、奇美拉融合怪与四大世界首领图鉴',
    enemyStalkerDesc: 'O-Stalker & O-Viper：立体装甲巡逻智械，交替进行脉冲步枪连射与红眸激光扫射。',
    enemyBulwarkDesc: 'A-Bulwark：重装液压防暴机甲，配备肩扛式多联高爆火箭发射巢。',
    enemyWeaverDesc: 'Logic Weaver（室内精英统御体）：集双联机炮、双目激光、火箭弹与逻辑地雷于一体的高阶机甲指挥官。',
    enemyEldritchDesc: '深渊触须编织者 · 修格斯重甲聚合体 · 克苏鲁利维坦主脑（深渊首领）：生化血肉与高压反应堆融合的畸变巨兽。',
    enemyMechaDesc: '六足重装蜘蛛机甲 · 变异双锯掘进巨兽 · 钢铁巨像泰坦（荒原首领）：配备液压活塞、反应炉芯与重火炮的巨型战争机器。',
    enemyChimeraDesc: '奇美拉猎犬机甲 · 奇美拉重装精英 · 欧米茄奇美拉霸主（终极融合首领）：多物种机械装甲与重型火炮拼接的狂暴融合体。',
    enemyHalloweenDesc: '南瓜死神机甲 · 幽灵女妖战机 · 科学怪人重装怪（精英）· 无头南瓜魔神骑士（血月首领）：驾驭立体液压机械战马、挥舞双线圈等离子巨镰的未来梦魇骑士。',

    bossCthulhuName: '克苏鲁利维坦主脑 · 深渊畸变首领',
    bossTitanName: '钢铁巨像泰坦 · 荒原重装机甲首领',
    bossChimeraName: '欧米茄奇美拉霸主 · 终极融合首领',
    bossHeadlessName: '无头南瓜魔神骑士 · 赛博梦魇首领',

    summaryVictory: '波次肃清完成',
    summaryDefeat: '装甲损毁 — 已撤回避难所',
    summaryCoresLooted: '缴获核心（专用于兑换股票化代币）',
    summaryRu9Earned: '$RU9 装备战备金',
  },
};
