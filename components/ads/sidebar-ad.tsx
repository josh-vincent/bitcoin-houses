import { AdUnit } from "./ad-unit";

export function SidebarAd() {
  return (
    <AdUnit
      slot="YOUR_SIDEBAR_SLOT_ID" // Replace with your slot ID
      format="vertical"
      className="min-h-[600px]"
    />
  );
}