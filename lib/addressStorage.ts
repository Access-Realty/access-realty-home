// ABOUTME: Stores user's property address in localStorage for cross-page persistence
// ABOUTME: Used to pre-fill address in get-started wizard when entered from homepage hero

import type { AddressData } from "@/components/direct-list/AddressInput";

const STORAGE_KEY = "access_address";

/**
 * Get stored address data from localStorage
 */
export function getStoredAddress(): AddressData | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AddressData;
  } catch {
    return null;
  }
}

/**
 * Save address data to localStorage
 */
export function saveAddress(address: AddressData): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(address));
  } catch {
    // localStorage might be full or disabled - fail silently
  }
}

/**
 * Clear stored address data
 */
export function clearAddress(): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Fail silently
  }
}
