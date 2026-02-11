// ABOUTME: Client-side brand context provider for multi-domain brand detection
// ABOUTME: Reads brand from data-brand attribute on <html>, set by root layout server component

"use client";

import { createContext, useContext, useMemo } from "react";
import type { Brand, BrandConfig } from "./brand";
import { brandPath as brandPathFn } from "./brand";

const BrandContext = createContext<BrandConfig>({
  brand: "access",
  siteUrl: "https://access.realty",
  brandName: "Access Realty",
});

export function BrandProvider({
  brand,
  children,
}: {
  brand: Brand;
  children: React.ReactNode;
}) {
  const config = useMemo<BrandConfig>(() => {
    if (brand === "directlist") {
      return {
        brand: "directlist",
        siteUrl: "https://direct-list.com",
        brandName: "DirectList",
      };
    }
    return {
      brand: "access",
      siteUrl: "https://access.realty",
      brandName: "Access Realty",
    };
  }, [brand]);

  return (
    <BrandContext.Provider value={config}>{children}</BrandContext.Provider>
  );
}

/** Client-side hook to get current brand config */
export function useBrand(): BrandConfig {
  return useContext(BrandContext);
}

/** Client-side hook that returns a path adjusted for the current brand */
export function useBrandPath() {
  const { brand } = useBrand();
  return (path: string) => brandPathFn(path, brand);
}
