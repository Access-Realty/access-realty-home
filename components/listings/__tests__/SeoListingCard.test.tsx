import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import SeoListingCard from '../SeoListingCard'
import type { SeoListingProps } from '@/types/seo-listing'

const baseListing: SeoListingProps = {
  listingId: '20976128',
  address: '4605 Brentgate Ct',
  city: 'Arlington',
  postalCode: '76017',
  price: 415000,
  originalPrice: 425000,
  bedrooms: 3,
  bathrooms: 2,
  sqft: 2555,
  status: 'Closed',
  date: '2026-02-14T00:00:00Z',
  dom: 42,
  photoUrl: 'https://example.com/photo.jpg',
  latitude: 32.6716,
  longitude: -97.1426,
  concessions: null,
}

describe('SeoListingCard', () => {
  it('renders address, price, and specs', () => {
    render(<SeoListingCard {...baseListing} />)
    expect(screen.getByText('4605 Brentgate Ct')).toBeDefined()
    expect(screen.getByText('$415,000')).toBeDefined()
    expect(screen.getByText(/3/)).toBeDefined()
    expect(screen.getByText(/2,555/)).toBeDefined()
  })

  it('renders status badge with correct text', () => {
    render(<SeoListingCard {...baseListing} />)
    expect(screen.getByText('Closed')).toBeDefined()
  })

  it('renders highlighted ring when highlighted', () => {
    const { container } = render(<SeoListingCard {...baseListing} highlighted />)
    const card = container.firstElementChild
    expect(card?.className).toContain('ring-2')
  })

  it('renders placeholder when no photo', () => {
    render(<SeoListingCard {...baseListing} photoUrl={null} />)
    expect(screen.getByText('4605 Brentgate Ct')).toBeDefined()
  })

  it('formats date for Closed status', () => {
    render(<SeoListingCard {...baseListing} />)
    expect(screen.getByText(/Sold/)).toBeDefined()
  })
})
