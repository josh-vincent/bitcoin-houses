"use client";

import { useRef } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { getCurrentHousePrices, type City } from "@/lib/api";
import { Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

export function ShareableRatio({ 
  city,
  bitcoinPrice
}: { 
  city: City;
  bitcoinPrice: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const currentPrices = getCurrentHousePrices();

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current);
      const dataUrl = canvas.toDataURL();
      
      await navigator.clipboard.writeText(window.location.href);
      
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate share image"
      });
    }
  };

  const ratio = (currentPrices[city] / bitcoinPrice).toFixed(2);
  const cityName = city.charAt(0).toUpperCase() + city.slice(1);

  return (
    <Card>
      <CardContent ref={cardRef} className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-2xl font-bold">{ratio} BTC</h3>
            <p className="text-sm text-muted-foreground">
              needed for a house in {cityName}
            </p>
          </div>
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}