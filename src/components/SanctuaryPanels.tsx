import React, { useState } from 'react';
import { ArrowUpCircle, Check, Lock, Shield, ShoppingCart } from 'lucide-react';
import { ASSET_URLS } from '../game/assetLoader';
import {
  ARMOR_CATALOG_CONFIG,
  computeArmorStats,
  getArmorUpgradeCostRu9,
  getWeaponUpgradeCostRu9,
  WEAPON_CATALOG_CONFIG,
} from '../game/equipmentConfig';
import { TranslationStrings } from '../i18n/translations';
import { ArmorId, CompanionKind, PlayerPortfolio, WeaponId } from '../types/game';
import {
  ArmorPreviewArt,
  getCompanionIconKind,
  ItemPreviewArt,
  WeaponPreviewArt,
} from './GameIllustrations';

interface BlackMarketProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  onBuySupply: (item: 'sphere' | 'ammo' | 'medkit' | 'patch') => void;
  onBuyWeapon: (weapon: WeaponId) => void;
  onUpgradeWeapon: (weapon: WeaponId) => void;
  onSelectWeapon: (weapon: WeaponId) => void;
  onBuyArmor: (armor: ArmorId) => void;
  onUpgradeArmor: (armor: ArmorId) => void;
  onSelectArmor: (armor: ArmorId) => void;
}

