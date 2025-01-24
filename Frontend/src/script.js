document.addEventListener("DOMContentLoaded", () => {
    const spinner = document.getElementById("spinner");
    const dashboard = document.getElementById("dashboard");
    const apiUrl = "https://api.coingecko.com/api/v3/coins/";
    const API_BASE_URL = "https://api.coingecko.com/api/v3";

    // Show dashboard after 2 seconds
    setTimeout(() => {
        spinner.classList.add("hidden");
        dashboard.classList.remove("hidden");
    }, 2000);

    // Function to fetch and update the current price
    async function updateCurrentPrice(cryptoId) {
        try {
            const response = await fetch(`${API_BASE_URL}/simple/price?ids=${cryptoId}&vs_currencies=usd`);
            const data = await response.json();

            const currentPrice = data[cryptoId]?.usd;
            document.getElementById("current-price").textContent = `$${currentPrice.toFixed(2)}`;
        } catch (error) {
            console.error("Error fetching current price:", error);
        }
    }

    const fetchCryptoData = async (crypto) => {
        try {
            const response = await fetch(`${apiUrl}${crypto}`);
            if (!response.ok) {
                throw new Error("Failed to fetch data");
            }
            const data = await response.json();

            const marketCapChange = `${data.market_data.market_cap_change_percentage_24h.toFixed(2)}%`;
            const allTimeHigh = `$${data.market_data.ath.usd}`;
            const high24hrs = `$${data.market_data.high_24h.usd}`;
            const low24hrs = `$${data.market_data.low_24h.usd}`;
            const positiveSentiments = `${(Math.random() * (80 - 50) + 50).toFixed(2)}%`; 

            const boxes = document.querySelectorAll(".flex-wrap > div");
            boxes[0].querySelector("h2").textContent = marketCapChange; 
            boxes[1].querySelector("h2").textContent = allTimeHigh; 
            boxes[2].querySelector("h2").textContent = positiveSentiments; 
            boxes[3].querySelector("h2").textContent = high24hrs; 
            boxes[4].querySelector("h2").textContent = low24hrs; 
        } catch (error) {
            console.error("Error fetching data:", error);
            alert("Failed to load cryptocurrency data. Please try again later.");
        }
    };

    fetchCryptoData("dogecoin");
    updateCurrentPrice("dogecoin");

    // for updating the option when changed through dropdown

    const cryptoSelect = document.querySelector("select");
    cryptoSelect.addEventListener("change", (event) => {
        const selectedCrypto = event.target.value;
        fetchCryptoData(selectedCrypto);
        updateCurrentPrice(selectedCrypto);
    });
});
