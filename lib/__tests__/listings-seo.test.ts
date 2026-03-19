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
      original_list_price: 425000,
      bedrooms_total: 3,
      bathrooms_total_decimal: 2.0,
      living_area: 2555,
      year_built: 1978,
      garage_spaces: 3,
      parking_total: 4,
      latitude: 32.6716,
      longitude: -97.1426,
      mls_status: 'Closed',
      status_change_timestamp: '2026-02-14T00:00:00Z',
      listing_contract_date: '2026-01-20',
      purchase_contract_date: '2026-02-05',
      cancellation_date: null,
      photo_urls: ['https://example.com/1.jpg', 'https://example.com/2.jpg'],
      photos_count: 25,
      ConcessionsAmount: '5000',
    }

    const result = transformListings([row])
    expect(result).toHaveLength(1)
    expect(result[0]).toEqual({
      listingId: '20976128',
      address: '4605 Brentgate Ct',
      city: 'Arlington',
      postalCode: '76017',
      price: 415000,
      originalPrice: 425000,
      bedrooms: 3,
      bathrooms: 2,
      sqft: 2555,
      yearBuilt: 1978,
      parking: 3,
      status: 'Closed',
      date: '2026-02-14T00:00:00Z',
      dom: 16, // Closed: purchase_contract_date(Feb 5) - listing_contract_date(Jan 20)
      photoUrl: 'https://example.com/1.jpg',
      photosCount: 25,
      latitude: 32.6716,
      longitude: -97.1426,
      concessions: 5000,
      listOfficeMlsId: null,
      listAgentMlsId: null,
    })
  })

  it('handles null photo_urls', () => {
    const row = {
      listing_id: '123',
      unparsed_address: '100 Main St',
      city: 'Dallas',
      postal_code: '75001',
      list_price: 300000,
      original_list_price: null,
      bedrooms_total: 2,
      bathrooms_total_decimal: 1,
      living_area: null,
      year_built: null,
      garage_spaces: null,
      parking_total: null,
      latitude: 32.7,
      longitude: -96.8,
      mls_status: 'Closed',
      status_change_timestamp: null,
      listing_contract_date: '2026-01-01',
      purchase_contract_date: null,
      cancellation_date: null,
      photo_urls: null,
      photos_count: null,
      ConcessionsAmount: null,
    }

    const result = transformListings([row])
    expect(result[0].photoUrl).toBeNull()
    expect(result[0].sqft).toBeNull()
    expect(result[0].date).toBe('2026-01-01')
    expect(result[0].concessions).toBeNull()
  })

  it('returns empty array for empty input', () => {
    expect(transformListings([])).toEqual([])
  })
})
