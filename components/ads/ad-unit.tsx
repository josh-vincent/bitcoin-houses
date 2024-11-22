"use client";

import { useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";

interface AdUnitProps {
  slot: string;
  format?: "auto" | "rectangle" | "horizontal" | "vertical";
  className?: string;
}

export function AdUnit({ slot, format = "auto", className = "" }: AdUnitProps) {
  // Update the ref type to HTMLModElement
  const adRef = useRef<HTMLModElement | null>(null);

  useEffect(() => {
    try {
      const adsbygoogle = (window as any).adsbygoogle || [];
      if (adRef.current && adsbygoogle) {
        adsbygoogle.push({});
      }
    } catch (err) {
      console.error("AdSense error:", err);
    }
  }, []);

  return (
    <Card className={`overflow-hidden ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client="ca-pub-YOUR_PUBLISHER_ID" // Replace with your AdSense publisher ID
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
        ref={adRef} // Assign the ref directly
      />
    </Card>
  );
}