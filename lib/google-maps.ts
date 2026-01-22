// ABOUTME: Shared Google Maps API loader configuration
// ABOUTME: All components must use this shared config to prevent loader conflicts

// Libraries needed across the application:
// - "places" for AddressInput autocomplete
// - Core maps API is included automatically
export const GOOGLE_MAPS_LIBRARIES: ("places")[] = ["places"];

// Shared loader options for useJsApiLoader
export const googleMapsLoaderOptions = {
  googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
  libraries: GOOGLE_MAPS_LIBRARIES,
} as const;
