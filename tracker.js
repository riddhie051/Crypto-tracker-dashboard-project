const apiURL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd";
const cryptoList = document.getElementById("crypto-list");
const searchInput = document.getElementById("search");

let coins = [];

// Fetch coin list
fetch(apiURL)
  .then(res => res.json())
  .then(data => {
    coins = data;
    displayCoins(coins);
  })
  .catch(error => {
    console.error("API Error:", error);
    cryptoList.innerHTML = "<p>Failed to load data.</p>";
  });

// Display coin cards
function displayCoins(coinsData) {
  cryptoList.innerHTML = "";
  coinsData.forEach(coin => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img src="${coin.image}" alt="${coin.name}" width="32" />
      <div class="coin-name">${coin.name} (${coin.symbol.toUpperCase()})</div>
      <p>💲Price: $${coin.current_price.toLocaleString()}</p>
      <p>📈 Change (24h): <span style="color: ${coin.price_change_percentage_24h >= 0 ? 'green' : 'red'}">
        ${coin.price_change_percentage_24h.toFixed(2)}%</span></p>
      <p>🏆 Market Cap: $${coin.market_cap.toLocaleString()}</p>
    `;

    // Click to show chart
    card.addEventListener("click", () => {
      showChart(coin.id, coin.name);
    });

    cryptoList.appendChild(card);
  });
}

searchInput.addEventListener("input", () => {
  const value = searchInput.value.toLowerCase();
  const filtered = coins.filter(coin =>
    coin.name.toLowerCase().includes(value) ||
    coin.symbol.toLowerCase().includes(value)
  );
  displayCoins(filtered);
});



// Chart modal logic
const chartModal = document.getElementById("chartModal");
const closeBtn = document.getElementById("closeBtn");
const ctx = document.getElementById("priceChart").getContext("2d");
let chartInstance = null;

function showChart(coinId, coinName) {
  fetch(`https://api.coingecko.com/api/v3/coins/${coinId}/market_chart?vs_currency=usd&days=7`)
    .then(res => res.json())
    .then(data => {
      const prices = data.prices.map(p => p[1]);
      const labels = data.prices.map(p => {
        const date = new Date(p[0]);
        return `${date.getDate()}/${date.getMonth() + 1}`;
      });

      if (chartInstance) {
        chartInstance.destroy();
      }

      chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: labels,
          datasets: [{
            label: `${coinName} Price (Last 7 Days)`,
            data: prices,
            fill: true,
            borderColor: 'blue',
            backgroundColor: 'rgba(0, 0, 255, 0.1)',
            tension: 0.3
          }]
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: true }
          }
        }
      });

      chartModal.style.display = "flex";
    });
}

// Close chart modal
closeBtn.onclick = () => {
  chartModal.style.display = "none";
};
window.onclick = (event) => {
  if (event.target === chartModal) {
    chartModal.style.display = "none";
  }
};







