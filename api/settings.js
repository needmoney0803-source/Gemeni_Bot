import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('bot_settings')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') throw error;

      if (!data) {
        // Return default settings
        return res.status(200).json({
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
      }

      return res.status(200).json(data);
    }

    if (req.method === 'PUT') {
      const settings = req.body;
      const { data: existing } = await supabase.from('bot_settings').select('id').limit(1).single();

      let result;
      if (existing) {
        const { data, error } = await supabase
          .from('bot_settings')
          .update(settings)
          .eq('id', existing.id)
          .select()
          .single();
        if (error) throw error;
        result = data;
      } else {
        const { data, error } = await supabase
          .from('bot_settings')
          .insert(settings)
          .select()
          .single();
        if (error) throw error;
        result = data;
      }

      return res.status(200).json(result);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Settings API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
