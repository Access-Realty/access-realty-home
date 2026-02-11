// ABOUTME: Shared brand types and utilities for multi-domain setup
// ABOUTME: Used by both server and client code — no server-only imports here

export type Brand = "access" | "directlist";

export interface BrandConfig {
  brand: Brand;
  siteUrl: string;
  brandName: string;
}

export const BRAND_CONFIGS: Record<Brand, BrandConfig> = {
  access: {
    brand: "access",
    siteUrl: "https://access.realty",
    brandName: "Access Realty",
  },
  directlist: {
    brand: "directlist",
    siteUrl: "https://direct-list.com",
    brandName: "DirectList",
  },
};

/**
 * Adjusts a path for the current brand.
 * On direct-list.com, strips the /direct-list prefix so links stay clean.
 * On access.realty, returns the path unchanged.
 */
export function brandPath(path: string, brand: Brand): string {
  if (brand === "directlist" && path.startsWith("/direct-list")) {
    return path.replace(/^\/direct-list/, "") || "/";
  }
  return path;
}
