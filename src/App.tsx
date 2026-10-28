import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Backpack, ChevronDown, Globe } from 'lucide-react';
import { BackpackModal } from './components/BackpackModal';
import { CombatArena } from './components/CombatArena';
import { EquityTerminalView } from './components/EquityTerminalView';
import { ItemPreviewArt } from './components/GameIllustrations';
import { BlackMarketView, CompanionsView, FieldManualView } from './components/SanctuaryPanels';
import { ASSET_URLS, preloadAllGameSprites } from './game/assetLoader';
import { soundFX } from './game/sound';
import { LANGUAGE_LABELS, TRANSLATIONS } from './i18n/translations';
import {
  ActiveTab,
  ChainTransaction,
  CompanionKind,
  EquityTicker,
  Language,
  PlayerPortfolio,
  PlayerSkinId,
  WeaponId,
} from './types/game';

const STORAGE_KEY = 'ai_uprising_core_liquidation_v5';
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
  ru9: INITIAL_RU9,
  oCores: 2,
  aCores: 2,
  oaiShares: 0,
  anthShares: 0,
  masterSpheres: 5,
  ammoCells: 64,
  energyPacks: 2,
  medkits: 2,
  firmwarePatches: 2,
  weaponLevels: {
    [WeaponId.ARC_BLADE]: 1,
    [WeaponId.CHAINSAW_SWORD]: 1,
    [WeaponId.PULSE_LASER]: 1,
    [WeaponId.DISRUPTOR_CANNON]: 1,
  },
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

