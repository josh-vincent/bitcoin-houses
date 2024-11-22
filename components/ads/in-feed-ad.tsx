import { AdUnit } from "./ad-unit";

export function InFeedAd() {
  return (
    <AdUnit
      slot="YOUR_INFEED_SLOT_ID" // Replace with your slot ID
      format="rectangle"
      className="min-h-[250px]"
    />
  );
}