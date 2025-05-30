module.exports = (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { timeframe, confidence } = req.body;

  const result = {
    predictedPrice: 1920.40,
    expectedChange: "+3.76%",
    investmentAdvice: "Consider buying gold as prices are expected to rise.",
    predictionDate: new Date(Date.now() + timeframe * 86400000).toDateString(),
  };

  res.status(200).json(result);
};
