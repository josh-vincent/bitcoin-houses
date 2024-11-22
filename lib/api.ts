//@ts-nocheck
import { unstable_cache } from 'next/cache';
import { HOUSE_PRICES_HISTORY } from './data/house-prices';
import { BITCOIN_PRICE_HISTORY } from './data/bitcoin-prices';

export type City = keyof typeof HOUSE_PRICES_HISTORY;

// Get current house prices (latest available month)
export const getCurrentHousePrices = () => {
  const currentPrices: Record<City, number> = {} as Record<City, number>;
  
  Object.entries(HOUSE_PRICES_HISTORY).forEach(([city, yearData]) => {
    const latestYear = Object.keys(yearData).sort().pop()!;
    const latestMonth = yearData[latestYear].length - 1;
    currentPrices[city as City] = yearData[latestYear][latestMonth];
  });
  
  return currentPrices;
};

// Get house price history for a specific city
export const getHousePriceHistory = (city: City, days: number = 365) => {
  const history: Array<{ date: string; price: number }> = [];
  const cityData = HOUSE_PRICES_HISTORY[city];
  
  // Process historical data
  Object.entries(cityData).forEach(([year, prices]) => {
    prices.forEach((price:number, month:string) => {
      history.push({
        date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
        price
      });
    });
  });

  // Sort chronologically
  const sortedHistory = history.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Get the last available price
  const lastPrice = sortedHistory[sortedHistory.length - 1].price;

  // Add today's date with the last available price
  const today = new Date().toISOString().split('T')[0];
  if (sortedHistory[sortedHistory.length - 1].date !== today) {
    sortedHistory.push({
      date: today,
      price: lastPrice
    });
  }
  
  // Return the requested number of days
  return sortedHistory.slice(-Math.ceil(days * (30.44 / 365))); // Convert days to months approximately
};

// Get current Bitcoin price from CoinGecko
export const getBitcoinPriceServer = unstable_cache(
  async () => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=aud',
        { next: { revalidate: 3600 } }
      );
      const data = await response.json();
      return data.bitcoin.aud;
    } catch (error) {
      console.error('Failed to fetch Bitcoin price:', error);
      // Return the latest price from our static data as fallback
      return BITCOIN_PRICE_HISTORY[BITCOIN_PRICE_HISTORY.length - 1].price;
    }
  },
  ['bitcoin-price'],
  { revalidate: 3600 }
);

// Get Bitcoin price history using static data and current price
export const getBitcoinHistoryServer = unstable_cache(
  async (days: number = 365) => {
    try {
      // Get current price
      const currentPrice = await getBitcoinPriceServer();
      
      // Create a new entry for today with the current price
      const today = new Date().toISOString().split('T')[0];
      const currentEntry = { date: today, price: currentPrice };
      
      // Get historical data
      const historicalData = [...BITCOIN_PRICE_HISTORY];
      
      // Add current price only if it's different from the last historical price
      const lastHistoricalPrice = historicalData[historicalData.length - 1].price;
      if (currentPrice !== lastHistoricalPrice) {
        historicalData.push(currentEntry);
      }
      
      // Sort by date and get the requested number of days
      return historicalData
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(-days);
    } catch (error) {
      console.error('Failed to fetch Bitcoin history:', error);
      // Return only static data as fallback
      return BITCOIN_PRICE_HISTORY.slice(-days);
    }
  },
  ['bitcoin-history'],
  { revalidate: 3600 }
);