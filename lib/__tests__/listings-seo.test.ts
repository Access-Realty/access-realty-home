import { describe, it, expect, vi } from 'vitest'

// lib/listings-seo.ts imports 'server-only' which throws outside RSC.
// Mock it so the module can be imported in Vitest's jsdom environment.
vi.mock('server-only', () => ({}))

import { transformListings } from '../listings-seo'

describe('transformListings', () => {
  it('maps MLS row fields to SeoListingProps', () => {
    const row = {
      listing_id: '20976128',
      unparsed_address: '4605 Brentgate Ct',
      city: 'Arlington',
      postal_code: '76017',
      list_price: 415000,
      bedrooms_total: 3,
      bathrooms_total_decimal: 2.0,
      living_area: 2555,
      latitude: 32.6716,
      longitude: -97.1426,
      standard_status: 'Closed',
      status_change_timestamp: '2026-02-14T00:00:00Z',
      listing_contract_date: '2026-01-20',
      photo_urls: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
    }

    const result = transformListings([row])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      listingId: '20976128',
      address: '4605 Brentgate Ct',
      city: 'Arlington',
      postalCode: '76017',
      price: 415000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2555,
      status: 'Closed',
      date: '2026-02-14T00:00:00Z',
      photoUrl: 'https://example.com/1.jpg',
      latitude: 32.6716,
      longitude: -97.1426,
    })
  })

  it('handles null photo_urls', () => {
    const row = {
      listing_id: '123',
      unparsed_address: '100 Main St',
      city: 'Dallas',
      postal_code: '75001',
      list_price: 300000,
      bedrooms_total: 2,
      bathrooms_total_decimal: 1,
      living_area: null,
      latitude: 32.7,
      longitude: -96.8,
      standard_status: 'Closed',
      status_change_timestamp: null,
      listing_contract_date: '2026-01-01',
      photo_urls: null,
    }

    const result = transformListings([row])
    expect(result[0].photoUrl).toBeNull()
    expect(result[0].sqft).toBeNull()
    expect(result[0].date).toBe('2026-01-01')
  })

  it('returns empty array for empty input', () => {
    expect(transformListings([])).toEqual([])
  })
})
