import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('ai_reflections')
        .select('*')
        .order('id', { ascending: false });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      const reflection = req.body;
      const { data, error } = await supabase
        .from('ai_reflections')
        .insert({
          trade_id: reflection.trade_id,
          symbol: reflection.symbol,
          outcome: reflection.outcome,
          pnl: reflection.pnl,
          key_learnings: reflection.key_learnings,
          rule_adjustment: reflection.rule_adjustment,
          llm_agent_feedback: reflection.llm_agent_feedback || {},
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      if (error) throw error;
      return res.status(201).json(data);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('AI Reflections API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
