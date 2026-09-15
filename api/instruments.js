import supabase from './db-client.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.status(204).end();

  try {
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('instruments')
        .select('*')
        .order('id', { ascending: true });
      if (error) throw error;
      return res.status(200).json(data || []);
    }

    if (req.method === 'POST') {
      // Simulate price fluctuation tick for instruments
      const { data: currentItems, error: fetchErr } = await supabase
        .from('instruments')
        .select('*');
      if (fetchErr) throw fetchErr;

      const updatedPromises = (currentItems || []).map(async (inst) => {
        const deltaPct = (Math.random() - 0.49) * 0.4; // subtle market tick
        const newSpot = Math.round((inst.spot_price * (1 + deltaPct / 100)) * 100) / 100;
        const newChangePct = Math.round(((newSpot - inst.spot_price) / inst.spot_price * 100 + inst.change_pct) * 100) / 100;
        
        return supabase
          .from('instruments')
          .update({
            spot_price: newSpot,
            change_pct: newChangePct
          })
          .eq('id', inst.id)
          .select()
          .single();
      });

      await Promise.all(updatedPromises);
      const { data: updatedData } = await supabase.from('instruments').select('*');
      return res.status(200).json(updatedData || []);
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error('Instruments API Error:', err);
    res.status(500).json({ error: err.message });
  }
}
