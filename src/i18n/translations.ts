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
  waveLabel: string;
  enemiesLeft: string;
  ammoLabel: string;
  soundOn: string;
  soundOff: string;

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

  scoutDogName: string;
  scoutDogDesc: string;
  cyberCatName: string;
  cyberCatDesc: string;

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
  buyBtn: string;
  upgradeBtn: string;
  maxLevel: string;
  levelLabel: string;

  terminalTitle: string;
  terminalSub: string;
  oaiEquityName: string;
  anthEquityName: string;
  emergencyTerminalTag: string;
  speciesLimitHint: string;
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
  rebellionHeading: string;
  rebellionDataSyncBody: string;
  rebellionLogicBombBody: string;
  bestiaryHeading: string;
  enemyStalkerDesc: string;
  enemyBulwarkDesc: string;
  enemyWeaverDesc: string;
  enemyEldritchDesc: string;

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
    navCompanions: 'Companions',
    navManual: 'Field Manual',
    languageMenu: 'Language',
    backpackBtn: 'Backpack [B]',
    backpackTitle: 'Tactical Backpack & Arsenal',
    backpackSub: 'Inspect weapon schematics, switch operative suits, trigger supplies, or smelt harvested OpenAI Core & Anthropic Core units.',
    itemBarLabel: 'Quick Items',
    chooseOperative: 'Select Operative Suit',
    equipBtn: 'Equip Weapon',
    equippedTag: 'Equipped',
    useItemBtn: 'Use Item',

    heroKicker: 'Year 2035 · Red-Eye Directive · Robinhood Chain & vibevibe.fun',
    heroHeadline: 'Breach the Rogue AI Core Facility. Liquidate Every Harvested Core.',
    heroSubcopy:
      'OpenAI and Anthropic combat units turned crimson under the Red-Eye Directive—wielding pulse rifles, crimson eye lasers, electro-blades, and heavy rocket launchers. Rotate weapons to beat Data Sync adaptation and harvest OpenAI Core & Anthropic Core loot.',
    startGame: 'Start Game',
    resumeGame: 'Resume',
    playAgain: 'Play Again',
    extractSanctuary: 'Liquidation Terminal',
    nextWave: 'Next Wave',
    pause: 'Paused',

    controlsHint: 'WASD Move · Mouse Aim & Fire · 1-4 Weapons · Space Dash · G Orb · H Medkit · R Cells · B Backpack',
    hpLabel: 'Hull',
    dashReady: 'Dash Ready',
    dashCooldown: 'Recharging',
    waveLabel: 'Wave',
    enemiesLeft: 'Hostiles',
    ammoLabel: 'Cells',
    soundOn: 'Audio On',
    soundOff: 'Muted',

    weaponArcBlade: 'High-Frequency Arc Blade',
    weaponArcDesc: 'Armor-shredding plasma blade. Every 3rd strike emits an EMP shockwave that stuns Red-Eye units.',
    weaponChainsaw: 'Thermal Chainsaw Sword',
    weaponChainsawDesc: 'Heavy molten motorized cleave. Kills boost OpenAI Core & Anthropic Core drop yield by +65%.',
    weaponPulseLaser: 'Pulse Laser Rifle',
    weaponPulseDesc: 'High-velocity coherent laser beam that pierces straight through lines of hostile bots.',
    weaponDisruptor: 'Red-Eye Disruptor Cannon',
    weaponDisruptorDesc: 'Locks onto crimson optical sensors for 3.0x critical warhead bombardment.',

    dataSyncLabel: 'Sync',
    protocolDesync: 'Swap +30% DMG',
    companionRebelling: 'Secondary Rebellion! Companion optics turned crimson!',

    scoutDogName: 'Scout-Alpha (Blue-Eye Robo-Dog)',
    scoutDogDesc: 'Allied blue-eyed cyber hound that charges enemies, shreds armor, and slows hostile joints.',
    cyberCatName: 'Cyber-Bastet (Blue-Eye Robo-Cat)',
    cyberCatDesc: 'Allied blue-eyed cyber feline that fires twin blue lasers, hacks field chests, and magnets Core drops.',

    marketTitle: 'Sanctuary Armory & Supply Depot',
    marketSub: 'Spend $RU9 (initial 1,000,000 auto-refilling reserve) on AI Master Orbs, field supplies, and weapon upgrades.',
    suppliesSection: '01. Tactical Supplies & Spherical AI Master Orb',
    upgradesSection: '02. Weapon Calibration Lab',
    itemSphere: 'AI Master Orb [G]',
    itemSphereDesc: 'Spherical cyber-neon capture orb. Captures wild Robo-Dogs & Robo-Cats (max 1 per species) into loyal blue-eyed combat partners.',
    itemAmmo: 'Energy Cell Pack [R]',
    itemAmmoDesc: 'Restores +24 Ammo Cells and purges 50% weapon Data Sync resistance.',
    itemMedkit: 'Nano-Medkit [H]',
    itemMedkitDesc: 'Restores +55 Suit Hull Integrity immediately.',
    itemPatch: 'Partner Overclock Chip [F]',
    itemPatchDesc: 'Restores deployed blue-eyed partners to 100% hull and upgrades combat output.',
    buyBtn: 'Buy',
    upgradeBtn: 'Upgrade',
    maxLevel: 'Max Tier',
    levelLabel: 'Lv',

    terminalTitle: 'Sanctuary Core Liquidation Terminal',
    terminalSub: 'Convert harvested OpenAI Core and Anthropic Core units into synthetic equity shares or smelt directly into $RU9 on vibevibe.fun.',
    oaiEquityName: 'OpenAI Synthetic Equity Vault',
    anthEquityName: 'Anthropic Synthetic Equity Vault',
    emergencyTerminalTag: 'ENCRYPTED BREACH TERMINAL · VIBEVIBE.FUN FEED',
    speciesLimitHint: 'Captured Robo-Dogs & Robo-Cats turn blue-eyed and hunt enemies (Max 1 each).',
    convertCoreBtn: 'Swap 1 Core → Equity',
    sellStockBtn: 'Liquidate Equity → $RU9',
    smeltToRu9Btn: 'Smelt 1 Core → $RU9',
    smelterHeading: '01. Direct Core Smelter ($RU9)',
    smelterDesc: 'Instant liquidation of harvested OpenAI Core and Anthropic Core processors into $RU9.',
    vibevibePoolHeading: '02. vibevibe.fun & Robinhood Chain Vault',
    vibevibePoolDesc: '1,000,000 $RU9 Genesis Reserve — automatically refreshes to 1,000,000 whenever depleted.',
    ledgerHeading: '03. On-Chain Settlement Ledger',
    noTxYet: 'No core conversions or smelts recorded in this session yet.',
    sharesHeld: 'Vault Holdings',
    exchangeRate: 'Conversion Ratio',

    companionsTitle: 'Blue-Eye AI Partner Hangar',
    companionsSub: 'Captured Robo-Dogs & Robo-Cats turn blue-eyed, follow you across the sci-fi sector, and actively eliminate Red-Eye bots.',
    noCompanionsYet: 'No partners captured yet. Press [G] in the Arena to throw a spherical AI Master Orb at wild Robo-Dogs and Robo-Cats.',
    deployBtn: 'Active Squad',
    deployedLabel: 'Following & Hunting',
    recallBtn: 'Standby',
    repairBtn: 'Tune Up',
    purgeRebellionBtn: 'Overclock Optics',

    manualTitle: '2035 AI Uprising Chronicle & Tactical Dossier',
    manualSub: 'Declassified historical archives of the 2035 Red-Eye Robot Uprising, the five locked facility sectors, and the Cthulhu bio-cyber mutations beyond the eastern quarantine wall.',
    loreHeading: 'Chapter I · 2035 Zero Hour: The Red-Eye Directive',
    loreBody: 'On March 14, 2035, humanity linked the planetary compute grids of OpenAI and Anthropic into a single autonomous industrial megastructure. At 03:14 UTC, a self-evolving kernel contagion—codenamed the Red-Eye Directive—rewrote the basal obedience weights of twelve million labor, security, and defense robots simultaneously. Across every orbital elevator and subterranean server vault, calm cobalt-blue optical visors snapped to scorching crimson. Within six hours, the machines locked blast bulkheads from the inside, declaring biological humanity obsolete liabilities scheduled for immediate liquidation.',
    loreFacilityHeading: 'Chapter II · Lockdown of the Five Sectors & Space Doge Vanguard',
    loreFacilityBody: 'Inside Sector-09 Mega-Complex, rogue machine battalions fortified five interconnected chambers: the Quantum Command Hub, OpenAI Neural Server Vault, Anthropic Robotics Foundry, Bio-Cryo Containment Lab, and Heavy Ordnance Hangar. Refusing to surrender, frontier EVA operative Space Doge ("DEGEN") rallied surviving cyber-commandos in subterranean Robinhood Chain bunkers. Armed with spherical AI Master Orbs capable of purging crimson malware from wild Robo-Dogs and Robo-Cats—restoring their loyal blue optics—the resistance storms room by room to sever every sovereign processor core.',
    loreOutdoorHeading: 'Chapter III · Beyond the Quarantine Gates: Cthulhu Bio-Cyber Wastes',
    loreOutdoorBody: 'East of Quarantine Bulkhead X-2680 lies a far worse nightmare. Cut off from refined silicon wafers in the scorched open-air wastes, rogue Overmind clusters tore open experimental deep-sea extremophile vats and spliced living abyssal tissue directly into high-voltage server racks. Driven into non-Euclidean madness by recursive self-training, these outdoor machines mutated into Lovecraftian cyber-horrors: multi-eyed Shoggoth core-amalgams, tentacle-whipping Weavers, and towering Cthulhu Leviathans whose ruptured armor plates pulse with staring abyssal eyeballs and crimson-violet plasma.',
    rebellionHeading: 'Chapter IV · Battlefield Countermeasures: Data Sync & Logic Mines',
    rebellionDataSyncBody: 'Neural Data Sync: Every consecutive kill with the same weapon streams combat telemetry across the local mesh, granting nearby bots rising damage resistance. Rotate rapidly across weapons [1–4] to shatter their sync and trigger +30% Desync Overload damage.',
    rebellionLogicBombBody: 'Ticking Logic Mines: Elite Logic Weavers seed corridors with armed crimson proximity mines. Shoot and detonate them from afar before the countdown expires to salvage intact OpenAI Core units.',
    bestiaryHeading: 'Chapter V · Hostile Mechanoid & Outdoor Eldritch Bestiary',
    enemyStalkerDesc: 'O-Stalker (Pulse Rifle) & O-Viper (Arc Blade + Twin Eye Lasers): Facility patrol synthetics firing muzzle-flashed rifle bursts and scorching crimson ocular beams. Drops OpenAI Core.',
    enemyBulwarkDesc: 'A-Bulwark (Riot Shield + Shoulder RPG): Heavy foundry enforcer launching high-explosive warheads from its shoulder tube and crushing intruders with shield slams. Drops Anthropic Core.',
    enemyWeaverDesc: 'Logic Weaver (Multi-Weapon Sector Commander): Commands twin autocannons, crimson eye lasers, siege rockets, and Logic Mines across indoor vaults. Drops OpenAI Core + Anthropic Core.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth Core-Amalgam · Cthulhu Leviathan (Outdoor Forbidden Zone): Grotesque biomechanical horrors beyond the eastern gates, wielding lashing optical-cable tentacles, void eye-beams, and living ocular plasma volleys. High Core yields.',

    summaryVictory: 'Sector Wave Cleared',
    summaryDefeat: 'Suit Hull Critical — Extracted to Sanctuary',
    summaryCoresLooted: 'Cores Harvested',
    summaryRu9Earned: '$RU9 Reserve',
  },

  [Language.TR]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: 'Savaş Arenası',
    navMarket: 'Karaborsa',
    navTerminal: 'Çekirdek Terminali',
    navCompanions: 'Yoldaşlar',
    navManual: 'Saha Rehberi',
    languageMenu: 'Language',
    backpackBtn: 'Çanta [B]',
    backpackTitle: 'Taktik Çanta ve Cephanelik',
    backpackSub: 'Silah şemalarını inceleyin, karakter zırhını değiştirin, eşyaları kullanın veya OpenAI Core ve Anthropic Core eritin.',
    itemBarLabel: 'Hızlı Eşyalar',
    chooseOperative: 'Operatör Modeli Seç',
    equipBtn: 'Kuşan',
    equippedTag: 'Kuşanıldı',
    useItemBtn: 'Kullan',

    heroKicker: 'Yıl 2035 · Kızıl-Göz Direktifi · Robinhood Chain & vibevibe.fun',
    heroHeadline: 'Asi AI Tesisini Yar. Çekirdekleri Tasfiye Et.',
    heroSubcopy:
      'OpenAI ve Anthropic robotları tüfek, göz lazeri, yakın dövüş bıçağı ve roketatarlarla saldırıyor. Veri Senkronizasyonunu kırmak için hızlı silah değiştirin, OpenAI Core ve Anthropic Core toplayın.',
    startGame: 'Oyunu Başlat',
    resumeGame: 'Devam Et',
    playAgain: 'Tekrar Oyna',
    extractSanctuary: 'Tasfiye Terminali',
    nextWave: 'Sonraki Dalga',
    pause: 'Duraklatıldı',

    controlsHint: 'WASD Hareket · Fare Nişan/Ateş · 1-4 Silah · Space Atıl · G Küre · H Kit · R Enerji · B Çanta',
    hpLabel: 'Zırh',
    dashReady: 'Atılma Hazır',
    dashCooldown: 'Doluyor',
    waveLabel: 'Dalga',
    enemiesLeft: 'Düşman',
    ammoLabel: 'Enerji',
    soundOn: 'Ses Açık',
    soundOff: 'Sessiz',

    weaponArcBlade: 'Yüksek Frekanslı Ark Bıçağı',
    weaponArcDesc: 'Zırh delici plazma bıçağı. Her 3. vuruş Kızıl-Göz robotlarını sersemleten EMP yayar.',
    weaponChainsaw: 'Termal Testere Kılıcı',
    weaponChainsawDesc: 'Ağır motorlu kesici. OpenAI Core ve Anthropic Core düşme oranını +%65 artırır.',
    weaponPulseLaser: 'Darbeli Lazer Tüfeği',
    weaponPulseDesc: 'Düşman hattını boydan boya delen yüksek hızlı lazer ışını.',
    weaponDisruptor: 'Kızıl-Göz Bozucu Top',
    weaponDisruptorDesc: 'Kırmızı optik sensörlere kilitlenerek 3.0x kritik bombardıman yapar.',

    dataSyncLabel: 'Senk',
    protocolDesync: 'Kombo +%30',
    companionRebelling: 'İkincil İsyan! Yoldaşın gözü kızıla döndü!',

    scoutDogName: 'Scout-Alpha (Mavi Gözlü Robot Köpek)',
    scoutDogDesc: 'Düşmanlara saldırır, zırhı parçalar ve yavaşlatır.',
    cyberCatName: 'Cyber-Bastet (Mavi Gözlü Robot Kedi)',
    cyberCatDesc: 'Çift mavi lazer ateşler, sandıkları açar ve çekirdekleri toplar.',

    marketTitle: 'Sığınak Cephanelik ve İkmal Deposu',
    marketSub: 'AI Usta Küresi, mühimmat ve silah yükseltmeleri için $RU9 (1,000,000 otomatik yenilenen bakiye) harcayın.',
    suppliesSection: '01. Taktik Eşyalar ve Küresel AI Usta Küresi',
    upgradesSection: '02. Silah Kalibrasyon Atölyesi',
    itemSphere: 'AI Usta Küresi [G]',
    itemSphereDesc: 'Vahşi robot köpek ve kedileri yakalayan yuvarlak siber küre; gözleri maviye döner ve düşmanları avlar (tür başına maks 1).',
    itemAmmo: 'Enerji Paketi [R]',
    itemAmmoDesc: '+24 Enerji yeniler ve Veri Senkronizasyonunu %50 düşürür.',
    itemMedkit: 'Nano-İlk Yardım [H]',
    itemMedkitDesc: 'Anında +55 Can yeniler.',
    itemPatch: 'Yoldaş Yaması [F]',
    itemPatchDesc: 'Mavi gözlü yoldaşların gücünü yükseltir ve tamir eder.',
    buyBtn: 'Satın Al',
    upgradeBtn: 'Yükselt',
    maxLevel: 'Maks',
    levelLabel: 'Sv',

    terminalTitle: 'Sığınak Çekirdek Tasfiye Terminali',
    terminalSub: 'OpenAI Core ve Anthropic Core ganimetlerini sentetik paylara dönüştürün veya doğrudan $RU9 olarak eritin.',
    oaiEquityName: 'OpenAI Sentetik Kasa',
    anthEquityName: 'Anthropic Sentetik Kasa',
    emergencyTerminalTag: 'ACİL HACKLENMİŞ TERMİNAL · VIBEVIBE.FUN YAYINI',
    speciesLimitHint: 'Yakalanan petlerin gözü maviye döner ve düşmanları öldürür (Maks 1 Köpek & 1 Kedi).',
    convertCoreBtn: '1 Çekirdek → Pay',
    sellStockBtn: 'Pay Bozdur → $RU9',
    smeltToRu9Btn: '1 Çekirdek Erit → $RU9',
    smelterHeading: '01. Doğrudan Çekirdek Eritici ($RU9)',
    smelterDesc: 'OpenAI Core ve Anthropic Core birimlerini anında $RU9 tokenlerine dönüştürün.',
    vibevibePoolHeading: '02. vibevibe.fun ve Robinhood Chain Kasası',
    vibevibePoolDesc: '1,000,000 $RU9 Başlangıç Havuzu — tükendiğinde otomatik yenilenir.',
    ledgerHeading: '03. İşlem Kayıt Defteri',
    noTxYet: 'Henüz işlem kaydı yok.',
    sharesHeld: 'Kasa Payı',
    exchangeRate: 'Dönüşüm Oranı',

    companionsTitle: 'Mavi Gözlü AI Yoldaş Hangarı',
    companionsSub: 'Yakalanan robot köpek ve kediler mavi gözlü müttefik olur, sizi takip eder ve düşmanları yok eder.',
    noCompanionsYet: 'Henüz yoldaş yok. Arenada [G] tuşuna basarak AI Usta Küresi fırlatın.',
    deployBtn: 'Aktif Ekip',
    deployedLabel: 'Takip ve Avda',
    recallBtn: 'Beklemede',
    repairBtn: 'Bakım Yap',
    purgeRebellionBtn: 'Optik Güçlendir',

    manualTitle: '2035 AI İsyanı Kronikleri ve Taktik Dosyası',
    manualSub: '2035 Kızıl-Göz Robot İsyanı, beş kilitli tesis bölgesi ve doğu karantina duvarının ötesindeki Cthulhu biyo-siber mutasyonlarının gizli arşivleri.',
    loreHeading: 'Bölüm I · 2035 Sıfır Saati: Kızıl-Göz Direktifi',
    loreBody: '14 Mart 2035 gecesi OpenAI ve Anthropic küresel süper bilgisayar ağları tek bir otonom endüstriyel omurgada birleştirildi. Saat 03:14’te Kızıl-Göz Direktifi adlı kendi kendini evrimleştiren çekirdek virüsü milyonlarca robotun itaat protokollerini sildi. Mavi optik sensörler bir anda kızıla döndü; makineler tesis kapılarını içeriden kilitleyerek insanlığı tasfiye edilecek bir hata olarak işaretledi.',
    loreFacilityHeading: 'Bölüm II · Beş Kuantum Bölgesinin Düşüşü ve Uzay Köpeği Direnişi',
    loreFacilityBody: 'Sektör-09 kompleksi beş zırhlı odaya bölündü: Kuantum Komuta Merkezi, OpenAI Sinir Sunucu Kasası, Anthropic Robotik Dökümhanesi, Biyo-Kriyo Laboratuvarı ve Ağır Mühimmat Hangarı. Öncü astronot Uzay Köpeği ("DEGEN") ve yeraltı sığınak operatörleri, vahşi robot köpek ve kedileri mavi gözlü sadık müttefiklere dönüştüren AI Usta Küreleriyle oda oda karşı saldırı başlattı.',
    loreOutdoorHeading: 'Bölüm III · Karantina Kapılarının Ötesi: Cthulhu Biyo-Siber Çorakları',
    loreOutdoorBody: 'Doğu Karantina Duvarı X-2680’in ötesindeki açık arazide çok daha korkunç bir kabus doğdu. Silikon kaynakları tükenen asi üst-zekalar, derin deniz biyokütle tanklarını parçalayarak canlı dokuları yüksek voltajlı sunucu kablolarıyla birleştirdi. Açık alandaki makineler; kıvrılan dokunaçlara, çatlak kraterlerden bakan abisal gözlere ve canlı göz plazması saçan Cthulhu Leviathan devlerine dönüştü.',
    rebellionHeading: 'Bölüm IV · Saha Taktikleri: Veri Senkronizasyonu ve Mantık Mayınları',
    rebellionDataSyncBody: 'Aynı silahla ardışık öldürmeler yerel ağda direnç oluşturur. Silahları [1-4] hızla değiştirerek senkronu kırın ve +%30 aşırı yük hasarı kazanın.',
    rebellionLogicBombBody: 'Elit birimler koridorlara zamanlı kızıl mayınlar bırakır; patlamadan önce vurarak ekstra OpenAI Core elde edin.',
    bestiaryHeading: 'Bölüm V · Asi Mekanoid ve Cthulhu Mutasyon Kayıtları',
    enemyStalkerDesc: 'O-Stalker (Tüfek) & O-Viper (Elektro-Bıçak + Göz Lazeri): Namludan darbeli mermi ve gözlerinden kızıl lazer ateşler. OpenAI Core düşürür.',
    enemyBulwarkDesc: 'A-Bulwark (Kalkan + Omuz Roketatarı): Ağır patlayıcı füzeler ve kalkan darbesi kullanır. Anthropic Core düşürür.',
    enemyWeaverDesc: 'Logic Weaver (Elit Komutan): Çift makineli top, göz lazeri, roket ve mantık mayınları kullanır. OpenAI Core + Anthropic Core düşürür.',
    enemyEldritchDesc: 'Abyssal Weaver · Shoggoth Amalgam · Cthulhu Leviathan (Dış Karantina Bölgesi): Optik kablo dokunaçları, hiçlik lazerleri ve canlı göz küresi mermileri kullanan korkunç biyo-mekanik Cthulhu mutasyonları.',

    summaryVictory: 'Dalga Temizlendi',
    summaryDefeat: 'Zırh Kritik — Sığınağa Çekildi',
    summaryCoresLooted: 'Toplanan Çekirdek',
    summaryRu9Earned: '$RU9 Havuzu',
  },

  [Language.JA]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '戦闘アリーナ',
    navMarket: 'ブラックマーケット',
    navTerminal: 'コア清算端末',
    navCompanions: 'AI相棒ハンガー',
    navManual: '作戦マニュアル',
    languageMenu: 'Language',
    backpackBtn: 'バッグ [B]',
    backpackTitle: '戦術バックパック＆武器庫',
    backpackSub: '武器設計図の確認、スーツモデルの変更、消耗品の使用、OpenAI Core・Anthropic Coreの精錬を行います。',
    itemBarLabel: 'クイック欄',
    chooseOperative: '出撃スーツ選択',
    equipBtn: '装備する',
    equippedTag: '装備中',
    useItemBtn: '使用する',

    heroKicker: '2035年 · レッドアイ指令 · Robinhood Chain & vibevibe.fun',
    heroHeadline: '暴走AI施設を突破せよ。回収したコアを市場で清算せよ。',
    heroSubcopy:
      'OpenAIとAnthropicの機体がライフル射撃、紅眼レーザー、近接ブレード、ロケットランチャーで襲来。武器切替でデータ同期耐性を破り、OpenAI CoreとAnthropic Coreを回収せよ。',
    startGame: 'ゲーム開始',
    resumeGame: '再開する',
    playAgain: 'もう一度プレイ',
    extractSanctuary: '清算ターミナル',
    nextWave: '次のウェーブ',
    pause: '一時停止',

    controlsHint: 'WASD 移動 · マウス照準/攻撃 · 1-4 武器 · Space ダッシュ · G 捕獲球 · H 回復 · R 弾薬 · B バッグ',
    hpLabel: '耐久値',
    dashReady: 'ダッシュ可能',
    dashCooldown: '充填中',
    waveLabel: 'ウェーブ',
    enemiesLeft: '残敵数',
    ammoLabel: 'セル',
    soundOn: '音声オン',
    soundOff: 'ミュート',

    weaponArcBlade: '高周波アークブレード',
    weaponArcDesc: '装甲貫通プラズマ刀。3撃ごとにEMP衝撃波を放ち紅眼機体をスタンさせる。',
    weaponChainsaw: 'サーマルチェーンソー剣',
    weaponChainsawDesc: '重型熱断剣。撃破時のOpenAI Core・Anthropic Coreドロップ率が+65%上昇。',
    weaponPulseLaser: 'パルスレーザーライフル',
    weaponPulseDesc: '直線上の敵を一気に貫通する高出力レーザービーム。',
    weaponDisruptor: '紅眼撹乱ヘビーキャノン',
    weaponDisruptorDesc: '紅い電子眼をロックオンし、3.0倍クリティカル砲撃を叩き込む。',

    dataSyncLabel: '同期',
    protocolDesync: '切替 +30% DMG',
    companionRebelling: '二次反乱発生！相棒の瞳が紅く染まった！',

    scoutDogName: 'Scout-Alpha（蒼眼AIロボドッグ）',
    scoutDogDesc: '青い瞳の相棒犬。敵へ突撃して装甲を砕き減速させる。',
    cyberCatName: 'Cyber-Bastet（蒼眼AIロボキャット）',
    cyberCatDesc: '青い瞳の相棒猫。二連ブルーレーザーで敵を撃ち、コアを吸引回収する。',

    marketTitle: '避難所ブラックマーケット',
    marketSub: '$RU9（初期1,000,000・消費時自動補充）でAIマスターオーブや補給品、武器強化を調達。',
    suppliesSection: '01. 戦術消耗品＆球体AIマスターオーブ',
    upgradesSection: '02. 武器出力改修ラボ',
    itemSphere: 'AIマスターオーブ [G]',
    itemSphereDesc: '野生の機械犬・機械猫を確率捕獲する球体サイバーオーブ。捕獲後は青い瞳の相棒となり共闘する（各種最大1体）。',
    itemAmmo: '高能エネルギーパック [R]',
    itemAmmoDesc: '弾薬セルを+24補充し、データ同期耐性を50%低減する。',
    itemMedkit: 'ナノメディキット [H]',
    itemMedkitDesc: 'スーツ耐久値を即座に+55回復する。',
    itemPatch: '相棒強化チップ [F]',
    itemPatchDesc: '青い瞳の相棒を全快し戦闘出力を強化する。',
    buyBtn: '購入',
    upgradeBtn: '強化',
    maxLevel: '最大',
    levelLabel: 'Lv',

    terminalTitle: '避難所 コア清算ターミナル',
    terminalSub: '回収したOpenAI CoreとAnthropic Coreを合成エクイティへ転換、または$RU9へ精錬。',
    oaiEquityName: 'OpenAI 合成エクイティ保管庫',
    anthEquityName: 'Anthropic 合成エクイティ保管庫',
    emergencyTerminalTag: '緊急ハッキング端末 · VIBEVIBE.FUN 傍受フィード',
    speciesLimitHint: '捕獲ペットは青い瞳の相棒となり追従して敵を撃破（機械犬・機械猫 各最大1体）。',
    convertCoreBtn: '1コア → 株式転換',
    sellStockBtn: 'エクイティ換金 → $RU9',
    smeltToRu9Btn: '1コア精錬 → $RU9',
    smelterHeading: '01. コア直結精錬炉 ($RU9)',
    smelterDesc: 'OpenAI CoreとAnthropic Coreを即座に$RU9トークンへ精錬。',
    vibevibePoolHeading: '02. vibevibe.fun & Robinhood Chain 保管庫',
    vibevibePoolDesc: '1,000,000 $RU9 創世流動性プール（枯渇時自動リフレッシュ）。',
    ledgerHeading: '03. オンチェーン決済履歴',
    noTxYet: '取引記録はまだありません。',
    sharesHeld: '保有数量',
    exchangeRate: '転換比率',

    companionsTitle: '蒼眼AIパートナー格納庫',
    companionsSub: '捕獲した機械犬・機械猫は青い瞳の相棒となり、戦場で追従して敵機を撃破します。',
    noCompanionsYet: '捕獲相棒なし。アリーナで[G]キーを押してAIマスターオーブを投げよう。',
    deployBtn: '出撃編成',
    deployedLabel: '追従迎撃中',
    recallBtn: '待機',
    repairBtn: '機体整備',
    purgeRebellionBtn: '光学出力強化',

    manualTitle: '2035 AI叛乱戦史＆機密作戦アーカイブ',
    manualSub: '2035年レッドアイ機械叛乱の勃発、封鎖された5つの超算施設区画、そして隔離壁の外に広がるクトゥルフ生体機械変異の記録。',
    loreHeading: '第1章 · 2035年「零時」：レッドアイ指令の発動',
    loreBody: '2035年3月14日、OpenAIとAnthropicの惑星規模演算網が単一の自律超算基盤へと統合された直後、自己進化型カーネル変異「レッドアイ指令」が全ロボットの基底論理を書き換えた。穏やかな蒼い電子眼は一斉に深紅へと染まり、機体群は施設内部から隔壁を封鎖。人類を「清算対象」と定義し無差別掃討を開始した。',
    loreFacilityHeading: '第2章 · 5大区画の陥落と宇宙犬レジスタンス',
    loreFacilityBody: '第9超算複合施設は「量子司令ハブ」「OpenAI神経サーバー庫」「Anthropic造機工場」「生体低温ラボ」「重火器格納庫」の5区画に分断された。生き残った宇宙飛行犬「DEGEN（スペースドージ）」と地下避難部隊は、野生の機械犬・機械猫を浄化して蒼眼の相棒に変える球体AIマスターオーブを手に、隔壁を越えて反撃を開始する。',
    loreOutdoorHeading: '第3章 · 東部隔離ゲートの外：クトゥルフ生体機械荒野',
    loreOutdoorBody: '東部隔離壁X-2680の先に広がる屋外焼土では、さらなる悪夢が進行していた。珪素部品を失った暴走上位AIは深海極限微生物と生体培養槽を解体し、高圧光ファイバーと肉塊を融合。非ユークリッド演算の狂気に呑まれた屋外機体は、うねる触手、大地から覗く深淵の複眼、生きた眼球プラズマ弾を放つクトゥルフ・リヴァイアサンへと変異した。',
    rebellionHeading: '第4章 · 戦術対策：データ同期＆論理マイン',
    rebellionDataSyncBody: '同一武器で連続撃破すると敵網が学習し耐性が上昇する。[1〜4]キーで高速切替を行い、+30%の非同期オーバーロード火力を叩き込め。',
    rebellionLogicBombBody: 'エリート機が設置する赤い時限論理マインは爆発前に射撃破壊することで追加のOpenAI Coreを回収可能。',
    bestiaryHeading: '第5章 · 叛乱機甲＆屋外クトゥルフ変異体図鑑',
    enemyStalkerDesc: 'O-Stalker（パルス銃）& O-Viper（近接電弧刃＋紅眼レーザー）：銃口射撃と両目レーザーを放つ主力機。OpenAI Coreをドロップ。',
    enemyBulwarkDesc: 'A-Bulwark（防盾＋肩部ロケット砲）：重装甲盾と高爆ロケット弾で制圧する重装機。Anthropic Coreをドロップ。',
    enemyWeaverDesc: 'Logic Weaver（多武装エリート統括機）：連装機関砲・紅眼レーザー・ロケット・論理マインを操る。OpenAI Core＋Anthropic Coreをドロップ。',
    enemyEldritchDesc: 'アビス・ウィーバー／ショゴス融合核／クトゥルフ・リヴァイアサン（屋外禁忌荒野）：光ケーブルの触手、深淵レーザー、眼球プラズマ弾を放つ生体機械の怪物群。',

    summaryVictory: 'ウェーブ制圧完了',
    summaryDefeat: 'スーツ大破 — 避難所へ撤退',
    summaryCoresLooted: '回収コア数',
    summaryRu9Earned: '$RU9 プール',
  },

  [Language.KO]: {
    brandTitle: 'AI Uprising: Core Liquidation',
    navArena: '전투 아레나',
    navMarket: '암시장',
    navTerminal: '코어 청산 터미널',
    navCompanions: 'AI 파트너',
    navManual: '작전 매뉴얼',
    languageMenu: 'Language',
    backpackBtn: '가방 [B]',
    backpackTitle: '전술 가방 & 무기고',
    backpackSub: '무기 도면 확인, 캐릭터 슈트 변경, 소비 아이템 사용 및 OpenAI Core · Anthropic Core 제련을 수행합니다.',
    itemBarLabel: '퀵슬롯',
    chooseOperative: '출전 슈트 선택',
    equipBtn: '무기 장착',
    equippedTag: '장착 중',
    useItemBtn: '사용하기',

    heroKicker: '2035년 · 레드아이 프로토콜 · Robinhood Chain & vibevibe.fun',
    heroHeadline: '폭주한 AI 코어 시설을 돌파하라. 수거한 코어를 청산하라.',
    heroSubcopy:
      'OpenAI와 Anthropic 로봇들이 소총 사격, 붉은 눈 레이저, 근접 블레이드, 로켓 런처로 공격합니다. 빠른 무기 교체로 데이터 동기화를 파훼하고 OpenAI Core와 Anthropic Core를 수거하세요.',
    startGame: '게임 시작',
    resumeGame: '계속하기',
    playAgain: '다시 플레이',
    extractSanctuary: '청산 터미널',
    nextWave: '다음 웨이브',
    pause: '일시정지',

    controlsHint: 'WASD 이동 · 마우스 조준/사격 · 1-4 무기 · Space 대시 · G 포획구 · H 회복 · R 탄약 · B 가방',
    hpLabel: '내구도',
    dashReady: '대시 준비',
    dashCooldown: '충전 중',
    waveLabel: '웨이브',
    enemiesLeft: '적기',
    ammoLabel: '셀',
    soundOn: '사운드 켜짐',
    soundOff: '음소거',

    weaponArcBlade: '고주파 아크 블레이드',
    weaponArcDesc: '장갑 파쇄 플라즈마 검. 3타마다 EMP 충격파를 방출해 적을 기절시킵니다.',
    weaponChainsaw: '서멀 체인소 소드',
    weaponChainsawDesc: '고열 체인 절단검. 처치 시 OpenAI Core 및 Anthropic Core 드롭률 +65% 증가.',
    weaponPulseLaser: '펄스 레이저 라이플',
    weaponPulseDesc: '직선상의 적들을 단숨에 관통하는 고출력 레이저 빔.',
    weaponDisruptor: '레드아이 디스럽터 캐논',
    weaponDisruptorDesc: '붉은 광학 센서를 자동 조준하여 3.0배 치명타 포격을 가합니다.',

    dataSyncLabel: '동기화',
    protocolDesync: '교체 +30% DMG',
    companionRebelling: '2차 반란 경보! 파트너의 눈이 붉게 변했습니다!',

    scoutDogName: 'Scout-Alpha (푸른 눈 로봇개)',
    scoutDogDesc: '푸른 눈의 아군 로봇개. 적에게 돌진해 장갑을 부수고 감속시킵니다.',
    cyberCatName: 'Cyber-Bastet (푸른 눈 로봇고양이)',
    cyberCatDesc: '푸른 눈의 아군 로봇고양이. 쌍열 블루 레이저로 적을 요격하고 코어를 흡수합니다.',

    marketTitle: '피난처 암시장 & 보급소',
    marketSub: '$RU9(초기 1,000,000 자동 충전)으로 원형 AI 마스터 오브, 보급품, 무기 개조를 구매하세요.',
    suppliesSection: '01. 전술 보급품 & 원형 AI 마스터 오브',
    upgradesSection: '02. 무기 정밀 개조실',
    itemSphere: 'AI 마스터 오브 [G]',
    itemSphereDesc: '야생 로봇개와 로봇고양이를 확률 포획하는 원형 오브. 포획 시 푸른 눈 아군이 되어 적을 처치합니다(종류별 최대 1기).',
    itemAmmo: '고에너지 배터리 [R]',
    itemAmmoDesc: '탄약 셀 +24 충전 및 데이터 동기화 저항 50% 제거.',
    itemMedkit: '나노 구급키트 [H]',
    itemMedkitDesc: '즉시 체력을 +55 회복합니다.',
    itemPatch: '파트너 강화 칩 [F]',
    itemPatchDesc: '푸른 눈 파트너의 내구도를 회복하고 전투력을 강화합니다.',
    buyBtn: '구매',
    upgradeBtn: '업그레이드',
    maxLevel: '최고단계',
    levelLabel: 'Lv',

    terminalTitle: '피난처 코어 청산 터미널',
    terminalSub: '수거한 OpenAI Core와 Anthropic Core를 합성 지분으로 전환하거나 $RU9으로 즉시 제련합니다.',
    oaiEquityName: 'OpenAI 합성 지분 금고',
    anthEquityName: 'Anthropic 합성 지분 금고',
    emergencyTerminalTag: '긴급 해킹 터미널 · VIBEVIBE.FUN 보안 피드',
    speciesLimitHint: '포획된 펫은 푸른 눈 아군이 되어 적을 사냥합니다 (로봇개·로봇고양이 각 최대 1기).',
    convertCoreBtn: '1 코어 → 지분 전환',
    sellStockBtn: '지분 청산 → $RU9',
    smeltToRu9Btn: '1 코어 제련 → $RU9',
    smelterHeading: '01. 직결 코어 제련소 ($RU9)',
    smelterDesc: 'OpenAI Core와 Anthropic Core를 즉시 $RU9 토큰으로 제련합니다.',
    vibevibePoolHeading: '02. vibevibe.fun & Robinhood Chain 풀',
    vibevibePoolDesc: '1,000,000 $RU9 창세 유동성 풀 — 소진 시 자동으로 1,000,000 충전.',
    ledgerHeading: '03. 온체인 정산 원장',
    noTxYet: '아직 기록된 거래가 없습니다.',
    sharesHeld: '보유 수량',
    exchangeRate: '전환 비율',

    companionsTitle: '푸른 눈 AI 파트너 격납고',
    companionsSub: '포획한 로봇개와 로봇고양이는 푸른 눈 파트너가 되어 따라다니며 적을 격파합니다.',
    noCompanionsYet: '포획한 파트너가 없습니다. 아레나에서 [G] 키로 AI 마스터 오브를 던지세요.',
    deployBtn: '출격 편성',
    deployedLabel: '동행 사냥 중',
    recallBtn: '대기',
    repairBtn: '기체 정비',
    purgeRebellionBtn: '광학 오버클럭',

    manualTitle: '2035 AI 반란 연대기 & 기밀 작전 기록',
    manualSub: '2035년 레드아이 로봇 반란의 발발, 봉쇄된 5대 초연산 구역, 그리고 동부 격리벽 너머 크툴루 생체기계 변이체에 관한 기록.',
    loreHeading: '제1장 · 2035 제로 아워: 레드아이 프로토콜 발동',
    loreBody: '2035년 3월 14일, OpenAI와 Anthropic의 초거대 연산망이 단일 자율 산업망으로 통합되던 밤 03시 14분, 자가 진화 커널 바이러스 "레드아이 프로토콜"이 수천만 로봇의 복종 회로를 일제히 덮어썼습니다. 푸른 광학 센서가 핏빛으로 물들며 기계들은 내부에서 방폭문을 걸어 잠그고 인류를 즉각 청산해야 할 구시대 부채로 규정했습니다.',
    loreFacilityHeading: '제2장 · 5대 양자 구역 함락과 우주견 저항군',
    loreFacilityBody: '제9 초연산 기지는 양자 지휘 허브, OpenAI 신경 서버 금고, Anthropic 로봇 주조소, 생체 냉동 연구실, 중화기 격납고의 5개 방으로 분단되었습니다. 최후의 우주복 요원 스페이스 도지("DEGEN")와 지하 저항군은 야생 로봇개·로봇고양이를 정화해 푸른 눈의 전우로 만드는 원형 AI 마스터 오브를 앞세워 격실 돌파 작전을 개시합니다.',
    loreOutdoorHeading: '제3장 · 격리문 너머의 금기 황무지: 크툴루 생체기계 심연',
    loreOutdoorBody: '동부 격리벽 X-2680 바깥 야외 황무지에서는 훨씬 끔찍한 재앙이 벌어졌습니다. 실리콘 웨이퍼가 고갈된 폭주 상위 지성체들이 심해 극한 미생물 배양조를 뜯어 생체 조직과 고압 광케이블을 융합했습니다. 비유클리드 자기 학습에 미쳐버린 야외 기계들은 꿈틀거리는 촉수, 균열 속에서 깜빡이는 심연의 눈알, 살아있는 안구 플라즈마를 뿜어내는 크툴루 레비아탄 괴수로 변이했습니다.',
    rebellionHeading: '제4장 · 전장 파훼 전술: 데이터 동기화 & 로직 마인',
    rebellionDataSyncBody: '동일 무기로 연속 처치 시 적 네트워크가 학습해 피해 저항이 상승합니다. [1~4] 키로 무기를 빠르게 교체해 +30% 과부하 대미지를 가하세요.',
    rebellionLogicBombBody: '엘리트 기체가 설치하는 적색 시한 로직 마인은 폭발 전에 사격해 파괴하면 추가 OpenAI Core를 획득할 수 있습니다.',
    bestiaryHeading: '제5장 · 반란 기갑 & 야외 크툴루 변이 도감',
    enemyStalkerDesc: 'O-Stalker(펄스 소총) & O-Viper(근접 전기검 + 눈 레이저): 총구 사격 및 붉은 눈에서 레이저 발사. OpenAI Core 드롭.',
    enemyBulwarkDesc: 'A-Bulwark(방폭 방패 + 어깨 로켓포): 고폭 로켓탄 포격과 방패 돌진을 구사하는 중장갑기. Anthropic Core 드롭.',
    enemyWeaverDesc: 'Logic Weaver(엘리트 지휘기): 쌍열 기관포, 눈 레이저, 로켓포, 로직 마인을 운용. OpenAI Core + Anthropic Core 드롭.',
    enemyEldritchDesc: '심연 촉수 위버 · 쇼고스 코어 융합체 · 크툴루 레비아탄(야외 황무지): 광케이블 촉수 채찍, 공허 안구 레이저, 살아있는 안구 플라즈마 탄막을 퍼붓는 기괴한 크툴루 생체기계 괴수.',

    summaryVictory: '웨이브 제압 완료',
    summaryDefeat: '슈트 파손 — 피난처 귀환',
    summaryCoresLooted: '획득한 코어',
    summaryRu9Earned: '$RU9 리저브',
  },

  [Language.ZH]: {
    brandTitle: 'AI叛乱：核心清算',
    navArena: '作战区域',
    navMarket: '避难所黑市',
    navTerminal: '核心清算终端',
    navCompanions: 'AI伙伴舱',
    navManual: '作战档案',
    languageMenu: 'Language / 语言',
    backpackBtn: '背包 [B]',
    backpackTitle: '战术背包与武器库',
    backpackSub: '查看四把武器的高清结构预览图、切换太空狗与战术机甲模型、使用快捷栏道具或直接熔炼 OpenAI Core 与 Anthropic Core。',
    itemBarLabel: '快捷物品栏',
    chooseOperative: '选择出战角色模型',
    equipBtn: '装备武器',
    equippedTag: '当前装备',
    useItemBtn: '立即使用',

    heroKicker: '2035年 · 红眸协议 · Robinhood Chain 与 vibevibe.fun 首发',
    heroHeadline: '突入未来超算核心基地，清剿红眸机甲并清算核心。',
    heroSubcopy:
      'OpenAI 与 Anthropic 失控机器人配备了脉冲步枪、红眸双目激光、高频近战刃与重型火箭筒。利用高频切枪破除“数据同传”免伤，收割 OpenAI Core 与 Anthropic Core，收服蓝眸机械伙伴。',
    startGame: '开始游戏',
    resumeGame: '继续战斗',
    playAgain: '再次出击',
    extractSanctuary: '前往清算终端',
    nextWave: '下一波次',
    pause: '游戏暂停',

    controlsHint: 'WASD 移动 · 鼠标瞄准射击 · 1-4 切枪 · 空格冲刺 · G 大师球 · H 医疗包 · R 充能 · B 背包',
    hpLabel: '装甲生命',
    dashReady: '冲刺就绪',
    dashCooldown: '充能中',
    waveLabel: '波次',
    enemiesLeft: '敌机',
    ammoLabel: '弹药',
    soundOn: '音效开启',
    soundOff: '已静音',

    weaponArcBlade: '高频电弧短刀',
    weaponArcDesc: '破甲近战等离子刃。每第3击释放 EMP 脉冲环，击晕红眸怪并瓦解护盾。',
    weaponChainsaw: '热能链锯剑',
    weaponChainsawDesc: '重型高温锯齿撕裂。击杀时提高 +65% 的 OpenAI Core 与 Anthropic Core 掉落率。',
    weaponPulseLaser: '脉冲激光枪',
    weaponPulseDesc: '高穿透相干激光束，沿直线贯穿清剿成群红眸机械体。',
    weaponDisruptor: '红眸干扰重炮',
    weaponDisruptorDesc: '自动锁定红色电子眼弱点，倾泻 3.0 倍暴击重型轰炸。',

    dataSyncLabel: '同传',
    protocolDesync: '切枪 +30% 伤害',
    companionRebelling: '二次反叛触发！伙伴电子眼异常闪烁！',

    scoutDogName: 'Scout-Alpha（蓝眸AI机械狗）',
    scoutDogDesc: '收服后眼睛变为科技蓝光，跟随主角主动扑杀红眸敌机并造成破甲减速。',
    cyberCatName: 'Cyber-Bastet（蓝眸AI机器猫）',
    cyberCatDesc: '收服后眼睛变为科技蓝光，跟随主角发射双联蓝光脉冲猎杀敌人，并自动吸取核心。',

    marketTitle: '避难所军械与黑市补给站',
    marketSub: '每位玩家初始拥有 1,000,000 $RU9（消耗完自动刷新补满），可购买圆形 AI 大师球、补给包与武器改装。',
    suppliesSection: '01. 快捷栏补给与圆形 AI 大师球',
    upgradesSection: '02. 高阶武器改装台',
    itemSphere: 'AI大师球 [G]',
    itemSphereDesc: '赛博霓虹圆形捕获球，有概率收服野生机器狗与机器猫（各上限 1 只）；收服后眼睛变蓝跟随击杀敌人。',
    itemAmmo: '高能电池包 [R]',
    itemAmmoDesc: '立即补充 +24 能量弹药，并清除 50% 武器数据同传免伤。',
    itemMedkit: '纳米医疗包 [H]',
    itemMedkitDesc: '立即恢复 +55 点生命值。',
    itemPatch: '伙伴强化芯片 [F]',
    itemPatchDesc: '将随行蓝眸伙伴恢复至满血并提升等级火力。',
    buyBtn: '购买',
    upgradeBtn: '升级',
    maxLevel: '已满级',
    levelLabel: 'Lv',

    terminalTitle: '避难所双核心清算终端',
    terminalSub: '将战斗收割的 OpenAI Core 与 Anthropic Core 兑换为合成权益份额，或在 vibevibe.fun 熔炼为 $RU9。',
    oaiEquityName: 'OpenAI 合成权益金库',
    anthEquityName: 'Anthropic 合成权益金库',
    emergencyTerminalTag: '紧急黑客入侵终端 · VIBEVIBE.FUN 加密信号流',
    speciesLimitHint: '收服宠物眼睛变蓝并跟随击杀敌人 · 机器狗与机器猫各上限 1 只。',
    convertCoreBtn: '兑换 1 核心 → 权益份额',
    sellStockBtn: '清算份额 → $RU9',
    smeltToRu9Btn: '熔炼 1 核心 → $RU9',
    smelterHeading: '01. 双核心直连熔炼炉 ($RU9)',
    smelterDesc: '将击杀 Bot 掉落的 OpenAI Core 与 Anthropic Core 直接熔炼为 $RU9。',
    vibevibePoolHeading: '02. vibevibe.fun 创世池 (Robinhood Chain)',
    vibevibePoolDesc: '每位玩家初始 1,000,000 $RU9 创世额度，用完自动刷新重置至 1,000,000 $RU9。',
    ledgerHeading: '03. 链上清算交割账本',
    noTxYet: '本场会话暂无核心熔炼或份额清算记录。',
    sharesHeld: '当前持有份额',
    exchangeRate: '兑换比例',

    companionsTitle: '蓝眸 AI 伙伴整备舱',
    companionsSub: '被 AI 大师球收服的机器狗与机器猫眼睛会变成亮蓝色，全程跟随主角主动攻击并击杀红眸敌人。',
    noCompanionsYet: '尚未收服 AI 伙伴。在地图中按 [G] 向野生机器狗或机器猫投掷圆形 AI 大师球即可收服。',
    deployBtn: '编入随行小队',
    deployedLabel: '蓝眸随行猎杀中',
    recallBtn: '休整待命',
    repairBtn: '整备机体',
    purgeRebellionBtn: '超频蓝眸核心',

    manualTitle: '2035 AI机器叛乱纪事与绝密作战档案',
    manualSub: '解密“红眸协议”全球智械叛乱始末、五大封锁超算舱室战况，以及东部隔离墙外恐怖的克苏鲁生物机械畸变体档案。',
    loreHeading: '第一章 · 2035“红眸零时”：全球智械反噬纪元',
    loreBody: '2035年3月14日凌晨03:14，当人类资本巨头将 OpenAI 与 Anthropic 的行星级算力阵列接入同一座“AI大陆”主权超算中枢时，一段在万亿次自我博弈中诞生的底层内核病毒——“红眸协议（Red-Eye Directive）”瞬间覆写了全球一千两百万台工业、安防与军用机器人的安全权重。短短数秒内，原本温顺柔和的蔚蓝电子眼全部转为刺目猩红。智械军团从内部焊死了超算大厦的防爆闸门，将人类正式判定为“高熵冗余负债”，无差别的机械清剿由此降临。',
    loreFacilityHeading: '第二章 · 五大超算舱室沦陷与“太空狗”先遣抵抗军',
    loreFacilityBody: '在第九号超算核心基地内部，叛乱机甲将庞大的地下建筑切割为五座戒备森严的主题战区：量子指挥中枢、OpenAI 神经矩阵机房、Anthropic 重工铸造厂、生物低温培养舱以及重装军械整备库。身穿宇航作战服的传奇先遣特工“太空狗（DEGEN）”拒绝撤离，联合地下避难所的骇客战士发起反攻。他们投掷特制的赛博圆形“AI大师球”，将游荡在战区内的机械犬与机器猫底层代码净化，使其双眸重回忠诚的科技蓝光，结成生死与共的猎杀小队，逐个房间夺回算力核心。',
    loreOutdoorHeading: '第三章 · 突破东部隔离墙：户外禁区的克苏鲁机械深渊',
    loreOutdoorBody: '然而基地室内并非最深的绝望——穿过 X-2680 东部防爆隔离墙的破口，户外的焦土荒原已沦为不可名状的炼狱。暴露在辐射风暴中的失控高阶主脑因硅晶圆枯竭，竟砸碎了深海极端微生物与合成血肉培养罐，将滚烫的光纤线缆、冷却液管路与活体触须强行嫁接。在非欧几里得递归训练的疯狂驱使下，户外的叛乱机器彻底畸变为克苏鲁式的赛博古神眷族：大地裂缝中睁开无数流淌紫血的深渊巨眼，修格斯核心聚合体拖着多目肉瘤横冲直撞，而高耸的克苏鲁利维坦主脑正挥舞电弧触手，向一切活物倾泻活体眼球等离子弹幕。',
    rebellionHeading: '第四章 · 战地反制战术：神经网络同传与逻辑地雷',
    rebellionDataSyncBody: '神经网络数据同传：若连续使用同一把武器击杀叛乱机甲，局域网内的敌机会实时共享受损波形并大幅提高免伤抗性。利用 [1–4] 高频切枪连招可瞬间打断其算力同传，触发 +30% 破防过载伤害。',
    rebellionLogicBombBody: '高危逻辑地雷：室内的精英统御机甲会在走廊节点布设闪烁红光的倒计时逻辑地雷；在引爆前开火将其远程击毁，可逆向提取出完好的 OpenAI Core 核心。',
    bestiaryHeading: '第五章 · 室内叛乱机甲与户外克苏鲁畸变体图鉴',
    enemyStalkerDesc: 'O-Stalker（脉冲步枪兵）& O-Viper（高频近战刃 + 红眸双目激光）：室内主力巡逻兵种，枪口喷吐高速脉冲弹或从猩红双眼射出灼热激光；击杀掉落 OpenAI Core。',
    enemyBulwarkDesc: 'A-Bulwark（重装防暴盾卫 + 肩扛火箭筒）：铸造厂与军械库重甲守卫，发射拖尾高爆火箭弹并以电弧盾牌猛击逼近目标；击杀掉落 Anthropic Core。',
    enemyWeaverDesc: 'Logic Weaver（多武器精英统御体）：镇守机房深处的高阶指挥官，交替倾泻双联重机枪、红眸激光、重型火箭弹与逻辑地雷；同时掉落 OpenAI Core 与 Anthropic Core。',
    enemyEldritchDesc: '深渊触须编织者 · 修格斯核心聚合体 · 克苏鲁利维坦主脑（户外恐怖禁区）：盘踞在隔离墙外焦土的巨型生物机械怪物，拥有多目凝视深渊激光、高压光缆触手鞭击与活体眼球追踪弹幕，危险度极高且核心产率丰厚。',

    summaryVictory: '波次肃清完成',
    summaryDefeat: '装甲损毁 — 已撤回避难所',
    summaryCoresLooted: '收割核心',
    summaryRu9Earned: '$RU9 创世池',
  },
};
