// ABOUTME: Supabase public storage URL helper for marketing site assets
// ABOUTME: Matches the app repo's pattern in src/constants/storage.ts

const SUPABASE_URL = "https://hvbicnpvactgxzprnygc.supabase.co";

/** Build a full URL for a file in the public-assets storage bucket */
export function publicAssetUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
}
