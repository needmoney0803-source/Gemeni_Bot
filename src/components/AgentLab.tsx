import React from 'react';
import { Cpu, Layers, ShieldCheck, Brain, Sliders, CheckCircle2 } from 'lucide-react';

export const AgentLab: React.FC = () => {
  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-cyan-400" />
          <span>Multi-LLM Specialist Intelligence Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Deep dive into the 4 LLMs that debate options setups before trade signals are emitted.
        </p>
      </div>

      {/* 4 Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Agent 1 */}
        <div className="bg-slate-900 border border-cyan-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Agent 1: Macro & Delta Trend LLM</h3>
                <span className="text-[10px] text-cyan-400 font-mono">Specialized in Market Structure & Open Interest</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">Active</span>
          </div>
          <p className="text-xs text-slate-300">
            Analyzes Put-Call Ratio (PCR), Max Pain gravity levels, FII/DII net flows, and option chain call/put resistance buildup.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            Weights: PCR (35%) • Max Pain (30%) • VIX (20%) • FII Flow (15%)
          </div>
        </div>

        {/* Agent 2 */}
        <div className="bg-slate-900 border border-indigo-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-indigo-950 text-indigo-400 border border-indigo-800">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Agent 2: Technical & Price Action LLM</h3>
                <span className="text-[10px] text-indigo-400 font-mono">Specialized in VWAP & Momentum Breakouts</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">Active</span>
          </div>
          <p className="text-xs text-slate-300">
            Evaluates 15-min and 5-min VWAP crossovers, Supertrend signals, RSI divergence, and candlestick pattern confirmations.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            Weights: VWAP (40%) • Supertrend (30%) • RSI Momentum (30%)
          </div>
        </div>

        {/* Agent 3 */}
        <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Agent 3: Risk & Capital Guard LLM</h3>
                <span className="text-[10px] text-emerald-400 font-mono">Specialized in Daily Position Limits & SL Math</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">Active</span>
          </div>
          <p className="text-xs text-slate-300">
            Strictly enforces daily max position limits (3 trades/day), minimum risk-reward ratio check (&gt;= 1:2.5), and stop-loss placement.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            Limits: Max 3 Positions/Day • Max Risk 2.0%/Trade • Min R:R 1:2.5
          </div>
        </div>

        {/* Agent 4 */}
        <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-5 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="p-2 rounded-lg bg-amber-950 text-amber-400 border border-amber-800">
                <Brain className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-100 text-sm">Agent 4: Self-Learning Memory LLM</h3>
                <span className="text-[10px] text-amber-400 font-mono">Specialized in Post-Trade Reflection Matching</span>
              </div>
            </div>
            <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">Active</span>
          </div>
          <p className="text-xs text-slate-300">
            Compares live market setups against historical winning/losing trades stored in Supabase to calculate similarity match scores.
          </p>
          <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] font-mono text-slate-400">
            Vault Memory: Dynamic Rule Evolution Enabled
          </div>
        </div>

      </div>

    </div>
  );
};
