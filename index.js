const ALPHA_VANTAGE_API_KEY = 'YOUR_ALPHA_VANTAGE_API_KEY';
const FINNHUB_API_KEY = 'YOUR_FINNHUB_API_KEY';

async function fetchStockData() {
  const symbol = document.getElementById('symbolInput').value.toUpperCase();
  if (!symbol) {
    alert('Please enter a stock symbol.');
    return;
  }

  const stockInfoDiv = document.getElementById('stockInfo');
  const sentimentDiv = document.getElementById('sentiment');
  stockInfoDiv.textContent = 'Loading...';
  sentimentDiv.textContent = '';

  try {
    // Fetch stock price from Alpha Vantage
    const priceResponse = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`);
    const priceData = await priceResponse.json();
    const price = priceData['Global Quote']['05. price'];

    if (!price) {
      stockInfoDiv.textContent = 'Stock symbol not found.';
      return;
    }

    stockInfoDiv.textContent = `${symbol}: $${parseFloat(price).toFixed(2)}`;

    // Fetch sentiment data from Finnhub
    const sentimentResponse = await fetch(`https://finnhub.io/api/v1/news-sentiment?symbol=${symbol}&token=${FINNHUB_API_KEY}`);
    const sentimentData = await sentimentResponse.json();

    const sentimentScore = sentimentData.sentiment?.companyNewsScore;

    if (sentimentScore !== undefined) {
      if (sentimentScore > 0.5) {
        sentimentDiv.textContent = '📈 Bullish Sentiment';
        sentimentDiv.style.color = 'green';
      } else if (sentimentScore < -0.5) {
        sentimentDiv.textContent = '📉 Bearish Sentiment';
        sentimentDiv.style.color = 'red';
      } else {
        sentimentDiv.textContent = '😐 Neutral Sentiment';
        sentimentDiv.style.color = 'gray';
      }
    } else {
      sentimentDiv.textContent = 'Sentiment data not available.';
      sentimentDiv.style.color = 'gray';
    }

  } catch (error) {
    console.error(error);
    stockInfoDiv.textContent = 'Error fetching data.';
    sentimentDiv.textContent = '';
  }
}