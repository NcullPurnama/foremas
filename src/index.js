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

// Back to top button
const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
  if (window.pageYOffset > 300) {
    backToTopButton.classList.remove("hidden");
  } else {
    backToTopButton.classList.add("hidden");
  }
});

backToTopButton.addEventListener("click", () => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

// Prediction form handling
const predictButton = document.getElementById("predictButton");
const loadingIndicator = document.getElementById("loadingIndicator");
const predictionResults = document.getElementById("predictionResults");
const initialState = document.getElementById("initialState");

predictButton.addEventListener("click", () => {
  // Show loading state
  initialState.classList.add("hidden");
  loadingIndicator.classList.remove("hidden");
  predictionResults.classList.add("hidden");

  // Simulate API call delay
  setTimeout(() => {
    loadingIndicator.classList.add("hidden");
    predictionResults.classList.remove("hidden");

    // Update results based on form inputs
    const timeframe = document.getElementById("timeframe");
    const timeframeText = timeframe.options[timeframe.selectedIndex].text;
    document.getElementById("resultTimeframe").textContent =
      timeframeText;

    // Generate random price change for demo
    const changePercentage = (Math.random() * 6 - 2).toFixed(2);
    const isPositive = changePercentage >= 0;
    const changeText = isPositive
      ? `+${changePercentage}%`
      : `${changePercentage}%`;

    document.getElementById("expectedChange").textContent = changeText;
    document.getElementById("expectedChange").className = `font-medium ${
      isPositive ? "text-green-600" : "text-red-600"
    }`;

    // Update advice based on prediction
    const adviceText = isPositive
      ? "Based on our analysis, we recommend considering buying gold as prices are expected to rise."
      : "Based on our analysis, you might want to hold off buying gold as prices are expected to drop.";

    document.getElementById("investmentAdvice").textContent = adviceText;

    // Update prediction date
    const today = new Date();
    const predictionDate = new Date(today);
    predictionDate.setDate(today.getDate() + parseInt(timeframe.value));

    const options = { year: "numeric", month: "long", day: "numeric" };
    document.getElementById("predictionDate").textContent =
      predictionDate.toLocaleDateString("en-US", options);

    // Generate chart
    // generatePriceChart(parseInt(timeframe.value), isPositive);
  }, 1500);
});

// Generate price chart
function generatePriceChart(days, isPositive) {
  const ctx = document.getElementById("priceChart").getContext("2d");

  // Destroy previous chart if exists
  if (window.priceChart) {
    window.priceChart.destroy();
  }

  // Generate labels
  const labels = [];
  const today = new Date();
  for (let i = 0; i <= days; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    labels.push(
      date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    );
  }

  // Generate data points
  const data = [];
  const currentPrice = 1850.75;
  data.push(currentPrice);

  for (let i = 1; i <= days; i++) {
    const fluctuation = isPositive
      ? Math.random() * 5 + 1 // Positive trend
      : -Math.random() * 5 - 1; // Negative trend

    const previousPrice = data[i - 1];
    const newPrice = previousPrice * (1 + fluctuation / 100);
    data.push(parseFloat(newPrice.toFixed(2)));
  }

  // Create chart
  window.priceChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Gold Price (USD)",
          data: data,
          borderColor: "#D4AF37",
          backgroundColor: "rgba(212, 175, 55, 0.1)",
          borderWidth: 3,
          pointBackgroundColor: "#D4AF37",
          pointRadius: 3,
          pointHoverRadius: 5,
          fill: true,
          tension: 0.4,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top",
        },
        tooltip: {
          mode: "index",
          intersect: false,
        },
      },
      scales: {
        y: {
          beginAtZero: false,
          grid: {
            color: "rgba(0, 0, 0, 0.05)",
          },
        },
        x: {
          grid: {
            display: false,
          },
        },
      },
    },
  });

  // Update predicted price display
  const predictedPrice = data[data.length - 1].toFixed(2);
  document.getElementById(
    "predictedPrice"
  ).textContent = `$${predictedPrice}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a[href^="#"]');
  const sections = Array.from(document.querySelectorAll('section[id]'));

  // Deklarasi 1x di awal
  const menuBtn = document.querySelector('.mobile-menu-button');
  const mobileMenu = document.querySelector('.mobile-menu');

  // Toggle menu saat tombol hamburger diklik
  if (menuBtn && mobileMenu) {
    menuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }

  // Auto-close menu mobile saat link diklik
  const mobileLinks = document.querySelectorAll('.mobile-menu a[href^="#"]');
  if (mobileMenu && mobileLinks.length) {
    mobileLinks.forEach((link) => {
      link.addEventListener('click', () => {
        mobileMenu.classList.add('hidden');
      });
    });
  }

  // Scroll active navbar logic
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.getAttribute('id');
        const navLink = document.querySelector(`nav a[href="#${id}"]`);

        if (entry.isIntersecting) {
          navLinks.forEach((link) => {
            link.classList.remove(
              'text-yellow-600',
              'border-yellow-500',
              'border-b-4',
              'font-semibold'
            );
            link.classList.add('text-gray-500');
          });

          if (navLink) {
            navLink.classList.remove('text-gray-500');
            navLink.classList.add(
              'text-yellow-600',
              'border-yellow-500',
              'border-b-4',
              'font-semibold'
            );
          }
        }
      });
    },
    {
      threshold: 0.2,
    }
  );

  sections.forEach((section) => {
    observer.observe(section);
  });
});

// // Close mobile menu if open
// if (!mobileMenu.classList.contains("hidden")) {
//   mobileMenu.classList.add("hidden");
// }