export default function App() {
  const [lang, setLang] = useState<Language>(Language.EN);
  const [activeTab, setActiveTab] = useState<ActiveTab>(ActiveTab.ARENA);
  const [backpackOpen, setBackpackOpen] = useState<boolean>(false);
  const [langMenuOpen, setLangMenuOpen] = useState<boolean>(false);
  const langMenuRef = useRef<HTMLDivElement | null>(null);

  const [portfolio, setPortfolio] = useState<PlayerPortfolio>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        return {
          ...DEFAULT_PORTFOLIO,
          ...parsed,
          ru9: typeof parsed.ru9 === 'number' && parsed.ru9 > 0 ? parsed.ru9 : INITIAL_RU9,
          weaponLevels: {
            ...DEFAULT_PORTFOLIO.weaponLevels,
            ...(parsed.weaponLevels || {}),
          },
        };
      }
    } catch {
      // Ignore storage parse failure
    }
    return DEFAULT_PORTFOLIO;
  });

  const [tickers, setTickers] = useState<EquityTicker[]>([
    {
      symbol: 'OpenAI',
      nameKey: 'oaiEquityName',
      coreType: 'oCore',
      priceRu9: 84.2,
      coreToShareRatio: 0.48,
      change24h: 5.14,
      history: [76.5, 78.2, 77.4, 80.1, 81.9, 80.8, 82.7, 84.2],
    },
    {
      symbol: 'Anthropic',
      nameKey: 'anthEquityName',
      coreType: 'aCore',
      priceRu9: 96.5,
      coreToShareRatio: 0.52,
      change24h: 3.46,
      history: [90.4, 91.8, 91.0, 93.2, 94.7, 94.1, 95.3, 96.5],
    },
  ]);

  useEffect(() => {
    preloadAllGameSprites();
  }, []);

  // Guarantee $RU9 automatically refreshes back to 1,000,000 if it ever reaches 0
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

  // Close Language dropdown on outside click
  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (langMenuRef.current && !langMenuRef.current.contains(e.target as Node)) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // Global [B] shortcut when outside Arena (Arena handles its own [B] + auto-pause)
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

  // Live synthetic stock fluctuation for OpenAI and Anthropic
  useEffect(() => {
    const id = window.setInterval(() => {
      setTickers((prev) =>
        prev.map((tk) => {
          const drift = (Math.random() - 0.48) * 2.6;
          const nextPrice = Math.max(28, Number((tk.priceRu9 + drift).toFixed(2)));
          const base = tk.history[0] || nextPrice;
          const nextChange = Number((((nextPrice - base) / base) * 100).toFixed(2));
          const nextRatio = Number(Math.max(0.28, Math.min(0.85, 38 / nextPrice)).toFixed(2));
          return {
            ...tk,
            priceRu9: nextPrice,
            change24h: nextChange,
            coreToShareRatio: nextRatio,
            history: [...tk.history.slice(-11), nextPrice],
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

  // Enforce strict Max 1 Robo-Dog and Max 1 Robo-Cat in roster!
  const handleCompanionCaptured = useCallback((kind: CompanionKind) => {
    setPortfolio((prev) => {
      if (prev.companions.some((c) => c.kind === kind)) {
        return prev;
      }
      const newComp = {
        id: `comp-${kind}-${Date.now()}`,
        kind,
        nickname: kind === CompanionKind.SCOUT_DOG ? 'Scout-Alpha' : 'Cyber-Bastet',
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

  const handleUpgradeWeapon = useCallback(
    (weapon: WeaponId) => {
      setPortfolio((prev) => {
        const lvl = prev.weaponLevels[weapon] || 1;
        if (lvl >= 5) return prev;
        const ru9Cost = 25000 * lvl;
        const coreCost = lvl;
        const needsOCore = weapon === WeaponId.ARC_BLADE || weapon === WeaponId.PULSE_LASER;
        const coreAvailable = needsOCore ? prev.oCores : prev.aCores;
        if (coreAvailable < coreCost) return prev;

        const { nextRu9 } = spendWithAutoRefill(prev.ru9, ru9Cost);
        soundFX.playCaptureResult(true);
        const tx = appendTx(
          'ARMORY UPGRADE',
          `${weapon} → Tier ${lvl + 1}`,
          `-${ru9Cost.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: nextRu9,
          oCores: needsOCore ? prev.oCores - coreCost : prev.oCores,
          aCores: !needsOCore ? prev.aCores - coreCost : prev.aCores,
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

  const handleConvertCoreToStock = useCallback(
    (symbol: 'OpenAI' | 'Anthropic') => {
      const tk = tickers.find((x) => x.symbol === symbol);
      if (!tk) return;
      const isOai = symbol === 'OpenAI';

      setPortfolio((prev) => {
        if (isOai && prev.oCores < 1) return prev;
        if (!isOai && prev.aCores < 1) return prev;
        soundFX.playLootPickup(true);
        const tx = appendTx(
          'MINT EQUITY',
          `1 ${isOai ? 'OpenAI Core' : 'Anthropic Core'} → ${tk.coreToShareRatio.toFixed(2)} ${symbol}`,
          `+${tk.coreToShareRatio.toFixed(2)} ${symbol}`,
          'Robinhood Chain'
        );
        return {
          ...prev,
          oCores: isOai ? prev.oCores - 1 : prev.oCores,
          aCores: !isOai ? prev.aCores - 1 : prev.aCores,
          oaiShares: isOai ? prev.oaiShares + tk.coreToShareRatio : prev.oaiShares,
          anthShares: !isOai ? prev.anthShares + tk.coreToShareRatio : prev.anthShares,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx, tickers]
  );

  const handleSellStockForRu9 = useCallback(
    (symbol: 'OpenAI' | 'Anthropic') => {
      const tk = tickers.find((x) => x.symbol === symbol);
      if (!tk) return;
      const isOai = symbol === 'OpenAI';

      setPortfolio((prev) => {
        const held = isOai ? prev.oaiShares : prev.anthShares;
        if (held < 0.25) return prev;
        const sellAmt = Math.min(1, held);
        const payout = Number((sellAmt * tk.priceRu9 * 100).toFixed(0));
        soundFX.playLootPickup(true);
        const tx = appendTx(
          'LIQUIDATE EQUITY',
          `Liquidated ${sellAmt.toFixed(2)} ${symbol}`,
          `+${payout.toLocaleString()} $RU9`,
          'Robinhood Chain'
        );
        return {
          ...prev,
          ru9: prev.ru9 + payout,
          oaiShares: isOai ? Math.max(0, prev.oaiShares - sellAmt) : prev.oaiShares,
          anthShares: !isOai ? Math.max(0, prev.anthShares - sellAmt) : prev.anthShares,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx, tickers]
  );

  const handleSmeltCoreToRu9 = useCallback(
    (coreType: 'oCore' | 'aCore') => {
      const yieldRu9 = coreType === 'oCore' ? 5000 : 6500;
      setPortfolio((prev) => {
        if (coreType === 'oCore' && prev.oCores < 1) return prev;
        if (coreType === 'aCore' && prev.aCores < 1) return prev;
        soundFX.playLootPickup(true);
        const tx = appendTx(
          'CORE SMELT',
          `1 ${coreType === 'oCore' ? 'OpenAI Core' : 'Anthropic Core'} smelted`,
          `+${yieldRu9.toLocaleString()} $RU9`,
          'vibevibe.fun'
        );
        return {
          ...prev,
          ru9: prev.ru9 + yieldRu9,
          oCores: coreType === 'oCore' ? prev.oCores - 1 : prev.oCores,
          aCores: coreType === 'aCore' ? prev.aCores - 1 : prev.aCores,
          txHistory: [tx, ...prev.txHistory.slice(0, 19)],
        };
      });
    },
    [appendTx]
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

  return (
    <div className="min-h-dvh bg-[#06080f] text-slate-100 flex flex-col">
      {/* PRIMARY COMPACT 3-ZONE TOP HEADER */}
      <header className="h-11 border-b border-slate-800/90 bg-[#090c15] px-3 lg:px-5 flex items-center justify-between gap-3 z-30">
        <div className="flex items-center gap-2.5 min-w-0">
          <img
            src={ASSET_URLS.VIBEVIBE_LOGO}
            alt="vibe/vibe"
            referrerPolicy="no-referrer"
            className="h-6 w-auto rounded bg-black px-1.5 py-0.5 object-contain border border-slate-800 shrink-0"
          />
          <span
            className="text-base sm:text-lg font-bold tracking-tight text-white truncate"
            style={{ fontFamily: "'Barlow Condensed', sans-serif" }}
          >
            {t.brandTitle}
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-5">
          {navItems.map((item) => {
            const active = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`py-2.5 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setBackpackOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-semibold text-slate-100 transition-colors whitespace-nowrap"
          >
            <Backpack className="w-3.5 h-3.5 text-[#d9ff00]" />
            <span>{t.backpackBtn}</span>
          </button>
        </div>
      </header>

      {/* COMPACT TOP HUD SUB-BAR ($RU9, OpenAI Core, Anthropic Core + Language Menu — NO Stock Price Ticker) */}
      <div className="min-h-9 border-b border-slate-800/80 bg-[#0b0f1a] px-3 lg:px-5 py-1 flex flex-wrap items-center justify-between gap-2.5 z-20">
        <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-xs font-mono tabular-nums">
          <div className="flex items-center gap-1.5">
            <ItemPreviewArt kind="ru9" className="w-5 h-5 shrink-0" />
            <span className="text-slate-400">$RU9</span>
            <strong className="text-amber-400 text-xs sm:text-sm">
              {Math.round(portfolio.ru9).toLocaleString()}
            </strong>
          </div>

          <span className="text-slate-800">·</span>

          <div className="flex items-center gap-1.5">
            <ItemPreviewArt kind="oCore" className="w-5 h-5 shrink-0" />
            <span className="text-slate-300">OpenAI Core</span>
            <strong className="text-white text-xs sm:text-sm">{portfolio.oCores}</strong>
          </div>

          <span className="text-slate-800">·</span>

          <div className="flex items-center gap-1.5">
            <ItemPreviewArt kind="aCore" className="w-5 h-5 shrink-0" />
            <span className="text-slate-300">Anthropic Core</span>
            <strong className="text-cyan-400 text-xs sm:text-sm">{portfolio.aCores}</strong>
          </div>
        </div>

        {/* Mobile Nav Switcher + Compact Language Dropdown Menu */}
        <div className="flex items-center gap-2.5 ml-auto">
          <div className="flex md:hidden items-center gap-1 overflow-x-auto">
            {navItems.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`px-2 py-1 text-xs rounded ${
                  activeTab === item.id ? 'bg-rose-600 text-white' : 'text-slate-400'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div ref={langMenuRef} className="relative">
            <button
              type="button"
              onClick={() => setLangMenuOpen((v) => !v)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#111624] hover:bg-[#171e30] border border-slate-700/90 text-xs font-medium text-slate-200 transition-colors"
            >
              <Globe className="w-3.5 h-3.5 text-slate-400" />
              <span>
                {t.languageMenu}: {LANGUAGE_LABELS[lang]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {langMenuOpen && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-lg bg-[#0e1320] border border-slate-700 shadow-xl py-1 z-50">
                {(Object.keys(LANGUAGE_LABELS) as Language[]).map((code) => {
                  const selected = code === lang;
                  return (
                    <button
                      key={code}
                      type="button"
                      onClick={() => {
                        setLang(code);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full px-3.5 py-2 text-left text-xs flex items-center justify-between transition-colors ${
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
        </div>
      </div>

      {/* MAIN VIEWPORT */}
      <main className="flex-1 w-full">
        {activeTab === ActiveTab.ARENA && (
          <CombatArena
            t={t}
            portfolio={portfolio}
            isBackpackOpen={backpackOpen}
            onOpenBackpack={() => setBackpackOpen(true)}
            onSelectSkin={(skin) => setPortfolio((p) => ({ ...p, selectedSkin: skin }))}
            onSelectWeapon={(weapon) => setPortfolio((p) => ({ ...p, equippedWeapon: weapon }))}
            onUpgradeWeapon={handleUpgradeWeapon}
            onBuySupply={handleBuySupply}
            onLootCollected={handleLootCollected}
            onCompanionCaptured={handleCompanionCaptured}
            onCompanionStateSync={handleCompanionStateSync}
            onExtractToSanctuary={() => setActiveTab(ActiveTab.TERMINAL)}
          />
        )}

        {activeTab === ActiveTab.MARKET && (
          <div className="px-4 lg:px-8">
            <BlackMarketView
              t={t}
              portfolio={portfolio}
              onBuySupply={handleBuySupply}
              onUpgradeWeapon={handleUpgradeWeapon}
              onSelectWeapon={(weapon) => setPortfolio((p) => ({ ...p, equippedWeapon: weapon }))}
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
              onSellStockForRu9={handleSellStockForRu9}
              onSmeltCoreToRu9={handleSmeltCoreToRu9}
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
          onSelectWeapon={(weapon) => setPortfolio((p) => ({ ...p, equippedWeapon: weapon }))}
          onUseConsumable={handleBackpackConsumable}
          onSmeltCore={handleSmeltCoreToRu9}
          onDeployCompanion={(id) => setPortfolio((p) => ({ ...p, activeCompanionId: id }))}
        />
      )}
    </div>
  );
}
