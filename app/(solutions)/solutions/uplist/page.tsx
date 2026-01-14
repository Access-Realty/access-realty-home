// ABOUTME: Uplist page wrapper - forces dynamic rendering
// ABOUTME: Avoids Google Maps loader conflicts between AddressInput and other map components during SSG

import UplistContent from "./UplistContent";

// Force dynamic rendering to avoid Google Maps loader conflicts during build
export const dynamic = 'force-dynamic';

export default function UplistPage() {
  return <UplistContent />;
}
