import React, { useState } from 'react';
import { Instrument, Trade, AgentDebateResult } from '../types';
import { CandleChart } from './CandleChart';
import { Play, Sparkles, Brain, CheckCircle, ShieldAlert, TrendingUp, TrendingDown, Clock, HelpCircle, Layers } from 'lucide-react';

interface TradingTerminalProps {
  instruments: Instrument[];
  selectedInstrument: Instrument | null;
  onSelectInstrument: (inst: Instrument) => void;
  activeTrades: Trade[];
  onExecuteTrade: (trade: Partial<Trade>) => void;
  dailyTradesCount: number;
  maxDailyPositions: number;
}

export const TradingTerminal: React.FC<TradingTerminalProps> = ({
  instruments,
  selectedInstrument,
  onSelectInstrument,
  onExecuteTrade,
  dailyTradesCount,
  maxDailyPositions,
}) => {
  const [analyzing, setAnalyzing] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<AgentDebateResult | null>(null);
  const [lots, setLots] = useState(1);
  const [carryForward, setCarryForward] = useState(true);

  if (!selectedInstrument) {
    return <div className="p-8 text-center text-slate-400">Loading instrument data...</div>;
  }

  const handleRunAiAnalysis = async () => {
    setAnalyzing(true);
    try {
      const res = await fetch('/api/ai-analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symbol: selectedInstrument.symbol,
          spot_price: selectedInstrument.spot_price,
          vix: selectedInstrument.vix,
          pcr: selectedInstrument.pcr,
          max_pain: selectedInstrument.max_pain
        })
      });
      const data = await res.json();
      setAiAnalysis(data);
    } catch (err) {
      console.error('AI Debate Analysis Error:', err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirmExecute = () => {
    if (!aiAnalysis) return;
    const qty = selectedInstrument.lot_size * lots;
    onExecuteTrade({
      symbol: selectedInstrument.symbol,
      option_type: aiAnalysis.option_type,
      strike_price: aiAnalysis.strike_price,
      action: 'BUY',
      entry_price: aiAnalysis.estimated_premium,
      target_price: aiAnalysis.target_price_1,
      stop_loss: aiAnalysis.stop_loss_price,
      quantity: qty,
      lots: lots,
      ai_conviction: aiAnalysis.consensus_score,
      ai_rationale: aiAnalysis.execution_recommendation,
      is_overnight: carryForward,
    });
    setAiAnalysis(null);
  };

  const isDailyLimitReached = dailyTradesCount >= maxDailyPositions;

  return (
    <div className="space-y-4">
      
      {/* Asset Quick Selector Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-none">
        {instruments.map((inst) => {
          const isSelected = selectedInstrument.symbol === inst.symbol;
          const isPos = inst.change_pct >= 0;
          return (
            <button
              key={inst.id}
              onClick={() => {
                onSelectInstrument(inst);
                setAiAnalysis(null);
              }}
              className={`flex flex-col items-start px-3.5 py-2 rounded-xl border min-w-[130px] transition-all cursor-pointer ${
                isSelected
                  ? 'bg-slate-800 border-cyan-400 shadow-md shadow-cyan-500/10'
                  : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <span className="font-extrabold text-xs text-slate-100">{inst.symbol}</span>
                <span className={`text-[10px] font-mono font-bold ${isPos ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPos ? '+' : ''}{inst.change_pct}%
                </span>
              </div>
              <div className="text-[11px] font-mono text-slate-300 mt-0.5">
                ₹{inst.spot_price.toLocaleString('en-IN')}
              </div>
              <div className="text-[9px] text-slate-400 font-mono mt-0.5">
                PCR {inst.pcr} • VIX {inst.vix}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Grid: Chart & Multi-LLM Debate Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Left Column: Chart & Market Snapshot (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Interactive Chart */}
          <CandleChart
            symbol={selectedInstrument.symbol}
            spotPrice={selectedInstrument.spot_price}
            changePct={selectedInstrument.change_pct}
          />

          {/* Key Option Micro Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs font-mono">
            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Put-Call Ratio (PCR)</span>
              <span className="font-bold text-slate-100 text-sm">{selectedInstrument.pcr}</span>
              <span className="text-[9px] text-emerald-400 block mt-0.5">
                {selectedInstrument.pcr > 1.0 ? 'Bullish Sentiment' : 'Bearish Pressure'}
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">India VIX</span>
              <span className="font-bold text-amber-400 text-sm">{selectedInstrument.vix}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Moderate IV Volatility</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Max Pain Strike</span>
              <span className="font-bold text-cyan-400 text-sm">{selectedInstrument.max_pain.toLocaleString('en-IN')}</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">Gravity Pin Target</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Lot Size / Expiry</span>
              <span className="font-bold text-slate-100 text-sm">{selectedInstrument.lot_size} Qty</span>
              <span className="text-[9px] text-slate-400 block mt-0.5">{selectedInstrument.expiry_date}</span>
            </div>
          </div>

          {/* Trigger Scan Button */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>Multi-LLM Consensus Engine</span>
              </h3>
              <p className="text-xs text-slate-400">
                Runs 4 specialized LLM Agents (Macro, Technical, Risk, Memory) to debate strike selection.
              </p>
            </div>

            <button
              onClick={handleRunAiAnalysis}
              disabled={analyzing || isDailyLimitReached}
              className={`w-full sm:w-auto px-5 py-2.5 rounded-xl font-bold text-xs flex items-center justify-center space-x-2 transition-all cursor-pointer shadow-lg ${
                isDailyLimitReached
                  ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                  : 'bg-gradient-to-r from-cyan-500 via-indigo-600 to-emerald-500 text-white hover:opacity-95 shadow-cyan-500/20'
              }`}
            >
              {analyzing ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin text-white" />
                  <span>4 LLMs Debating...</span>
                </>
              ) : isDailyLimitReached ? (
                <>
                  <ShieldAlert className="w-4 h-4 text-rose-400" />
                  <span>Max Daily Positions Reached</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-cyan-300" />
                  <span>Run 4-LLM Scan ({selectedInstrument.symbol})</span>
                </>
              )}
            </button>
          </div>

        </div>

        {/* Right Column: Multi-LLM Debate Panel & Order Console (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          
          {aiAnalysis ? (
            <div className="bg-slate-900 border border-cyan-500/40 rounded-xl p-4 space-y-4 shadow-xl shadow-cyan-500/5 animate-fade-in">
              
              {/* Signal Header */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <div className={`p-2 rounded-xl ${
                    aiAnalysis.signal === 'BULLISH_CE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                  }`}>
                    {aiAnalysis.signal === 'BULLISH_CE' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
                  </div>
                  <div>
                    <div className="text-[10px] text-slate-400 uppercase font-mono">Consensus Recommendation</div>
                    <div className="font-extrabold text-sm text-slate-100 flex items-center space-x-2">
                      <span>{aiAnalysis.recommended_option}</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800 font-mono">
                        {aiAnalysis.consensus_score}% Conviction
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 4 LLM Agent Votes Cards */}
              <div className="space-y-2">
                <div className="text-[11px] font-bold text-slate-300 uppercase font-mono">4-LLM Specialist Debate Breakdown:</div>

                {/* Agent 1 */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-cyan-400 flex items-center">
                      <Layers className="w-3.5 h-3.5 mr-1" />
                      {aiAnalysis.agents.macro_agent.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-mono">
                      {aiAnalysis.agents.macro_agent.vote} ({aiAnalysis.agents.macro_agent.confidence}%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{aiAnalysis.agents.macro_agent.reasoning}</p>
                </div>

                {/* Agent 2 */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-indigo-400 flex items-center">
                      <TrendingUp className="w-3.5 h-3.5 mr-1" />
                      {aiAnalysis.agents.technical_agent.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 font-mono">
                      {aiAnalysis.agents.technical_agent.vote} ({aiAnalysis.agents.technical_agent.confidence}%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{aiAnalysis.agents.technical_agent.reasoning}</p>
                </div>

                {/* Agent 3 */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-emerald-400 flex items-center">
                      <ShieldAlert className="w-3.5 h-3.5 mr-1" />
                      {aiAnalysis.agents.risk_agent.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-400 font-mono">
                      {aiAnalysis.agents.risk_agent.vote} ({aiAnalysis.agents.risk_agent.confidence}%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{aiAnalysis.agents.risk_agent.reasoning}</p>
                </div>

                {/* Agent 4 */}
                <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-amber-400 flex items-center">
                      <Brain className="w-3.5 h-3.5 mr-1" />
                      {aiAnalysis.agents.memory_agent.name}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 font-mono">
                      {aiAnalysis.agents.memory_agent.vote} ({aiAnalysis.agents.memory_agent.confidence}%)
                    </span>
                  </div>
                  <p className="text-slate-300 text-[11px]">{aiAnalysis.agents.memory_agent.reasoning}</p>
                </div>

              </div>

              {/* Proposed Trade Metrics */}
              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 space-y-2 text-xs">
                <div className="grid grid-cols-3 gap-2 text-center font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Est. Premium</span>
                    <span className="font-bold text-slate-100">₹{aiAnalysis.estimated_premium}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Target 1 / Target 2</span>
                    <span className="font-bold text-emerald-400">₹{aiAnalysis.target_price_1} / ₹{aiAnalysis.target_price_2}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block">Stop-Loss</span>
                    <span className="font-bold text-rose-400">₹{aiAnalysis.stop_loss_price}</span>
                  </div>
                </div>

                {/* Sizing & Carry Forward */}
                <div className="pt-2 border-t border-slate-800 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-slate-400 text-[11px]">Lots:</span>
                    <button
                      onClick={() => setLots(Math.max(1, lots - 1))}
                      className="w-6 h-6 bg-slate-800 rounded text-slate-200 text-xs font-bold hover:bg-slate-700"
                    >
                      -
                    </button>
                    <span className="font-mono font-bold text-slate-100">{lots} ({lots * selectedInstrument.lot_size} qty)</span>
                    <button
                      onClick={() => setLots(lots + 1)}
                      className="w-6 h-6 bg-slate-800 rounded text-slate-200 text-xs font-bold hover:bg-slate-700"
                    >
                      +
                    </button>
                  </div>

                  <label className="flex items-center space-x-1.5 text-xs text-slate-300 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={carryForward}
                      onChange={(e) => setCarryForward(e.target.checked)}
                      className="rounded bg-slate-800 border-slate-700 text-cyan-500 focus:ring-0"
                    />
                    <span className="text-[11px]">Auto BTST Carry-Forward</span>
                  </label>
                </div>
              </div>

              {/* Execute Action Button */}
              <button
                onClick={handleConfirmExecute}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white font-extrabold text-sm flex items-center justify-center space-x-2 hover:opacity-95 shadow-lg shadow-emerald-500/20 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Execute Trade ({lots * selectedInstrument.lot_size} Qty @ ₹{aiAnalysis.estimated_premium})</span>
              </button>

            </div>
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mx-auto text-cyan-400">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-slate-200 text-sm">Multi-LLM Scouter Ready</h4>
                <p className="text-xs text-slate-400 max-w-xs mx-auto mt-1">
                  Click "Run 4-LLM Scan" to initiate deep real-time option chain evaluation across Macro, Technical, Risk & AI Memory models.
                </p>
              </div>
              <div className="text-[11px] text-slate-500 font-mono bg-slate-950 p-2 rounded-lg max-w-xs mx-auto">
                Daily Safeguard: Max {maxDailyPositions} positions/day. Overnight profit carry-forward active.
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
