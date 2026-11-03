import React, { useState } from 'react';
import { ArrowRightLeft, Backpack, Check, Lock, Shield, ShoppingCart, X, Zap } from 'lucide-react';
import { PLAYER_SKIN_META } from '../game/assetLoader';
import {
  ARMOR_CATALOG_CONFIG,
  computeArmorStats,
  getArmorUpgradeCostRu9,
  getWeaponUpgradeCostRu9,
  WEAPON_CATALOG_CONFIG,
} from '../game/equipmentConfig';
import { TranslationStrings } from '../i18n/translations';
import {
  ArmorId,
  CompanionKind,
  PlayerPortfolio,
  PlayerSkinId,
  WeaponId,
} from '../types/game';
import {
  ArmorPreviewArt,
  getCompanionIconKind,
  ItemIconKind,
  ItemPreviewArt,
  WeaponPreviewArt,
} from './GameIllustrations';

interface BackpackModalProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  onClose: () => void;
  onSelectSkin: (skin: PlayerSkinId) => void;
  onSelectWeapon: (weapon: WeaponId) => void;
  onBuyWeapon?: (weapon: WeaponId) => void;
  onUpgradeWeapon?: (weapon: WeaponId) => void;
  onSelectArmor: (armor: ArmorId) => void;
  onBuyArmor?: (armor: ArmorId) => void;
  onUpgradeArmor?: (armor: ArmorId) => void;
  onBuySupply?: (item: 'sphere' | 'ammo' | 'medkit' | 'patch') => void;
  onUseConsumable: (kind: 'medkit' | 'ammo' | 'patch') => void;
  onDeployCompanion: (id: string) => void;
  onToggleHalloweenHat?: () => void;
  onOpenTerminal?: () => void;
}

type SelectedSlot =
  | { type: 'weapon'; weaponId: WeaponId }
  | { type: 'armor'; armorId: ArmorId }
  | {
      type: 'item';
      itemKey: 'sphere' | 'medkit' | 'ammo' | 'patch' | 'oCore' | 'aCore' | 'ru9' | 'oaiStock' | 'anthStock';
      icon: ItemIconKind;
    }
  | { type: 'companion'; compId: string };

