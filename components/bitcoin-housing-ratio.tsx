"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Share2, Bitcoin } from "lucide-react";
import { type City } from "@/lib/api";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

type ViewType = "monthly" | "yearly";

export function BitcoinHousingRatio({ 
  city,
  bitcoinPrice, 
  bitcoinHistory,
  houseHistory
}: { 
  city: City;
  bitcoinPrice: number;
  bitcoinHistory: Array<{ date: string; price: number; }>;
  houseHistory: Array<{ date: string; price: number; }>;
}) {
  const [viewType, setViewType] = useState<ViewType>("yearly");
  const [useLogScale, setUseLogScale] = useState(false);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const cityName = city.charAt(0).toUpperCase() + city.slice(1);
  const currentHousePrice = houseHistory[houseHistory.length - 1].price;
  const currentRatio = (currentHousePrice / bitcoinPrice).toFixed(2);

  // Create a map of dates to bitcoin prices for faster lookup
  const btcPriceMap = new Map(bitcoinHistory.map(b => [b.date.slice(0, 7), b.price]));

  // Create aligned data points and calculate ratios
  const allData = houseHistory.map(house => {
    const monthKey = house.date.slice(0, 7); // Get YYYY-MM format
    const btcPrice = btcPriceMap.get(monthKey);
    
    return btcPrice ? {
      date: house.date,
      ratio: Number((house.price / btcPrice).toFixed(2))
    } : null;
  }).filter((entry): entry is { date: string; ratio: number; } => entry !== null);

  // Sort data chronologically
  const sortedData = allData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Add current ratio if it's different from the last entry
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = sortedData[sortedData.length - 1];

  if (lastEntry?.date !== today) {
    sortedData.push({
      date: today,
      ratio: Number(currentRatio)
    });
  }

  // Filter data based on view type
  const filteredData = (() => {
    if (viewType === "monthly") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return sortedData.filter(entry => new Date(entry.date) >= oneYearAgo);
    }
    return sortedData;
  })();

  const handleShare = async () => {
    if (!chartRef.current) return;

    try {
      const canvas = await html2canvas(chartRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      
      if (navigator.share) {
        await navigator.share({
          title: `Bitcoin to ${cityName} House Price Ratio`,
          text: `It takes ${currentRatio} BTC to buy a house in ${cityName}!`,
          url: window.location.href,
          files: [new File([blob], 'btc-ratio.png', { type: 'image/png' })]
        });
      } else {
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'btc-ratio.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Image saved & link copied!",
          description: "The chart has been downloaded and the share link copied to your clipboard",
        });
      }
    } catch (error) {
      console.error('Share failed:', error);
      toast({
        title: "Error",
        description: "Failed to share or download the image",
      });
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div className="space-y-1.5">
          <CardTitle>Bitcoin to House Price Ratio</CardTitle>
          <div className="flex items-center space-x-2">
            <Bitcoin className="h-5 w-5 text-orange-500" />
            <span className="text-2xl font-bold">{currentRatio}</span>
            
          </div>
          <span className="text-sm text-muted-foreground">
              BTC needed for a median house price in <strong>{cityName}</strong>
            </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setUseLogScale(!useLogScale)}
          >
            {useLogScale ? "Linear" : "Log"} Scale
          </Button>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent ref={chartRef}>
        <Tabs value={viewType} onValueChange={(v) => setViewType(v as ViewType)} className="space-y-4">
          <TabsList>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
            <TabsTrigger value="yearly">Yearly</TabsTrigger>
          </TabsList>

          <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRatio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(249, 115, 22)" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="rgb(249, 115, 22)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="date"
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return viewType === "monthly"
                      ? `${date.toLocaleString('default', { month: 'short' })} ${date.getFullYear()}`
                      : date.getFullYear().toString();
                  }}
                />
                <YAxis 
                  scale={useLogScale ? "log" : "linear"}
                  domain={useLogScale ? [1, 'auto'] : [0, 'auto']}
                  tickFormatter={(value) => value.toFixed(1)}
                />
                <Tooltip
                  formatter={(value: number) => [`${value.toFixed(2)} BTC`, "BTC/House Ratio"]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return viewType === "monthly"
                      ? date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
                      : date.getFullYear().toString();
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="ratio"
                  stroke="rgb(249, 115, 22)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRatio)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}