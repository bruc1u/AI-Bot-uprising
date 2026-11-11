import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Backpack, ChevronDown, Globe } from 'lucide-react';
import { BackpackModal } from './components/BackpackModal';
import { CombatArena } from './components/CombatArena';
import { EquityTerminalView } from './components/EquityTerminalView';
import { ItemPreviewArt } from './components/GameIllustrations';
import { BlackMarketView, CompanionsView, FieldManualView } from './components/SanctuaryPanels';
import { ASSET_URLS, preloadAllGameSprites } from './game/assetLoader';
import {
  ARMOR_CATALOG_CONFIG,
  DEFAULT_ARMOR_LEVELS,
  DEFAULT_WEAPON_LEVELS,
  getArmorUpgradeCostRu9,
  getWeaponUpgradeCostRu9,
  STARTER_WEAPON_IDS,
  WEAPON_CATALOG_CONFIG,
} from './game/equipmentConfig';
import { soundFX } from './game/sound';
import { LANGUAGE_LABELS, TRANSLATIONS } from './i18n/translations';
import {
  ActiveTab,
  ArmorId,
  ChainTransaction,
  CompanionKind,
  EquityTicker,
  Language,
  PlayerPortfolio,
  PlayerSkinId,
  WeaponId,
} from './types/game';

const STORAGE_KEY = 'ai_uprising_core_liquidation_v6';
export const INITIAL_RU9 = 1_000_000;

function spendWithAutoRefill(currentRu9: number, cost: number): { nextRu9: number; refreshed: boolean } {
  if (currentRu9 <= cost) {
    return { nextRu9: INITIAL_RU9, refreshed: true };
  }
  const rem = currentRu9 - cost;
  return rem <= 0 ? { nextRu9: INITIAL_RU9, refreshed: true } : { nextRu9: rem, refreshed: false };
}

const DEFAULT_PORTFOLIO: PlayerPortfolio = {
  selectedSkin: PlayerSkinId.DEGEN_ASTRO,
  equippedWeapon: WeaponId.PULSE_LASER,
  equippedArmor: ArmorId.EVA_STANDARD_SUIT,
  ownedWeapons: [...STARTER_WEAPON_IDS],
  ownedArmors: [ArmorId.EVA_STANDARD_SUIT],
  ru9: INITIAL_RU9,
  oCores: 3,
  aCores: 3,
  oaiShares: 0,
  anthShares: 0,
  masterSpheres: 5,
  ammoCells: 64,
  energyPacks: 2,
  medkits: 2,
  firmwarePatches: 2,
  weaponLevels: { ...DEFAULT_WEAPON_LEVELS },
  armorLevels: { ...DEFAULT_ARMOR_LEVELS },
  companions: [],
  activeCompanionId: null,
  highestWave: 1,
  totalKills: 0,
  txHistory: [],
};

