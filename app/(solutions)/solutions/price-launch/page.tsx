// ABOUTME: Price Launch page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and ClosedDealsMap during SSG

import PriceLaunchContent from "./PriceLaunchContent";

// Force dynamic rendering to avoid Google Maps loader conflicts during build
// AddressInput uses ["places"] while ClosedDealsMap uses ["maps"]
export const dynamic = 'force-dynamic';

export default function PriceLaunchPage() {
  return <PriceLaunchContent />;
}
