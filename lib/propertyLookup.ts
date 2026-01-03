// ABOUTME: Client-side service for property data lookup via Supabase Edge Function
// ABOUTME: Returns parcel data stored in shared DB (avoids duplicate BatchData calls)

// Parcel data from Edge Function (matches parcels table structure)
export interface ParcelData {
  parcel_id: string;
  cached: boolean;
  address_hash?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  full_address?: string;
  latitude?: number;
  longitude?: number;
  property_type_detail?: string;
  living_area_sqft?: number;
  bedrooms?: number;
  bathrooms_full?: number;
  bathrooms_total?: number;
  stories?: number;
  lot_size_acres?: number;
  year_built?: number;
  avm_value?: number;
  subdivision?: string;
}

// Mapped property specs for display/forms
export interface PropertySpecs {
  parcelId: string;
  cached: boolean;
  propertyType: string;
  propertyTypeLabel: string;
  bedrooms: number | null;
  fullBathrooms: number | null;
  halfBathrooms: number | null;
  squareFeet: number | null;
  stories: number | null;
  lotSizeAcres: number | null;
  yearBuilt: number | null;
  avmValue: number | null;
}

// Local cache for session (avoids redundant API calls within same session)
const sessionCache = new Map<string, PropertySpecs | null>();

/**
 * Map property type detail to value/label
 * Defaults to "Single Family Home" for unrecognized types
 */
function mapPropertyType(typeDetail: string | undefined): { value: string; label: string } {
  const normalized = (typeDetail || "").toLowerCase().trim();

  // Check for known property types
  if (normalized.includes("condo")) {
    return { value: "condo", label: "Condo" };
  }
  if (normalized.includes("townho") || normalized.includes("townhome")) {
    return { value: "townhome", label: "Townhouse" };
  }
  if (normalized.includes("duplex")) {
    if (normalized.includes("half")) {
      return { value: "halfDuplex", label: "Half Duplex" };
    }
    return { value: "duplex", label: "Duplex" };
  }
  if (normalized.includes("land") || normalized.includes("lot") || normalized.includes("vacant")) {
    return { value: "land", label: "Land" };
  }

  // Default to Single Family Home for residential/unknown types
  return { value: "residential", label: "Single Family Home" };
}

/**
 * Calculate half bathrooms from total and full count
 */
function calculateHalfBaths(total: number | undefined, full: number | undefined): number | null {
  if (total === undefined || total === null) return null;
  if (full === undefined || full === null) {
    // If only total, estimate half baths from decimal
    const decimal = total % 1;
    return decimal >= 0.5 ? 1 : 0;
  }
  // Calculate from difference
  const diff = total - full;
  return Math.round(diff * 2); // Each .5 = 1 half bath
}

/**
 * Map parcel data to PropertySpecs for display
 */
function mapParcelToSpecs(parcel: ParcelData): PropertySpecs {
  const mappedType = mapPropertyType(parcel.property_type_detail);

  return {
    parcelId: parcel.parcel_id,
    cached: parcel.cached,
    propertyType: mappedType.value,
    propertyTypeLabel: mappedType.label,
    bedrooms: parcel.bedrooms ?? null,
    fullBathrooms: parcel.bathrooms_full ?? null,
    halfBathrooms: calculateHalfBaths(parcel.bathrooms_total, parcel.bathrooms_full),
    squareFeet: parcel.living_area_sqft ?? null,
    stories: parcel.stories ?? null,
    lotSizeAcres: parcel.lot_size_acres ?? null,
    yearBuilt: parcel.year_built ?? null,
    avmValue: parcel.avm_value ?? null,
  };
}

/**
 * Look up property data by address
 * Calls Edge Function which stores parcel in shared DB
 */
export async function lookupProperty(address: string): Promise<PropertySpecs | null> {
  const cacheKey = address.toLowerCase().trim();

  // Check session cache first
  if (sessionCache.has(cacheKey)) {
    console.log("Using session-cached property data for:", address);
    return sessionCache.get(cacheKey) || null;
  }

  console.log("Looking up property:", address);

  try {
    const response = await fetch("/api/property-lookup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ address }),
    });

    if (response.ok) {
      const parcel: ParcelData = await response.json();
      const specs = mapParcelToSpecs(parcel);

      // Cache for this session
      sessionCache.set(cacheKey, specs);

      console.log(
        `Property found: ${specs.bedrooms} bed, ${specs.squareFeet} sqft`,
        specs.cached ? "(from DB cache)" : "(fresh lookup)"
      );

      return specs;
    } else if (response.status === 404) {
      // Cache negative result for session
      sessionCache.set(cacheKey, null);
      console.log("Property not found:", address);
      return null;
    } else {
      console.error("Property lookup failed:", response.status);
      return null;
    }
  } catch (error) {
    console.error("Property lookup error:", error);
    return null;
  }
}

/**
 * Format specs for display
 */
export function formatSpecs(specs: PropertySpecs): string {
  const parts: string[] = [];

  if (specs.bedrooms) parts.push(`${specs.bedrooms} bed`);
  if (specs.fullBathrooms) {
    let bathStr = `${specs.fullBathrooms} bath`;
    if (specs.halfBathrooms && specs.halfBathrooms > 0) {
      bathStr = `${specs.fullBathrooms}.${specs.halfBathrooms > 1 ? specs.halfBathrooms : "5"} bath`;
    }
    parts.push(bathStr);
  }
  if (specs.squareFeet) parts.push(`${specs.squareFeet.toLocaleString()} sqft`);
  if (specs.yearBuilt) parts.push(`Built ${specs.yearBuilt}`);

  return parts.join(" · ");
}

/**
 * Format AVM value for display
 */
export function formatAvmValue(value: number | null): string {
  if (!value) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}