function makeTxHash(): string {
  const chars = '0123456789abcdef';
  let out = '0x';
  for (let i = 0; i < 8; i++) out += chars[Math.floor(Math.random() * chars.length)];
  out += '...';
  for (let i = 0; i < 4; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

const LANG_STORAGE_KEY = 'ai_uprising_lang_pref';

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(LANG_STORAGE_KEY);
      if (saved && Object.values(Language).includes(saved as Language)) {
        return saved as Language;
      }
    } catch {
      // ignore
    }
    return Language.EN; // Default to English upon entering as requested!
  });
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ARENA);
  const [backpackOpen, setBackpackOpen] = useState<boolean>(false);
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const [arenaPlaying, setArenaPlaying] = useState<boolean>(false);
  const [forceShowTopBar, setForceShowTopBar] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const handleSelectLanguage = useCallback((newLang: Language) => {
    setLang(newLang);
    try {
      localStorage.setItem(LANG_STORAGE_KEY, newLang);
    } catch {
      // ignore
    }
  }, []);

  const handleToggleTopBar = useCallback(() => {
    setForceShowTopBar((prev) => !prev);
  }, []);

  const handlePlayingStateChange = useCallback((playing: boolean) => {
    setArenaPlaying(playing);
  }, []);

  const [portfolio, setPortfolio] = useState<PlayerPortfolio>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const mergedOwnedWeapons = Array.from(
          new Set([...STARTER_WEAPON_IDS, ...(Array.isArray(parsed.ownedWeapons) ? parsed.ownedWeapons : [])])
        ) as WeaponId[];
        const mergedOwnedArmors = Array.from(
          new Set([ArmorId.EVA_STANDARD_SUIT, ...(Array.isArray(parsed.ownedArmors) ? parsed.ownedArmors : [])])
        ) as ArmorId[];

        return {
          ...DEFAULT_PORTFOLIO,
          ...parsed,
          ownedWeapons: mergedOwnedWeapons,
          ownedArmors: mergedOwnedArmors,
          equippedArmor: parsed.equippedArmor || ArmorId.EVA_STANDARD_SUIT,
          ru9: typeof parsed.ru9 === 'number' && parsed.ru9 > 0 ? parsed.ru9 : INITIAL_RU9,
          weaponLevels: {
            ...DEFAULT_WEAPON_LEVELS,
            ...(parsed.weaponLevels || {}),
          },
          armorLevels: {
            ...DEFAULT_ARMOR_LEVELS,
            ...(parsed.armorLevels || {}),
          },
        };
      }
    } catch {
      // Ignore storage parse failure
    }
    return DEFAULT_PORTFOLIO;
  });

  // Tokenized Stock Oracle Tickers ($OPENAI & $ANTH — strictly independent of $RU9!)
  const [tickers, setTickers] = useState<EquityTicker[]>([
    {
      symbol: 'OpenAI',
      tokenTicker: '$OPENAI',
      nameKey: 'oaiEquityName',
      coreType: 'oCore',
      navUsd: 168.4,
      coreToShareRatio: 0.5,
      change24h: 5.14,
      history: [158.2, 160.5, 159.4, 162.8, 165.1, 164.0, 166.9, 168.4],
    },
    {
      symbol: 'Anthropic',
      tokenTicker: '$ANTH',
      nameKey: 'anthEquityName',
      coreType: 'aCore',
      navUsd: 142.8,
      coreToShareRatio: 0.55,
      change24h: 3.46,
      history: [136.4, 138.0, 137.2, 139.5, 140.9, 140.1, 141.6, 142.8],
    },
  ]);

  useEffect(() => {
    preloadAllGameSprites();
  }, []);

  useEffect(() => {
    if (portfolio.ru9 <= 0) {
      setPortfolio((prev) => ({ ...prev, ru9: INITIAL_RU9 }));
    }
  }, [portfolio.ru9]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(portfolio));
    } catch {
      // Ignore quota errors
    }
  }, [portfolio]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (activeTab !== ActiveTab.ARENA && e.code === 'KeyB') {
        e.preventDefault();
        setBackpackOpen((prev) => !prev);
      } else if (e.code === 'Escape' && backpackOpen) {
        setBackpackOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [activeTab, backpackOpen]);

  // Live Oracle Reference NAV fluctuation for $OPENAI and $ANTH Tokenized Stocks
  useEffect(() => {
    const id = window.setInterval(() => {
      setTickers((prev) =>
        prev.map((tk) => {
          const drift = (Math.random() - 0.48) * 2.8;
          const nextNav = Math.max(45, Number((tk.navUsd + drift).toFixed(2)));
          const base = tk.history[0] || nextNav;
          const nextChange = Number((((nextNav - base) / base) * 100).toFixed(2));
          const nextRatio = Number(Math.max(0.32, Math.min(0.85, 82 / nextNav)).toFixed(2));
          return {
            ...tk,
            navUsd: nextNav,
            change24h: nextChange,
            coreToShareRatio: nextRatio,
            history: [...tk.history.slice(-11), nextNav],
          };
        })
      );
    }, 3400);
    return () => window.clearInterval(id);
  }, []);

  const appendTx = useCallback(
    (
      action: string,
      detail: string,
      amountLabel: string,
      platform: 'Robinhood Chain' | 'vibevibe.fun'
    ): ChainTransaction => ({
      id: `tx-${Date.now()}-${Math.random()}`,
      hash: makeTxHash(),
      timestamp: new Date().toLocaleTimeString(),
      action,
      detail,
      amountLabel,
      platform,
    }),
    []
  );

  const handleLootCollected = useCallback(
    (delta: {
      ru9?: number;
      oCores?: number;
      aCores?: number;
      ammoCells?: number;
      masterSpheres?: number;
      medkits?: number;
      energyPacks?: number;
      firmwarePatches?: number;
      kills?: number;
      waveReached?: number;
    }) => {
      setPortfolio((prev) => {
        const rawRu9 = prev.ru9 + (delta.ru9 || 0);
        return {
          ...prev,
          ru9: rawRu9 <= 0 ? INITIAL_RU9 : rawRu9,
          oCores: Math.max(0, prev.oCores + (delta.oCores || 0)),
          aCores: Math.max(0, prev.aCores + (delta.aCores || 0)),
          ammoCells: Math.max(0, prev.ammoCells + (delta.ammoCells || 0)),
          masterSpheres: Math.max(0, prev.masterSpheres + (delta.masterSpheres || 0)),
          medkits: Math.max(0, prev.medkits + (delta.medkits || 0)),
          energyPacks: Math.max(0, prev.energyPacks + (delta.energyPacks || 0)),
          firmwarePatches: Math.max(0, prev.firmwarePatches + (delta.firmwarePatches || 0)),
          totalKills: prev.totalKills + (delta.kills || 0),
          highestWave: Math.max(prev.highestWave, delta.waveReached || prev.highestWave),
        };
      });
    },
    []
  );

  const handleCompanionCaptured = useCallback((kind: CompanionKind) => {
    setPortfolio((prev) => {
      if (prev.companions.some((c) => c.kind === kind)) {
        return prev;
      }
      const nicknameMap: Record<CompanionKind, string> = {
        [CompanionKind.SCOUT_DOG]: 'Scout-Alpha',
        [CompanionKind.CYBER_CAT]: 'Cyber-Bastet',
        [CompanionKind.PUMPKIN_SPIRIT]: 'Jack-Pup',
        [CompanionKind.NIGHT_BAT]: 'Nosferatu-Bit',
      };
      const newComp = {
        id: `comp-${kind}-${Date.now()}`,
        kind,
        nickname: nicknameMap[kind] || 'Cyber-Pet',
        hp: 120,
        maxHp: 120,
        rebelling: false,
        level: 1,
      };
      return {
        ...prev,
        companions: [...prev.companions, newComp],
        activeCompanionId: prev.activeCompanionId || newComp.id,
      };
    });
  }, []);

  const handleToggleHalloweenHat = useCallback((forceValue?: boolean) => {
    setPortfolio((prev) => {
      const nextVal = typeof forceValue === 'boolean' ? forceValue : !prev.halloweenHat;
      soundFX.playHalloweenChime(true);
      return { ...prev, halloweenHat: nextVal };
    });
  }, []);

  const handleCompanionStateSync = useCallback((id: string, hp: number, rebelling: boolean) => {
    setPortfolio((prev) => ({
      ...prev,
      companions: prev.companions.map((c) => (c.id === id ? { ...c, hp, rebelling } : c)),
    }));
  }, []);

  const handleBuySupply = useCallback((item: 'sphere' | 'ammo' | 'medkit' | 'patch') => {
    const costMap = { sphere: 2500, ammo: 1200, medkit: 1800, patch: 2000 };
    const cost = costMap[item];
    setPortfolio((prev) => {
      const { nextRu9 } = spendWithAutoRefill(prev.ru9, cost);
      soundFX.playLootPickup(true);
      return {
        ...prev,
        ru9: nextRu9,
        masterSpheres: prev.masterSpheres + (item === 'sphere' ? 1 : 0),
        energyPacks: prev.energyPacks + (item === 'ammo' ? 1 : 0),
        medkits: prev.medkits + (item === 'medkit' ? 1 : 0),
        firmwarePatches: prev.firmwarePatches + (item === 'patch' ? 1 : 0),
      };
    });
  }, []);

  // Buy Weapon strictly with $RU9
  const handleBuyWeapon = useCallback(
    (weapon: WeaponId) => {
      const cfg = WEAPON_CATALOG_CONFIG.find((w) => w.id === weapon);
      if (!cfg) return;
      setPortfolio((prev) => {
        if (prev.ownedWeapons.includes(weapon)) return prev;
        const { nextRu9 } = spendWithAutoRefill(prev.ru9, cfg.buyCostRu9);
        soundFX.playCaptureResult(true);
        const tx = appendTx(
          'BUY WEAPON',
          `Unlocked ${weapon}`,
          `-${cfg.buyCostRu9.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: nextRu9,
          ownedWeapons: [...prev.ownedWeapons, weapon],
          equippedWeapon: weapon,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx]
  );

  // Upgrade Weapon strictly with $RU9 (ZERO Core requirement!)
  const handleUpgradeWeapon = useCallback(
    (weapon: WeaponId) => {
      setPortfolio((prev) => {
        if (!prev.ownedWeapons.includes(weapon)) return prev;
        const lvl = prev.weaponLevels[weapon] || 1;
        if (lvl >= 5) return prev;
        const ru9Cost = getWeaponUpgradeCostRu9(weapon, lvl);

        const { nextRu9 } = spendWithAutoRefill(prev.ru9, ru9Cost);
        soundFX.playCaptureResult(true);
        const tx = appendTx(
          'UPGRADE WEAPON',
          `${weapon} → Lv.${lvl + 1}`,
          `-${ru9Cost.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: nextRu9,
          weaponLevels: {
            ...prev.weaponLevels,
            [weapon]: lvl + 1,
          },
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx]
  );

  // Buy Exo-Armor strictly with $RU9
  const handleBuyArmor = useCallback(
    (armor: ArmorId) => {
      const cfg = ARMOR_CATALOG_CONFIG.find((a) => a.id === armor);
      if (!cfg) return;
      setPortfolio((prev) => {
        if (prev.ownedArmors.includes(armor)) return prev;
        const { nextRu9 } = spendWithAutoRefill(prev.ru9, cfg.buyCostRu9);
        soundFX.playCaptureResult(true);
        const tx = appendTx(
          'BUY EXO-ARMOR',
          `Unlocked ${armor}`,
          `-${cfg.buyCostRu9.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: nextRu9,
          ownedArmors: [...prev.ownedArmors, armor],
          equippedArmor: armor,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx]
  );

  const handleSelectArmor = useCallback((armor: ArmorId) => {
    setPortfolio((prev) => {
      if (!prev.ownedArmors.includes(armor)) return prev;
      soundFX.playLootPickup(true);
      return { ...prev, equippedArmor: armor };
    });
  }, []);

  // Upgrade Exo-Armor strictly with $RU9 (ZERO Core requirement!)
  const handleUpgradeArmor = useCallback(
    (armor: ArmorId) => {
      setPortfolio((prev) => {
        if (!prev.ownedArmors.includes(armor)) return prev;
        const lvl = prev.armorLevels[armor] || 1;
        if (lvl >= 5) return prev;
        const ru9Cost = getArmorUpgradeCostRu9(armor, lvl);
        const { nextRu9 } = spendWithAutoRefill(prev.ru9, ru9Cost);
        soundFX.playCaptureResult(true);
        const tx = appendTx(
          'UPGRADE ARMOR',
          `${armor} → Lv.${lvl + 1}`,
          `-${ru9Cost.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: nextRu9,
          armorLevels: {
            ...prev.armorLevels,
            [armor]: lvl + 1,
          },
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx]
  );

  // Redeem OpenAI Core / Anthropic Core EXCLUSIVELY into $OPENAI / $ANTH Tokenized Stocks
  const handleConvertCoreToStock = useCallback(
    (symbol: 'OpenAI' | 'Anthropic', mode: 'one' | 'all' = 'one') => {
      const tk = tickers.find((x) => x.symbol === symbol);
      if (!tk) return;
      const isOai = symbol === 'OpenAI';

      setPortfolio((prev) => {
        const available = isOai ? prev.oCores : prev.aCores;
        if (available < 1) return prev;
        const count = mode === 'all' ? available : 1;
        const mintedTokens = Number((count * tk.coreToShareRatio).toFixed(4));
        soundFX.playLootPickup(true);
        const tx = appendTx(
          'MINT TOKENIZED STOCK',
          `${count} ${isOai ? 'OpenAI Core' : 'Anthropic Core'} → ${mintedTokens.toFixed(2)} ${tk.tokenTicker}`,
          `+${mintedTokens.toFixed(2)} ${tk.tokenTicker}`,
          'Robinhood Chain'
        );
        return {
          ...prev,
          oCores: isOai ? prev.oCores - count : prev.oCores,
          aCores: !isOai ? prev.aCores - count : prev.aCores,
          oaiShares: isOai ? prev.oaiShares + mintedTokens : prev.oaiShares,
          anthShares: !isOai ? prev.anthShares + mintedTokens : prev.anthShares,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx, tickers]
  );

  const handleRepairCompanion = useCallback((id: string, _purgeRebellion: boolean) => {
    const cost = 15000;
    setPortfolio((prev) => {
      const { nextRu9 } = spendWithAutoRefill(prev.ru9, cost);
      soundFX.playCaptureResult(true);
      return {
        ...prev,
        ru9: nextRu9,
        companions: prev.companions.map((c) =>
          c.id === id
            ? { ...c, hp: c.maxHp, rebelling: false, level: Math.min(5, c.level + 1) }
            : c
        ),
      };
    });
  }, []);

  const handleBackpackConsumable = useCallback((kind: 'medkit' | 'ammo' | 'patch') => {
    setPortfolio((prev) => {
      if (kind === 'medkit' && prev.medkits > 0) {
        soundFX.playLootPickup(true);
        return { ...prev, medkits: prev.medkits - 1 };
      }
      if (kind === 'ammo' && prev.energyPacks > 0) {
        soundFX.playLootPickup(true);
        return { ...prev, energyPacks: prev.energyPacks - 1, ammoCells: prev.ammoCells + 24 };
      }
      if (kind === 'patch' && prev.firmwarePatches > 0 && prev.companions.length > 0) {
        soundFX.playCaptureResult(true);
        return {
          ...prev,
          firmwarePatches: prev.firmwarePatches - 1,
          companions: prev.companions.map((c) => ({
            ...c,
            hp: c.maxHp,
            rebelling: false,
            level: Math.min(5, c.level + 1),
          })),
        };
      }
      return prev;
    });
  }, []);

  const t = TRANSLATIONS[lang];

  const navItems: { id: ActiveTab; label: string }[] = [
    { id: ActiveTab.ARENA, label: t.navArena },
    { id: ActiveTab.MARKET, label: t.navMarket },
    { id: ActiveTab.TERMINAL, label: t.navTerminal },
    { id: ActiveTab.COMPANIONS, label: t.navCompanions },
    { id: ActiveTab.MANUAL, label: t.navManual },
  ];

  const topBarHidden = activeTab === ActiveTab.ARENA && arenaPlaying && !forceShowTopBar;

  return (
    <div className="min-h-dvh bg-[#06080f] text-slate-100 flex flex-col">
      {/* SINGLE COMPACT 40px TOP BAR */}
      {!topBarHidden && (
        <header className="h-10 border-b border-slate-800/90 bg-[#090c15] px-2.5 lg:px-4 flex items-center justify-between gap-2 z-[100] relative">
          <div className="flex items-center gap-2 shrink-0">
            <img
              src={ASSET_URLS.VIBEVIBE_LOGO}
              alt="vibe/vibe"
              referrerPolicy="no-referrer"
              className="h-5 w-auto rounded bg-black px-1 py-0.5 object-contain border border-slate-800 shrink-0"
            />
            <span
              className="hidden xl:inline text-base font-bold tracking-tight text-white whitespace-nowrap"
              style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
            >
              {t.brandTitle}
            </span>
          </div>

          <nav className="flex items-center gap-1 sm:gap-3.5 overflow-x-auto">
            {navItems.map((item) => {
              const active = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`py-2 px-1.5 text-[11px] sm:text-xs font-semibold border-b-2 transition-colors whitespace-nowrap shrink-0 ${
                    active
                      ? 'border-rose-500 text-white'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2 text-[11px] font-mono tabular-nums">
              <span className="inline-flex items-center gap-1" title={t.ru9Desc}>
                <ItemPreviewArt kind="ru9" className="w-4 h-4 shrink-0" />
                <span className="hidden lg:inline text-slate-400">$RU9</span>
                <strong className="text-amber-400">
                  {Math.round(portfolio.ru9).toLocaleString()}
                </strong>
              </span>
              <span className="text-slate-700">·</span>
              <span className="inline-flex items-center gap-1" title={t.oCoreDesc}>
                <ItemPreviewArt kind="oCore" className="w-4 h-4 shrink-0" />
                <strong className="text-white">{portfolio.oCores}</strong>
              </span>
              <span className="inline-flex items-center gap-1" title={t.aCoreDesc}>
                <ItemPreviewArt kind="aCore" className="w-4 h-4 shrink-0" />
                <strong className="text-cyan-400">{portfolio.aCores}</strong>
              </span>
              {(portfolio.oaiShares > 0 || portfolio.anthShares > 0) && (
                <>
                  <span className="text-slate-700">·</span>
                  <span className="hidden xl:inline-flex items-center gap-1.5 text-emerald-400">
                    <span>$OPENAI {portfolio.oaiShares.toFixed(1)}</span>
                    <span className="text-slate-600">/</span>
                    <span className="text-sky-400">$ANTH {portfolio.anthShares.toFixed(1)}</span>
                  </span>
                </>
              )}
            </div>

            <div ref={langMenuRef} className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen((v) => !v)}
                className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-[#111624] hover:bg-[#171e30] border border-slate-700/90 text-[11px] font-medium text-slate-200 transition-colors whitespace-nowrap"
              >
                <Globe className="w-3 h-3 text-slate-400" />
                <span className="uppercase font-mono">{lang}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-1 w-40 rounded-lg bg-[#0e1320] border border-slate-700 shadow-2xl py-1 z-[120]">
                  {(Object.keys(LANGUAGE_LABELS) as Language[]).map((code) => {
                    const selected = code === lang;
                    return (
                      <button
                        key={code}
                        type="button"
                        onClick={() => {
                          handleSelectLanguage(code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full px-3 py-1.5 text-left text-xs flex items-center justify-between transition-colors ${
                          selected
                            ? 'bg-rose-600/20 text-white font-semibold'
                            : 'text-slate-300 hover:bg-slate-800/80'
                        }`}
                      >
                        <span>{LANGUAGE_LABELS[code]}</span>
                        <span className="font-mono uppercase text-[10px] text-slate-400">{code}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setBackpackOpen(true)}
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-800 border border-slate-700 text-[11px] font-semibold text-slate-100 transition-colors whitespace-nowrap"
            >
              <Backpack className="w-3.5 h-3.5 text-[#d9ff00]" />
              <span className="hidden sm:inline">{t.backpackBtn}</span>
            </button>
          </div>
        </header>
      )}

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full">
        {activeTab === ActiveTab.ARENA && (
          <CombatArena
            t={t}
            lang={lang}
            onSelectLanguage={handleSelectLanguage}
            portfolio={portfolio}
            isBackpackOpen={backpackOpen}
            topBarHidden={topBarHidden}
            onToggleTopBar={handleToggleTopBar}
            onPlayingStateChange={handlePlayingStateChange}
            onOpenBackpack={() => setBackpackOpen(true)}
            onSelectSkin={(skin) => setPortfolio((p) => ({ ...p, selectedSkin: skin }))}
            onSelectWeapon={(weapon) =>
              setPortfolio((p) =>
                p.ownedWeapons.includes(weapon) ? { ...p, equippedWeapon: weapon } : p
              )
            }
            onUpgradeWeapon={handleUpgradeWeapon}
            onBuySupply={handleBuySupply}
            onLootCollected={handleLootCollected}
            onCompanionCaptured={handleCompanionCaptured}
            onCompanionStateSync={handleCompanionStateSync}
            onToggleHalloweenHat={handleToggleHalloweenHat}
            onExtractToSanctuary={() => setActiveTab(ActiveTab.TERMINAL)}
          />
        )}

        {activeTab === ActiveTab.MARKET && (
          <div className="px-4 lg:px-8">
            <BlackMarketView
              t={t}
              portfolio={portfolio}
              onBuySupply={handleBuySupply}
              onBuyWeapon={handleBuyWeapon}
              onUpgradeWeapon={handleUpgradeWeapon}
              onSelectWeapon={(weapon) =>
                setPortfolio((p) =>
                  p.ownedWeapons.includes(weapon) ? { ...p, equippedWeapon: weapon } : p
                )
              }
              onBuyArmor={handleBuyArmor}
              onUpgradeArmor={handleUpgradeArmor}
              onSelectArmor={handleSelectArmor}
            />
          </div>
        )}

        {activeTab === ActiveTab.TERMINAL && (
          <div className="px-4 lg:px-8">
            <EquityTerminalView
              t={t}
              portfolio={portfolio}
              tickers={tickers}
              onConvertCoreToStock={handleConvertCoreToStock}
            />
          </div>
        )}

        {activeTab === ActiveTab.COMPANIONS && (
          <div className="px-4 lg:px-8">
            <CompanionsView
              t={t}
              portfolio={portfolio}
              onDeployCompanion={(id) => setPortfolio((p) => ({ ...p, activeCompanionId: id }))}
              onRepairCompanion={handleRepairCompanion}
            />
          </div>
        )}

        {activeTab === ActiveTab.MANUAL && (
          <div className="px-4 lg:px-8">
            <FieldManualView t={t} />
          </div>
        )}
      </main>

      {/* RPG TACTICAL BACKPACK MODAL [B] */}
      {backpackOpen && (
        <BackpackModal
          t={t}
          portfolio={portfolio}
          onClose={() => setBackpackOpen(false)}
          onSelectSkin={(skin) => setPortfolio((p) => ({ ...p, selectedSkin: skin }))}
          onSelectWeapon={(weapon) =>
            setPortfolio((p) =>
              p.ownedWeapons.includes(weapon) ? { ...p, equippedWeapon: weapon } : p
            )
          }
          onBuyWeapon={handleBuyWeapon}
          onUpgradeWeapon={handleUpgradeWeapon}
          onSelectArmor={handleSelectArmor}
          onBuyArmor={handleBuyArmor}
          onUpgradeArmor={handleUpgradeArmor}
          onBuySupply={handleBuySupply}
          onUseConsumable={handleBackpackConsumable}
          onDeployCompanion={(id) => setPortfolio((p) => ({ ...p, activeCompanionId: id }))}
          onToggleHalloweenHat={() => handleToggleHalloweenHat()}
          onOpenTerminal={() => setActiveTab(ActiveTab.TERMINAL)}
        />
      )}
    </div>
  );
}
