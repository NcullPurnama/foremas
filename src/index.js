// Final index.js dengan prediksi dinamis dan update ke HTML
import './style.css';

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();

    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

// ======= Back to Top Button =======
const backToTopButton = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  backToTopButton?.classList.toggle('hidden', window.pageYOffset <= 300);
});
backToTopButton?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ======= Prediction Handler =======
const predictButton = document.getElementById("predictButton");
const loadingIndicator = document.getElementById("loadingIndicator");
const predictionResults = document.getElementById("predictionResults");
const initialState = document.getElementById("initialState");

predictButton?.addEventListener("click", () => {
  const timeframe = document.getElementById("time");
  const daysAhead = parseInt(timeframe.value);

  initialState?.classList.add("hidden");
  loadingIndicator?.classList.remove("hidden");
  predictionResults?.classList.add("hidden");

  fetch("/api/predict", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ days_ahead: daysAhead })
  })
    .then(res => res.json())
    .then(data => {
      loadingIndicator?.classList.add("hidden");
      predictionResults?.classList.remove("hidden");

      if (data.error) {
        document.getElementById("resultTimeframe").textContent = "Error memuat prediksi";
        return;
      }

      const prices = data.prediction;
      const average = data.average;
      const timeframeText = timeframe.options[timeframe.selectedIndex].text;

      document.getElementById("resultTimeframe").textContent = timeframeText;

      const lastChange = (prices.at(-1) - prices[0]) / prices[0] * 100;
      const isPositive = lastChange >= 0;
      const changeText = isPositive ? `+${lastChange.toFixed(2)}%` : `${lastChange.toFixed(2)}%`;

      document.getElementById("expectedChange").textContent = changeText;
      document.getElementById("expectedChange").className = `font-medium ${isPositive ? "text-green-600" : "text-red-600"}`;
      document.getElementById("investmentAdvice").textContent = isPositive
        ? "Based on our analysis, we recommend considering buying gold as prices are expected to rise."
        : "Based on our analysis, you might want to hold off buying gold as prices are expected to drop.";

      const today = new Date();
      const predictionEndDate = new Date(today);
      predictionEndDate.setDate(today.getDate() + prices.length);
      const options = { year: "numeric", month: "long", day: "numeric" };
      document.getElementById("predictionDate").textContent = predictionEndDate.toLocaleDateString("en-US", options);

      document.getElementById("predictedPrice").textContent = `$${prices.at(-1).toFixed(2)}`;
      generatePriceChartFromPrediction(prices);
    })
    .catch(err => {
      loadingIndicator?.classList.add("hidden");
      predictionResults?.classList.remove("hidden");
      document.getElementById("resultTimeframe");
      console.error("Fetch error:", err);
    });
});

function generatePriceChartFromPrediction(prices) {
  const ctx = document.getElementById("priceChart").getContext("2d");
  if (window.priceChart) window.priceChart.destroy();

  const labels = [];
  const today = new Date();
  for (let i = 1; i <= prices.length; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    labels.push(date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
  }

  if (window.priceChart) {
    window.priceChart.destroy();
  }

  window.priceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [{
        label: "Prediksi Harga Emas (USD)",
        data: prices,
        borderColor: "#D4AF37",
        backgroundColor: "rgba(212, 175, 55, 0.1)",
        borderWidth: 2,
        pointBackgroundColor: "#D4AF37",
        pointRadius: 3,
        fill: true,
        tension: 0.4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'top' },
      },
      scales: {
        x: { grid: { display: false } },
        y: {
          beginAtZero: false,
          grid: { color: "rgba(0,0,0,0.05)" }
        }
      }
    }
  });
}
