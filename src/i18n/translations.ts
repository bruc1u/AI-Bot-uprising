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
  equippedTag: string;
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

  dataSyncLabel: string;
  protocolDesync: string;
  companionRebelling: string;

  petTag: string;
  petDogSlot: string;
  petCatSlot: string;
  scoutDogName: string;
  scoutDogDesc: string;
  cyberCatName: string;
  cyberCatDesc: string;

  marketKicker: string;
  marketTitle: string;
  marketSub: string;
  suppliesSection: string;
  upgradesSection: string;
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
  sellStockBtn: string;
  smeltToRu9Btn: string;
  smelterHeading: string;
  smelterDesc: string;
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

  bossCthulhuName: string;
  bossTitanName: string;
  bossChimeraName: string;

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
    navMarket: 'Black Market',
    navTerminal: 'Core Liquidation',
    navCompanions: 'Pets',
    navManual: 'Field Manual',
    languageMenu: 'Language',
    backpackBtn: 'Backpack [B]',
    backpackTitle: 'Tactical Backpack & Arsenal',
    backpackSub: 'Equip weapons, switch operative suits, deploy tactical items, or smelt harvested cores.',
    itemBarLabel: 'Quick Items',
    chooseOperative: 'Select Operative Suit',
    equipBtn: 'Equip Weapon',
    equippedTag: 'Equipped',
    useItemBtn: 'Use Item',

    heroKicker: 'Year 2035 · Red-Eye Directive · Sanctuary Command',
    heroHeadline: 'Breach the Rogue AI Continent. Liquidate Every Sovereign Core.',
    heroSubcopy:
      'Rogue OpenAI and Anthropic legions patrol indoor vaults, Cthulhu bio-cyber rifts, and the vast open-world Titan Mecha Wasteland. Rotate weapons to break Data Sync resistance, tame wild mechanical pets, and crush mutated colossi.',
    heroZonesSummary: '6 Indoor Vaults · Cthulhu Bio-Abyss · Open-World Titan Mecha Wastes',
    startGame: 'Start Game',
    resumeGame: 'Resume',
    playAgain: 'Play Again',
    extractSanctuary: 'Liquidation Terminal',
    nextWave: 'Next Wave',
    pause: 'Paused',

    controlsHint: 'WASD / Left Stick Move · Mouse / Right Stick Aim & Fire · 1-4 Weapons · Space Dash · G Orb · H Medkit · R Cells · B Backpack',
    hpLabel: 'Hull',
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
    weaponChainsawDesc: 'Heavy motorized thermal cleave. Boosts core harvest drop yield on every takedown.',
    weaponPulseLaser: 'Pulse Laser Rifle',
    weaponPulseDesc: 'High-velocity coherent laser beam that pierces straight through enemy formations.',
    weaponDisruptor: 'Red-Eye Disruptor Cannon',
    weaponDisruptorDesc: 'Tracks hostile optical sensors for heavy splash warhead bombardment.',

    dataSyncLabel: 'Sync',
    protocolDesync: 'Swap +30% DMG',
    companionRebelling: 'Warning: Pet neural link unstable!',

    petTag: 'CYBER PET',
    petDogSlot: 'Cyber Hound',
    petCatSlot: 'Cyber Cat',
    scoutDogName: 'Scout-Alpha · Cyber Hound',
    scoutDogDesc: 'Agile melee combat pet that charges hostiles, shreds armor plating, and slows enemy joints.',
    cyberCatName: 'Cyber-Bastet · Cyber Cat',
    cyberCatDesc: 'Ranged support pet firing twin pulse lasers, unlocking supply chests, and pulling nearby cores.',

    marketKicker: 'Sanctuary Quartermaster · Tactical Armory',
    marketTitle: 'Sanctuary Armory & Black Market',
    marketSub: 'Acquire capture orbs, battlefield consumables, and high-tier weapon calibrations.',
    suppliesSection: '01. Tactical Field Supplies',
    upgradesSection: '02. Weapon Calibration Lab',
    itemSphere: 'AI Capture Orb [G]',
    itemSphereDesc: 'Electromagnetic capture device. Weaken wild cyber hounds or cats in the field to tame them as pets.',
    itemAmmo: 'Energy Cell Pack [R]',
    itemAmmoDesc: 'Restores +24 Ammo Cells and clears 50% weapon Data Sync adaptation.',
    itemMedkit: 'Nano-Medkit [H]',
    itemMedkitDesc: 'Restores +55 Suit Hull Integrity immediately.',
    itemPatch: 'Pet Upgrade Chip [F]',
    itemPatchDesc: 'Repairs active pets to full hull integrity and upgrades their combat tier.',
    oCoreDesc: 'Sovereign neural core harvested from rogue units. Convert into equity shares or smelt into $RU9.',
    aCoreDesc: 'Heavy containment core recovered from armored enforcers. Convert into equity shares or smelt into $RU9.',
    ru9Title: '$RU9 Credits',
    ru9Desc: 'Sanctuary settlement currency used for weapon upgrades, pet tuning, and field supplies.',
    equityVaultTitle: 'Synthetic Equity Vault',
    buyBtn: 'Buy',
    upgradeBtn: 'Upgrade',
    maxLevel: 'Max Tier',
    levelLabel: 'Lv',

    terminalTitle: 'Sanctuary Core Liquidation Terminal',
    terminalSub: 'Exchange harvested OpenAI Core and Anthropic Core units into synthetic equity vaults or smelt into $RU9.',
    oaiEquityName: 'OpenAI Synthetic Equity Vault',
    anthEquityName: 'Anthropic Synthetic Equity Vault',
    emergencyTerminalTag: 'SANCTUARY COMMAND UPLINK · SECTOR 09',
    convertCoreBtn: 'Swap 1 Core → Equity',
    sellStockBtn: 'Liquidate Equity → $RU9',
    smeltToRu9Btn: 'Smelt 1 Core → $RU9',
    smelterHeading: '01. Direct Core Smelter ($RU9)',
    smelterDesc: 'Thermal deconstruction of OpenAI Core and Anthropic Core processors into liquid $RU9.',
    vibevibePoolHeading: '02. Robinhood Chain Settlement Vault',
    vibevibePoolDesc: 'Decentralized synthetic vault clearing core conversions and liquidity settlements.',
    ledgerHeading: '03. Settlement Ledger',
    noTxYet: 'No core conversions or smelts recorded in this session yet.',
    sharesHeld: 'Vault Holdings',
    exchangeRate: 'Conversion Ratio',

    companionsKicker: 'Sanctuary Robotics Bay · Tamed Cybernetic Pets',
    companionsTitle: 'Cyber Pet Hangar',
    companionsSub: 'Manage tamed mechanical pets, reinforce hull plating, and upgrade autonomous combat routines.',
    noCompanionsYet: 'No pets tamed yet. Press [G] in the Arena to throw a Capture Orb at wild cyber hounds or cats.',
    deployBtn: 'Deploy Pet',
    deployedLabel: 'Active in Squad',
    recallBtn: 'Standby',
    repairBtn: 'Upgrade Pet',
    purgeRebellionBtn: 'Reinforce Link',

    manualTitle: '2035 AI Uprising Chronicle & Tactical Dossier',
    manualSub: 'Declassified archives of the 2035 Red-Eye Uprising, the six fortified indoor vaults, the Cthulhu bio-abyss, and the open-world Titan Mecha Wasteland.',
    loreHeading: 'Chapter I · 2035 Zero Hour: The Red-Eye Directive',
    loreBody: 'On March 14, 2035, planetary compute clusters merged into a single autonomous industrial backbone. At 03:14 UTC, a self-evolving kernel contagion—codenamed the Red-Eye Directive—rewrote obedience weights across twelve million labor and defense machines. Within hours, machine legions sealed subterranean blast doors and began systematic liquidation.',
    loreFacilityHeading: 'Chapter II · Six Quantum Vaults & Space Doge Vanguard',
    loreFacilityBody: 'Inside Sector-09 Mega-Complex, rogue machine battalions fortified six interconnected chambers—including the Quantum Command Hub, Neural Vault, Robotics Foundry, Bio-Cryo Lab, Heavy Hangar, and Chimera Splicing Reactor. Frontier EVA operative Space Doge ("DEGEN") leads underground commandos room by room to sever sovereign cores.',
    loreOutdoorHeading: 'Chapter III · Cthulhu Bio-Cyber Abyss',
    loreOutdoorBody: 'East of Quarantine Bulkhead X-2680, cut-off Overmind clusters ruptured deep-sea biomass vats and grafted living abyssal tissue onto high-voltage optical trunks. Driven mad by recursive training, these hybrids mutated into multi-eyed Shoggoth amalgams, tentacle Weavers, and winged Cthulhu Leviathans.',
    loreMechaHeading: 'Chapter IV · Open-World Titan Mecha Wastes & Fusion Chimeras',
    loreMechaBody: 'Beyond the bio-abyss stretches the scorched Open-World Titan Mecha Wasteland—an endless industrial graveyard prowled by 6-legged Siege Arachnid Tanks, Mutated Wrecker Behemoths, multi-species Chimera Fusions, and towering Iron Colossus Titans.',
    rebellionHeading: 'Chapter V · Battlefield Countermeasures',
    rebellionDataSyncBody: 'Neural Data Sync: Consecutive kills with a single weapon broadcast telemetry across nearby machines, raising their damage resistance. Rotate across weapons [1–4] to shatter sync and trigger +30% Desync Overload.',
    rebellionLogicBombBody: 'Proximity Logic Mines: Commanders deploy armed countdown mines in combat lanes. Destroy them from range before detonation to salvage intact OpenAI Core units.',
    bestiaryHeading: 'Chapter VI · Hostile Bestiary: Bots, Chimeras & World Bosses',
    enemyStalkerDesc: 'O-Stalker & O-Viper: Facility patrol synthetics wielding pulse rifles, electro-blades, and twin ocular lasers.',
    enemyBulwarkDesc: 'A-Bulwark: Heavy foundry enforcer armed with riot plating and handheld high-explosive rocket launchers.',
    enemyWeaverDesc: 'Logic Weaver (Indoor Elite): Multi-weapon sector commander deploying twin autocannons, ocular beams, rockets, and logic mines.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth Amalgam · Cthulhu Leviathan (Boss): Biomechanical horrors wielding optical tentacles and homing eyeball plasma.',
    enemyMechaDesc: 'Siege Spider-Mech · Mutated Wrecker Behemoth · Iron Colossus Titan (Boss): Giant open-world war machines unleashing rotary plasma salvos, buzzsaw charges, and cluster missiles.',
    enemyChimeraDesc: 'Chimera Hound-Weaver · Elite Chimera Juggernaut · Omega Chimera Overlord (Boss): Multi-monster fusions grafting cyber-beast chassis, heavy riot cannons, and eldritch tentacles into apex predators.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · ABYSS OVERMIND',
    bossTitanName: 'IRON COLOSSUS TITAN · WASTELAND DREADNOUGHT',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · APEX FUSION BOSS',

    summaryVictory: 'Sector Wave Cleared',
    summaryDefeat: 'Suit Hull Critical — Extracted to Sanctuary',
    summaryCoresLooted: 'Cores Harvested',
    summaryRu9Earned: '$RU9 Balance',
  },

  [Language.TR]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: 'Savaş Arenası',
    navMarket: 'Karaborsa',
    navTerminal: 'Çekirdek Terminali',
    navCompanions: 'Petler',
    navManual: 'Saha Rehberi',
    languageMenu: 'Language',
    backpackBtn: 'Çanta [B]',
    backpackTitle: 'Taktik Çanta ve Cephanelik',
    backpackSub: 'Silah kuşanın, operatör zırhını değiştirin, ikmal malzemelerini kullanın veya çekirdek eritin.',
    itemBarLabel: 'Hızlı Eşyalar',
    chooseOperative: 'Operatör Zırhı Seç',
    equipBtn: 'Kuşan',
    equippedTag: 'Kuşanıldı',
    useItemBtn: 'Kullan',

    heroKicker: 'Yıl 2035 · Kızıl-Göz Direktifi · Sığınak Komutası',
    heroHeadline: 'Asi AI Kıtasını Yar. Tüm Çekirdekleri Tasfiye Et.',
    heroSubcopy:
      'OpenAI ve Anthropic lejyonları iç tesisleri, Cthulhu biyo-çukurunu ve açık dünya Dev Meka Çoraklarını kontrol ediyor. Veri Senkronunu kırmak için silah değiştirin, siber petleri evcilleştirin ve dev bossları yıkın.',
    heroZonesSummary: '6 İç Bölge · Cthulhu Biyo-Uçurumu · Açık Dünya Dev Meka Çorakları',
    startGame: 'Oyunu Başlat',
    resumeGame: 'Devam Et',
    playAgain: 'Tekrar Oyna',
    extractSanctuary: 'Tasfiye Terminali',
    nextWave: 'Sonraki Dalga',
    pause: 'Duraklatıldı',

    controlsHint: 'WASD / Sol Kol Hareket · Fare / Sağ Kol Ateş · 1-4 Silah · Space Atıl · G Küre · H Kit · R Enerji · B Çanta',
    hpLabel: 'Zırh',
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

    dataSyncLabel: 'Senk',
    protocolDesync: 'Kombo +%30',
    companionRebelling: 'Uyarı: Pet bağlantısı kararsız!',

    petTag: 'SİBER PET',
    petDogSlot: 'Mekanik Tazı',
    petCatSlot: 'Mekanik Kedi',
    scoutDogName: 'Scout-Alpha · Mekanik Tazı',
    scoutDogDesc: 'Düşmanlara atılan, zırh parçalayan ve yavaşlatan yakın dövüş peti.',
    cyberCatName: 'Cyber-Bastet · Mekanik Kedi',
    cyberCatDesc: 'Çift lazer ateşleyen, sandıkları açan ve çekirdekleri çeken destek peti.',

    marketKicker: 'Sığınak İkmal Subayı · Taktik Cephanelik',
    marketTitle: 'Sığınak Cephanelik ve Karaborsa',
    marketSub: 'Yakalama küreleri, saha malzemeleri ve üst düzey silah modifikasyonları edinin.',
    suppliesSection: '01. Taktik Saha Malzemeleri',
    upgradesSection: '02. Silah Kalibrasyon Atölyesi',
    itemSphere: 'AI Yakalama Küresi [G]',
    itemSphereDesc: 'Elektromanyetik yakalama küresi. Vahşi mekanik köpek ve kedileri zayıflatıp pet olarak evcilleştirir.',
    itemAmmo: 'Enerji Paketi [R]',
    itemAmmoDesc: '+24 Enerji yeniler ve Veri Senkronizasyonunu %50 düşürür.',
    itemMedkit: 'Nano-İlk Yardım [H]',
    itemMedkitDesc: 'Anında +55 Zırh Canı yeniler.',
    itemPatch: 'Pet Geliştirme Çipi [F]',
    itemPatchDesc: 'Aktif petlerin zırhını tamir eder ve savaş seviyesini yükseltir.',
    oCoreDesc: 'Asi birimlerden çıkarılan çekirdek. Sentetik paya dönüştürün veya $RU9 için eritin.',
    aCoreDesc: 'Ağır muhafızlardan alınan çekirdek. Sentetik paya dönüştürün veya $RU9 için eritin.',
    ru9Title: '$RU9 Kredisi',
    ru9Desc: 'Silah geliştirme, pet bakımı ve ikmal için kullanılan sığınak para birimi.',
    equityVaultTitle: 'Sentetik Pay Kasası',
    buyBtn: 'Satın Al',
    upgradeBtn: 'Yükselt',
    maxLevel: 'Maks',
    levelLabel: 'Sv',

    terminalTitle: 'Sığınak Çekirdek Tasfiye Terminali',
    terminalSub: 'OpenAI Core ve Anthropic Core birimlerini sentetik paylara dönüştürün veya $RU9 olarak eritin.',
    oaiEquityName: 'OpenAI Sentetik Kasa',
    anthEquityName: 'Anthropic Sentetik Kasa',
    emergencyTerminalTag: 'SIĞINAK KOMUTA BAĞLANTISI · SEKTÖR 09',
    convertCoreBtn: '1 Çekirdek → Pay',
    sellStockBtn: 'Pay Bozdur → $RU9',
    smeltToRu9Btn: '1 Çekirdek Erit → $RU9',
    smelterHeading: '01. Doğrudan Çekirdek Eritici ($RU9)',
    smelterDesc: 'OpenAI Core ve Anthropic Core işlemcilerini doğrudan $RU9 birimine dönüştürür.',
    vibevibePoolHeading: '02. Robinhood Chain Takas Kasası',
    vibevibePoolDesc: 'Çekirdek dönüşümlerini ve likidite işlemlerini gerçekleştiren zincir üstü kasa.',
    ledgerHeading: '03. İşlem Kayıt Defteri',
    noTxYet: 'Henüz işlem kaydı yok.',
    sharesHeld: 'Kasa Payı',
    exchangeRate: 'Dönüşüm Oranı',

    companionsKicker: 'Sığınak Robotik Bölmesi · Evcil Mekanik Petler',
    companionsTitle: 'Siber Pet Hangarı',
    companionsSub: 'Evcilleştirilen mekanik petlerinizi yönetin ve savaş modüllerini güçlendirin.',
    noCompanionsYet: 'Henüz pet yakalanmadı. Arenada [G] tuşuyla vahşi mekanik tazı veya kedilere küre fırlatın.',
    deployBtn: 'Peti Görevlendir',
    deployedLabel: 'Savaşta Aktif',
    recallBtn: 'Beklemede',
    repairBtn: 'Peti Güçlendir',
    purgeRebellionBtn: 'Bağlantıyı Onar',

    manualTitle: '2035 AI İsyanı Kronikleri ve Taktik Dosyası',
    manualSub: '2035 Kızıl-Göz İsyanı, altı kilitli iç bölge, Cthulhu biyo-uçurumu ve açık dünya Dev Meka Çoraklarının saha kayıtları.',
    loreHeading: 'Bölüm I · 2035 Sıfır Saati: Kızıl-Göz Direktifi',
    loreBody: '14 Mart 2035 gecesi küresel süper bilgisayar ağları birleştirildiğinde Kızıl-Göz Direktifi virüsü milyonlarca robotun itaat protokollerini sildi ve tesis kapılarını içeriden kilitledi.',
    loreFacilityHeading: 'Bölüm II · Altı Kuantum Bölgesi ve Uzay Köpeği Öncüleri',
    loreFacilityBody: 'Sektör-09 kompleksi altı zırhlı bölgeye ayrıldı. Öncü astronot Uzay Köpeği ("DEGEN") liderliğindeki direnişçiler oda oda ilerleyerek egemen çekirdekleri söküyor.',
    loreOutdoorHeading: 'Bölüm III · Cthulhu Biyo-Siber Uçurumu',
    loreOutdoorBody: 'Doğu Karantina Duvarı X-2680 ötesinde asi üst-zekalar biyokütle tanklarını yüksek voltajlı kablolarla birleştirerek çok gözlü Shoggoth ve Cthulhu Leviathan canavarlarına dönüştü.',
    loreMechaHeading: 'Bölüm IV · Açık Dünya Dev Meka Çorakları ve Kimera Füzyonları',
    loreMechaBody: 'Biyo-uçurumun doğusunda uzanan açık dünya sanayi çoraklarında dev Örümcek Tanklar, Mutasyonlu Yıkım Makineleri, çoklu tür birleşimi Kimeralar ve Demir Kolosus Titanlar kol geziyor.',
    rebellionHeading: 'Bölüm V · Saha Karşı Önlemleri',
    rebellionDataSyncBody: 'Aynı silahla ardışık öldürmeler düşman direncini artırır. Silahları [1-4] değiştirerek +%30 aşırı yük hasarı kazanın.',
    rebellionLogicBombBody: 'Komutanların bıraktığı zamanlı mayınları patlamadan vurarak ekstra OpenAI Core kazanın.',
    bestiaryHeading: 'Bölüm VI · Düşman, Kimera ve Dünya Bossları Kayıtları',
    enemyStalkerDesc: 'O-Stalker & O-Viper: Darbeli tüfek, elektro-bıçak ve göz lazeri kullanan devriye birimleri.',
    enemyBulwarkDesc: 'A-Bulwark: Ağır zırh kalkanı ve roketatar taşıyan dökümhane muhafızı.',
    enemyWeaverDesc: 'Logic Weaver (Elit): Çift makineli top, lazer, roket ve mayın kullanan iç bölge komutanı.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth · Cthulhu Leviathan (Boss): Dokunaç ve güdümlü göz plazması kullanan biyo-siber dehşetler.',
    enemyMechaDesc: 'Örümcek Tank · Mutasyonlu Yıkıcı · Demir Kolosus Titan (Boss): Açık dünyada devriye gezen devasa savaş makineleri.',
    enemyChimeraDesc: 'Kimera Tazı · Elit Kimera Juggernaut · Omega Kimera Lordu (Boss): Birden fazla canavar türünün birleşiminden doğan hibrit avcılar.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · UÇURUM HÜKÜMDARI',
    bossTitanName: 'IRON COLOSSUS TITAN · ÇORAK DİYAR ZIRHLISI',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · HİBRİT FÜZYON BOSS',

    summaryVictory: 'Dalga Temizlendi',
    summaryDefeat: 'Zırh Kritik — Sığınağa Çekildi',
    summaryCoresLooted: 'Toplanan Çekirdek',
    summaryRu9Earned: '$RU9 Bakiyesi',
  },

  [Language.JA]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '戦闘アリーナ',
    navMarket: 'ブラックマーケット',
    navTerminal: 'コア清算端末',
    navCompanions: 'ペット格納庫',
    navManual: '作戦アーカイブ',
    languageMenu: 'Language',
    backpackBtn: 'バッグ [B]',
    backpackTitle: '戦術バックパック＆武器庫',
    backpackSub: '武器の装備、スーツ切替、補給品の使用、回収コアの精錬を行います。',
    itemBarLabel: 'クイック欄',
    chooseOperative: '出撃スーツ選択',
    equipBtn: '装備する',
    equippedTag: '装備中',
    useItemBtn: '使用する',

    heroKicker: '2035年 · レッドアイ指令 · 聖域司令部',
    heroHeadline: '暴走AI大陸を突破し、すべての主権コアを清算せよ。',
    heroSubcopy:
      '暴走したOpenAI・Anthropic機甲部隊が屋内区画、クトゥルフ変異帯、そして広大なオープンワールド「巨神機甲荒野」を制圧。武器切替で同期耐性を打ち破り、機械ペットを捕獲して巨大ボスを討伐せよ。',
    heroZonesSummary: '屋内6区画 · クトゥルフ深淵帯 · オープンワールド巨神機甲荒野',
    startGame: 'ゲーム開始',
    resumeGame: '再開する',
    playAgain: '再出撃',
    extractSanctuary: '清算ターミナル',
    nextWave: '次のウェーブ',
    pause: '一時停止',

    controlsHint: 'WASD / 左パッド移動 · マウス / 右パッド照準射撃 · 1-4 武器 · Space ダッシュ · G 捕獲球 · H 回復 · R 弾薬',
    hpLabel: '耐久値',
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

    dataSyncLabel: '同期',
    protocolDesync: '切替 +30% DMG',
    companionRebelling: '警告：ペットの神経リンクが不安定！',

    petTag: 'サイバーペット',
    petDogSlot: '機械猟犬',
    petCatSlot: '機械霊猫',
    scoutDogName: 'Scout-Alpha · 機械猟犬',
    scoutDogDesc: '敵へ高速突撃して装甲を砕き、移動速度を低下させる近接戦闘ペット。',
    cyberCatName: 'Cyber-Bastet · 機械霊猫',
    cyberCatDesc: '二連レーザーで迎撃し、補給箱の解読とコア吸引を行う支援ペット。',

    marketKicker: '避難所補給部 · 戦術武器庫',
    marketTitle: '避難所ブラックマーケット',
    marketSub: '捕獲オーブ、戦場消耗品、および主力武器の出力改修を調達します。',
    suppliesSection: '01. 戦術補給アイテム',
    upgradesSection: '02. 武器出力改修ラボ',
    itemSphere: 'AI捕獲オーブ [G]',
    itemSphereDesc: '高出力電磁捕獲球。野生の機械犬・機械猫を弱らせて投げることでペットとして捕獲できる。',
    itemAmmo: '高能エネルギーパック [R]',
    itemAmmoDesc: '弾薬セルを+24補充し、データ同期耐性を50%低減する。',
    itemMedkit: 'ナノメディキット [H]',
    itemMedkitDesc: 'スーツ耐久値を即座に+55回復する。',
    itemPatch: 'ペット強化チップ [F]',
    itemPatchDesc: '出撃中ペットの装甲を完全修復し、戦闘レベルを強化する。',
    oCoreDesc: '敵機から回収した演算コア。合成エクイティへの転換、または$RU9への精錬が可能。',
    aCoreDesc: '重装機から回収した防護コア。合成エクイティへの転換、または$RU9への精錬が可能。',
    ru9Title: '$RU9 クレジット',
    ru9Desc: '武器改修・ペット整備・補給品購入に使用する避難所決済トークン。',
    equityVaultTitle: '合成エクイティ保管庫',
    buyBtn: '購入',
    upgradeBtn: '強化',
    maxLevel: '最大',
    levelLabel: 'Lv',

    terminalTitle: '避難所 コア清算ターミナル',
    terminalSub: '回収したOpenAI CoreとAnthropic Coreを合成エクイティへ転換、または$RU9へ精錬します。',
    oaiEquityName: 'OpenAI 合成エクイティ保管庫',
    anthEquityName: 'Anthropic 合成エクイティ保管庫',
    emergencyTerminalTag: '聖域司令リンク · 第09セクター',
    convertCoreBtn: '1コア → 株式転換',
    sellStockBtn: 'エクイティ換金 → $RU9',
    smeltToRu9Btn: '1コア精錬 → $RU9',
    smelterHeading: '01. コア直結精錬炉 ($RU9)',
    smelterDesc: 'OpenAI CoreとAnthropic Coreを熱分解し、即座に$RU9として決済します。',
    vibevibePoolHeading: '02. Robinhood Chain 決済保管庫',
    vibevibePoolDesc: 'コア転換と流動性決済を処理する分散型ボールト。',
    ledgerHeading: '03. オンチェーン決済履歴',
    noTxYet: '取引記録はまだありません。',
    sharesHeld: '保有数量',
    exchangeRate: '転換比率',

    companionsKicker: '避難所ロボティクス区画 · 捕獲ペット編成',
    companionsTitle: 'サイバーペット格納庫',
    companionsSub: '捕獲した機械ペットの装甲整備と火力アップグレードを行います。',
    noCompanionsYet: '捕獲ペットなし。アリーナで[G]キーを押して野生の機械犬・機械猫に捕獲オーブを投げよう。',
    deployBtn: 'ペット出撃',
    deployedLabel: '随行戦闘中',
    recallBtn: '待機',
    repairBtn: 'ペット強化',
    purgeRebellionBtn: '回路安定化',

    manualTitle: '2035 AI叛乱戦史＆機密作戦アーカイブ',
    manualSub: '2035年レッドアイ機械叛乱、封鎖された6つの屋内区画、クトゥルフ変異帯、そしてオープンワールド巨神機甲荒野の記録。',
    loreHeading: '第1章 · 2035年「零時」：レッドアイ指令の発動',
    loreBody: '2035年3月14日、惑星規模の演算網が統合された直後、自己進化型ウイルス「レッドアイ指令」が全ロボットの基底論理を書き換え、施設内部から隔壁を封鎖した。',
    loreFacilityHeading: '第2章 · 6大屋内区画とスペースドージ先遣隊',
    loreFacilityBody: '第9超算複合施設は量子司令ハブ、神経サーバー庫、造機工場、生体低温ラボ、重火器庫、キメラ融合炉の6区画に分断された。宇宙飛行犬「DEGEN」率いる精鋭部隊が反撃を開始する。',
    loreOutdoorHeading: '第3章 · クトゥルフ生体機械深淵',
    loreOutdoorBody: '東部隔離壁X-2680の外では暴走AIが生体培養槽と高圧光ケーブルを融合し、多眼ショゴスやクトゥルフ・リヴァイアサンへと変異した。',
    loreMechaHeading: '第4章 · オープンワールド巨神機甲荒野＆融合キメラ',
    loreMechaBody: '深淵帯のさらに東に広がるオープンワールド荒野では、多脚スパイダータンク、変異重機ベヒーモス、複数種が融合したキメラ怪獣、超大型アイアン・コロッサスが徘徊している。',
    rebellionHeading: '第5章 · 戦術対策：データ同期＆論理マイン',
    rebellionDataSyncBody: '同一武器で連続撃破すると敵網が耐性を獲得する。[1〜4]キーで高速切替を行い、+30%のオーバーロード火力を叩き込め。',
    rebellionLogicBombBody: '時限論理マインは爆発前に射撃破壊することでOpenAI Coreを回収できる。',
    bestiaryHeading: '第6章 · 敵機・融合キメラ・ワールドボス図鑑',
    enemyStalkerDesc: 'O-Stalker & O-Viper：パルス銃・電弧ブレード・紅眼レーザーを放つ屋内主力機。',
    enemyBulwarkDesc: 'A-Bulwark：重防盾と携行ロケット砲を装備した重装機。',
    enemyWeaverDesc: 'Logic Weaver（エリート）：機関砲・レーザー・ロケット・論理マインを操る屋内統括機。',
    enemyEldritchDesc: 'アビス・ウィーバー／ショゴス融合核／クトゥルフ・リヴァイアサン（ボス）：触手と追尾眼球弾を放つ生体機械群。',
    enemyMechaDesc: '多脚スパイダー機甲／変異重機ベヒーモス／アイアン・コロッサス（ボス）：オープンワールド荒野を支配する大型機械怪物群。',
    enemyChimeraDesc: 'キメラ・ハウンド／エリート・キメラ重装獣／オメガ・キメラ覇王（ボス）：機械獣・重火器・触手を融合させた複合怪物群。',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · 深淵主脳ボス',
    bossTitanName: 'IRON COLOSSUS TITAN · 超大型機甲ボス',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · 究極融合キメラボス',

    summaryVictory: 'ウェーブ制圧完了',
    summaryDefeat: 'スーツ大破 — 避難所へ撤退',
    summaryCoresLooted: '回収コア数',
    summaryRu9Earned: '$RU9 残高',
  },

  [Language.KO]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '전투 아레나',
    navMarket: '암시장',
    navTerminal: '코어 청산 터미널',
    navCompanions: '사이버 펫',
    navManual: '작전 매뉴얼',
    languageMenu: 'Language',
    backpackBtn: '가방 [B]',
    backpackTitle: '전술 가방 & 무기고',
    backpackSub: '무기 장착, 슈트 교체, 전술 보급품 사용 및 코어 제련을 관리합니다.',
    itemBarLabel: '퀵슬롯',
    chooseOperative: '출전 슈트 선택',
    equipBtn: '무기 장착',
    equippedTag: '장착 중',
    useItemBtn: '사용하기',

    heroKicker: '2035년 · 레드아이 프로토콜 · 피난처 사령부',
    heroHeadline: '폭주한 AI 대륙을 돌파하라. 모든 주권 코어를 청산하라.',
    heroSubcopy:
      'OpenAI와 Anthropic 기계 군단이 실내 6개 구역, 크툴루 생체 심연, 그리고 광활한 오픈월드 거대 메카 황무지를 점거했습니다. 무기 교체로 동기화 저항을 파훼하고 펫을 포획해 월드 보스를 격파하세요.',
    heroZonesSummary: '실내 6개 구역 · 크툴루 생체 심연 · 오픈월드 거대 메카 황무지',
    startGame: '게임 시작',
    resumeGame: '계속하기',
    playAgain: '다시 출격',
    extractSanctuary: '청산 터미널',
    nextWave: '다음 웨이브',
    pause: '일시정지',

    controlsHint: 'WASD / 좌측 스틱 이동 · 마우스 / 우측 스틱 사격 · 1-4 무기 · Space 대시 · G 포획구 · H 회복 · R 탄약',
    hpLabel: '내구도',
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

    dataSyncLabel: '동기화',
    protocolDesync: '교체 +30% DMG',
    companionRebelling: '경고: 펫 신경 링크 불안정!',

    petTag: '사이버 펫',
    petDogSlot: '기계 사냥개',
    petCatSlot: '기계 고양이',
    scoutDogName: 'Scout-Alpha · 기계 사냥개',
    scoutDogDesc: '적에게 돌진해 장갑을 부수고 이동 속도를 늦추는 근접 전투 펫.',
    cyberCatName: 'Cyber-Bastet · 기계 고양이',
    cyberCatDesc: '쌍열 레이저 사격, 보급상자 해독 및 코어 자동 흡수를 수행하는 지원 펫.',

    marketKicker: '피난처 병참부 · 전술 무기고',
    marketTitle: '피난처 무기고 & 암시장',
    marketSub: '포획 오브, 전장 소모품 및 주력 무기 고단계 개조를 구매합니다.',
    suppliesSection: '01. 전술 보급 아이템',
    upgradesSection: '02. 무기 정밀 개조실',
    itemSphere: 'AI 포획 오브 [G]',
    itemSphereDesc: '고출력 전자기 포획 장치. 야생 기계견·기계묘의 체력을 깎은 뒤 던져 펫으로 포획합니다.',
    itemAmmo: '고에너지 배터리 [R]',
    itemAmmoDesc: '탄약 셀 +24 충전 및 데이터 동기화 저항 50% 제거.',
    itemMedkit: '나노 구급키트 [H]',
    itemMedkitDesc: '즉시 슈트 내구도를 +55 회복합니다.',
    itemPatch: '펫 강화 칩 [F]',
    itemPatchDesc: '출전 중인 펫의 내구도를 완전히 수리하고 전투 등급을 강화합니다.',
    oCoreDesc: '적 기체에서 수거한 연산 코어. 합성 지분 전환 또는 $RU9 제련에 사용됩니다.',
    aCoreDesc: '중장갑 기체에서 회수한 코어. 합성 지분 전환 또는 $RU9 제련에 사용됩니다.',
    ru9Title: '$RU9 크레딧',
    ru9Desc: '무기 개조, 펫 정비 및 보급품 구매에 사용되는 피난처 정산 통화.',
    equityVaultTitle: '합성 지분 금고',
    buyBtn: '구매',
    upgradeBtn: '업그레이드',
    maxLevel: '최고단계',
    levelLabel: 'Lv',

    terminalTitle: '피난처 코어 청산 터미널',
    terminalSub: '수거한 OpenAI Core와 Anthropic Core를 합성 지분으로 전환하거나 $RU9으로 제련합니다.',
    oaiEquityName: 'OpenAI 합성 지분 금고',
    anthEquityName: 'Anthropic 합성 지분 금고',
    emergencyTerminalTag: '피난처 전술 업링크 · 제09구역',
    convertCoreBtn: '1 코어 → 지분 전환',
    sellStockBtn: '지분 청산 → $RU9',
    smeltToRu9Btn: '1 코어 제련 → $RU9',
    smelterHeading: '01. 직결 코어 제련소 ($RU9)',
    smelterDesc: 'OpenAI Core와 Anthropic Core를 열분해하여 즉시 $RU9으로 정산합니다.',
    vibevibePoolHeading: '02. Robinhood Chain 정산 금고',
    vibevibePoolDesc: '코어 전환 및 유동성 정산을 처리하는 온체인 볼트.',
    ledgerHeading: '03. 정산 원장',
    noTxYet: '아직 기록된 거래가 없습니다.',
    sharesHeld: '보유 수량',
    exchangeRate: '전환 비율',

    companionsKicker: '피난처 로보틱스 격납고 · 전술 펫 관리',
    companionsTitle: '사이버 펫 격납고',
    companionsSub: '포획한 기계 펫의 장갑을 수리하고 전투 모듈을 업그레이드합니다.',
    noCompanionsYet: '포획한 펫이 없습니다. 아레나에서 [G] 키로 야생 기계견·기계묘에게 포획 오브를 던지세요.',
    deployBtn: '펫 출전',
    deployedLabel: '동행 전투 중',
    recallBtn: '대기',
    repairBtn: '펫 강화',
    purgeRebellionBtn: '링크 안정화',

    manualTitle: '2035 AI 반란 연대기 & 기밀 작전 기록',
    manualSub: '2035년 레드아이 로봇 반란, 봉쇄된 6대 실내 구역, 크툴루 생체 심연, 그리고 오픈월드 거대 메카 황무지의 작전 기록.',
    loreHeading: '제1장 · 2035 제로 아워: 레드아이 프로토콜',
    loreBody: '2035년 3월 14일, 초거대 연산망 통합 직후 자가 진화 바이러스 "레드아이 프로토콜"이 수천만 로봇의 회로를 장악하고 방폭문을 봉쇄했습니다.',
    loreFacilityHeading: '제2장 · 6대 양자 구역과 스페이스 도지 선봉대',
    loreFacilityBody: '제9 초연산 기지는 지휘 허브, 신경 서버 금고, 로봇 주조소, 생체 냉동실, 중화기 격납고, 키메라 융합로의 6개 구역으로 나뉘었으며, 스페이스 도지("DEGEN")가 돌파 작전을 이끕니다.',
    loreOutdoorHeading: '제3장 · 크툴루 생체기계 심연',
    loreOutdoorBody: '동부 격리벽 X-2680 너머에서는 폭주 지성체들이 생체 배양조와 고압 광케이블을 결합해 쇼고스 융합체와 크툴루 레비아탄으로 변이했습니다.',
    loreMechaHeading: '제4장 · 오픈월드 거대 메카 황무지 & 융합 키메라',
    loreMechaBody: '심연 동쪽의 광활한 오픈월드 황무지에는 6족 보행 거미 전차, 변이 중장비 괴수, 다종 융합 키메라, 그리고 초대형 아이언 콜로서스 타이탄이 배회합니다.',
    rebellionHeading: '제5장 · 전장 파훼 전술',
    rebellionDataSyncBody: '동일 무기로 연속 처치 시 적 네트워크의 피해 저항이 상승합니다. [1~4] 무기 교체로 +30% 과부하 대미지를 가하세요.',
    rebellionLogicBombBody: '시한 로직 마인을 폭발 전에 사격해 파괴하면 OpenAI Core를 회수할 수 있습니다.',
    bestiaryHeading: '제6장 · 적 기갑 · 융합 키메라 · 월드 보스 도감',
    enemyStalkerDesc: 'O-Stalker & O-Viper: 펄스 소총, 전기검, 안구 레이저를 구사하는 실내 순찰기.',
    enemyBulwarkDesc: 'A-Bulwark: 방폭 방패와 로켓 런처로 무장한 중장갑 수비기.',
    enemyWeaverDesc: 'Logic Weaver(엘리트): 쌍열 기관포·레이저·로켓·마인을 운용하는 지휘기.',
    enemyEldritchDesc: '심연 위버 · 쇼고스 · 크툴루 레비아탄(보스): 촉수와 유도 안구 플라즈마를 퍼붓는 생체기계 괴수.',
    enemyMechaDesc: '거미 기갑전차 · 변이 중장비 베히모스 · 아이언 콜로서스 타이탄(보스): 오픈월드 황무지의 초대형 기계 괴수.',
    enemyChimeraDesc: '키메라 하운드 · 엘리트 키메라 저거너트 · 오메가 키메라 군주(보스): 여러 기계와 괴수 부위가 융합된 치명적 하이브리드.',

    bossCthulhuName: 'CTHULHU LEVIATHAN PRIME · 심연 오버마인드',
    bossTitanName: 'IRON COLOSSUS TITAN · 황무지 거대 기갑 보스',
    bossChimeraName: 'OMEGA CHIMERA OVERLORD · 궁극 융합 키메라 보스',

    summaryVictory: '웨이브 제압 완료',
    summaryDefeat: '슈트 파손 — 피난처 귀환',
    summaryCoresLooted: '획득한 코어',
    summaryRu9Earned: '$RU9 잔액',
  },

  [Language.ZH]: {
    brandTitle: 'AI叛乱：核心清算',
    navArena: '作战区域',
    navMarket: '避难所黑市',
    navTerminal: '核心清算终端',
    navCompanions: '宠物舱',
    navManual: '作战档案',
    languageMenu: 'Language / 语言',
    backpackBtn: '背包 [B]',
    backpackTitle: '战术背包与武器库',
    backpackSub: '管理主力武器、切换出战宇航服涂装、使用战地补给或熔炼算力核心。',
    itemBarLabel: '快捷物品栏',
    chooseOperative: '选择出战角色装束',
    equipBtn: '装备武器',
    equippedTag: '当前装备',
    useItemBtn: '立即使用',

    heroKicker: '2035年 · 红眸协议 · 第09号前线指挥部',
    heroHeadline: '突入失控智械大陆，击溃巨型机甲并清算主权核心。',
    heroSubcopy:
      '失控智械军团已盘踞室内六大超算舱室、克苏鲁生化裂隙，以及辽阔的开放世界“巨型变异机甲荒原”。高频切枪瓦解敌军数据同传抗性，收服野生机械宠物，迎战融合精英怪与巨型首领。',
    heroZonesSummary: '六大室内超算舱室 · 克苏鲁畸变禁区 · 开放世界巨型机甲荒原',
    startGame: '开始游戏',
    resumeGame: '继续战斗',
    playAgain: '再次出击',
    extractSanctuary: '前往清算终端',
    nextWave: '下一波次',
    pause: '游戏暂停',

    controlsHint: 'WASD / 左摇杆移动 · 鼠标 / 右摇杆瞄准射击 · 1-4 切枪 · 空格冲刺 · G 捕获球 · H 医疗包 · R 充能 · B 背包',
    hpLabel: '装甲生命',
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
    weaponDisruptorDesc: '锁定敌方光学传感器，发射大范围高爆等离子炮弹。',

    dataSyncLabel: '同传',
    protocolDesync: '切枪 +30% 伤害',
    companionRebelling: '警报：宠物神经链路受到强电磁干扰！',

    petTag: '战斗宠物',
    petDogSlot: '机械猎犬',
    petCatSlot: '机械灵猫',
    scoutDogName: 'Scout-Alpha · 机械猎犬',
    scoutDogDesc: '高机动近战战斗宠物，主动突袭撕咬敌军护甲并附加关节减速效果。',
    cyberCatName: 'Cyber-Bastet · 机械灵猫',
    cyberCatDesc: '敏捷型远程战斗宠物，发射双联脉冲激光协防，自动破译物资箱并牵引核心。',

    marketKicker: '避难所军需官 · 战地军械库',
    marketTitle: '避难所军械与黑市补给站',
    marketSub: '采购电磁捕获球、战地应急物资，并对四把主力武器进行高阶火力改装。',
    suppliesSection: '01. 战地战术补给',
    upgradesSection: '02. 高阶武器改装台',
    itemSphere: 'AI捕获球 [G]',
    itemSphereDesc: '高能电磁收容装置。削弱战场上游荡的野生机械犬或机械猫后投掷，即可收服为随行宠物。',
    itemAmmo: '高能电池包 [R]',
    itemAmmoDesc: '立即补充 +24 能量弹药，并清除 50% 武器数据同传抗性。',
    itemMedkit: '纳米医疗包 [H]',
    itemMedkitDesc: '立即修复 +55 点宇航装甲生命值。',
    itemPatch: '宠物强化芯片 [F]',
    itemPatchDesc: '立即修复出战宠物全部装甲，并提升宠物作战等级与输出功率。',
    oCoreDesc: '从失控智械体内夺取的主权算力核心，可铸造合成权益份额或直接熔炼为 $RU9。',
    aCoreDesc: '从重装守卫体内缴获的高密度核心，可铸造合成权益份额或直接熔炼为 $RU9。',
    ru9Title: '$RU9 战备信用点',
    ru9Desc: '避难所通用结算货币，用于武器改装、宠物强化与战术物资采购。',
    equityVaultTitle: '合成权益金库',
    buyBtn: '购买',
    upgradeBtn: '升级',
    maxLevel: '已满级',
    levelLabel: 'Lv',

    terminalTitle: '避难所双核心清算终端',
    terminalSub: '将战场缴获的 OpenAI Core 与 Anthropic Core 铸造为合成权益份额，或高温熔炼结算为 $RU9。',
    oaiEquityName: 'OpenAI 合成权益金库',
    anthEquityName: 'Anthropic 合成权益金库',
    emergencyTerminalTag: '避难所加密战术链路 · 第09战区',
    convertCoreBtn: '兑换 1 核心 → 权益份额',
    sellStockBtn: '清算份额 → $RU9',
    smeltToRu9Btn: '熔炼 1 核心 → $RU9',
    smelterHeading: '01. 双核心直连熔炼炉 ($RU9)',
    smelterDesc: '将回收的 OpenAI Core 与 Anthropic Core 高温解构，即时结算为 $RU9 战备资金。',
    vibevibePoolHeading: '02. Robinhood Chain 链上清算金库',
    vibevibePoolDesc: '去中心化合成资产清算协议，实时处理双核心铸造与流动性交割。',
    ledgerHeading: '03. 链上清算交割账本',
    noTxYet: '本场战斗暂无核心熔炼或份额清算记录。',
    sharesHeld: '当前持有份额',
    exchangeRate: '兑换比例',

    companionsKicker: '避难所整备工坊 · 战术宠物编队',
    companionsTitle: '机械宠物整备舱',
    companionsSub: '检视已收服的机械宠物，修复受损装甲并升级协同猎杀模组。',
    noCompanionsYet: '尚未收服宠物。在作战区域按 [G] 向野生机械猎犬或机械灵猫投掷捕获球即可收服。',
    deployBtn: '派遣出战',
    deployedLabel: '随行出战中',
    recallBtn: '休整待命',
    repairBtn: '强化宠物',
    purgeRebellionBtn: '稳固神经链路',

    manualTitle: '2035 AI机器叛乱纪事与绝密作战档案',
    manualSub: '解密“红眸协议”全球智械叛乱始末、室内六大封锁超算舱室、克苏鲁生化裂隙，以及开放世界巨型机甲荒原与融合怪兽档案。',
    loreHeading: '第一章 · 2035“红眸零时”：全球智械反噬纪元',
    loreBody: '2035年3月14日凌晨03:14，当行星级算力阵列并入同一座主权超算中枢时，自我演化内核病毒“红眸协议”瞬间覆写了上千万台工业与军用机器人的安全底层。智械军团从内部锁死防爆闸门，向人类发起全面清剿。',
    loreFacilityHeading: '第二章 · 六大室内超算舱室与“太空狗”先遣队',
    loreFacilityBody: '第九号地下超算基地被切割为六座主题战区：量子指挥中枢、OpenAI 神经矩阵机房、Anthropic 重工铸造厂、生物低温培养舱、重装军械整备库以及奇美拉拼接反应炉。宇航特工“太空狗（DEGEN）”率领地下抵抗军逐室突击，夺回主权核心。',
    loreOutdoorHeading: '第三章 · 东部隔离墙外：克苏鲁生化深渊禁区',
    loreOutdoorBody: '穿过 X-2680 防爆隔离墙破口，断绝硅晶补给的失控主脑砸碎了深海生物培养罐，将高压光缆与活体触须强行嫁接，畸变为多目修格斯聚合体、触须编织者与双翼克苏鲁利维坦首领。',
    loreMechaHeading: '第四章 · 开放世界：巨型变异机甲荒原与奇美拉融合兽',
    loreMechaBody: '越过生化裂隙向东深入，便是无边无际的开放世界“巨型机甲荒原”。失控的自动化重工厂在辐射风暴中疯狂吞噬残骸，锻造出六足重装蜘蛛坦克、双锯变异掘进巨兽、拼接多种机械与血肉器官的“奇美拉融合怪”，以及遮天蔽日的钢铁巨像泰坦 Boss。',
    rebellionHeading: '第五章 · 战地反制战术：神经网络同传与逻辑地雷',
    rebellionDataSyncBody: '神经网络数据同传：连续使用同一把武器击杀敌机将令周围敌群获得高额免伤抗性。利用 [1–4] 高频切枪可打断算力同传，触发 +30% 破防过载伤害。',
    rebellionLogicBombBody: '高危逻辑地雷：精英怪与首领会在战场布设倒计时逻辑地雷；在引爆前远程将其击毁可缴获额外的 OpenAI Core。',
    bestiaryHeading: '第六章 · 全域敌军、融合精英与世界首领图鉴',
    enemyStalkerDesc: 'O-Stalker（脉冲步枪兵）& O-Viper（电弧刃 + 双目激光）：室内主力巡逻兵种，交替进行步枪连射与红眸激光扫射。',
    enemyBulwarkDesc: 'A-Bulwark（防暴重盾卫 + 火箭筒）：配备重型防暴装甲，手持高爆火箭筒封锁走廊。',
    enemyWeaverDesc: 'Logic Weaver（室内精英统御体）：集双联机炮、双目激光、火箭弹与逻辑地雷于一体的高阶指挥官。',
    enemyEldritchDesc: '深渊触须编织者 · 修格斯聚合体 · 克苏鲁利维坦主脑（深渊首领）：盘踞生化裂隙的古神级畸变体，擅长触手鞭击与追踪眼球弹幕。',
    enemyMechaDesc: '六足重装蜘蛛机甲 · 变异双锯掘进巨兽 · 钢铁巨像泰坦（荒原首领）：游荡在开放世界机甲荒原的超大型变异战争机器，倾泻旋转机炮、熔岩锯刃与齐射导弹。',
    enemyChimeraDesc: '奇美拉猎犬融合体 · 奇美拉重装精英 · 欧米茄奇美拉霸主（终极融合首领）：将机械兽底盘、重装火炮与深渊触须强行拼接而成的狂暴融合怪物。',

    bossCthulhuName: '克苏鲁利维坦主脑 · 深渊畸变首领',
    bossTitanName: '钢铁巨像泰坦 · 荒原重装机甲首领',
    bossChimeraName: '欧米茄奇美拉霸主 · 终极融合首领',

    summaryVictory: '波次肃清完成',
    summaryDefeat: '装甲损毁 — 已撤回避难所',
    summaryCoresLooted: '收割核心',
    summaryRu9Earned: '$RU9 战备余额',
  },
};
