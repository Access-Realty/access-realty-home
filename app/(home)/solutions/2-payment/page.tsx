// ABOUTME: 2-Payment page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import TwoPaymentContent from "./TwoPaymentContent";

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function TwoPaymentPage() {
  return <TwoPaymentContent />;
}
