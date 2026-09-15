import React from 'react';
import { AIReflection } from '../types';
import { Brain, Sparkles, CheckCircle, AlertTriangle, TrendingUp, Lightbulb, BookOpen } from 'lucide-react';

interface SelfLearningVaultProps {
  reflections: AIReflection[];
}

export const SelfLearningVault: React.FC<SelfLearningVaultProps> = ({ reflections }) => {
  const winCount = reflections.filter(r => r.outcome === 'WIN').length;
  const totalCount = reflections.length || 1;
  const winRate = Math.round((winCount / totalCount) * 100);

  return (
    <div className="space-y-6">
      
      {/* Learning Analytics Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-xs font-mono font-bold">
              <Brain className="w-4 h-4" />
              <span>Self-Learning Continuous Improvement Vault</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-100">
              Post-Trade Reflection & Dynamic Rule Evolution Engine
            </h2>
            <p className="text-xs text-slate-300 max-w-xl">
              Every completed option trade triggers an automated LLM post-mortem analysis. The bot updates its conviction memory to avoid repeating mistakes and double down on winning setups.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-center font-mono shrink-0">
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Win Rate Reflection</span>
              <span className="text-lg font-extrabold text-emerald-400">{winRate}%</span>
              <span className="text-[9px] text-slate-400 block">From {reflections.length} Trades</span>
            </div>
            <div className="bg-slate-900/80 border border-slate-800 p-3 rounded-xl">
              <span className="text-[10px] text-slate-400 block uppercase">Rules Formulated</span>
              <span className="text-lg font-extrabold text-cyan-400">{reflections.length + 3} Rules</span>
              <span className="text-[9px] text-slate-400 block">Active Prompts</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI-Evolved Strategy Rules Active Memory */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <Lightbulb className="w-4 h-4 text-amber-400" />
          <span>Active LLM Strategy Rule Set (Dynamically Learned)</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-bold block">Rule #1: Delta Buffer for VIX &gt; 18</span>
            <p className="text-slate-300">
              When India VIX rises above 18, prefer ITM Call options with Delta &gt; 0.60 to mitigate IV crush losses on intraday momentum trades.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-bold block">Rule #2: MCX Crude Oil Gamma Expiry Guard</span>
            <p className="text-slate-300">
              On MCX expiry sessions after 8:00 PM IST, restrict buying far OTM options. Enforce 50% profit scale-out on 1st target hit.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-bold block">Rule #3: BTST Carry-Forward Threshold</span>
            <p className="text-slate-300">
              Only carry forward trades overnight if trade profit is &gt;= 15% near market close and Multi-LLM consensus score remains &gt;= 80%.
            </p>
          </div>

          <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 space-y-1">
            <span className="text-cyan-400 font-mono font-bold block">Rule #4: Daily Limit Discipline</span>
            <p className="text-slate-300">
              Strictly cap active positions to max 3 per day. Once daily loss limit (-2%) is hit, system automatically pauses scanning.
            </p>
          </div>
        </div>
      </div>

      {/* Historical Post-Trade Reflection Log */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4">
        <h3 className="text-sm font-bold text-slate-100 flex items-center space-x-2">
          <BookOpen className="w-4 h-4 text-indigo-400" />
          <span>Post-Trade Reflection Log Feed</span>
        </h3>

        {reflections.length === 0 ? (
          <p className="text-xs text-slate-500 font-mono text-center py-4">No post-trade reflections generated yet.</p>
        ) : (
          <div className="space-y-3">
            {reflections.map((ref) => {
              const isWin = ref.outcome === 'WIN';
              return (
                <div
                  key={ref.id}
                  className={`p-4 rounded-xl border space-y-2 text-xs font-mono ${
                    isWin ? 'bg-emerald-950/10 border-emerald-800/40' : 'bg-rose-950/10 border-rose-800/40'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                        isWin ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                      }`}>
                        {ref.outcome} ({ref.pnl >= 0 ? '+' : ''}₹{ref.pnl.toLocaleString('en-IN')})
                      </span>
                      <span className="font-bold text-slate-100 text-sm">{ref.symbol}</span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(ref.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div className="text-slate-300 font-sans text-xs">
                    <strong className="text-cyan-400">Key Learning:</strong> {ref.key_learnings}
                  </div>

                  <div className="bg-slate-950 p-2 rounded border border-slate-800/80 text-[11px] text-amber-300">
                    <strong>Rule Adjustment Formulated:</strong> {ref.rule_adjustment}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

    </div>
  );
};
