module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { days_ahead } = req.body;
  console.log('📥 Data diterima:', req.body);

  if (typeof days_ahead !== 'number') {
    return res.status(400).json({ error: 'days_ahead harus berupa angka', received: req.body });
  }

  const RAILWAY_URL = 'https://web-production-b0aa.up.railway.app/predict'; 

  try {
    const response = await fetch(RAILWAY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ days_ahead })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return res.status(response.status).json({ error: 'Gagal dari backend', detail: errorText });
    }

    const result = await response.json();
    return res.status(200).json(result);

  } catch (err) {
    console.error('❌ Gagal fetch ke Railway:', err);
    return res.status(500).json({ error: 'Tidak bisa hubungi backend', detail: err.message });
  }
};
