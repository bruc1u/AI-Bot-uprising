import React, { useState } from 'react';
import { Backpack, Check, Flame, X, Zap } from 'lucide-react';
import { PLAYER_SKIN_META } from '../game/assetLoader';
import { TranslationStrings } from '../i18n/translations';
import {
  CompanionKind,
  PlayerPortfolio,
  PlayerSkinId,
  WeaponId,
} from '../types/game';
import { ItemIconKind, ItemPreviewArt, WeaponPreviewArt } from './GameIllustrations';

interface BackpackModalProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  onClose: () => void;
  onSelectSkin: (skin: PlayerSkinId) => void;
  onSelectWeapon: (weapon: WeaponId) => void;
  onUseConsumable: (kind: 'medkit' | 'ammo' | 'patch') => void;
  onSmeltCore: (coreType: 'oCore' | 'aCore') => void;
  onDeployCompanion: (id: string) => void;
}

type SelectedSlot =
  | { type: 'weapon'; weaponId: WeaponId }
  | { type: 'item'; itemKey: 'sphere' | 'medkit' | 'ammo' | 'patch' | 'oCore' | 'aCore' | 'ru9' | 'stock'; icon: ItemIconKind }
  | { type: 'companion'; compId: string };

export const BackpackModal: React.FC<BackpackModalProps> = ({
  t,
  portfolio,
  onClose,
  onSelectSkin,
  onSelectWeapon,
  onUseConsumable,
  onSmeltCore,
  onDeployCompanion,
}) => {
  const [selected, setSelected] = useState<SelectedSlot>({
    type: 'weapon',
    weaponId: portfolio.equippedWeapon,
  });

  const activeSkinMeta =
    PLAYER_SKIN_META.find((s) => s.id === portfolio.selectedSkin) || PLAYER_SKIN_META[0];
  const activeCompanion = portfolio.companions.find(
    (c) => c.id === portfolio.activeCompanionId
  );

  const weaponCatalog: { id: WeaponId; name: string; desc: string; stats: string }[] = [
    {
      id: WeaponId.ARC_BLADE,
      name: t.weaponArcBlade,
      desc: t.weaponArcDesc,
      stats: 'DMG 34 · SPD Fast · 3rd Hit EMP Stun',
    },
    {
      id: WeaponId.CHAINSAW_SWORD,
      name: t.weaponChainsaw,
      desc: t.weaponChainsawDesc,
      stats: 'DMG 50 · Heavy Cleave · +65% Core Drop',
    },
    {
      id: WeaponId.PULSE_LASER,
      name: t.weaponPulseLaser,
      desc: t.weaponPulseDesc,
      stats: 'DMG 44 · Line Pierce · Cost 1 Cell',
    },
    {
      id: WeaponId.DISRUPTOR_CANNON,
      name: t.weaponDisruptor,
      desc: t.weaponDisruptorDesc,
      stats: 'DMG 102 · Auto-Optic Lock · Cost 2 Cells',
    },
  ];

  const itemSlots: {
    key: 'sphere' | 'medkit' | 'ammo' | 'patch' | 'oCore' | 'aCore' | 'ru9' | 'stock';
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
      key: 'oCore',
      icon: 'oCore',
      title: 'OpenAI Core',
      desc: 'Authentic OpenAI logo core dropped by bots. Swap into equity vault or smelt for 5,000 $RU9.',
      countLabel: `x${portfolio.oCores}`,
    },
    {
      key: 'aCore',
      icon: 'aCore',
      title: 'Anthropic Core',
      desc: 'Harvested from heavy A-Bulwark units. Swap into equity vault or smelt for 6,500 $RU9.',
      countLabel: `x${portfolio.aCores}`,
    },
    {
      key: 'ru9',
      icon: 'ru9',
      title: '$RU9 Token (1M Auto-Refresh)',
      desc: 'Each player starts with 1,000,000 $RU9 and automatically refreshes back to 1,000,000 whenever depleted.',
      countLabel: `${Math.round(portfolio.ru9).toLocaleString()}`,
    },
    {
      key: 'stock',
      icon: 'oaiStock',
      title: 'Synthetic Equity Vault',
      desc: `Holdings: ${portfolio.oaiShares.toFixed(2)} OpenAI · ${portfolio.anthShares.toFixed(2)} Anthropic`,
      countLabel: `${(portfolio.oaiShares + portfolio.anthShares).toFixed(1)} sh`,
    },
  ];

  const equippedMeta =
    weaponCatalog.find((w) => w.id === portfolio.equippedWeapon) || weaponCatalog[0];

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
          <button
            type="button"
            onClick={onClose}
            className="p-2 min-h-[40px] min-w-[40px] bg-zinc-900 hover:bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-300 hover:text-white transition-colors flex items-center justify-center"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT: Full-Body Space-Suit Doge Model + Skin Selector + Equipped Weapon Preview */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-[#131824] border border-zinc-800 rounded-xl p-4">
              <div className="flex items-center justify-between text-xs text-zinc-400 mb-3">
                <span>{t.chooseOperative}</span>
                <span className="font-mono text-zinc-200">{activeSkinMeta.name}</span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="relative w-24 h-32 rounded-xl overflow-hidden border border-zinc-700 bg-zinc-900/90 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={activeSkinMeta.portraitUrl}
                    alt={activeSkinMeta.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-400 mb-1">
                    {t.equippedTag} · {t.levelLabel} {portfolio.weaponLevels[equippedMeta.id]}/5
                  </div>
                  <div className="text-sm font-semibold text-white truncate">
                    {equippedMeta.name}
                  </div>
                  <WeaponPreviewArt weapon={equippedMeta.id} className="w-full h-14 mt-1" />
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
            </div>

            {/* Captured Blue-Eyed AI Partners */}
            {portfolio.companions.map((comp) => (
              <div
                key={comp.id}
                className="bg-[#131824] border border-sky-500/40 rounded-xl p-4 flex items-center gap-3.5"
              >
                <ItemPreviewArt
                  kind={comp.kind === CompanionKind.SCOUT_DOG ? 'roboDog' : 'roboCat'}
                  className="w-14 h-14 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="text-xs text-sky-400 font-mono tabular-nums">
                    BLUE-EYE ALLY · {t.levelLabel}.{comp.level}
                  </div>
                  <div className="text-sm font-semibold text-white truncate">{comp.nickname}</div>
                  <div className="text-xs text-zinc-400 truncate">
                    {comp.kind === CompanionKind.SCOUT_DOG ? t.scoutDogDesc : t.cyberCatDesc}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* RIGHT: 16-Slot Backpack Grid + Selected Item Inspector */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-5">
            <div>
              <div className="text-xs text-zinc-400 mb-2.5">
                Arsenal & Inventory Slots ({4 + itemSlots.length + portfolio.companions.length})
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-4 gap-2.5">
                {/* 4 Weapons with Preview Art */}
                {weaponCatalog.map((w, idx) => {
                  const isSel = selected.type === 'weapon' && selected.weaponId === w.id;
                  const isEq = portfolio.equippedWeapon === w.id;
                  return (
                    <button
                      key={w.id}
                      type="button"
                      onClick={() => setSelected({ type: 'weapon', weaponId: w.id })}
                      className={`relative p-2.5 rounded-lg border text-left transition-colors ${
                        isSel
                          ? 'bg-zinc-800/90 border-rose-500'
                          : 'bg-[#131824] border-zinc-800 hover:border-zinc-700'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-1">
                        <span>[{idx + 1}]</span>
                        <span>Lv.{portfolio.weaponLevels[w.id]}</span>
                      </div>
                      <WeaponPreviewArt weapon={w.id} className="w-full h-11" />
                      <div className="text-[11px] font-medium text-zinc-200 truncate mt-1">
                        {w.name}
                      </div>
                      {isEq && (
                        <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-400" />
                      )}
                    </button>
                  );
                })}

                {/* Consumables, Cores, Tokens */}
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
                        <span>{it.hotkey ? `[${it.hotkey}]` : 'ITEM'}</span>
                        <span className="text-zinc-200 font-semibold tabular-nums truncate max-w-[64px]">
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

                {/* Captured Companions in Backpack */}
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
                        <span>ALLY</span>
                        <span>Lv.{comp.level}</span>
                      </div>
                      <ItemPreviewArt
                        kind={comp.kind === CompanionKind.SCOUT_DOG ? 'roboDog' : 'roboCat'}
                        className="w-10 h-10 my-1"
                      />
                      <div className="text-[11px] text-zinc-200 truncate w-full text-center">
                        {comp.nickname}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Selected Slot Detail & Action Inspector */}
            <div className="bg-[#131824] border border-zinc-800 rounded-xl p-4">
              {selected.type === 'weapon' && (() => {
                const w = weaponCatalog.find((x) => x.id === selected.weaponId) || weaponCatalog[0];
                const isEquipped = portfolio.equippedWeapon === w.id;
                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-40 shrink-0 bg-zinc-900/90 border border-zinc-800 rounded-lg p-2">
                      <WeaponPreviewArt weapon={w.id} className="w-full h-16" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-rose-400 mb-0.5">
                        {w.stats} · {t.levelLabel} {portfolio.weaponLevels[w.id]}/5
                      </div>
                      <h3 className="text-base font-bold text-white">{w.name}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{w.desc}</p>
                    </div>
                    <button
                      type="button"
                      disabled={isEquipped}
                      onClick={() => onSelectWeapon(w.id)}
                      className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-emerald-400 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                    >
                      <Check className="w-3.5 h-3.5" />
                      {isEquipped ? t.equippedTag : t.equipBtn}
                    </button>
                  </div>
                );
              })()}

              {selected.type === 'item' && (() => {
                const it = itemSlots.find((x) => x.key === selected.itemKey) || itemSlots[0];
                const canUse =
                  (it.key === 'medkit' && portfolio.medkits > 0) ||
                  (it.key === 'ammo' && portfolio.energyPacks > 0) ||
                  (it.key === 'patch' && portfolio.firmwarePatches > 0);
                const canSmelt =
                  (it.key === 'oCore' && portfolio.oCores > 0) ||
                  (it.key === 'aCore' && portfolio.aCores > 0);

                return (
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="w-16 h-16 shrink-0 bg-zinc-900 border border-zinc-800 rounded-lg flex items-center justify-center">
                      <ItemPreviewArt kind={it.icon} className="w-11 h-11" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-mono text-zinc-400 mb-0.5">
                        Quantity: {it.countLabel}
                      </div>
                      <h3 className="text-base font-bold text-white">{it.title}</h3>
                      <p className="text-xs text-zinc-400 mt-1">{it.desc}</p>
                    </div>
                    {(it.key === 'medkit' || it.key === 'ammo' || it.key === 'patch') && (
                      <button
                        type="button"
                        disabled={!canUse}
                        onClick={() => onUseConsumable(it.key as 'medkit' | 'ammo' | 'patch')}
                        className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <Zap className="w-3.5 h-3.5" />
                        {t.useItemBtn}
                      </button>
                    )}
                    {(it.key === 'oCore' || it.key === 'aCore') && (
                      <button
                        type="button"
                        disabled={!canSmelt}
                        onClick={() => onSmeltCore(it.key as 'oCore' | 'aCore')}
                        className="px-4 py-2.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
                      >
                        <Flame className="w-3.5 h-3.5" />
                        {t.smeltToRu9Btn}
                      </button>
                    )}
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
                      kind={comp.kind === CompanionKind.SCOUT_DOG ? 'roboDog' : 'roboCat'}
                      className="w-16 h-16 shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h3 className="text-base font-bold text-white">{comp.nickname}</h3>
                      <p className="text-xs text-zinc-400 mt-1">
                        {comp.kind === CompanionKind.SCOUT_DOG ? t.scoutDogDesc : t.cyberCatDesc}
                      </p>
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
