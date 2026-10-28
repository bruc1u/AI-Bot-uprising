import React from 'react';
import { ArrowUpCircle, Check } from 'lucide-react';
import { ASSET_URLS } from '../game/assetLoader';
import { TranslationStrings } from '../i18n/translations';
import { CompanionKind, PlayerPortfolio, WeaponId } from '../types/game';
import { ItemPreviewArt, WeaponPreviewArt } from './GameIllustrations';

interface BlackMarketProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  onBuySupply: (item: 'sphere' | 'ammo' | 'medkit' | 'patch') => void;
  onUpgradeWeapon: (weapon: WeaponId) => void;
  onSelectWeapon: (weapon: WeaponId) => void;
}

export const BlackMarketView: React.FC<BlackMarketProps> = ({
  t,
  portfolio,
  onBuySupply,
  onUpgradeWeapon,
  onSelectWeapon,
}) => {
  const supplies = [
    {
      key: 'sphere' as const,
      title: t.itemSphere,
      desc: t.itemSphereDesc,
      costRu9: 2500,
      owned: portfolio.masterSpheres,
    },
    {
      key: 'ammo' as const,
      title: t.itemAmmo,
      desc: t.itemAmmoDesc,
      costRu9: 1200,
      owned: portfolio.energyPacks,
    },
    {
      key: 'medkit' as const,
      title: t.itemMedkit,
      desc: t.itemMedkitDesc,
      costRu9: 1800,
      owned: portfolio.medkits,
    },
    {
      key: 'patch' as const,
      title: t.itemPatch,
      desc: t.itemPatchDesc,
      costRu9: 2000,
      owned: portfolio.firmwarePatches,
    },
  ];

  const weapons = [
    {
      id: WeaponId.ARC_BLADE,
      name: t.weaponArcBlade,
      desc: t.weaponArcDesc,
      coreLabel: 'OpenAI Core',
      coreKey: 'oCores' as const,
    },
    {
      id: WeaponId.CHAINSAW_SWORD,
      name: t.weaponChainsaw,
      desc: t.weaponChainsawDesc,
      coreLabel: 'Anthropic Core',
      coreKey: 'aCores' as const,
    },
    {
      id: WeaponId.PULSE_LASER,
      name: t.weaponPulseLaser,
      desc: t.weaponPulseDesc,
      coreLabel: 'OpenAI Core',
      coreKey: 'oCores' as const,
    },
    {
      id: WeaponId.DISRUPTOR_CANNON,
      name: t.weaponDisruptor,
      desc: t.weaponDisruptorDesc,
      coreLabel: 'Anthropic Core',
      coreKey: 'aCores' as const,
    },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-10">
      <div className="pb-6 border-b border-zinc-800/80">
        <p className="text-xs text-zinc-400 mb-1.5">
          Sanctuary Quartermaster · 1,000,000 $RU9 Auto-Refresh Protocol
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
          {t.marketTitle}
        </h1>
        <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.marketSub}</p>
      </div>

      {/* Field Supplies */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-white">{t.suppliesSection}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {supplies.map((item) => (
            <div
              key={item.key}
              className="bg-[#111520] border border-zinc-800/90 rounded-xl p-5 flex flex-col justify-between gap-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="w-12 h-12 rounded-lg bg-[#090b12] border border-zinc-800 flex items-center justify-center">
                    <ItemPreviewArt kind={item.key} className="w-9 h-9" />
                  </div>
                  <span className="text-xs font-mono tabular-nums text-zinc-400">
                    x{item.owned}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{item.desc}</p>
              </div>

              <button
                type="button"
                onClick={() => onBuySupply(item.key)}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors tabular-nums"
              >
                {t.buyBtn} · {item.costRu9.toLocaleString()} $RU9
              </button>
            </div>
          ))}
        </div>
      </section>

      {/* Weapon Schematics & Upgrades */}
      <section className="space-y-4 pt-2">
        <h2 className="text-xl font-bold text-white">{t.upgradesSection}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {weapons.map((w) => {
            const lvl = portfolio.weaponLevels[w.id] || 1;
            const isMax = lvl >= 5;
            const isEquipped = portfolio.equippedWeapon === w.id;
            const ru9Cost = 25000 * lvl;
            const coreCost = lvl;
            const hasCores = portfolio[w.coreKey] >= coreCost;

            return (
              <div
                key={w.id}
                className="bg-[#111520] border border-zinc-800/90 rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-mono tabular-nums text-zinc-400 mb-2">
                    <span>
                      {t.levelLabel} {lvl} / 5 · +{Math.round((lvl - 1) * 22)}% DMG
                    </span>
                    <span className="text-zinc-300">{w.coreLabel} Calibration</span>
                  </div>

                  {/* Weapon Schematic Illustration */}
                  <div className="w-full h-24 rounded-lg bg-[#090b12] border border-zinc-800/80 flex items-center justify-center px-6 mb-4">
                    <WeaponPreviewArt weapon={w.id} className="w-full h-20" />
                  </div>

                  <h3 className="text-lg font-bold text-white">{w.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{w.desc}</p>
                </div>

                <div className="flex items-center gap-2.5">
                  <button
                    type="button"
                    onClick={() => onSelectWeapon(w.id)}
                    className={`py-2.5 px-4 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                      isEquipped
                        ? 'bg-emerald-950/50 border-emerald-500/60 text-emerald-300'
                        : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                    }`}
                  >
                    {isEquipped && <Check className="w-3.5 h-3.5" />}
                    {isEquipped ? t.equippedTag : t.equipBtn}
                  </button>

                  <button
                    type="button"
                    disabled={isMax || !hasCores}
                    onClick={() => onUpgradeWeapon(w.id)}
                    className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-45 border border-zinc-700 text-zinc-100 transition-colors whitespace-nowrap tabular-nums"
                  >
                    {isMax
                      ? t.maxLevel
                      : `${t.upgradeBtn} · ${ru9Cost.toLocaleString()} $RU9 + ${coreCost} ${w.coreLabel}`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

interface CompanionsViewProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  onDeployCompanion: (id: string | null) => void;
  onRepairCompanion: (id: string, purgeRebellion: boolean) => void;
}

export const CompanionsView: React.FC<CompanionsViewProps> = ({
  t,
  portfolio,
  onRepairCompanion,
}) => {
  const ownsDog = portfolio.companions.some((c) => c.kind === CompanionKind.SCOUT_DOG);
  const ownsCat = portfolio.companions.some((c) => c.kind === CompanionKind.CYBER_CAT);

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-sky-400 mb-1.5">{t.speciesLimitHint}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.companionsTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.companionsSub}</p>
        </div>
        <div className="text-xs font-mono tabular-nums text-zinc-300 space-y-1">
          <div>
            Blue-Eye Robo-Dog:{' '}
            <strong className={ownsDog ? 'text-sky-400' : 'text-zinc-500'}>
              {ownsDog ? '1 / 1 ALLIED' : '0 / 1'}
            </strong>
          </div>
          <div>
            Blue-Eye Robo-Cat:{' '}
            <strong className={ownsCat ? 'text-sky-400' : 'text-zinc-500'}>
              {ownsCat ? '1 / 1 ALLIED' : '0 / 1'}
            </strong>
          </div>
        </div>
      </div>

      {portfolio.companions.length === 0 ? (
        <div className="bg-[#111520] border border-zinc-800/90 rounded-xl p-8 space-y-6">
          <p className="text-sm text-zinc-300 max-w-xl">{t.noCompanionsYet}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#090b12] border border-zinc-800/80">
              <ItemPreviewArt kind="roboDog" className="w-16 h-16 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">{t.scoutDogName}</h3>
                <p className="text-xs text-zinc-400 mt-1">{t.scoutDogDesc}</p>
              </div>
            </div>
            <div className="flex items-center gap-4 p-4 rounded-lg bg-[#090b12] border border-zinc-800/80">
              <ItemPreviewArt kind="roboCat" className="w-16 h-16 shrink-0" />
              <div>
                <h3 className="text-sm font-bold text-white">{t.cyberCatName}</h3>
                <p className="text-xs text-zinc-400 mt-1">{t.cyberCatDesc}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {portfolio.companions.map((comp) => {
            const isDog = comp.kind === CompanionKind.SCOUT_DOG;
            const isMaxLv = comp.level >= 5;

            return (
              <div
                key={comp.id}
                className="bg-[#111520] border border-sky-500/40 rounded-xl p-6 flex flex-col justify-between gap-5"
              >
                <div className="flex items-start gap-4">
                  <ItemPreviewArt
                    kind={isDog ? 'roboDog' : 'roboCat'}
                    className="w-20 h-20 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-sky-400 mb-1">
                      <span>BLUE-EYE PARTNER · Lv.{comp.level}/5</span>
                      <span className="text-emerald-400 font-semibold">{t.deployedLabel}</span>
                    </div>

                    <h2 className="text-lg font-bold text-white truncate">
                      {comp.nickname} · {isDog ? t.scoutDogName : t.cyberCatName}
                    </h2>
                    <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                      {isDog ? t.scoutDogDesc : t.cyberCatDesc}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <button
                    type="button"
                    disabled={isMaxLv}
                    onClick={() => onRepairCompanion(comp.id, false)}
                    className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                  >
                    <ArrowUpCircle className="w-4 h-4" />
                    {isMaxLv
                      ? t.maxLevel
                      : `${t.upgradeBtn} Partner Combat (15,000 $RU9)`}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export const FieldManualView: React.FC<{ t: TranslationStrings }> = ({ t }) => {
  const bestiary = [
    { img: ASSET_URLS.VIBER_42, desc: t.enemyStalkerDesc },
    { img: ASSET_URLS.VIBER_71, desc: t.enemyBulwarkDesc },
    { img: ASSET_URLS.VIBER_103, desc: t.enemyWeaverDesc },
  ];

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-rose-400 tracking-wider uppercase mb-1.5">
            DECLASSIFIED ARCHIVE // YEAR 2035 · RED-EYE UPRISING
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.manualTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">{t.manualSub}</p>
        </div>
        <div className="flex items-center gap-3 bg-[#101522] border border-zinc-800 rounded-xl px-3.5 py-2.5 shrink-0">
          <img
            src={ASSET_URLS.SPACE_DOGE_R_IDLE}
            alt="Space Doge Vanguard"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-contain bg-[#090d16] border border-zinc-800"
          />
          <div className="text-xs">
            <div className="font-mono text-[#d9ff00] font-semibold">VANGUARD FILE #01</div>
            <div className="text-zinc-300 font-medium">Space Doge · DEGEN</div>
          </div>
        </div>
      </div>

      {/* Multi-Chapter AI Uprising Story Chronicle */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <article className="bg-[#0e1320] border border-zinc-800/90 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-rose-400 font-semibold tracking-wider">
              ARCHIVE LOG // 2035.03.14 — 03:14 UTC
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreHeading}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{t.loreBody}</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/70 text-[11px] font-mono text-zinc-500">
            STATUS: GLOBAL CONTAINMENT LOST
          </div>
        </article>

        <article className="bg-[#0e1320] border border-cyan-900/50 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
              SECTOR-09 // 5 INDOOR QUANTUM CHAMBERS
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreFacilityHeading}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{t.loreFacilityBody}</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/70 text-[11px] font-mono text-cyan-400/80">
            ROOMS: HUB · VAULT · FOUNDRY · CRYO · HANGAR
          </div>
        </article>

        <article className="bg-[#140d1d] border border-fuchsia-800/60 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-fuchsia-400 font-semibold tracking-wider">
              BEYOND GATE X-2680 // BIO-CYBER ABYSS
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreOutdoorHeading}</h2>
            <p className="text-sm text-zinc-200/90 leading-relaxed">{t.loreOutdoorBody}</p>
          </div>
          <div className="pt-3 border-t border-fuchsia-900/50 text-[11px] font-mono text-fuchsia-300/90">
            THREAT LEVEL: NON-EUCLIDEAN // EXTREME
          </div>
        </article>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-4 border-t border-zinc-800/80">
        <div className="md:col-span-5 space-y-4">
          <h2 className="text-xl font-bold text-white">{t.rebellionHeading}</h2>
          <div className="p-4 rounded-xl bg-[#111520] border border-zinc-800/90 space-y-3">
            <p className="text-sm text-zinc-300 leading-relaxed">{t.rebellionDataSyncBody}</p>
            <div className="h-px bg-zinc-800/80" />
            <p className="text-sm text-zinc-300 leading-relaxed">{t.rebellionLogicBombBody}</p>
          </div>
        </div>

        <div className="md:col-span-7 space-y-4">
          <h2 className="text-xl font-bold text-white">{t.bestiaryHeading}</h2>
          <div className="space-y-3">
            {bestiary.map((b, idx) => (
              <div
                key={idx}
                className="flex items-center gap-3.5 p-3 rounded-lg bg-[#111520] border border-zinc-800/80"
              >
                <img
                  src={b.img}
                  alt="Red-Eye Unit"
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-contain bg-[#090d16] p-1 shrink-0 border border-zinc-800"
                />
                <p className="text-xs text-zinc-300 leading-relaxed">{b.desc}</p>
              </div>
            ))}

            {/* Outdoor Cthulhu Bio-Cyber Mutant Signature Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#170e24] border border-fuchsia-700/60">
              <div className="w-14 h-14 rounded-lg bg-[#0d0616] border border-fuchsia-600/50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 56 56" className="w-12 h-12">
                  <path
                    d="M28 10 C18 10 12 18 13 27 C14 34 10 41 6 45 M28 10 C38 10 44 18 43 27 C42 34 46 41 50 45 M20 32 C18 39 15 45 13 50 M36 32 C38 39 41 45 43 50 M28 33 L28 51"
                    stroke="#a855f7"
                    strokeWidth="3.2"
                    strokeLinecap="round"
                    fill="none"
                  />
                  <ellipse cx="28" cy="23" rx="13" ry="10" fill="#2e1065" stroke="#e879f9" strokeWidth="1.6" />
                  <ellipse cx="28" cy="23" rx="6.5" ry="4.5" fill="#ff1744" />
                  <ellipse cx="28" cy="23" rx="1.6" ry="3.8" fill="#09030f" />
                  <circle cx="19" cy="18" r="2.1" fill="#fb7185" />
                  <circle cx="37" cy="18" r="2.1" fill="#fb7185" />
                </svg>
              </div>
              <p className="text-xs text-fuchsia-100/90 leading-relaxed">{t.enemyEldritchDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

