import React from 'react';
import { Trade } from '../types';
import { Briefcase, ArrowUpRight, ArrowDownRight, Clock, Zap, ShieldCheck, CheckCircle2, TrendingUp, RefreshCcw } from 'lucide-react';

interface PositionsManagerProps {
  trades: Trade[];
  onCloseTrade: (id: number) => void;
  onToggleCarryForward: (id: number, currentVal: boolean) => void;
}

export const PositionsManager: React.FC<PositionsManagerProps> = ({
  trades,
  onCloseTrade,
  onToggleCarryForward,
}) => {
  const activeTrades = trades.filter(t => t.status === 'ACTIVE' || t.status === 'CARRY_FORWARD');
  const closedTrades = trades.filter(t => t.status === 'CLOSED');

  const totalUnrealizedPnL = activeTrades.reduce((sum, t) => sum + t.pnl, 0);

  return (
    <div className="space-y-6">
      
      {/* Active Positions Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <Briefcase className="w-5 h-5 text-emerald-400" />
            <h2 className="text-base font-bold text-slate-100">Active Option Positions ({activeTrades.length})</h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated Trailing Stop-Loss & Smart Carry-Forward BTST/STBT rules applied.
          </p>
        </div>

        <div className="flex items-center space-x-4 font-mono">
          <div className="bg-slate-950 px-3 py-1.5 rounded-lg border border-slate-800 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Unrealized MTM P&L</span>
            <span className={`font-extrabold text-sm ${totalUnrealizedPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}₹{totalUnrealizedPnL.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Active Positions List */}
      {activeTrades.length === 0 ? (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center text-slate-400 text-sm">
          No active positions currently held. Use the Scouter terminal or Option Chain to initiate trades.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {activeTrades.map((trade) => {
            const isWin = trade.pnl >= 0;
            return (
              <div
                key={trade.id}
                className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3 shadow-lg relative overflow-hidden"
              >
                {/* Carry Forward Banner if active */}
                {trade.is_overnight && (
                  <div className="absolute top-0 right-0 bg-cyan-500/20 text-cyan-400 border-l border-b border-cyan-500/40 text-[9px] font-mono px-2 py-0.5 rounded-bl uppercase font-bold flex items-center space-x-1">
                    <Clock className="w-3 h-3 mr-0.5" />
                    <span>BTST CARRY-FORWARD</span>
                  </div>
                )}

                {/* Trade Header */}
                <div className="flex items-center justify-between pt-1">
                  <div>
                    <div className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                      <span>{trade.symbol} {trade.strike_price} {trade.option_type}</span>
                      <span className="text-xs font-mono text-cyan-400">({trade.lots} Lot / {trade.quantity} Qty)</span>
                    </div>
                    <div className="text-[10px] text-slate-400 font-mono mt-0.5">
                      Entry @ ₹{trade.entry_price} • Time: {new Date(trade.entry_time).toLocaleTimeString()}
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <div className={`font-extrabold text-base ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {isWin ? '+' : ''}₹{trade.pnl.toLocaleString('en-IN')}
                    </div>
                    <div className={`text-[10px] font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                      ({isWin ? '+' : ''}{trade.pnl_pct}%)
                    </div>
                  </div>
                </div>

                {/* Target & SL Progress Bar */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs font-mono space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-rose-400 font-bold">SL: ₹{trade.stop_loss}</span>
                    <span className="text-slate-100 font-bold">LTP: ₹{trade.current_price}</span>
                    <span className="text-emerald-400 font-bold">TGT: ₹{trade.target_price}</span>
                  </div>
                  
                  {/* Conviction & Rationale */}
                  <div className="text-[10px] text-slate-400 border-t border-slate-800/80 pt-1 flex items-center justify-between">
                    <span>AI Rationale: {trade.ai_rationale}</span>
                    <span className="text-cyan-400 font-bold">{trade.ai_conviction}% Conviction</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={() => onToggleCarryForward(trade.id, trade.is_overnight)}
                    className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-all cursor-pointer ${
                      trade.is_overnight
                        ? 'bg-cyan-950 text-cyan-400 border-cyan-800 font-bold'
                        : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    {trade.is_overnight ? '✓ Carrying Forward' : 'Enable Carry Forward'}
                  </button>

                  <button
                    onClick={() => onCloseTrade(trade.id)}
                    className="px-4 py-1.5 rounded-lg bg-rose-600/20 text-rose-400 border border-rose-500/30 hover:bg-rose-600 hover:text-white text-xs font-bold transition-all cursor-pointer"
                  >
                    Close Position
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Closed Positions History */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-200">Closed Positions History ({closedTrades.length})</h3>

        {closedTrades.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono">No closed trades yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="bg-slate-950 text-slate-400 border-b border-slate-800 uppercase text-[10px]">
                <tr>
                  <th className="py-2 px-3">Trade ID / Symbol</th>
                  <th className="py-2 px-3">Entry / Exit</th>
                  <th className="py-2 px-3">Qty</th>
                  <th className="py-2 px-3 text-right">Realized P&L</th>
                  <th className="py-2 px-3 text-right">AI Reflection</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {closedTrades.map((t) => {
                  const isWin = t.pnl >= 0;
                  return (
                    <tr key={t.id} className="hover:bg-slate-800/40">
                      <td className="py-2 px-3 font-bold text-slate-100">
                        {t.trade_id} - {t.symbol} {t.strike_price} {t.option_type}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        ₹{t.entry_price} → ₹{t.current_price}
                      </td>
                      <td className="py-2 px-3 text-slate-400">
                        {t.quantity}
                      </td>
                      <td className={`py-2 px-3 text-right font-bold ${isWin ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {isWin ? '+' : ''}₹{t.pnl.toLocaleString('en-IN')} ({t.pnl_pct}%)
                      </td>
                      <td className="py-2 px-3 text-right text-cyan-400">
                        Recorded in Vault ✓
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
