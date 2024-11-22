"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";

const DEMO_NEWS = [
  {
    id: 1,
    title: "Bitcoin Surges Past $50,000 Mark",
    source: "CryptoNews",
    date: "2024-03-15",
  },
  {
    id: 2,
    title: "Australian Housing Market Shows Signs of Recovery",
    source: "Property Weekly",
    date: "2024-03-14",
  },
  {
    id: 3,
    title: "Sydney Property Prices Hit New Record",
    source: "Real Estate Today",
    date: "2024-03-13",
  },
];

export function MarketNews() {
  const { data: news, isLoading } = useQuery({
    queryKey: ["market-news"],
    queryFn: async () => DEMO_NEWS,
  });

  if (isLoading) {
    return <Skeleton className="h-[200px] w-full" />;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Latest Market News</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {news?.map((item) => (
            <div key={item.id} className="border-b pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold">{item.title}</h3>
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>{item.source}</span>
                <span>•</span>
                <span>{item.date}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}