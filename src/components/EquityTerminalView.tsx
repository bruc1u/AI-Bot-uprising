import React from 'react';
import { ArrowRightLeft } from 'lucide-react';
import { ASSET_URLS } from '../game/assetLoader';
import { TranslationStrings } from '../i18n/translations';
import { EquityTicker, PlayerPortfolio } from '../types/game';
import { ItemPreviewArt } from './GameIllustrations';

interface EquityTerminalViewProps {
  t: TranslationStrings;
  portfolio: PlayerPortfolio;
  tickers: EquityTicker[];
  onConvertCoreToStock: (symbol: 'OpenAI' | 'Anthropic', mode?: 'one' | 'all') => void;
}

export const EquityTerminalView: React.FC<EquityTerminalViewProps> = ({
  t,
  portfolio,
  tickers,
  onConvertCoreToStock,
}) => {
  return (
    <div className="max-w-6xl mx-auto py-6 space-y-10">
      {/* Header & Core + Tokenized Stock Vault Summary (Strictly decoupled from $RU9) */}
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
              Robinhood Chain · Core-to-Tokenized-Stock Redemption Vault ($OPENAI · $ANTH)
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight">
            {t.terminalTitle}
          </h1>
          <p className="text-sm text-zinc-400 mt-2 max-w-2xl">{t.terminalSub}</p>
        </div>

        <div className="flex flex-wrap items-center gap-5 text-sm font-mono tabular-nums">
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
            <ItemPreviewArt kind="oaiStock" className="w-8 h-8" />
            <div>
              <div className="text-xs text-zinc-400">$OPENAI</div>
              <div className="text-lg font-semibold text-emerald-400">
                {portfolio.oaiShares.toFixed(2)}
              </div>
            </div>
          </div>
          <span className="text-zinc-800">/</span>
          <div className="flex items-center gap-2.5">
            <ItemPreviewArt kind="anthStock" className="w-8 h-8" />
            <div>
              <div className="text-xs text-zinc-400">$ANTH</div>
              <div className="text-lg font-semibold text-sky-400">
                {portfolio.anthShares.toFixed(2)}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* OpenAI Core -> $OPENAI & Anthropic Core -> $ANTH Tokenized Stock Vault Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tickers.map((tk) => {
          const isOai = tk.symbol === 'OpenAI';
          const coreOwned = isOai ? portfolio.oCores : portfolio.aCores;
          const sharesHeld = isOai ? portfolio.oaiShares : portfolio.anthShares;
          const coreFullName = isOai ? 'OpenAI Core' : 'Anthropic Core';

          const minH = Math.min(...tk.history);
          const maxH = Math.max(...tk.history);
          const spanH = Math.max(1, maxH - minH);
          const sparkPoints = tk.history
            .map((val, idx) => {
              const x = (idx / Math.max(1, tk.history.length - 1)) * 220;
              const y = 38 - ((val - minH) / spanH) * 30;
              return `${x.toFixed(1)},${y.toFixed(1)}`;
            })
            .join(' ');

          return (
            <div
              key={tk.symbol}
              className="bg-[#111520] border border-zinc-800/90 rounded-xl p-6 flex flex-col justify-between gap-5"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <ItemPreviewArt kind={isOai ? 'oCore' : 'aCore'} className="w-11 h-11 shrink-0" />
                    <div>
                      <div className="text-xs text-zinc-400 mb-0.5">
                        {coreFullName} Backed · Robinhood Chain RWA
                      </div>
                      <div className="flex items-baseline gap-2">
                        <h2 className="text-2xl font-bold text-white tracking-tight font-mono">
                          {tk.tokenTicker}
                        </h2>
                        <span className="text-xs font-mono text-zinc-400">· {tk.symbol}</span>
                      </div>
                      <p className="text-xs text-zinc-400">{t[tk.nameKey]}</p>
                    </div>
                  </div>

                  <div className="text-right font-mono tabular-nums">
                    <div className="text-xs text-zinc-400">Oracle Reference NAV</div>
                    <div className="text-lg font-semibold text-white">
                      ${tk.navUsd.toFixed(2)}
                    </div>
                    <div
                      className={`text-xs ${
                        tk.change24h >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {tk.change24h >= 0 ? '+' : ''}
                      {tk.change24h.toFixed(2)}%
                    </div>
                  </div>
                </div>

                {/* Live NAV Sparkline */}
                <div className="bg-[#090c14] border border-zinc-800/80 rounded-lg px-4 py-2.5 flex items-center justify-between gap-4">
                  <svg viewBox="0 0 220 44" className="w-44 h-10 shrink-0" fill="none" aria-hidden="true">
                    <polyline
                      points={sparkPoints}
                      stroke={isOai ? '#10b981' : '#38bdf8'}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="text-right font-mono tabular-nums text-xs">
                    <div className="text-zinc-400">{coreFullName}</div>
                    <div className="text-base font-bold text-sky-300">x{coreOwned}</div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-300 font-mono tabular-nums py-3 border-y border-zinc-800/80">
                  <span>
                    {t.exchangeRate}: 1 {coreFullName} = {tk.coreToShareRatio.toFixed(2)} {tk.tokenTicker}
                  </span>
                  <span>
                    {t.sharesHeld}:{' '}
                    <strong className={isOai ? 'text-emerald-400' : 'text-sky-400'}>
                      {sharesHeld.toFixed(2)} {tk.tokenTicker}
                    </strong>
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  disabled={coreOwned < 1}
                  onClick={() => onConvertCoreToStock(tk.symbol, 'one')}
                  className="flex-1 py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-rose-600 hover:bg-rose-500 disabled:bg-zinc-800 disabled:text-zinc-500 text-white transition-colors inline-flex items-center justify-center gap-1.5 whitespace-nowrap"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5" />
                  {t.convertCoreBtn}
                </button>
                <button
                  type="button"
                  disabled={coreOwned < 2}
                  onClick={() => onConvertCoreToStock(tk.symbol, 'all')}
                  className="py-2.5 px-4 min-h-[42px] text-xs font-semibold rounded-lg bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-700 text-zinc-100 transition-colors whitespace-nowrap tabular-nums"
                >
                  {t.convertAllCoresBtn} ({coreOwned})
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Robinhood Chain RWA Vault Architecture & On-Chain Minting Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
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
            <p className="text-xs text-zinc-400 leading-relaxed">{t.vibevibePoolDesc}</p>

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
                <span className="text-zinc-400">RWA Settlement L2</span>
                <span className="text-white font-semibold">Robinhood Chain (ID: 7999)</span>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-zinc-400">Tokenized Stock Pairs</span>
                <span className="text-emerald-400">OpenAI Core → $OPENAI · Anthropic Core → $ANTH</span>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7 bg-[#111520] border border-zinc-800/90 rounded-xl p-6">
          <h3 className="text-xl font-bold text-white mb-3">{t.ledgerHeading}</h3>
          {portfolio.txHistory.length === 0 ? (
            <p className="text-sm text-zinc-500 py-8 border-y border-zinc-800/70">{t.noTxYet}</p>
          ) : (
            <div className="overflow-x-auto border-y border-zinc-800/80">
              <table className="w-full text-left text-xs font-mono tabular-nums">
                <thead>
                  <tr className="text-zinc-400 border-b border-zinc-800/80">
                    <th className="py-3 pr-3 font-medium">Tx Hash</th>
                    <th className="py-3 px-3 font-medium">Venue</th>
                    <th className="py-3 px-3 font-medium">Action</th>
                    <th className="py-3 px-3 font-medium">Detail</th>
                    <th className="py-3 pl-3 text-right font-medium">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60 text-zinc-200">
                  {portfolio.txHistory.slice(0, 8).map((tx) => (
                    <tr key={tx.id}>
                      <td className="py-2.5 pr-3 text-zinc-400">{tx.hash}</td>
                      <td className="py-2.5 px-3">{tx.platform}</td>
                      <td className="py-2.5 px-3 text-white font-semibold">{tx.action}</td>
                      <td className="py-2.5 px-3 text-zinc-300">{tx.detail}</td>
                      <td className="py-2.5 pl-3 text-right text-emerald-400">{tx.amountLabel}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
