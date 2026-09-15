import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Navigation } from './components/Navigation';
import { TradingTerminal } from './components/TradingTerminal';
import { OptionChain } from './components/OptionChain';
import { PositionsManager } from './components/PositionsManager';
import { SelfLearningVault } from './components/SelfLearningVault';
import { AgentLab } from './components/AgentLab';
import { BrokerSettings } from './components/BrokerSettings';
import { Instrument, OptionStrike, Trade, AIReflection, BotSettings } from './types';

export function App() {
  const [activeTab, setActiveTab] = useState('terminal');
  const [isMobileView, setIsMobileView] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // Core States
  const [instruments, setInstruments] = useState<Instrument[]>([]);
  const [selectedInstrument, setSelectedInstrument] = useState<Instrument | null>(null);
  const [optionChain, setOptionChain] = useState<OptionStrike[]>([]);
  const [trades, setTrades] = useState<Trade[]>([]);
  const [reflections, setReflections] = useState<AIReflection[]>([]);
  const [settings, setSettings] = useState<BotSettings>({
    trading_mode: 'SEMI_AUTO',
    broker_provider: 'PAPER',
    max_daily_positions: 3,
    max_risk_per_trade_pct: 2.0,
    enable_carry_forward: true,
    min_carry_forward_profit_pct: 15.0,
    virtual_balance: 1000000,
    realized_pnl: 34250,
    unrealized_pnl: 8120,
  });

  // Initial Data Fetch
  const fetchData = async () => {
    setIsSimulating(true);
    try {
      // 1. Fetch Instruments
      const resInst = await fetch('/api/instruments');
      const instData = await resInst.json();
      if (Array.isArray(instData) && instData.length > 0) {
        setInstruments(instData);
        if (!selectedInstrument) {
          setSelectedInstrument(instData[0]);
        }
      }

      // 2. Fetch Trades
      const resTrades = await fetch('/api/trades');
      const tradesData = await resTrades.json();
      if (Array.isArray(tradesData)) {
        setTrades(tradesData);
      }

      // 3. Fetch Reflections
      const resRef = await fetch('/api/ai-reflections');
      const refData = await resRef.json();
      if (Array.isArray(refData)) {
        setReflections(refData);
      }

      // 4. Fetch Settings
      const resSet = await fetch('/api/settings');
      const setData = await resSet.json();
      if (setData && !setData.error) {
        setSettings(setData);
      }
    } catch (err) {
      console.error('Data Fetching Error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Fetch Option Chain when selected instrument changes
  useEffect(() => {
    if (!selectedInstrument) return;
    const fetchOptions = async () => {
      try {
        const res = await fetch(`/api/options?symbol=${selectedInstrument.symbol}`);
        const data = await res.json();
        if (Array.isArray(data)) {
          setOptionChain(data);
        }
      } catch (err) {
        console.error('Option Chain fetch error:', err);
      }
    };
    fetchOptions();
  }, [selectedInstrument]);

  // Handle Trade Execution
  const handleExecuteTrade = async (newTradeData: Partial<Trade>) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTradeData),
      });
      if (res.ok) {
        fetchData();
        setActiveTab('positions');
      }
    } catch (err) {
      console.error('Execute Trade Error:', err);
    }
  };

  // Handle Close Trade
  const handleCloseTrade = async (tradeId: number) => {
    try {
      const trade = trades.find(t => t.id === tradeId);
      if (!trade) return;
      const simulatedExitPrice = trade.entry_price * (1 + (Math.random() > 0.3 ? 0.25 : -0.15));

      const res = await fetch('/api/trades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tradeId,
          status: 'CLOSED',
          current_price: Math.round(simulatedExitPrice),
          exit_time: new Date().toISOString(),
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Close Trade Error:', err);
    }
  };

  // Toggle Carry Forward
  const handleToggleCarryForward = async (tradeId: number, currentVal: boolean) => {
    try {
      const res = await fetch('/api/trades', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: tradeId,
          is_overnight: !currentVal,
          status: !currentVal ? 'CARRY_FORWARD' : 'ACTIVE',
        }),
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Toggle Carry Forward Error:', err);
    }
  };

  // Update Settings
  const handleUpdateSettings = async (newSettings: BotSettings) => {
    try {
      const res = await fetch('/api/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSettings),
      });
      if (res.ok) {
        const updated = await res.json();
        setSettings(updated);
      }
    } catch (err) {
      console.error('Update settings error:', err);
    }
  };

  const activeTradesCount = trades.filter(t => t.status === 'ACTIVE' || t.status === 'CARRY_FORWARD').length;

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 font-sans antialiased pb-16 md:pb-8 ${isMobileView ? 'max-w-md mx-auto border-x border-slate-800 shadow-2xl' : ''}`}>
      
      {/* Header */}
      <Header
        settings={settings}
        activePositionsCount={activeTradesCount}
        isSimulating={isSimulating}
        onRefresh={fetchData}
        isMobileView={isMobileView}
        setIsMobileView={setIsMobileView}
        marketStatus="OPEN"
      />

      {/* Navigation */}
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        activeTradesCount={activeTradesCount}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4">
        {activeTab === 'terminal' && (
          <TradingTerminal
            instruments={instruments}
            selectedInstrument={selectedInstrument}
            onSelectInstrument={setSelectedInstrument}
            activeTrades={trades.filter(t => t.status === 'ACTIVE' || t.status === 'CARRY_FORWARD')}
            onExecuteTrade={handleExecuteTrade}
            dailyTradesCount={activeTradesCount}
            maxDailyPositions={settings.max_daily_positions}
          />
        )}

        {activeTab === 'option_chain' && selectedInstrument && (
          <OptionChain
            instruments={instruments}
            selectedInstrument={selectedInstrument}
            onSelectInstrument={setSelectedInstrument}
            optionChain={optionChain}
            onExecuteStrikeTrade={(strike, type) => {
              const premium = type === 'CE' ? strike.ce_ltp : strike.pe_ltp;
              handleExecuteTrade({
                symbol: selectedInstrument.symbol,
                option_type: type,
                strike_price: strike.strike_price,
                action: 'BUY',
                entry_price: premium,
                target_price: Math.round(premium * 1.4),
                stop_loss: Math.round(premium * 0.8),
                quantity: selectedInstrument.lot_size,
                lots: 1,
                ai_conviction: 88,
                ai_rationale: `Manual Strike Selection from Matrix (${type} ${strike.strike_price})`,
                is_overnight: true,
              });
            }}
          />
        )}

        {activeTab === 'positions' && (
          <PositionsManager
            trades={trades}
            onCloseTrade={handleCloseTrade}
            onToggleCarryForward={handleToggleCarryForward}
          />
        )}

        {activeTab === 'learning' && (
          <SelfLearningVault reflections={reflections} />
        )}

        {activeTab === 'agents' && (
          <AgentLab />
        )}

        {activeTab === 'settings' && (
          <BrokerSettings
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
          />
        )}
      </main>

    </div>
  );
}

export default App;
