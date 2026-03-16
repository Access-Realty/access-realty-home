// ABOUTME: Interactive Mapbox GL JS map for SEO property pages
// ABOUTME: Clustering, pin popups, viewport tracking via react-map-gl

'use client'

import { useState, useCallback, useMemo, useRef } from 'react'
import Map, { Source, Layer, Popup, NavigationControl } from 'react-map-gl/mapbox'
import type { MapRef, MapMouseEvent } from 'react-map-gl/mapbox'
import type { GeoJSONSource, CircleLayerSpecification, SymbolLayerSpecification } from 'mapbox-gl'
import type { SeoListingProps } from '@/types/seo-listing'
import ListingPopup from './ListingPopup'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
const BRAND_NAVY = '#284b70'  // Closed/sold
const ACTIVE_GREEN = '#16a34a' // Active/Pending (green-600)

interface ListingsMapProps {
  listings: SeoListingProps[]
  initialCenter: [number, number] // [lng, lat]
  initialZoom: number
  onVisibleListingsChange: (visibleIds: string[]) => void
  onHighlightChange?: (listingId: string | null) => void
  clusteringEnabled?: boolean
  interactive?: boolean // false = locked view, no pan/zoom, fit to pins
}

const clusterLayer: Omit<CircleLayerSpecification, 'source'> = {
  id: 'clusters',
  type: 'circle',
  filter: ['has', 'point_count'],
  paint: {
    'circle-color': BRAND_NAVY,
    'circle-radius': ['step', ['get', 'point_count'], 18, 10, 24, 50, 32],
    'circle-opacity': 0.85,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
  },
}

const clusterCountLayer: Omit<SymbolLayerSpecification, 'source'> = {
  id: 'cluster-count',
  type: 'symbol',
  filter: ['has', 'point_count'],
  layout: {
    'text-field': '{point_count_abbreviated}',
    'text-font': ['DIN Pro Medium', 'Arial Unicode MS Bold'],
    'text-size': 13,
  },
  paint: {
    'text-color': '#ffffff',
  },
}

const unclusteredPointLayer: Omit<CircleLayerSpecification, 'source'> = {
  id: 'unclustered-point',
  type: 'circle',
  filter: ['!', ['has', 'point_count']],
  paint: {
    'circle-color': [
      'match', ['get', 'status'],
      'Closed', BRAND_NAVY,
      ACTIVE_GREEN, // default: all non-closed statuses
    ],
    'circle-radius': 7,
    'circle-stroke-width': 2,
    'circle-stroke-color': '#ffffff',
    'circle-opacity': 0.9,
  },
}

function listingsToGeoJSON(listings: SeoListingProps[]): GeoJSON.FeatureCollection {
  return {
    type: 'FeatureCollection',
    features: listings.map((l) => ({
      type: 'Feature',
      geometry: {
        type: 'Point',
        coordinates: [l.longitude, l.latitude],
      },
      properties: {
        listingId: l.listingId,
        status: l.status,
      },
    })),
  }
}

