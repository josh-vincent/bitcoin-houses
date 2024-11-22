import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentHousePrices, type City } from "@/lib/api";
import { Bitcoin, Home } from "lucide-react";

export function PriceComparison({ 
  city,
  bitcoinPrice
}: { 
  city: City;
  bitcoinPrice: number;
}) {
  const currentPrices = getCurrentHousePrices();

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Current Prices</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2 text-orange-500">
            <Bitcoin className="h-5 w-5" />
            <span className="font-semibold">Bitcoin</span>
          </div>
          <p className="text-2xl font-bold">${bitcoinPrice?.toLocaleString()}</p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2 text-blue-500">
            <Home className="h-5 w-5" />
            <span className="font-semibold">House Prices</span>
          </div>
          <div className="grid gap-3">
            {Object.entries(currentPrices).map(([cityName, price]) => (
              <div 
                key={cityName}
                className={`flex justify-between items-center p-2 rounded-lg ${
                  cityName === city ? 'bg-muted font-medium' : ''
                }`}
              >
                <span className="capitalize">{cityName}</span>
                <span>${price.toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}