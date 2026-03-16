// ABOUTME: API route to fetch full photo_urls for a listing (on-demand for photo modal)
// ABOUTME: Keeps page payload lean — only fetches when user clicks a photo

import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  const listingId = request.nextUrl.searchParams.get('id')
  if (!listingId) {
    return NextResponse.json({ photos: [] }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('mls_listings')
    .select('photo_urls')
    .eq('listing_id', listingId)
    .limit(1)
    .single()

  if (error || !data?.photo_urls) {
    return NextResponse.json({ photos: [] })
  }

  return NextResponse.json({ photos: data.photo_urls })
}
