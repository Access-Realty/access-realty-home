// ABOUTME: Seller Finance page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import SellerFinanceContent from "./SellerFinanceContent";

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function SellerFinancePage() {
  return <SellerFinanceContent />;
}
