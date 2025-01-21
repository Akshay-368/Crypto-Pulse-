document.addEventListener("DOMContentLoaded", () => {
  const spinner = document.getElementById("spinner");
  const dashboard = document.getElementById("dashboard");


  setTimeout(() => {
    spinner.classList.add("hidden"); 
    dashboard.classList.remove("hidden"); 
  }, 2000);

  
  const apiUrl = "https://api.coingecko.com/api/v3/coins/";

  
  async function fetchCryptoData(crypto) {
    try {
      const response = await fetch(${apiUrl}${crypto});
      const data = await response.json();

      
      document.getElementById("crypto-name").textContent = data.name;
      document.getElementById("current-price").textContent = $${data.market_data.current_price.usd};
      document.getElementById("market-price").textContent = $${data.market_data.current_price.usd};
      document.getElementById("market-cap").textContent = $${data.market_data.market_cap.usd};

      document.getElementById("crypto-info").innerHTML = `
        <div class="bg-gray-800 p-4 rounded-lg flex-1 min-w-[280px] text-center">
          <p>Market Cap 24hrs</p>
          <h2 class="text-lg font-bold">${data.market_data.market_cap_change_percentage_24h.toFixed(2)}%</h2>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg flex-1 min-w-[280px] text-center">
          <p>All Time High</p>
          <h2 class="text-lg font-bold">$${data.market_data.high_24h.usd}</h2>
        </div>
        <div class="bg-gray-800 p-4 rounded-lg flex-1 min-w-[280px] text-center">
          <p>Positive Sentiments</p>
          <h2 class="text-lg font-bold">${(Math.random() * 50 + 50).toFixed(2)}%</h2>
        </div>
      `;
    } catch (error) {
      console.error("Error fetching crypto data:", error);
    }
  }

  
  fetchCryptoData("dogecoin");


  document.getElementById("crypto-select").addEventListener("change", (event) => {
    const selectedCrypto = event.target.value;
    fetchCryptoData(selectedCrypto);
  });
});
