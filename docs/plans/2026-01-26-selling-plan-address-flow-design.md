# Selling Plan Address Flow

Route homepage visitors through the selling plan quiz while preserving their property address for downstream pages.

## Current State

```
Homepage Hero → /direct-list/get-started (wizard)
                ↓ reads address from localStorage
                ↓ clears immediately after reading
```

Solution pages (equity-bridge, price-launch, etc.) each have their own AddressInput but don't read from localStorage — users must re-enter their address.

## Target State

```
Homepage Hero → /selling-plan (quiz, no address shown)
                ↓ address stays in localStorage
                ↓ quiz generates recommendations
                → /solutions/equity-bridge (pre-fills address)
                → /solutions/price-launch (pre-fills address)
                → /direct-list/get-started (pre-fills address)
                → ProgramInquiryModal (has address context)
                ↓ address cleared on lead creation
```

## Changes

### 1. Hero.tsx — Change navigation target

```tsx
// Before
const navigateToWizard = useCallback(() => {
  router.push("/direct-list/get-started");
}, [router]);

// After
const navigateToWizard = useCallback(() => {
  router.push("/selling-plan");
}, [router]);
```

### 2. Solution pages — Read from localStorage on mount

Add to each solution content component:
- `EquityBridgeContent.tsx`
- `PriceLaunchContent.tsx`
- `UplistContent.tsx`
- `SellerFinanceContent.tsx`

```tsx
import { getStoredAddress } from "@/lib/addressStorage";

// Inside component, add useEffect:
useEffect(() => {
  const stored = getStoredAddress();
  if (stored) {
    setAddressData(stored);
  }
}, []);
```

### 3. DirectList wizard — Remove immediate clear

In `app/(direct-list)/direct-list/get-started/page.tsx`, line ~345:

```tsx
// Before
useEffect(() => {
  const storedAddress = getStoredAddress();
  if (storedAddress) {
    // ... populate state
    clearAddress(); // <-- remove this line
  }
}, []);

// After
useEffect(() => {
  const storedAddress = getStoredAddress();
  if (storedAddress) {
    // ... populate state
    // Don't clear here — cleared on lead creation
  }
}, []);
```

### 4. Clear address on lead creation

**ProgramInquiryModal.tsx** — after successful lead creation (~line 113):

```tsx
import { clearAddress } from "@/lib/addressStorage";

// Inside handleSubmit, after successful response:
const { leadId: newLeadId } = await response.json();
setLeadId(newLeadId);
clearAddress(); // <-- add this
```

**DirectList wizard** — in `handleContactSubmit` after successful response (~line 561):

```tsx
import { clearAddress } from "@/lib/addressStorage";

// After storing leadId:
if (data.leadId) {
  setLeadId(data.leadId);
}
clearAddress(); // <-- add this
```

### 5. SellingPlanResults — Pass stored address to modal

In `app/(home)/selling-plan/page.tsx`, the results component needs access to stored address for the "Schedule a Call" modal.

```tsx
// Add state and effect in SellingPlanPage:
const [storedAddress, setStoredAddress] = useState<AddressData | null>(null);

useEffect(() => {
  const stored = getStoredAddress();
  if (stored) {
    setStoredAddress(stored);
  }
}, []);

// Pass to SellingPlanResults:
<SellingPlanResults
  result={recommendation}
  onStartOver={handleRestart}
  storedAddress={storedAddress}  // <-- new prop
/>
```

Update `SellingPlanResults.tsx` to accept and use `storedAddress`:

```tsx
interface SellingPlanResultsProps {
  result: RecommendationResult;
  onStartOver: () => void;
  storedAddress?: AddressData | null;  // <-- new prop
}

// In component, pass to modal:
<ProgramInquiryModal
  isOpen={showInquiryModal}
  onClose={() => setShowInquiryModal(false)}
  programName="Discuss Selling Options"
  programSlug="selling_plan"
  addressData={storedAddress || null}  // <-- use stored address
/>
```

## Files Modified

| File | Change |
|------|--------|
| `components/Hero.tsx` | Navigate to `/selling-plan` |
| `app/(home)/selling-plan/page.tsx` | Read stored address, pass to results |
| `components/selling-plan/SellingPlanResults.tsx` | Accept `storedAddress` prop, pass to modal |
| `app/(solutions)/solutions/equity-bridge/EquityBridgeContent.tsx` | Read stored address on mount |
| `app/(solutions)/solutions/price-launch/PriceLaunchContent.tsx` | Read stored address on mount |
| `app/(solutions)/solutions/uplist/UplistContent.tsx` | Read stored address on mount |
| `app/(solutions)/solutions/seller-finance/SellerFinanceContent.tsx` | Read stored address on mount |
| `app/(direct-list)/direct-list/get-started/page.tsx` | Remove immediate clear, add clear on lead creation |
| `components/solutions/ProgramInquiryModal.tsx` | Clear address on lead creation |

## Testing

1. Enter address on homepage → click "Get Started"
2. Verify redirect to `/selling-plan` (not `/direct-list/get-started`)
3. Complete quiz → verify results show
4. Click "Learn More" on Equity Bridge → verify address pre-filled
5. Go back, click DirectList → verify address pre-filled in wizard
6. Submit contact form → verify address cleared from localStorage
7. Return to homepage → verify no pre-filled address
