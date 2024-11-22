"use client";

import { useState, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";
import { getCurrentHousePrices, type City } from "@/lib/api";
import html2canvas from "html2canvas";
import { useToast } from "@/hooks/use-toast";

export function AffordabilityCalculator({ city }: { city: City }) {
  const [salary, setSalary] = useState("");
  const [savings, setSavings] = useState("");
  const cardRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const currentHousePrice = getCurrentHousePrices()[city];
  const depositNeeded = currentHousePrice * 0.2; // 20% deposit

  const calculateTimeToSave = () => {
    const annualSavings = Number(salary) * 0.2; // Assuming 20% savings rate
    return Math.ceil((depositNeeded - Number(savings)) / annualSavings);
  };

  const handleShare = async () => {
    if (!cardRef.current) return;

    try {
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: null,
        scale: 2,
      });
      
      const dataUrl = canvas.toDataURL('image/png');
      const blob = await (await fetch(dataUrl)).blob();
      
      if (navigator.share) {
        await navigator.share({
          title: `${city} Housing Affordability Calculator`,
          text: 'Check out how long it takes to save for a house deposit!',
          url: window.location.href,
          files: [new File([blob], 'affordability.png', { type: 'image/png' })]
        });
      } else {
        // Create download link
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'affordability.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Copy URL to clipboard
        await navigator.clipboard.writeText(window.location.href);
        toast({
          title: "Image saved & link copied!",
          description: "The calculation has been downloaded and the share link copied to your clipboard",
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
        <CardTitle>Affordability Calculator</CardTitle>
        <Button variant="outline" size="icon" onClick={handleShare}>
          <Share2 className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent ref={cardRef} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="salary">Annual Salary (AUD)</Label>
          <Input
            id="salary"
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="Enter your annual salary"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="savings">Current Savings (AUD)</Label>
          <Input
            id="savings"
            type="number"
            value={savings}
            onChange={(e) => setSavings(e.target.value)}
            placeholder="Enter your current savings"
          />
        </div>

        <div className="pt-4 space-y-2">
          <p className="text-sm text-muted-foreground">Required deposit (20%):</p>
          <p className="text-xl font-bold">${depositNeeded.toLocaleString()}</p>
        </div>

        {salary && savings && (
          <div className="pt-4 space-y-2">
            <p className="text-sm text-muted-foreground">Time to save for deposit:</p>
            <p className="text-2xl font-bold">{calculateTimeToSave()} years</p>
            <p className="text-sm text-muted-foreground">
              Based on saving 20% of your annual salary
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}