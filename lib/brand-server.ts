// ABOUTME: Server-only brand detection — reads x-brand header set by middleware
// ABOUTME: Must only be imported from server components (uses next/headers)

import { headers } from "next/headers";
import type { Brand, BrandConfig } from "./brand";
import { BRAND_CONFIGS } from "./brand";

/** Server-side: read brand from x-brand header set by middleware */
export async function getBrand(): Promise<BrandConfig> {
  const headersList = await headers();
  const brand = (headersList.get("x-brand") as Brand) || "access";
  return BRAND_CONFIGS[brand] || BRAND_CONFIGS.access;
}
