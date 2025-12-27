// ABOUTME: Server component wrapper for closed deals map
// ABOUTME: Fetches data and renders map with stats

import { getClosedDeals, formatPrice } from "@/lib/listings";
import ClosedDealsMap from "./ClosedDealsMap";

interface ClosedDealsSectionProps {
  agentMlsId: string;
  agentName: string;
}

export default async function ClosedDealsSection({
  agentMlsId,
  agentName,
}: ClosedDealsSectionProps) {
  const deals = await getClosedDeals(agentMlsId);

  if (deals.length === 0) {
    return null; // Don't render section if no closed deals
  }

  // Calculate stats
  const totalVolume = deals.reduce(
    (sum, d) => sum + (d.list_price || 0),
    0
  );

  return (
    <section className="py-16 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <p className="text-sm font-semibold text-muted-foreground tracking-widest mb-2">
            TRACK RECORD
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Closed Deals
          </h2>
          <p className="text-muted-foreground">
            {deals.length} homes sold • {formatPrice(totalVolume)} total volume
          </p>
        </div>

        <ClosedDealsMap deals={deals} agentName={agentName} />
      </div>
    </section>
  );
}