export const BlackMarketView: React.FC<BlackMarketProps> = ({
  t,
  portfolio,
  onBuySupply,
  onBuyWeapon,
  onUpgradeWeapon,
  onSelectWeapon,
  onBuyArmor,
  onUpgradeArmor,
  onSelectArmor,
}) => {
  const [filter, setFilter] = useState<'all' | 'weapons' | 'armors' | 'supplies'>('all');

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

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-10">
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 pb-6 border-b border-zinc-800/80">
        <div>
          <p className="text-xs text-zinc-400 mb-1.5">{t.marketKicker}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.marketTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.marketSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2.5 font-mono tabular-nums">
            <ItemPreviewArt kind="ru9" className="w-8 h-8 shrink-0" />
            <div>
              <div className="text-xs text-zinc-400">{t.ru9Title}</div>
              <div className="text-xl font-bold text-amber-400">
                {Math.round(portfolio.ru9).toLocaleString()} $RU9
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 p-1 bg-[#111520] border border-zinc-800 rounded-lg">
            {(
              [
                { id: 'all', label: 'All' },
                { id: 'weapons', label: `Weapons (${WEAPON_CATALOG_CONFIG.length})` },
                { id: 'armors', label: `Armors (${ARMOR_CATALOG_CONFIG.length})` },
                { id: 'supplies', label: 'Supplies (4)' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                  filter === tab.id
                    ? 'bg-rose-600 text-white'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 01. 8 FUTURISTIC WEAPONS ARSENAL (Pure $RU9 Buy & Upgrade) */}
      {(filter === 'all' || filter === 'weapons') && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold text-white">{t.upgradesSection}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {WEAPON_CATALOG_CONFIG.map((w) => {
              const isOwned = portfolio.ownedWeapons.includes(w.id);
              const lvl = portfolio.weaponLevels[w.id] || 1;
              const isMax = lvl >= 5;
              const isEquipped = portfolio.equippedWeapon === w.id;
              const upgCostRu9 = getWeaponUpgradeCostRu9(w.id, lvl);

              return (
                <div
                  key={w.id}
                  className={`bg-[#111520] border rounded-xl p-6 flex flex-col justify-between gap-5 ${
                    isEquipped
                      ? 'border-rose-500/75'
                      : isOwned
                      ? 'border-zinc-800/90'
                      : 'border-amber-500/35'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-zinc-400 mb-2">
                      <span>
                        [{w.hotkey}] ·{' '}
                        {isOwned
                          ? `${t.levelLabel} ${lvl} / 5 · +${Math.round((lvl - 1) * 22)}% DMG`
                          : t.lockedTag}
                      </span>
                      <span className="text-cyan-300">{w.statsBadge}</span>
                    </div>

                    <div className="w-full h-24 rounded-lg bg-[#090b12] border border-zinc-800/80 flex items-center justify-center px-6 mb-4">
                      <WeaponPreviewArt weapon={w.id} className="w-full h-20" />
                    </div>

                    <h3 className="text-lg font-bold text-white">{t[w.nameKey]}</h3>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{t[w.descKey]}</p>
                  </div>

                  {!isOwned ? (
                    <button
                      type="button"
                      onClick={() => onBuyWeapon(w.id)}
                      className="w-full py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors inline-flex items-center justify-center gap-2 tabular-nums"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.buyBtn} · {w.buyCostRu9.toLocaleString()} $RU9
                    </button>
                  ) : (
                    <div className="flex items-center gap-2.5">
                      <button
                        type="button"
                        onClick={() => onSelectWeapon(w.id)}
                        className={`py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
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
                        disabled={isMax}
                        onClick={() => onUpgradeWeapon(w.id)}
                        className="flex-1 py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-45 border border-zinc-700 text-amber-300 transition-colors whitespace-nowrap tabular-nums"
                      >
                        {isMax
                          ? t.maxLevel
                          : `${t.upgradeBtn} · ${upgCostRu9.toLocaleString()} $RU9`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 02. 6 FUTURISTIC EXO-ARMORS & SHIELD CHASSIS (Pure $RU9 Buy & Upgrade) */}
      {(filter === 'all' || filter === 'armors') && (
        <section className="space-y-4 pt-2">
          <h2 className="text-xl font-bold text-white">{t.armorsSection}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ARMOR_CATALOG_CONFIG.map((a) => {
              const isOwned = portfolio.ownedArmors.includes(a.id);
              const lvl = portfolio.armorLevels[a.id] || 1;
              const isMax = lvl >= 5;
              const isEquipped = portfolio.equippedArmor === a.id;
              const upgCostRu9 = getArmorUpgradeCostRu9(a.id, lvl);
              const stats = computeArmorStats(a.id, lvl);

              const perkParts: string[] = [
                `${t.hpLabel} ${stats.maxHp}`,
                `${t.shieldLabel} ${stats.maxShield}`,
                `DR ${Math.round(stats.damageReduction * 100)}%`,
              ];
              if (a.moveSpeedBonus > 0) perkParts.push(`+${Math.round(a.moveSpeedBonus * 100)}% SPD`);
              if (a.damageBonus > 0)
                perkParts.push(`+${Math.round((stats.damageMult - 1) * 100)}% DMG`);
              if (a.killHeal > 0) perkParts.push(`+${a.killHeal} HP/Kill`);

              return (
                <div
                  key={a.id}
                  className={`bg-[#111520] border rounded-xl p-6 flex flex-col justify-between gap-5 ${
                    isEquipped
                      ? 'border-cyan-400/80'
                      : isOwned
                      ? 'border-zinc-800/90'
                      : 'border-amber-500/35'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between text-xs font-mono tabular-nums text-zinc-400 mb-2">
                      <span className="inline-flex items-center gap-1">
                        {isOwned ? (
                          <Shield className="w-3.5 h-3.5 text-cyan-400" />
                        ) : (
                          <Lock className="w-3.5 h-3.5 text-amber-400" />
                        )}
                        {isOwned ? `${t.levelLabel} ${lvl} / 5` : t.lockedTag}
                      </span>
                      <span className="text-sky-300 truncate max-w-[200px]">
                        {perkParts.slice(0, 3).join(' · ')}
                      </span>
                    </div>

                    <div className="w-full h-24 rounded-lg bg-[#090b12] border border-zinc-800/80 flex items-center justify-center px-4 mb-4">
                      <ArmorPreviewArt armor={a.id} className="w-full h-20" />
                    </div>

                    <h3 className="text-lg font-bold text-white">{t[a.nameKey]}</h3>
                    <div className="text-[11px] font-mono text-emerald-300/90 mt-1">
                      {perkParts.join(' · ')}
                    </div>
                    <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{t[a.descKey]}</p>
                  </div>

                  {!isOwned ? (
                    <button
                      type="button"
                      onClick={() => onBuyArmor(a.id)}
                      className="w-full py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors inline-flex items-center justify-center gap-2 tabular-nums"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      {t.buyBtn} · {a.buyCostRu9.toLocaleString()} $RU9
                    </button>
                  ) : (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectArmor(a.id)}
                        className={`py-2.5 px-3.5 min-h-[42px] text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap inline-flex items-center gap-1.5 ${
                          isEquipped
                            ? 'bg-cyan-950/60 border-cyan-400/70 text-cyan-200'
                            : 'bg-zinc-950 hover:bg-zinc-900 border-zinc-800 text-zinc-300'
                        }`}
                      >
                        {isEquipped && <Check className="w-3.5 h-3.5" />}
                        {isEquipped ? t.equippedTag : t.equipArmorBtn}
                      </button>

                      <button
                        type="button"
                        disabled={isMax}
                        onClick={() => onUpgradeArmor(a.id)}
                        className="flex-1 py-2.5 px-3.5 min-h-[42px] text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-45 border border-zinc-700 text-amber-300 transition-colors whitespace-nowrap tabular-nums"
                      >
                        {isMax
                          ? t.maxLevel
                          : `${t.upgradeBtn} · ${upgCostRu9.toLocaleString()} $RU9`}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* 03. TACTICAL FIELD SUPPLIES ($RU9) */}
      {(filter === 'all' || filter === 'supplies') && (
        <section className="space-y-4 pt-2">
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
                  className="w-full py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors tabular-nums"
                >
                  {t.buyBtn} · {item.costRu9.toLocaleString()} $RU9
                </button>
              </div>
            ))}
          </div>
        </section>
      )}
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
  const petSpeciesCatalog = [
    {
      kind: CompanionKind.SCOUT_DOG,
      icon: 'roboDog' as const,
      slotLabel: t.petDogSlot,
      name: t.scoutDogName,
      desc: t.scoutDogDesc,
      accentClass: 'border-sky-500/40',
      textAccent: 'text-sky-400',
    },
    {
      kind: CompanionKind.CYBER_CAT,
      icon: 'roboCat' as const,
      slotLabel: t.petCatSlot,
      name: t.cyberCatName,
      desc: t.cyberCatDesc,
      accentClass: 'border-cyan-500/40',
      textAccent: 'text-cyan-400',
    },
    {
      kind: CompanionKind.PUMPKIN_SPIRIT,
      icon: 'pumpkinPet' as const,
      slotLabel: t.pumpkinPetSlot,
      name: t.pumpkinPetName,
      desc: t.pumpkinPetDesc,
      accentClass: 'border-orange-500/45',
      textAccent: 'text-orange-400',
    },
    {
      kind: CompanionKind.NIGHT_BAT,
      icon: 'batPet' as const,
      slotLabel: t.batPetSlot,
      name: t.batPetName,
      desc: t.batPetDesc,
      accentClass: 'border-purple-500/45',
      textAccent: 'text-purple-400',
    },
  ];

  const untamedSpecies = petSpeciesCatalog.filter(
    (sp) => !portfolio.companions.some((c) => c.kind === sp.kind)
  );

  return (
    <div className="max-w-5xl mx-auto py-6 space-y-8">
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-xs text-sky-400 mb-1.5">{t.companionsKicker}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.companionsTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.companionsSub}</p>
        </div>
        <div className="grid grid-cols-2 gap-x-5 gap-y-1 text-xs font-mono tabular-nums text-zinc-300">
          {petSpeciesCatalog.map((sp) => {
            const owned = portfolio.companions.some((c) => c.kind === sp.kind);
            return (
              <div key={sp.kind}>
                {sp.slotLabel}:{' '}
                <strong className={owned ? sp.textAccent : 'text-zinc-500'}>
                  {owned ? '1 / 1' : '0 / 1'}
                </strong>
              </div>
            );
          })}
        </div>
      </div>

      {portfolio.companions.length === 0 ? (
        <div className="bg-[#111520] border border-zinc-800/90 rounded-xl p-8 space-y-6">
          <p className="text-sm text-zinc-300 max-w-2xl">{t.noCompanionsYet}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            {petSpeciesCatalog.map((sp) => (
              <div
                key={sp.kind}
                className="flex items-center gap-4 p-4 rounded-lg bg-[#090b12] border border-zinc-800/80"
              >
                <ItemPreviewArt kind={sp.icon} className="w-16 h-16 shrink-0" />
                <div>
                  <h3 className="text-sm font-bold text-white">{sp.name}</h3>
                  <p className="text-xs text-zinc-400 mt-1">{sp.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {portfolio.companions.map((comp) => {
              const meta =
                petSpeciesCatalog.find((s) => s.kind === comp.kind) || petSpeciesCatalog[0];
              const isMaxLv = comp.level >= 5;

              return (
                <div
                  key={comp.id}
                  className={`bg-[#111520] border ${meta.accentClass} rounded-xl p-6 flex flex-col justify-between gap-5`}
                >
                  <div className="flex items-start gap-4">
                    <ItemPreviewArt
                      kind={getCompanionIconKind(comp.kind)}
                      className="w-20 h-20 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div
                        className={`flex items-center justify-between text-xs font-mono tabular-nums ${meta.textAccent} mb-1`}
                      >
                        <span>
                          {t.petTag} · Lv.{comp.level}/5
                        </span>
                        <span className="text-emerald-400 font-semibold">{t.deployedLabel}</span>
                      </div>

                      <h2 className="text-lg font-bold text-white truncate">{meta.name}</h2>
                      <p className="text-xs text-zinc-400 mt-1 leading-relaxed">{meta.desc}</p>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5">
                    <button
                      type="button"
                      disabled={isMaxLv}
                      onClick={() => onRepairCompanion(comp.id, false)}
                      className="w-full py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
                    >
                      <ArrowUpCircle className="w-4 h-4" />
                      {isMaxLv ? t.maxLevel : `${t.repairBtn} (15,000 $RU9)`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {untamedSpecies.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              {untamedSpecies.map((sp) => (
                <div
                  key={sp.kind}
                  className="flex items-center gap-4 p-4 rounded-xl bg-[#0b0e17] border border-zinc-800/80 opacity-85"
                >
                  <ItemPreviewArt kind={sp.icon} className="w-14 h-14 shrink-0" />
                  <div>
                    <div className="text-[10px] font-mono text-amber-400 mb-0.5">[G] WILD IN ARENA</div>
                    <h3 className="text-sm font-bold text-white">{sp.name}</h3>
                    <p className="text-xs text-zinc-400 mt-0.5">{sp.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
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
    <div className="max-w-6xl mx-auto py-6 space-y-8">
      <div className="pb-6 border-b border-zinc-800/80 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <p className="text-xs font-mono text-rose-400 tracking-wider mb-1.5">
            Declassified Archive · Year 2035 · Red-Eye Uprising
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.manualTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-3xl leading-relaxed">{t.manualSub}</p>
        </div>
        <div className="flex items-center gap-3 bg-[#101522] border border-zinc-800 rounded-xl px-3.5 py-2.5 shrink-0">
          <img
            src={ASSET_URLS.DOGE_R_IDLE}
            alt="Space Doge Vanguard"
            referrerPolicy="no-referrer"
            className="w-12 h-12 rounded-lg object-contain bg-[#090d16] border border-zinc-800"
          />
          <div className="text-xs">
            <div className="font-mono text-[#d9ff00] font-semibold">Vanguard File 01</div>
            <div className="text-zinc-300 font-medium">Space Doge · DEGEN</div>
          </div>
        </div>
      </div>

      {/* 4-Chapter AI Uprising Story Chronicle */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <article className="bg-[#0e1320] border border-zinc-800/90 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-rose-400 font-semibold tracking-wider">
              Archive Log · 2035.03.14 · 03:14 UTC
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreHeading}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{t.loreBody}</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/70 text-[11px] font-mono text-zinc-500">
            Global Containment Breach
          </div>
        </article>

        <article className="bg-[#0e1320] border border-cyan-900/50 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-cyan-400 font-semibold tracking-wider">
              Sector 09 · Ruined AI Data Vaults & Glitch Terminals
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreFacilityHeading}</h2>
            <p className="text-sm text-zinc-300 leading-relaxed">{t.loreFacilityBody}</p>
          </div>
          <div className="pt-3 border-t border-zinc-800/70 text-[11px] font-mono text-cyan-400/80">
            Hub · Vault · Foundry · Cryo · Hangar · Chimera Lab
          </div>
        </article>

        <article className="bg-[#140d1d] border border-fuchsia-800/60 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-fuchsia-400 font-semibold tracking-wider">
              Beyond Gate X-2680 · Bio-Cyber Abyss
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreOutdoorHeading}</h2>
            <p className="text-sm text-zinc-200/90 leading-relaxed">{t.loreOutdoorBody}</p>
          </div>
          <div className="pt-3 border-t border-fuchsia-900/50 text-[11px] font-mono text-fuchsia-300/90">
            Forbidden Zone · Eldritch Mutation
          </div>
        </article>

        <article className="bg-[#19110a] border border-orange-800/60 rounded-xl p-5 space-y-3 flex flex-col justify-between">
          <div className="space-y-2.5">
            <div className="text-[11px] font-mono text-orange-400 font-semibold tracking-wider">
              Frontier X-4680 · Open-World Titan Mecha Wasteland
            </div>
            <h2 className="text-lg font-bold text-white leading-snug">{t.loreMechaHeading}</h2>
            <p className="text-sm text-zinc-200/90 leading-relaxed">{t.loreMechaBody}</p>
          </div>
          <div className="pt-3 border-t border-orange-900/50 text-[11px] font-mono text-orange-300/90">
            Iron Colossus Titan · Omega Chimera Overlord
          </div>
        </article>

        <article className="md:col-span-2 bg-gradient-to-r from-[#1c0d1f] via-[#1a0f12] to-[#1f1108] border border-amber-600/55 rounded-xl p-5 space-y-2.5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-mono text-amber-400 font-semibold tracking-wider">
            <span>BLOOD-MOON PROTOCOL · HALLOWEEN GLITCH ANOMALY</span>
            <span className="text-purple-300">[K] Witch Hat · [666] Secret Jackpot</span>
          </div>
          <h2 className="text-lg font-bold text-white leading-snug">{t.loreHalloweenHeading}</h2>
          <p className="text-sm text-amber-100/90 leading-relaxed">{t.loreHalloweenBody}</p>
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
                  <polygon points="15,22 28,12 41,22 36,33 20,33" fill="#2e1065" stroke="#e879f9" strokeWidth="1.6" />
                  <ellipse cx="28" cy="23" rx="6.5" ry="4.5" fill="#ff1744" />
                  <ellipse cx="28" cy="23" rx="1.6" ry="3.8" fill="#09030f" />
                </svg>
              </div>
              <p className="text-xs text-fuchsia-100/90 leading-relaxed">{t.enemyEldritchDesc}</p>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#1d120a] border border-orange-700/60">
              <div className="w-14 h-14 rounded-lg bg-[#120b06] border border-orange-600/50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 56 56" className="w-12 h-12">
                  <polygon points="14,18 28,11 42,18 42,36 28,42 14,36" fill="#292524" stroke="#f97316" strokeWidth="2" />
                  <path d="M14 26 L5 20 L4 34 M42 26 L51 20 L52 34 M18 38 L12 49 M38 38 L44 49" stroke="#94a3b8" strokeWidth="3" strokeLinecap="round" fill="none" />
                  <rect x="20" y="21" width="16" height="4" fill="#ff1744" />
                  <circle cx="28" cy="32" r="4" fill="#fb923c" />
                </svg>
              </div>
              <p className="text-xs text-orange-100/90 leading-relaxed">{t.enemyMechaDesc}</p>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#1b0e18] border border-rose-700/60">
              <div className="w-14 h-14 rounded-lg bg-[#11070f] border border-rose-600/50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 56 56" className="w-12 h-12">
                  <path d="M10 18 Q4 8 18 16 M46 18 Q52 8 38 16" stroke="#e879f9" strokeWidth="2.5" fill="none" />
                  <polygon points="16,20 28,13 40,20 38,39 18,39" fill="#311042" stroke="#f43f5e" strokeWidth="2" />
                  <circle cx="23" cy="28" r="3.5" fill="#10b981" />
                  <circle cx="33" cy="28" r="3.5" fill="#38bdf8" />
                  <circle cx="28" cy="20" r="3" fill="#ff1744" />
                </svg>
              </div>
              <p className="text-xs text-rose-100/90 leading-relaxed">{t.enemyChimeraDesc}</p>
            </div>

            <div className="flex items-center gap-3.5 p-3 rounded-lg bg-[#1c1008] border border-amber-500/60">
              <div className="w-14 h-14 rounded-lg bg-[#110804] border border-amber-500/50 flex items-center justify-center shrink-0">
                <svg viewBox="0 0 56 56" className="w-12 h-12" fill="none">
                  <path d="M39 10 L51 16 L43 32 Z" fill="#c084fc" fillOpacity="0.45" stroke="#e879f9" strokeWidth="2" />
                  <line x1="39" y1="10" x2="35" y2="48" stroke="#94a3b8" strokeWidth="2.4" />
                  <polygon points="12,28 19,19 29,19 35,28 30,39 17,39" fill="#ea580c" stroke="#fde047" strokeWidth="1.6" />
                  <polygon points="18,26 22,23 21,28" fill="#00e5ff" />
                  <polygon points="30,26 26,23 27,28" fill="#00e5ff" />
                  <path d="M18 33 L21 35 L24 33 L27 35 L30 33" stroke="#fde047" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <p className="text-xs text-amber-100/90 leading-relaxed">{t.enemyHalloweenDesc}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