export default function ListingsMap({
  listings,
  initialCenter,
  initialZoom,
  onVisibleListingsChange,
  onHighlightChange,
  clusteringEnabled = true,
  interactive = true,
}: ListingsMapProps) {
  const mapRef = useRef<MapRef>(null)
  const lastVisibleIdsRef = useRef<string>('')
  const [selectedListing, setSelectedListing] = useState<SeoListingProps | null>(null)

  const closePopup = useCallback(() => {
    setSelectedListing(null)
    onHighlightChange?.(null)
  }, [onHighlightChange])

  const listingMap = useMemo(
    () => new globalThis.Map<string, SeoListingProps>(listings.map((l) => [l.listingId, l])),
    [listings]
  )

  const geojson = useMemo(() => listingsToGeoJSON(listings), [listings])

  const updateVisibleListings = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (!map) return

    const bounds = map.getBounds()
    if (!bounds) return

    const visibleIds = listings
      .filter((l) =>
        l.longitude >= bounds.getWest() &&
        l.longitude <= bounds.getEast() &&
        l.latitude >= bounds.getSouth() &&
        l.latitude <= bounds.getNorth()
      )
      .map((l) => l.listingId)

    // Skip update if visible set hasn't changed (avoids unnecessary grid re-renders)
    const key = visibleIds.join(',')
    if (key === lastVisibleIdsRef.current) return
    lastVisibleIdsRef.current = key

    onVisibleListingsChange(visibleIds)
  }, [listings, onVisibleListingsChange])

  const handleMapLoad = useCallback(() => {
    if (!interactive && listings.length > 0) {
      // Fit bounds to all pins with padding
      const map = mapRef.current?.getMap()
      if (map) {
        const lngs = listings.map(l => l.longitude)
        const lats = listings.map(l => l.latitude)
        map.fitBounds(
          [[Math.min(...lngs), Math.min(...lats)], [Math.max(...lngs), Math.max(...lats)]],
          { padding: 50, maxZoom: 15 }
        )
      }
    }
    updateVisibleListings()
  }, [updateVisibleListings, interactive, listings])

  const handleMoveEnd = useCallback(() => {
    if (interactive) updateVisibleListings()
  }, [updateVisibleListings, interactive])

  const handleClick = useCallback(
    (e: MapMouseEvent) => {
      const map = mapRef.current?.getMap()
      if (!map) return

      const clusterFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['clusters'],
      })
      if (clusterFeatures.length > 0) {
        const feature = clusterFeatures[0]
        const clusterId = feature.properties?.cluster_id
        const source = map.getSource('listings') as GeoJSONSource
        source.getClusterExpansionZoom(clusterId, (err, zoom) => {
          if (err || zoom == null) return
          const geometry = feature.geometry as GeoJSON.Point
          map.easeTo({
            center: geometry.coordinates as [number, number],
            zoom,
          })
        })
        return
      }

      const pointFeatures = map.queryRenderedFeatures(e.point, {
        layers: ['unclustered-point'],
      })
      if (pointFeatures.length > 0) {
        const listingId = pointFeatures[0].properties?.listingId
        const listing = listingMap.get(listingId)
        if (listing) {
          setSelectedListing(listing)
          onHighlightChange?.(listing.listingId)
        }
      } else {
        closePopup()
      }
    },
    [listingMap, onHighlightChange, closePopup]
  )

  const handleMouseEnter = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = 'pointer'
  }, [])

  const handleMouseLeave = useCallback(() => {
    const map = mapRef.current?.getMap()
    if (map) map.getCanvas().style.cursor = ''
  }, [])

  if (!MAPBOX_TOKEN) {
    return null
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border" style={{ height: 450 }}>
      <Map
        ref={mapRef}
        mapboxAccessToken={MAPBOX_TOKEN}
        initialViewState={{
          longitude: initialCenter[0],
          latitude: initialCenter[1],
          zoom: initialZoom,
        }}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        onLoad={handleMapLoad}
        onMoveEnd={handleMoveEnd}
        onClick={handleClick}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        interactiveLayerIds={['clusters', 'unclustered-point']}
        attributionControl={false}
        dragPan={interactive}
        scrollZoom={interactive}
        doubleClickZoom={interactive}
        touchZoomRotate={interactive}
        dragRotate={false}
      >
        {interactive && <NavigationControl position="top-right" />}

        <Source
          id="listings"
          type="geojson"
          data={geojson}
          cluster={clusteringEnabled}
          clusterMaxZoom={14}
          clusterRadius={50}
        >
          <Layer {...clusterLayer} />
          <Layer {...clusterCountLayer} />
          <Layer {...unclusteredPointLayer} />
        </Source>

        {selectedListing && (
          <Popup
            longitude={selectedListing.longitude}
            latitude={selectedListing.latitude}
            anchor="bottom"
            onClose={closePopup}
            closeButton={false}
            maxWidth="280px"
          >
            <ListingPopup
              listing={selectedListing}
              onClose={closePopup}
            />
          </Popup>
        )}
      </Map>
    </div>
  )
}
