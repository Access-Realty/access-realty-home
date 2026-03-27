// lib/investorVetting.ts
// ABOUTME: Pure business logic for investor qualification vetting
// ABOUTME: Checks parcel data from BatchData to determine if seller is an investor

export type VettingResult = {
  passed: boolean;
  reason: string;
  signal: "llc_owner" | "corporate_owned" | "recent_transfer" | "homestead" | "no_signal";
};

/**
 * Determine if a property's ownership signals indicate an investor seller.
 *
 * Priority order:
 * 1. LLC/Corp/Trust ownership → PASS (trumps homestead)
 * 2. Homestead exemption → FAIL
 * 3. Owned < 1 year → PASS
 * 4. No clear signal → FAIL
 */
export function vetInvestor(parcel: {
  owner_status_type?: string | null;
  ql_corporate_owned?: boolean | null;
  ql_trust_owned?: boolean | null;
  last_transfer_date?: string | null;
  raw_response?: Record<string, unknown> | null;
}): VettingResult {
  // 1. LLC/Corporate/Trust ownership — PASS (highest priority, trumps HS)
  const ownerType = (parcel.owner_status_type || "").toLowerCase();
  if (
    ownerType.includes("company") ||
    ownerType.includes("corporate") ||
    ownerType.includes("llc") ||
    ownerType.includes("trust")
  ) {
    return { passed: true, reason: "Property owned by entity", signal: "llc_owner" };
  }
  if (parcel.ql_corporate_owned || parcel.ql_trust_owned) {
    return { passed: true, reason: "Entity-owned property", signal: "corporate_owned" };
  }

  // 2. Homestead exemption — FAIL
  if (hasHomesteadExemption(parcel.raw_response)) {
    return { passed: false, reason: "Homestead exemption detected", signal: "homestead" };
  }

  // 3. Owned less than 1 year — PASS
  if (parcel.last_transfer_date) {
    const transferDate = new Date(parcel.last_transfer_date);
    const oneYearAgo = new Date();
    oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
    if (transferDate > oneYearAgo) {
      return { passed: true, reason: "Recent acquisition (< 1 year)", signal: "recent_transfer" };
    }
  }

  // 4. No clear signal — FAIL
  return { passed: false, reason: "No investor signals detected", signal: "no_signal" };
}

/**
 * Check raw BatchData response for homestead (HS) tax exemption.
 * BatchData stores exemptions in tax.taxExemptions as an array of strings.
 */
function hasHomesteadExemption(rawResponse: Record<string, unknown> | null | undefined): boolean {
  if (!rawResponse) return false;

  try {
    const tax = rawResponse.tax as Record<string, unknown> | undefined;
    if (!tax) return false;

    const exemptions = tax.taxExemptions;
    if (!Array.isArray(exemptions)) return false;

    return exemptions.some((e: unknown) => {
      const str = String(e).toLowerCase().trim();
      return str.includes("homestead") || str === "hs" || str === "res homestead";
    });
  } catch {
    return false;
  }
}

/** Response shape returned by /api/investor-vetting — shared between route and UI */
export interface InvestorVettingResponse {
  vetting: VettingResult;
  parcel: {
    parcel_id: string;
    street_address?: string;
    city?: string;
    state?: string;
    zip?: string;
    bedrooms?: number;
    bathrooms_total?: number;
    living_area_sqft?: number;
    year_built?: number;
    avm_value?: number;
    owner_1_full_name?: string;
  };
}
