import React from 'react';
import { Bot, Shield, Cpu, RefreshCw, Zap, Laptop, Smartphone } from 'lucide-react';
import { BotSettings } from '../types';

interface HeaderProps {
  settings: BotSettings;
  activePositionsCount: number;
  isSimulating: boolean;
  onRefresh: () => void;
  isMobileView: boolean;
  setIsMobileView: (val: boolean) => void;
  marketStatus: 'OPEN' | 'CLOSED';
}

export const Header: React.FC<HeaderProps> = ({
  settings,
  activePositionsCount,
  isSimulating,
  onRefresh,
  isMobileView,
  setIsMobileView,
  marketStatus
}) => {
  const totalPnL = settings.realized_pnl + settings.unrealized_pnl;
  const isPnLPositive = totalPnL >= 0;

  return (
    <header className="bg-slate-900 border-b border-slate-800 text-slate-100 sticky top-0 z-40 backdrop-blur-md bg-opacity-95">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 sm:py-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 sm:gap-4">
          
          {/* Logo & Status Title */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-cyan-500 via-indigo-600 to-emerald-500 p-0.5 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                  <Cpu className="w-5 h-5 text-cyan-400 animate-pulse" />
                </div>
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-cyan-400 via-indigo-300 to-emerald-400 bg-clip-text text-transparent">
                    AlphaTrader <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/60 font-mono">INDIA</span>
                  </h1>
                  <span className={`inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                    marketStatus === 'OPEN' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${marketStatus === 'OPEN' ? 'bg-emerald-400 animate-ping' : 'bg-amber-400'}`}></span>
                    NSE/MCX {marketStatus}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 hidden sm:block">Multi-LLM Autonomous Options & Commodities Bot • Self-Learning Engine</p>
              </div>
            </div>

            {/* Mobile Actions Right */}
            <div className="flex md:hidden items-center space-x-2">
              <button
                onClick={() => setIsMobileView(!isMobileView)}
                className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white"
                title="Toggle Mobile/Desktop view mode"
              >
                {isMobileView ? <Laptop className="w-4 h-4 text-cyan-400" /> : <Smartphone className="w-4 h-4 text-emerald-400" />}
              </button>
              <button
                onClick={onRefresh}
                className={`p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white ${isSimulating ? 'animate-spin text-cyan-400' : ''}`}
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Key Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs">
            
            {/* Mode & Broker */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
              <Bot className="w-4 h-4 text-indigo-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Mode / Broker</div>
                <div className="font-semibold text-slate-200 flex items-center space-x-1">
                  <span>{settings.trading_mode}</span>
                  <span className="text-[10px] text-cyan-400 font-mono">({settings.broker_provider})</span>
                </div>
              </div>
            </div>

            {/* Daily Trade Limit Guard */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
              <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Daily Limit Guard</div>
                <div className="font-semibold text-slate-200">
                  <span className={activePositionsCount >= settings.max_daily_positions ? 'text-rose-400 font-bold' : 'text-emerald-400'}>
                    {activePositionsCount}
                  </span>
                  <span className="text-slate-500"> / {settings.max_daily_positions} Max Trades</span>
                </div>
              </div>
            </div>

            {/* Portfolio Virtual Balance */}
            <div className="bg-slate-950/80 border border-slate-800 rounded-lg p-2 flex items-center space-x-2">
              <Zap className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Portfolio Capital</div>
                <div className="font-semibold text-slate-100 font-mono">
                  ₹{(settings.virtual_balance + totalPnL).toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Total P&L */}
            <div className={`bg-slate-950/80 border rounded-lg p-2 flex items-center space-x-2 ${
              isPnLPositive ? 'border-emerald-800/40 bg-emerald-950/10' : 'border-rose-800/40 bg-rose-950/10'
            }`}>
              <div>
                <div className="text-[10px] text-slate-400 uppercase font-mono">Total P&L (Realized + UnR)</div>
                <div className={`font-extrabold font-mono text-xs sm:text-sm ${isPnLPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {isPnLPositive ? '+' : ''}₹{totalPnL.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsMobileView(!isMobileView)}
              className="px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-slate-300 hover:text-white flex items-center space-x-1.5 transition-colors"
              title="Toggle view density"
            >
              {isMobileView ? (
                <>
                  <Laptop className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Desktop View</span>
                </>
              ) : (
                <>
                  <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Android Companion</span>
                </>
              )}
            </button>
            <button
              onClick={onRefresh}
              className={`p-2 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white transition-colors ${
                isSimulating ? 'animate-spin text-cyan-400' : ''
              }`}
              title="Fetch latest market quotes"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
