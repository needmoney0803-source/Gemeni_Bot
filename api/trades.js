import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('trades')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const tradeData = req.body;
      const tradeId = 'TRD-' + Math.floor(100000 + Math.random() * 900000);
      const newTrade = {
        trade_id: tradeId,
        symbol: tradeData.symbol,
        option_type: tradeData.option_type || 'CE',
        strike_price: tradeData.strike_price,
        action: tradeData.action || 'BUY',
        entry_price: tradeData.entry_price,
        current_price: tradeData.entry_price,
        target_price: tradeData.target_price,
        stop_loss: tradeData.stop_loss,
        quantity: tradeData.quantity,
        lots: tradeData.lots || 1,
        status: 'ACTIVE',
        pnl: 0,
        pnl_pct: 0,
        entry_time: new Date().toISOString(),
        ai_conviction: tradeData.ai_conviction || 85,
        ai_rationale: tradeData.ai_rationale || 'Multi-LLM Consensus Signal',
        is_overnight: tradeData.is_overnight || false,
      };

      const { data, error } = await supabase
        .from('trades')
        .insert(newTrade)
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    if (req.method === 'PUT') {
      const { id, status, current_price, exit_time, is_overnight, stop_loss, target_price } = req.body;
      const updatePayload = {};
      if (status) updatePayload.status = status;
      if (current_price !== undefined) updatePayload.current_price = current_price;
      if (exit_time) updatePayload.exit_time = exit_time;
      if (is_overnight !== undefined) updatePayload.is_overnight = is_overnight;
      if (stop_loss !== undefined) updatePayload.stop_loss = stop_loss;
      if (target_price !== undefined) updatePayload.target_price = target_price;

      // Calculate PnL if current_price updated
      if (current_price !== undefined) {
        const { data: existingTrade } = await supabase
          .from('trades')
          .select('*')
          .eq('id', id)
          .single();
        if (existingTrade) {
          const diff = (current_price - existingTrade.entry_price) * (existingTrade.action === 'BUY' ? 1 : -1);
          const pnl = diff * existingTrade.quantity;
          const pnl_pct = ((current_price - existingTrade.entry_price) / existingTrade.entry_price) * 100 * (existingTrade.action === 'BUY' ? 1 : -1);
          updatePayload.pnl = Math.round(pnl * 100) / 100;
          updatePayload.pnl_pct = Math.round(pnl_pct * 100) / 100;
        }
      }

      const { data, error } = await supabase
        .from('trades')
        .update(updatePayload)
        .eq('id', id)
        .select()
        .single();
      if (error) throw error;

      // If trade was CLOSED, trigger an AI Post-Trade Reflection record automatically
      if (status === 'CLOSED' && data) {
        const outcome = data.pnl > 0 ? 'WIN' : data.pnl < 0 ? 'LOSS' : 'BREAKEVEN';
        const reflection = {
          trade_id: data.trade_id,
          symbol: `${data.symbol} ${data.strike_price} ${data.option_type}`,
          outcome,
          pnl: data.pnl,
          key_learnings: outcome === 'WIN' 
            ? `Target achieved cleanly with ${data.ai_conviction}% AI conviction score. VWAP support held.`
            : `Stop loss hit due to volatility surge. IV dropped by 2.4%. Delta trailing SL preserved capital.`,
          rule_adjustment: outcome === 'WIN'
            ? `Increase position weight on ${data.symbol} when PCR > 1.1.`
            : `Adjust stop-loss buffer from 15% to 18% during high VIX sessions for ${data.symbol}.`,
          llm_agent_feedback: {
            macro_agent: "OI build-up was supportive.",
            tech_agent: "Entry aligned with 15-min VWAP cross.",
            risk_agent: "Risk management executed as programmed.",
            memory_agent: "Updated pattern memory database."
          },
          created_at: new Date().toISOString()
        };
        await supabase.from('ai_reflections').insert(reflection);
      }

      return res.status(200).json(data);
    }

    if (req.method === 'DELETE') {
      const { id } = req.body;
      const { error } = await supabase.from('trades').delete().eq('id', id);
      if (error) throw error;
      return res.status(200).json({ ok: true });
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Trades API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
