export interface Instrument {
  id: number;
  symbol: string;
  name: string;
  category: 'INDEX_OPTION' | 'COMMODITY_OPTION';
  spot_price: number;
  change_pct: number;
  vix: number;
  pcr: number;
  max_pain: number;
  lot_size: number;
  expiry_date: string;
}

export interface OptionStrike {
  id: number;
  symbol: string;
  strike_price: number;
  ce_ltp: number;
  ce_oi: number;
  ce_iv: number;
  ce_delta: number;
  pe_ltp: number;
  pe_oi: number;
  pe_iv: number;
  pe_delta: number;
}

export interface Trade {
  id: number;
  trade_id: string;
  symbol: string;
  option_type: 'CE' | 'PE';
  strike_price: number;
  action: 'BUY' | 'SELL';
  entry_price: number;
  current_price: number;
  target_price: number;
  stop_loss: number;
  quantity: number;
  lots: number;
  status: 'ACTIVE' | 'CLOSED' | 'CARRY_FORWARD';
  pnl: number;
  pnl_pct: number;
  entry_time: string;
  exit_time?: string;
  ai_conviction: number;
  ai_rationale: string;
  is_overnight: boolean;
}

export interface AIReflection {
  id: number;
  trade_id: string;
  symbol: string;
  outcome: 'WIN' | 'LOSS' | 'BREAKEVEN';
  pnl: number;
  key_learnings: string;
  rule_adjustment: string;
  llm_agent_feedback: {
    macro_agent?: string;
    tech_agent?: string;
    risk_agent?: string;
    memory_agent?: string;
  };
  created_at: string;
}

export interface AgentDebateResult {
  symbol: string;
  spot_price: number;
  signal: 'BULLISH_CE' | 'BEARISH_PE' | 'NEUTRAL_WAIT';
  recommended_option: string;
  strike_price: number;
  option_type: 'CE' | 'PE';
  action: 'BUY' | 'SELL';
  estimated_premium: number;
  target_price_1: number;
  target_price_2: number;
  stop_loss_price: number;
  consensus_score: number;
  agents: {
    macro_agent: { name: string; vote: string; confidence: number; reasoning: string };
    technical_agent: { name: string; vote: string; confidence: number; reasoning: string };
    risk_agent: { name: string; vote: string; confidence: number; reasoning: string };
    memory_agent: { name: string; vote: string; confidence: number; reasoning: string };
  };
  execution_recommendation: string;
}

export interface BotSettings {
  id?: number;
  trading_mode: 'AUTO' | 'SEMI_AUTO' | 'MANUAL';
  broker_provider: 'PAPER' | 'ZERODHA' | 'ANGELONE' | 'DHAN' | 'UPSTOX';
  max_daily_positions: number;
  max_risk_per_trade_pct: number;
  enable_carry_forward: boolean;
  min_carry_forward_profit_pct: number;
  virtual_balance: number;
  realized_pnl: number;
  unrealized_pnl: number;
}
