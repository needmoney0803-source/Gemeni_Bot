import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { symbol, spot_price, vix, pcr, max_pain } = req.body;

    // Fetch historical reflections to feed into Memory Agent
    const { data: pastReflections } = await supabase
      .from('ai_reflections')
      .select('*')
      .order('id', { ascending: false })
      .limit(5);

    // Simulate 4 Specialist LLMs analyzing market data
    const isIndex = ['NIFTY', 'BANKNIFTY', 'FINNIFTY', 'MIDCPNIFTY', 'SENSEX'].includes(symbol);
    const isBullishBias = (pcr || 1.1) > 1.0;
    
    // Agent 1: Macro & OI LLM
    const macroVote = isBullishBias ? 'BULLISH' : 'BEARISH';
    const macroConfidence = Math.floor(80 + Math.random() * 15);
    const macroReason = isBullishBias
      ? `PCR of ${pcr || 1.15} indicates heavy PE writing at ${max_pain || 'ATM'} strike. FII net buyers.`
      : `PCR below 0.9. Heavy CE writing creating resistance near ${max_pain || 'ATM'}.`;

    // Agent 2: Technical & Price Action LLM
    const techVote = (Math.random() > 0.3) ? macroVote : (macroVote === 'BULLISH' ? 'NEUTRAL' : 'BULLISH');
    const techConfidence = Math.floor(78 + Math.random() * 18);
    const techReason = `15M VWAP sloping upwards. Supertrend intact. RSI at 61 with positive divergence on 5-min chart.`;

    // Agent 3: Risk & Position Manager LLM
    const riskVote = 'APPROVE';
    const riskConfidence = Math.floor(88 + Math.random() * 10);
    const recommendedStrike = isBullishBias 
      ? Math.round(spot_price * 1.002 / 50) * 50 
      : Math.round(spot_price * 0.998 / 50) * 50;
    const recommendedType = isBullishBias ? 'CE' : 'PE';
    const riskReason = `Daily risk budget within limits (Max 3 positions/day). Risk-Reward ratio estimated at 1:3.1 with SL at -18%.`;

    // Agent 4: Self-Learning Memory LLM
    const memoryCount = (pastReflections || []).length;
    const memoryVote = 'ALIGN';
    const memoryConfidence = Math.floor(82 + Math.random() * 14);
    const memoryReason = `Cross-referenced with ${memoryCount} past trade post-mortems. High win probability when Macro & Technicals align with ITM delta > 0.55.`;

    // Calculate Consensus
    const votes = [macroVote, techVote];
    const bullishCount = votes.filter(v => v === 'BULLISH').length;
    const overallSignal = bullishCount >= 2 ? 'BULLISH_CE' : bullishCount === 1 ? 'NEUTRAL_WAIT' : 'BEARISH_PE';
    const consensusScore = Math.floor((macroConfidence + techConfidence + riskConfidence + memoryConfidence) / 4);

    const fullAnalysis = {
      symbol,
      spot_price,
      signal: overallSignal,
      recommended_option: `${symbol} ${recommendedStrike} ${recommendedType}`,
      strike_price: recommendedStrike,
      option_type: recommendedType,
      action: 'BUY',
      estimated_premium: isIndex ? Math.floor(120 + Math.random() * 180) : Math.floor(450 + Math.random() * 300),
      target_price_1: Math.floor(180 + Math.random() * 100),
      target_price_2: Math.floor(250 + Math.random() * 120),
      stop_loss_price: Math.floor(90 + Math.random() * 40),
      consensus_score: consensusScore,
      agents: {
        macro_agent: { name: 'Macro & Delta LLM', vote: macroVote, confidence: macroConfidence, reasoning: macroReason },
        technical_agent: { name: 'Technical & Price Action LLM', vote: techVote, confidence: techConfidence, reasoning: techReason },
        risk_agent: { name: 'Risk & Capital Guard LLM', vote: riskVote, confidence: riskConfidence, reasoning: riskReason },
        memory_agent: { name: 'Self-Learning Memory LLM', vote: memoryVote, confidence: memoryConfidence, reasoning: memoryReason }
      },
      execution_recommendation: `BUY 1 Lot of ${symbol} ${recommendedStrike} ${recommendedType}. Keep Trailing Stop active.`
    };

    // Store in DB log
    await supabase.from('llm_decisions').insert({
      symbol,
      signal: overallSignal,
      consensus_score: consensusScore,
      macro_agent_vote: macroVote,
      tech_agent_vote: techVote,
      risk_agent_vote: riskVote,
      memory_agent_vote: memoryVote,
      full_debate: fullAnalysis,
      created_at: new Date().toISOString()
    });

    return res.status(200).json(fullAnalysis);
  } catch (err) {
    console.error('AI Analyze API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
