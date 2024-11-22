"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { type City } from "@/lib/api";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

type ViewType = "monthly" | "yearly";

export function MarketOverview({ 
  city,
  bitcoinHistory,
  currentBitcoinPrice,
  houseHistory
}: { 
  city: City;
  bitcoinHistory: Array<{ date: string; price: number; }>;
  currentBitcoinPrice: number;
  houseHistory: Array<{ date: string; price: number; }>;
}) {
  const [viewType, setViewType] = useState<ViewType>("yearly");
  const [useLogScale, setUseLogScale] = useState(true);
  const chartRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Create a map of dates to bitcoin prices for faster lookup
  const btcPriceMap = new Map(bitcoinHistory.map(b => [b.date.slice(0, 7), b.price]));

  // Create aligned data points for both bitcoin and house prices
  const allData = houseHistory.map(house => {
    const monthKey = house.date.slice(0, 7); // Get YYYY-MM format
    const btcPrice = btcPriceMap.get(monthKey);
    
    return btcPrice ? {
      date: house.date,
      bitcoin: btcPrice,
      housing: house.price
    } : null;
  }).filter((entry): entry is { date: string; bitcoin: number; housing: number; } => entry !== null);

  // Sort data chronologically
  const sortedData = allData.sort((a, b) => 
    new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // Add current prices if they're different from the last entry
  const today = new Date().toISOString().split('T')[0];
  const lastEntry = sortedData[sortedData.length - 1];

  if (lastEntry?.date !== today) {
    sortedData.push({
      date: today,
      bitcoin: currentBitcoinPrice,
      housing: lastEntry?.housing || 0
    });
  }

  // Filter and process data based on view type
  const filteredData = (() => {
    if (viewType === "monthly") {
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
      return sortedData.filter(entry => new Date(entry.date) >= oneYearAgo);
    }

    // For yearly view, ensure we have one data point per month
    const yearlyData = [...sortedData];
    const firstDate = new Date(yearlyData[0].date);
    const lastDate = new Date(yearlyData[yearlyData.length - 1].date);
    
    // Create a map of existing dates for faster lookup
    const existingDates = new Set(yearlyData.map(d => d.date));
    
    // Fill in any missing months with interpolated values
    const currentDate = new Date(firstDate);
    while (currentDate <= lastDate) {
      const dateStr = currentDate.toISOString().split('T')[0];
      if (!existingDates.has(dateStr)) {
        // Find nearest data points for interpolation
        const prevData = yearlyData.find(d => new Date(d.date) < currentDate);
        const nextData = yearlyData.find(d => new Date(d.date) > currentDate);
        
        if (prevData && nextData) {
          const timeDiff = new Date(nextData.date).getTime() - new Date(prevData.date).getTime();
          const currentDiff = currentDate.getTime() - new Date(prevData.date).getTime();
          const ratio = currentDiff / timeDiff;
          
          yearlyData.push({
            date: dateStr,
            bitcoin: prevData.bitcoin + (nextData.bitcoin - prevData.bitcoin) * ratio,
            housing: prevData.housing + (nextData.housing - prevData.housing) * ratio
          });
        }
      }
      currentDate.setMonth(currentDate.getMonth() + 1);
    }
    
    return yearlyData.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
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
          title: `Bitcoin vs ${city} Housing Market Trends`,
          text: 'Check out this comparison of Bitcoin and housing prices!',
          url: window.location.href,
          files: [new File([blob], 'market-trends.png', { type: 'image/png' })]
        });
      } else {
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'market-trends.png';
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
        description: "Failed to share or download the image"
      });
    }
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <CardTitle>Market Overview</CardTitle>
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
                  <linearGradient id="colorBitcoin" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(249, 115, 22)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="rgb(249, 115, 22)" stopOpacity={0}/>
                  </linearGradient>
                  <linearGradient id="colorHousing" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="rgb(59, 130, 246)" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="rgb(59, 130, 246)" stopOpacity={0}/>
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
                  minTickGap={30}
                />
                <YAxis 
                  scale={useLogScale ? "log" : "linear"}
                  domain={useLogScale ? ["auto", 0] : ['auto', 0]}
                  tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [
                    `$${value.toLocaleString()}`,
                    name === "bitcoin" ? "Bitcoin Price" : "House Price"
                  ]}
                  labelFormatter={(label) => {
                    const date = new Date(label);
                    return viewType === "monthly"
                      ? date.toLocaleDateString('default', { month: 'long', year: 'numeric' })
                      : date.getFullYear().toString();
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="bitcoin"
                  name="bitcoin"
                  stroke="rgb(249, 115, 22)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorBitcoin)"
                />
                <Area
                  type="monotone"
                  dataKey="housing"
                  name="housing"
                  stroke="rgb(59, 130, 246)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorHousing)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Tabs>
      </CardContent>
    </Card>
  );
}