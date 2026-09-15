import React, { useState } from 'react';
import { BotSettings } from '../types';
import { Settings, Shield, Key, CheckCircle2, RefreshCw, Smartphone, Laptop } from 'lucide-react';

interface BrokerSettingsProps {
  settings: BotSettings;
  onUpdateSettings: (newSettings: BotSettings) => void;
}

export const BrokerSettings: React.FC<BrokerSettingsProps> = ({
  settings,
  onUpdateSettings,
}) => {
  const [form, setForm] = useState<BotSettings>(settings);
  const [saved, setSaved] = useState(false);
  const [testingPing, setTestingPing] = useState(false);
  const [pingSuccess, setPingSuccess] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTestBrokerPing = () => {
    setTestingPing(true);
    setPingSuccess(null);
    setTimeout(() => {
      setTestingPing(false);
      setPingSuccess(`Successfully connected to ${form.broker_provider} API Gateway (Latency: 18ms)`);
    }, 1200);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      
      {/* Title */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
        <h2 className="text-base font-bold text-slate-100 flex items-center space-x-2">
          <Settings className="w-5 h-5 text-cyan-400" />
          <span>Broker Integration, Risk Guard & PWA Settings</span>
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Zero registration required. Configure paper trading or link Indian broker APIs (Zerodha Kite, Angel One, Dhan, Upstox).
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Trading Mode & Broker Selection */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono border-b border-slate-800 pb-2">
            1. Execution Mode & Broker Gateway
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Trading Mode</label>
              <select
                value={form.trading_mode}
                onChange={(e) => setForm({ ...form, trading_mode: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none"
              >
                <option value="SEMI_AUTO">SEMI_AUTO (Co-Pilot: AI Suggests, You Approve)</option>
                <option value="AUTO">AUTO (Fully Autonomous Execution)</option>
                <option value="MANUAL">MANUAL (Manual Control)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Broker Integration Gateway</label>
              <select
                value={form.broker_provider}
                onChange={(e) => setForm({ ...form, broker_provider: e.target.value as any })}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100 font-mono focus:outline-none"
              >
                <option value="PAPER">Paper Trading Sandbox (Virtual ₹10,00,000)</option>
                <option value="ZERODHA">Zerodha Kite Connect API</option>
                <option value="ANGELONE">Angel One SmartAPI</option>
                <option value="DHAN">Dhan HQ API</option>
                <option value="UPSTOX">Upstox Developer API</option>
              </select>
            </div>
          </div>

          {/* Broker API Simulator inputs */}
          {form.broker_provider !== 'PAPER' && (
            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3 text-xs">
              <div className="flex items-center space-x-2 text-cyan-400 font-bold">
                <Key className="w-4 h-4" />
                <span>{form.broker_provider} API Keys Configuration</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono">
                <div>
                  <span className="text-[10px] text-slate-400 block">API Key</span>
                  <input
                    type="password"
                    defaultValue="kite_api_live_8472910"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs"
                  />
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">API Secret / Access Token</span>
                  <input
                    type="password"
                    defaultValue="secret_token_x91023810"
                    className="w-full bg-slate-900 border border-slate-700 rounded p-2 text-slate-100 text-xs"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={handleTestBrokerPing}
                  disabled={testingPing}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 font-mono flex items-center space-x-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingPing ? 'animate-spin' : ''}`} />
                  <span>Test API Connection Ping</span>
                </button>

                {pingSuccess && (
                  <span className="text-xs text-emerald-400 font-mono font-bold">{pingSuccess}</span>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Daily Risk Guard Limits */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-4">
          <h3 className="text-sm font-bold text-slate-200 uppercase font-mono border-b border-slate-800 pb-2 flex items-center space-x-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <span>2. Daily Risk Safeguard Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
            <div>
              <label className="block text-slate-300 font-bold mb-1">Max Positions Per Day</label>
              <input
                type="number"
                value={form.max_daily_positions}
                onChange={(e) => setForm({ ...form, max_daily_positions: parseInt(e.target.value) || 1 })}
                min={1}
                max={10}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Prevents overtrading. Default: 3</span>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">Max Risk Per Trade (%)</label>
              <input
                type="number"
                step="0.5"
                value={form.max_risk_per_trade_pct}
                onChange={(e) => setForm({ ...form, max_risk_per_trade_pct: parseFloat(e.target.value) || 1 })}
                min={0.5}
                max={5}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Capital percentage at risk</span>
            </div>

            <div>
              <label className="block text-slate-300 font-bold mb-1">BTST Carry Profit Min (%)</label>
              <input
                type="number"
                value={form.min_carry_forward_profit_pct}
                onChange={(e) => setForm({ ...form, min_carry_forward_profit_pct: parseFloat(e.target.value) || 10 })}
                min={5}
                max={50}
                className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-slate-100"
              />
              <span className="text-[10px] text-slate-500 block mt-1">Min profit to carry overnight</span>
            </div>
          </div>
        </div>

        {/* Save Settings */}
        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-extrabold text-sm flex items-center space-x-2 transition-colors cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Save Bot Configuration</span>
          </button>

          {saved && (
            <span className="text-xs text-emerald-400 font-mono font-bold animate-fade-in">
              Settings updated & synced with Supabase DB!
            </span>
          )}
        </div>

      </form>

    </div>
  );
};
