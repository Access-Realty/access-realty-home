// ABOUTME: Supabase public storage URL helpers for marketing site assets
// ABOUTME: Matches the app repo's pattern in src/constants/storage.ts

const SUPABASE_URL = "https://hvbicnpvactgxzprnygc.supabase.co";

/** Build a full URL for a file in the public-assets storage bucket */
export function publicAssetUrl(path: string): string {
  return `${SUPABASE_URL}/storage/v1/object/public/public-assets/${path}`;
}

/** Build a CDN-optimized image URL with auto WebP conversion and optional resizing */
export function publicAssetImageUrl(
  path: string,
  options: { width?: number; quality?: number } = {}
): string {
  const { width, quality } = options;
  const params = new URLSearchParams();
  if (width) params.set("width", String(width));
  if (quality) params.set("quality", String(quality));
  return `${SUPABASE_URL}/storage/v1/render/image/public/public-assets/${path}?${params}`;
}