export const BackpackModal: React.FC<BackpackModalProps> = ({
  t,
  portfolio,
  onClose,
  onSelectSkin,
  onSelectWeapon,
  onBuyWeapon,
  onUpgradeWeapon,
  onSelectArmor,
  onBuyArmor,
  onUpgradeArmor,
  onBuySupply,
  onUseConsumable,
  onDeployCompanion,
  onToggleHalloweenHat,
  onOpenTerminal,
}) => {
  const [tab, setTab] = useState<'weapons' | 'armors' | 'items'>('weapons');
  const [selected, setSelected] = useState<SelectedSlot>({
    type: 'weapon',
    weaponId: portfolio.equippedWeapon,
  });

  const activeSkinMeta =
    PLAYER_SKIN_META.find((s) => s.id === portfolio.selectedSkin) || PLAYER_SKIN_META[0];

  const equippedWeaponCfg =
    WEAPON_CATALOG_CONFIG.find((w) => w.id === portfolio.equippedWeapon) || WEAPON_CATALOG_CONFIG[0];
  const equippedArmorCfg =
    ARMOR_CATALOG_CONFIG.find((a) => a.id === portfolio.equippedArmor) || ARMOR_CATALOG_CONFIG[0];
  const equippedArmorLvl = portfolio.armorLevels[equippedArmorCfg.id] || 1;
  const equippedArmorStats = computeArmorStats(equippedArmorCfg.id, equippedArmorLvl);

  const getPetDesc = (kind: CompanionKind) => {
    switch (kind) {
      case CompanionKind.CYBER_CAT:
        return t.cyberCatDesc;
      case CompanionKind.PUMPKIN_SPIRIT:
        return t.pumpkinPetDesc;
      case CompanionKind.NIGHT_BAT:
        return t.batPetDesc;
      default:
        return t.scoutDogDesc;
    }
  };

  const itemSlots: {
    key: 'sphere' | 'medkit' | 'ammo' | 'patch' | 'ru9' | 'oCore' | 'aCore' | 'oaiStock' | 'anthStock';
    icon: ItemIconKind;
    title: string;
    desc: string;
    countLabel: string;
    hotkey?: string;
  }[] = [
    {
      key: 'sphere',
      icon: 'sphere',
      title: t.itemSphere,
      desc: t.itemSphereDesc,
      countLabel: `x${portfolio.masterSpheres}`,
      hotkey: 'G',
    },
    {
      key: 'medkit',
      icon: 'medkit',
      title: t.itemMedkit,
      desc: t.itemMedkitDesc,
      countLabel: `x${portfolio.medkits}`,
      hotkey: 'H',
    },
    {
      key: 'ammo',
      icon: 'ammo',
      title: t.itemAmmo,
      desc: t.itemAmmoDesc,
      countLabel: `x${portfolio.energyPacks}`,
      hotkey: 'R',
    },
    {
      key: 'patch',
      icon: 'patch',
      title: t.itemPatch,
      desc: t.itemPatchDesc,
      countLabel: `x${portfolio.firmwarePatches}`,
      hotkey: 'F',
    },
    {
      key: 'ru9',
      icon: 'ru9',
      title: t.ru9Title,
      desc: t.ru9Desc,
      countLabel: `${Math.round(portfolio.ru9).toLocaleString()}`,
    },
    {
      key: 'oCore',
      icon: 'oCore',
      title: 'OpenAI Core',
      desc: t.oCoreDesc,
      countLabel: `x${portfolio.oCores}`,
    },
    {
      key: 'aCore',
      icon: 'aCore',
      title: 'Anthropic Core',
      desc: t.aCoreDesc,
      countLabel: `x${portfolio.aCores}`,
    },
    {
      key: 'oaiStock',
      icon: 'oaiStock',
      title: '$OPENAI Tokenized Stock',
      desc: t.oaiEquityName,
      countLabel: `${portfolio.oaiShares.toFixed(2)}`,
    },
    {
      key: 'anthStock',
      icon: 'anthStock',
      title: '$ANTH Tokenized Stock',
      desc: t.anthEquityName,
      countLabel: `${portfolio.anthShares.toFixed(2)}`,
    },
  ];

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
      <div className="max-w-5xl w-full max-h-[90vh] overflow-y-auto bg-[#0E121B] border border-zinc-700/90 rounded-xl p-6 shadow-2xl">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 mb-6 border-b border-zinc-800">
          <div>
            <div className="flex items-center gap-2 text-white">
              <Backpack className="w-5 h-5 text-rose-500" />
              <h2 className="text-2xl font-display font-bold tracking-tight">
                {t.backpackTitle}
              </h2>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{t.backpackSub}</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-1.5 text-xs font-mono tabular-nums text-amber-400">
              <ItemPreviewArt kind="ru9" className="w-5 h-5" />
              <strong>{Math.round(portfolio.ru9).toLocaleString()} $RU9</strong>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 min-h-[40px] min-w-[40px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Operative Portrait + Equipped Weapon + Equipped Exo-Armor + Skin Switcher */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-[#131824] border border-zinc-800 rounded-xl p-4 space-y-4">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span>{t.chooseOperative}</span>
                <span className="font-mono text-zinc-200">{activeSkinMeta.name}</span>
              </div>

              <div className="flex items-center gap-3.5">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900/90 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={activeSkinMeta.portraitUrl}
                    alt={activeSkinMeta.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0 space-y-2">
                  <div className="bg-[#0b0f19] border border-zinc-800 rounded-lg p-2">
                    <div className="text-[10px] font-mono text-rose-400">
                      [{equippedWeaponCfg.hotkey}] Lv.{portfolio.weaponLevels[equippedWeaponCfg.id] || 1}/5
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {t[equippedWeaponCfg.nameKey]}
                    </div>
                    <WeaponPreviewArt weapon={equippedWeaponCfg.id} className="w-full h-10 mt-0.5" />
                  </div>

                  <div className="bg-[#0b0f19] border border-cyan-900/60 rounded-lg p-2">
                    <div className="text-[10px] font-mono text-cyan-300">
                      {t.hpLabel} {equippedArmorStats.maxHp} · {t.shieldLabel} {equippedArmorStats.maxShield} · DR{' '}
                      {Math.round(equippedArmorStats.damageReduction * 100)}%
                    </div>
                    <div className="text-xs font-semibold text-white truncate">
                      {t[equippedArmorCfg.nameKey]}
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 Character Skin Switcher Thumbnails */}
              <div className="grid grid-cols-4 gap-2">
                {PLAYER_SKIN_META.map((sk) => {
                  const isCurrent = portfolio.selectedSkin === sk.id;
                  return (
                    <button
                      key={sk.id}
                      type="button"
                      onClick={() => onSelectSkin(sk.id)}
                      className={`p-1.5 rounded-lg border transition-colors flex flex-col items-center gap-1 ${
                        isCurrent
                          ? 'border-rose-500 bg-rose-950/30 text-white'
                          : 'border-zinc-800 bg-zinc-900/70 text-zinc-400 hover:border-zinc-600'
                      }`}
                    >
                      <img
                        src={sk.portraitUrl}
                        alt={sk.name}
                        referrerPolicy="no-referrer"
                        className="w-11 h-14 rounded object-contain bg-zinc-950/70 p-0.5"
                      />
                      <span className="text-[10px] font-medium truncate w-full text-center">
                        {sk.name.split('·')[1]?.trim() || sk.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {onToggleHalloweenHat && (
                <button
                  type="button"
                  onClick={onToggleHalloweenHat}
                  className={`w-full py-2 px-3 rounded-lg border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                    portfolio.halloweenHat
                      ? 'bg-purple-950/60 border-amber-400 text-amber-200'
                      : 'bg-zinc-900/90 border-zinc-700 hover:border-purple-400 text-zinc-300'
                  }`}
                >
                  <ItemPreviewArt kind="witchHat" className="w-5 h-5 shrink-0" />
                  <span>{portfolio.halloweenHat ? t.halloweenHatOn : t.halloweenHatBtn}</span>
                </button>
              )}
            </div>

            {/* Active Pets Summary */}
            {portfolio.companions.length > 0 && (
              <div className="grid grid-cols-2 gap-2.5">
                {portfolio.companions.map((comp) => (
                  <button
                    key={comp.id}
                    type="button"
                    onClick={() => {
                      setTab('items');
                      setSelected({ type: 'companion', compId: comp.id });
                    }}
                    className="bg-[#131824] border border-sky-500/40 hover:border-sky-400 rounded-xl p-2.5 flex items-center gap-2.5 text-left transition-colors"
                  >
                    <ItemPreviewArt
                      kind={getCompanionIconKind(comp.kind)}
                      className="w-10 h-10 shrink-0"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="text-[10px] text-sky-400 font-mono tabular-nums">
                        Lv.{comp.level}
                      </div>
                      <div className="text-xs font-semibold text-white truncate">
                        {comp.nickname}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT: Category Tabs + Arsenal/Armor/Inventory Grid + Action Inspector */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            <div className="space-y-3">
              {/* Interactive Category Switcher */}
              <div className="flex items-center gap-1 p-1 bg-[#131824] border border-zinc-800 rounded-lg">
                <button
                  type="button"
                  onClick={() => {
                    setTab('weapons');
                    setSelected({ type: 'weapon', weaponId: portfolio.equippedWeapon });
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                    tab === 'weapons'
                      ? 'bg-rose-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Weapons ({portfolio.ownedWeapons.length}/{WEAPON_CATALOG_CONFIG.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('armors');
                    setSelected({ type: 'armor', armorId: portfolio.equippedArmor });
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                    tab === 'armors'
                      ? 'bg-cyan-600 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Exo-Armors ({portfolio.ownedArmors.length}/{ARMOR_CATALOG_CONFIG.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTab('items');
                    setSelected({ type: 'item', itemKey: 'sphere', icon: 'sphere' });
                  }}
                  className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-md transition-colors ${
                    tab === 'items'
                      ? 'bg-zinc-700 text-white'
                      : 'text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  Supplies & Vault ({itemSlots.length + portfolio.companions.length})
                </button>
              </div>

              {/* WEAPONS GRID (All 8 Weapons) */}
              {tab === 'weapons' && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {WEAPON_CATALOG_CONFIG.map((w) => {
                    const isOwned = portfolio.ownedWeapons.includes(w.id);
                    const isSel = selected.type === 'weapon' && selected.weaponId === w.id;
                    const isEq = portfolio.equippedWeapon === w.id;
                    const lvl = portfolio.weaponLevels[w.id] || 1;
                    return (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => setSelected({ type: 'weapon', weaponId: w.id })}
                        className={`relative p-2.5 rounded-lg border text-left transition-colors ${
                          isSel
                            ? 'bg-zinc-800/90 border-rose-500'
                            : isOwned
                            ? 'bg-[#131824] border-zinc-800 hover:border-zinc-700'
                            : 'bg-[#10131d]/75 border-amber-500/30 hover:border-amber-400/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>[{w.hotkey}]</span>
                          <span>{isOwned ? `Lv.${lvl}` : `${(w.buyCostRu9 / 1000).toFixed(0)}k`}</span>
                        </div>
                        <WeaponPreviewArt weapon={w.id} className="w-full h-11" />
                        <div className="text-[11px] font-medium text-zinc-200 truncate mt-1">
                          {t[w.nameKey]}
                        </div>
                        <div className="mt-0.5 text-[9px] font-mono font-semibold">
                          {isEq ? (
                            <span className="text-emerald-400">{t.equippedTag}</span>
                          ) : !isOwned ? (
                            <span className="text-amber-400">{t.lockedTag}</span>
                          ) : (
                            <span className="text-zinc-500">READY</span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* EXO-ARMORS GRID (All 6 Armors) */}
              {tab === 'armors' && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {ARMOR_CATALOG_CONFIG.map((a) => {
                    const isOwned = portfolio.ownedArmors.includes(a.id);
                    const isSel = selected.type === 'armor' && selected.armorId === a.id;
                    const isEq = portfolio.equippedArmor === a.id;
                    const lvl = portfolio.armorLevels[a.id] || 1;
                    const st = computeArmorStats(a.id, lvl);
                    return (
                      <button
                        key={a.id}
                        type="button"
                        onClick={() => setSelected({ type: 'armor', armorId: a.id })}
                        className={`relative p-3 rounded-lg border text-left transition-colors ${
                          isSel
                            ? 'bg-zinc-800/90 border-cyan-400'
                            : isOwned
                            ? 'bg-[#131824] border-zinc-800 hover:border-zinc-700'
                            : 'bg-[#10131d]/75 border-amber-500/30 hover:border-amber-400/60'
                        }`}
                      >
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                          <span>{isOwned ? `Lv.${lvl}` : t.lockedTag}</span>
                          <span className="text-cyan-300">SHD {st.maxShield}</span>
                        </div>
                        <ArmorPreviewArt armor={a.id} className="w-full h-14" />
                        <div className="text-xs font-semibold text-zinc-100 truncate mt-1">
                          {t[a.nameKey]}
                        </div>
                        <div className="text-[10px] font-mono mt-0.5">
                          {isEq ? (
                            <span className="text-emerald-400">{t.equippedTag}</span>
                          ) : !isOwned ? (
                            <span className="text-amber-400">
                              {a.buyCostRu9.toLocaleString()} $RU9
                            </span>
                          ) : (
                            <span className="text-zinc-400">
                              DR {Math.round(st.damageReduction * 100)}%
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* SUPPLIES, CORES, TOKENIZED STOCKS & PETS GRID */}
              {tab === 'items' && (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
                  {itemSlots.map((it) => {
                    const isSel = selected.type === 'item' && selected.itemKey === it.key;
                    return (
                      <button
                        key={it.key}
                        type="button"
                        onClick={() => setSelected({ type: 'item', itemKey: it.key, icon: it.icon })}
                        className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col items-center justify-between min-h-[92px] ${
                          isSel
                            ? 'bg-zinc-800/90 border-rose-500'
                            : 'bg-[#131824] border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span>{it.hotkey ? `[${it.hotkey}]` : 'ASSET'}</span>
                          <span className="text-zinc-200 font-semibold tabular-nums truncate max-w-[68px]">
                            {it.countLabel}
                          </span>
                        </div>
                        <ItemPreviewArt kind={it.icon} className="w-10 h-10 my-1" />
                        <div className="text-[11px] text-zinc-300 truncate w-full text-center">
                          {it.title.replace(/\[.\]/g, '').trim()}
                        </div>
                      </button>
                    );
                  })}

                  {portfolio.companions.map((comp) => {
                    const isSel = selected.type === 'companion' && selected.compId === comp.id;
                    return (
                      <button
                        key={comp.id}
                        type="button"
                        onClick={() => setSelected({ type: 'companion', compId: comp.id })}
                        className={`p-2.5 rounded-lg border text-left transition-colors flex flex-col items-center justify-between min-h-[92px] ${
                          isSel
                            ? 'bg-zinc-800/90 border-sky-500'
                            : 'bg-[#131824] border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        <div className="w-full flex items-center justify-between text-[10px] font-mono text-sky-400">
                          <span>{t.petTag}</span>
                          <span>Lv.{comp.level}</span>
                        </div>
                        <ItemPreviewArt
                          kind={getCompanionIconKind(comp.kind)}
                          className="w-10 h-10 my-1"
                        />
                        <div className="text-[11px] text-zinc-200 truncate w-full text-center">
                          {comp.nickname}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Slot Detail & Action Inspector */}
            <div className="bg-[#131824] border border-zinc-800 rounded-xl p-4">
              {selected.type === 'weapon' && (() => {
                const w =
                  WEAPON_CATALOG_CONFIG.find((x) => x.id === selected.weaponId) ||
                  WEAPON_CATALOG_CONFIG[0];
                const isOwned = portfolio.ownedWeapons.includes(w.id);
                const isEquipped = portfolio.equippedWeapon === w.id;
                const lvl = portfolio.weaponLevels[w.id] || 1;
                const upgCost = getWeaponUpgradeCostRu9(w.id, lvl);
                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-36 shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                      <WeaponPreviewArt weapon={w.id} className="w-full h-16" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-rose-400 mb-0.5">
                        [{w.hotkey}] {w.statsBadge} · {isOwned ? `${t.levelLabel} ${lvl}/5` : t.lockedTag}
                      </div>
                      <h3 className="text-base font-bold text-white">{t[w.nameKey]}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{t[w.descKey]}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {!isOwned ? (
                        onBuyWeapon && (
                          <button
                            type="button"
                            onClick={() => onBuyWeapon(w.id)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors flex items-center gap-1.5 whitespace-nowrap tabular-nums"
                          >
                            <ShoppingCart className="w-3.5 h-3.5" />
                            {t.buyBtn} · {w.buyCostRu9.toLocaleString()} $RU9
                          </button>
                        )
                      ) : (
                        <>
                          {onUpgradeWeapon && lvl < 5 && (
                            <button
                              type="button"
                              onClick={() => onUpgradeWeapon(w.id)}
                              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-300 transition-colors whitespace-nowrap tabular-nums"
                            >
                              {t.upgradeBtn} · {(upgCost / 1000).toFixed(0)}k $RU9
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isEquipped}
                            onClick={() => onSelectWeapon(w.id)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-emerald-400 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Check className="w-3.5 h-3.5" />
                            {isEquipped ? t.equippedTag : t.equipBtn}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {selected.type === 'armor' && (() => {
                const a =
                  ARMOR_CATALOG_CONFIG.find((x) => x.id === selected.armorId) ||
                  ARMOR_CATALOG_CONFIG[0];
                const isOwned = portfolio.ownedArmors.includes(a.id);
                const isEquipped = portfolio.equippedArmor === a.id;
                const lvl = portfolio.armorLevels[a.id] || 1;
                const upgCost = getArmorUpgradeCostRu9(a.id, lvl);
                const st = computeArmorStats(a.id, lvl);
                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-32 shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                      <ArmorPreviewArt armor={a.id} className="w-full h-16" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-cyan-300 mb-0.5">
                        {t.hpLabel} {st.maxHp} · {t.shieldLabel} {st.maxShield} · DR{' '}
                        {Math.round(st.damageReduction * 100)}% ·{' '}
                        {isOwned ? `${t.levelLabel} ${lvl}/5` : t.lockedTag}
                      </div>
                      <h3 className="text-base font-bold text-white">{t[a.nameKey]}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{t[a.descKey]}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {!isOwned ? (
                        onBuyArmor && (
                          <button
                            type="button"
                            onClick={() => onBuyArmor(a.id)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 text-zinc-950 transition-colors flex items-center gap-1.5 whitespace-nowrap tabular-nums"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            {t.buyBtn} · {a.buyCostRu9.toLocaleString()} $RU9
                          </button>
                        )
                      ) : (
                        <>
                          {onUpgradeArmor && lvl < 5 && (
                            <button
                              type="button"
                              onClick={() => onUpgradeArmor(a.id)}
                              className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-300 transition-colors whitespace-nowrap tabular-nums"
                            >
                              {t.upgradeBtn} · {(upgCost / 1000).toFixed(0)}k $RU9
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isEquipped}
                            onClick={() => onSelectArmor(a.id)}
                            className="px-4 py-2 text-xs font-semibold rounded-lg bg-cyan-600 hover:bg-cyan-500 disabled:bg-zinc-800 disabled:text-emerald-400 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                          >
                            <Shield className="w-3.5 h-3.5" />
                            {isEquipped ? t.equippedTag : t.equipArmorBtn}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                );
              })()}

              {selected.type === 'item' && (() => {
                const it = itemSlots.find((x) => x.key === selected.itemKey) || itemSlots[0];
                const canUse =
                  (it.key === 'medkit' && portfolio.medkits > 0) ||
                  (it.key === 'ammo' && portfolio.energyPacks > 0) ||
                  (it.key === 'patch' && portfolio.firmwarePatches > 0);
                const isCoreOrTokenStock =
                  it.key === 'oCore' ||
                  it.key === 'aCore' ||
                  it.key === 'oaiStock' ||
                  it.key === 'anthStock';

                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-16 h-16 shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                      <ItemPreviewArt kind={it.icon} className="w-11 h-11" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-zinc-400 mb-0.5">
                        Balance: {it.countLabel}
                      </div>
                      <h3 className="text-base font-bold text-white">{it.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{it.desc}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 shrink-0">
                      {(it.key === 'sphere' ||
                        it.key === 'medkit' ||
                        it.key === 'ammo' ||
                        it.key === 'patch') &&
                        onBuySupply && (
                          <button
                            type="button"
                            onClick={() =>
                              onBuySupply(it.key as 'sphere' | 'ammo' | 'medkit' | 'patch')
                            }
                            className="px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-600 text-amber-300 transition-colors whitespace-nowrap"
                          >
                            + {t.buyBtn} ($RU9)
                          </button>
                        )}
                      {(it.key === 'medkit' || it.key === 'ammo' || it.key === 'patch') && (
                        <button
                          type="button"
                          disabled={!canUse}
                          onClick={() => onUseConsumable(it.key as 'medkit' | 'ammo' | 'patch')}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <Zap className="w-3.5 h-3.5" />
                          {t.useItemBtn}
                        </button>
                      )}
                      {isCoreOrTokenStock && onOpenTerminal && (
                        <button
                          type="button"
                          onClick={() => {
                            onClose();
                            onOpenTerminal();
                          }}
                          className="px-4 py-2 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap"
                        >
                          <ArrowRightLeft className="w-3.5 h-3.5" />
                          {t.openTerminalBtn}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })()}

              {selected.type === 'companion' && (() => {
                const comp = portfolio.companions.find((c) => c.id === selected.compId);
                if (!comp) return null;
                const isDep = portfolio.activeCompanionId === comp.id;
                return (
                  <div className="flex items-center justify-between gap-4">
                    <ItemPreviewArt
                      kind={getCompanionIconKind(comp.kind)}
                      className="w-16 h-16 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white">{comp.nickname}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{getPetDesc(comp.kind)}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isDep}
                      onClick={() => onDeployCompanion(comp.id)}
                      className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-emerald-400 text-white transition-colors whitespace-nowrap shrink-0"
                    >
                      {isDep ? t.deployedLabel : t.deployBtn}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
