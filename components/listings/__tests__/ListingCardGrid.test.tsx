import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import ListingCardGrid from '../ListingCardGrid'
import type { SeoListingProps } from '@/types/seo-listing'

const makeListing = (id: string, address: string): SeoListingProps => ({
  listingId: id,
  address,
  city: 'Arlington',
  postalCode: '76017',
  price: 400000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 2000,
  status: 'Closed',
  date: '2026-02-14T00:00:00Z',
  photoUrl: null,
  photosCount: 0,
  latitude: 32.67,
  longitude: -97.14,
  originalPrice: null,
  yearBuilt: null,
  parking: null,
  dom: null,
  concessions: null,
  listOfficeName: null,
  listAgentName: null,
  listOfficeMlsId: null,
  listAgentMlsId: null,
})

const listings = [
  makeListing('1', '100 Main St'),
  makeListing('2', '200 Oak Ave'),
  makeListing('3', '300 Elm Dr'),
]

describe('ListingCardGrid', () => {
  it('renders only visible listings', () => {
    render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '3']}
        highlightedId={null}
      />
    )
    expect(screen.getByText('100 Main St')).toBeDefined()
    expect(screen.getByText('300 Elm Dr')).toBeDefined()
    expect(screen.queryByText('200 Oak Ave')).toBeNull()
  })

  it('shows count of visible vs total', () => {
    render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '2']}
        highlightedId={null}
      />
    )
    expect(screen.getByText(/Showing 2 of 3/)).toBeDefined()
  })

  it('highlights the correct card', () => {
    const { container } = render(
      <ListingCardGrid
        listings={listings}
        visibleIds={['1', '2', '3']}
        highlightedId="2"
      />
    )
    const highlighted = container.querySelector('[data-listing-id="2"]')
    expect(highlighted?.className).toContain('ring-2')
  })
})
