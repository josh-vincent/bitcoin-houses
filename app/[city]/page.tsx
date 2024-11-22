import { notFound } from "next/navigation";
import { Metadata } from "next";
import { MarketOverview } from "@/components/market-overview";
import { BitcoinHousingRatio } from "@/components/bitcoin-housing-ratio";
import { PriceComparison } from "@/components/price-comparison";
import { CityNav } from "@/components/city-nav";
import { HOUSE_PRICES_HISTORY } from "@/lib/data/house-prices";
import { 
  getBitcoinPriceServer, 
  getBitcoinHistoryServer, 
  getCurrentHousePrices,
  getHousePriceHistory,
  type City 
} from "@/lib/api";

interface Props {
  params: {
    city: string;
  };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // Validate city
  if (!Object.keys(HOUSE_PRICES_HISTORY).includes(params.city)) {
    return {};
  }

  const city = params.city as City;
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const currentPrices = getCurrentHousePrices();
  const housePrice = currentPrices[city].toLocaleString();

  return {
    title: `Bitcoin vs ${cityName} Housing Market Analysis`,
    description: `Compare Bitcoin performance against ${cityName}'s housing market. Current median house price: $${housePrice}. Track historical trends and calculate property affordability.`,
    openGraph: {
      title: `Bitcoin vs ${cityName} Housing Market Analysis`,
      description: `Compare Bitcoin performance against ${cityName}'s housing market. Current median house price: $${housePrice}. Track historical trends and calculate property affordability.`,
      images: [{
        url: '/share-image.png',
        width: 1200,
        height: 1200,
        alt: `Bitcoin vs ${cityName} Housing Market Comparison`
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `Bitcoin vs ${cityName} Housing Market Analysis`,
      description: `Compare Bitcoin performance against ${cityName}'s housing market. Current median house price: $${housePrice}. Track historical trends and calculate property affordability.`,
      images: ['/share-image.png'],
      creator: '@btchousing',
    },
  };
}

export default async function CityPage({ params }: Props) {
  // Validate city parameter
  if (!Object.keys(HOUSE_PRICES_HISTORY).includes(params.city)) {
    notFound();
  }

  const city = params.city as City;
  
  // Fetch all required data
  const [bitcoinPrice, bitcoinHistory, houseHistory] = await Promise.all([
    getBitcoinPriceServer(),
    getBitcoinHistoryServer(365 * 5), // Get 5 years of Bitcoin history
    getHousePriceHistory(city, 365 * 5) // Get 5 years of house price history
  ]);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold tracking-tight">
          {city.charAt(0).toUpperCase() + city.slice(1)} Market
        </h1>
        <CityNav currentCity={city} />
      </div>

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <BitcoinHousingRatio 
            city={city}
            bitcoinPrice={bitcoinPrice}
            bitcoinHistory={bitcoinHistory}
            houseHistory={houseHistory}
          />
        </div>
        <div>
          <PriceComparison 
            city={city}
            bitcoinPrice={bitcoinPrice}
          />
        </div>
      </div>

      <MarketOverview 
        city={city}
        bitcoinHistory={bitcoinHistory}
        currentBitcoinPrice={bitcoinPrice}
        houseHistory={houseHistory}
      />
    </div>
  );
}

// Generate static params for all cities
export function generateStaticParams() {
  return Object.keys(HOUSE_PRICES_HISTORY).map((city) => ({
    city,
  }));
}