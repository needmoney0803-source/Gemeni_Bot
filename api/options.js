import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    const { symbol } = req.query;
    let query = supabase.from('option_chain').select('*');
    if (symbol) {
      query = query.eq('symbol', symbol);
    }
    const { data, error } = await query.order('strike_price', { ascending: true });
    if (error) throw error;
    return res.status(200).json(data || []);
  } catch (err) {
    console.error('Options API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
