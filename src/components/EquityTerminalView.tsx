import React from 'react';
import { Flame } from 'lucide-react';
import { ASSET_URLS } from '../game/assetLoader';
import { TranslationStrings } from '../i18n/translations';
import { EquityTicker, PlayerPortfolio } from '../types/game';
import { ItemPreviewArt } from './GameIllustrations';

interface EquityTerminalViewProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  tickers: EquityTicker[];
  onConvertCoreToStock: (symbol: 'OpenAI' | 'Anthropic') => void;
  onSellStockForRu9: (symbol: 'OpenAI' | 'Anthropic') => void;
  onSmeltCoreToRu9: (coreType: 'oCore' | 'aCore') => void;
}

export const EquityTerminalView: React.FC<EquityTerminalViewProps> = ({
  t,
  portfolio,
  tickers,
  onConvertCoreToStock,
  onSellStockForRu9,
  onSmeltCoreToRu9,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 space-y-10">
      {/* Header & Portfolio Summary Strip with Full Core Names */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-zinc-800/80">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <img
              src={ASSET_URLS.VIBEVIBE_LOGO}
              alt="vibe/vibe"
              referrerPolicy="no-referrer"
              className="h-6 w-auto rounded bg-black px-1.5 py-0.5 object-contain"
            />
            <span className="text-xs text-zinc-400">
              Robinhood Chain · OpenAI Core & Anthropic Core Liquidation Vault
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.terminalTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.terminalSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-6 text-sm font-mono tabular-nums">
          <div className="flex items-center gap-2.5">
            <ItemPreviewArt kind="oCore" className="w-8 h-8" />
            <div>
              <div className="text-xs text-zinc-400">OpenAI Core</div>
              <div className="text-lg font-semibold text-white">{portfolio.oCores}</div>
            </div>
          </div>
          <span className="text-zinc-800">/</span>
          <div className="flex items-center gap-2.5">
            <ItemPreviewArt kind="aCore" className="w-8 h-8" />
            <div>
              <div className="text-xs text-zinc-400">Anthropic Core</div>
              <div className="text-lg font-semibold text-cyan-400">{portfolio.aCores}</div>
            </div>
          </div>
          <span className="text-zinc-800">/</span>
          <div className="flex items-center gap-2.5">
            <ItemPreviewArt kind="ru9" className="w-8 h-8" />
            <div>
              <div className="text-xs text-zinc-400">$RU9 (1M Auto-Refresh)</div>
              <div className="text-lg font-semibold text-amber-400">
                {Math.round(portfolio.ru9).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OpenAI & Anthropic Core Conversion Vault Cards (No stock price ticker displayed) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickers.map((tk) => {
          const isOai = tk.symbol === 'OpenAI';
          const coreOwned = isOai ? portfolio.oCores : portfolio.aCores;
          const sharesHeld = isOai ? portfolio.oaiShares : portfolio.anthShares;
          const coreFullName = isOai ? 'OpenAI Core' : 'Anthropic Core';

          return (
            <div
              key={tk.symbol}
              className="bg-[#111520] border border-zinc-800/90 rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <ItemPreviewArt kind={isOai ? 'oCore' : 'aCore'} className="w-11 h-11 shrink-0" />
                    <div>
                      <div className="text-xs text-zinc-400 mb-0.5">
                        {coreFullName} Backed · Robinhood Chain Vault
                      </div>
                      <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
                        {tk.symbol}
                      </h2>
                      <p className="text-xs text-zinc-400">{t[tk.nameKey]}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="text-xs text-zinc-400">Available</div>
                    <div className="text-lg font-semibold text-sky-400">
                      {coreOwned} {coreFullName}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-zinc-300 font-mono tabular-nums py-3 border-y border-zinc-800/80">
                  <span>
                    {t.exchangeRate}: 1 {coreFullName} = {tk.coreToShareRatio.toFixed(2)} {tk.symbol}
                  </span>
                  <span>
                    {t.sharesHeld}: <strong className="text-zinc-100">{sharesHeld.toFixed(2)}</strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={coreOwned < 1}
                  onClick={() => onConvertCoreToStock(tk.symbol)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors whitespace-nowrap shrink-0"
                >
                  {t.convertCoreBtn}
                </button>
                <button
                  type="button"
                  disabled={sharesHeld < 0.25}
                  onClick={() => onSellStockForRu9(tk.symbol)}
                  className="flex-1 py-2.5 px-4 text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-45 border border-zinc-700 text-zinc-100 transition-colors whitespace-nowrap shrink-0"
                >
                  {t.sellStockBtn}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Direct Core Smelter & vibevibe.fun Pool Status */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        <div className="lg:col-span-7 bg-[#111520] border border-zinc-800/90 rounded-xl p-6 space-y-5">
          <div>
            <h3 className="text-xl font-bold text-white">{t.smelterHeading}</h3>
            <p className="text-xs text-zinc-400 mt-1">{t.smelterDesc}</p>
          </div>

          <div className="divide-y divide-zinc-800/80 text-sm">
            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ItemPreviewArt kind="oCore" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-semibold text-white">OpenAI Core → 5,000 $RU9</div>
                  <div className="text-xs text-zinc-400 font-mono tabular-nums">
                    Owned: {portfolio.oCores} · OpenAI Underlying Processor Core
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={portfolio.oCores < 1}
                onClick={() => onSmeltCoreToRu9('oCore')}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Flame className="w-3.5 h-3.5" />
                {t.smeltToRu9Btn}
              </button>
            </div>

            <div className="py-3.5 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <ItemPreviewArt kind="aCore" className="w-10 h-10 shrink-0" />
                <div>
                  <div className="font-semibold text-white">Anthropic Core → 6,500 $RU9</div>
                  <div className="text-xs text-zinc-400 font-mono tabular-nums">
                    Owned: {portfolio.aCores} · Anthropic Heavy Shield Core
                  </div>
                </div>
              </div>
              <button
                type="button"
                disabled={portfolio.aCores < 1}
                onClick={() => onSmeltCoreToRu9('aCore')}
                className="px-4 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-800 disabled:text-zinc-500 text-zinc-950 rounded-lg transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
              >
                <Flame className="w-3.5 h-3.5" />
                {t.smeltToRu9Btn}
              </button>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 bg-[#111520] border border-zinc-800/90 rounded-xl p-6 flex flex-col justify-between gap-4">
          <div>
            <div className="flex items-center justify-between gap-3 mb-2">
              <h3 className="text-xl font-bold text-white">{t.vibevibePoolHeading}</h3>
              <img
                src={ASSET_URLS.VIBEVIBE_LOGO}
                alt="vibe/vibe"
                referrerPolicy="no-referrer"
                className="h-7 w-auto rounded bg-black px-2 py-0.5 object-contain"
              />
            </div>
            <p className="text-xs text-zinc-400">{t.vibevibePoolDesc}</p>

            <div className="mt-4 rounded-lg overflow-hidden border border-zinc-800/90 h-28 relative">
              <img
                src={ASSET_URLS.TRADE_ROOM}
                alt="Sanctuary Trade Room"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>

            <div className="mt-4 space-y-2 text-xs font-mono tabular-nums text-zinc-300">
              <div className="flex justify-between py-1 border-b border-zinc-800/70">
                <span className="text-zinc-400">Launchpad</span>
                <span className="text-[#d9ff00] font-semibold">vibevibe.fun</span>
              </div>
              <div className="flex justify-between py-1 border-b border-zinc-800/70">
                <span className="text-zinc-400">Settlement L2</span>
                <span className="text-white font-semibold">Robinhood Chain (ID: 7999)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Core Assets</span>
                <span className="text-amber-400">OpenAI Core · Anthropic Core · $RU9</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settlement Ledger */}
      <div className="pt-2">
        <h3 className="text-xl font-bold text-white mb-3">{t.ledgerHeading}</h3>
        {portfolio.txHistory.length === 0 ? (
          <p className="text-sm text-zinc-500 py-6 border-y border-zinc-800/70">{t.noTxYet}</p>
        ) : (
          <div className="overflow-x-auto border-y border-zinc-800/80">
            <table className="w-full text-left text-xs font-mono tabular-nums">
              <thead>
                <tr className="text-zinc-400 border-b border-zinc-800/80">
                  <th className="py-3 pr-4 font-medium">Tx Hash</th>
                  <th className="py-3 px-4 font-medium">Venue</th>
                  <th className="py-3 px-4 font-medium">Action</th>
                  <th className="py-3 px-4 font-medium">Detail</th>
                  <th className="py-3 pl-4 text-right font-medium">Settlement</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                {portfolio.txHistory.slice(0, 8).map((tx) => (
                  <tr key={tx.id}>
                    <td className="py-2.5 pr-4 text-zinc-400">{tx.hash}</td>
                    <td className="py-2.5 px-4">{tx.platform}</td>
                    <td className="py-2.5 px-4 text-white font-semibold">{tx.action}</td>
                    <td className="py-2.5 px-4 text-zinc-300">{tx.detail}</td>
                    <td className="py-2.5 pl-4 text-right text-amber-400">{tx.amountLabel}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
