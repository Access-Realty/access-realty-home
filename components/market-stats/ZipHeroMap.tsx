// ABOUTME: 2-tone streets-only hero map background for zip code pages
// ABOUTME: Uses react-map-gl (same as ListingsMap) with custom navy style

'use client'

import { useState } from 'react'
import Map from 'react-map-gl/mapbox'
import 'mapbox-gl/dist/mapbox-gl.css'

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN

// Custom navy 2-tone style — streets only, no labels clutter
const MAP_STYLE: mapboxgl.StyleSpecification = {
  version: 8 as const,
  name: 'Navy Streets',
  sources: {
    'mapbox-streets': {
      type: 'vector' as const,
      url: 'mapbox://mapbox.mapbox-streets-v8',
    },
  },
  layers: [
    {
      id: 'background',
      type: 'background',
      paint: { 'background-color': '#1a3350' },
    },
    {
      id: 'water',
      type: 'fill',
      source: 'mapbox-streets',
      'source-layer': 'water',
      paint: { 'fill-color': '#152a42' },
    },
    {
      id: 'landuse',
      type: 'fill',
      source: 'mapbox-streets',
      'source-layer': 'landuse',
      paint: { 'fill-color': '#1d3856', 'fill-opacity': 0.4 },
    },
    {
      id: 'roads-major',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'motorway', 'trunk', 'primary', 'secondary'],
      paint: {
        'line-color': '#2d5a8a',
        'line-width': ['interpolate', ['linear'], ['zoom'], 8, 0.5, 12, 1.5, 16, 3],
        'line-opacity': 0.7,
      },
    },
    {
      id: 'roads-minor',
      type: 'line',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'tertiary', 'street', 'street_limited'],
      paint: {
        'line-color': '#253f5e',
        'line-width': ['interpolate', ['linear'], ['zoom'], 10, 0.2, 14, 0.8],
        'line-opacity': 0.5,
      },
    },
    {
      id: 'road-labels',
      type: 'symbol',
      source: 'mapbox-streets',
      'source-layer': 'road',
      filter: ['in', 'class', 'motorway', 'trunk', 'primary'],
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 10,
        'symbol-placement': 'line',
        'text-max-angle': 30,
      },
      paint: {
        'text-color': '#3a6690',
        'text-halo-color': '#1a3350',
        'text-halo-width': 1,
      },
    },
    {
      id: 'place-labels',
      type: 'symbol',
      source: 'mapbox-streets',
      'source-layer': 'place_label',
      filter: ['in', 'class', 'neighbourhood', 'suburb'],
      layout: {
        'text-field': ['get', 'name'],
        'text-size': 11,
        'text-transform': 'uppercase',
        'text-letter-spacing': 0.15,
      },
      paint: {
        'text-color': '#4a7daa',
        'text-halo-color': '#1a3350',
        'text-halo-width': 1,
        'text-opacity': 0.6,
      },
    },
  ],
}

interface ZipHeroMapProps {
  center: [number, number] // [lng, lat]
  zoom: number
}

export default function ZipHeroMap({ center, zoom }: ZipHeroMapProps) {
  const [loaded, setLoaded] = useState(false)

  if (!MAPBOX_TOKEN) {
    // Fallback: plain navy background
    return <div className="absolute inset-0 bg-primary-dark" />
  }

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Map */}
      <div style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.6s ease' }} className="w-full h-full">
        <Map
          initialViewState={{ longitude: center[0], latitude: center[1], zoom }}
          mapboxAccessToken={MAPBOX_TOKEN}
          mapStyle={MAP_STYLE}
          interactive={false}
          attributionControl={false}
          onLoad={() => setLoaded(true)}
          style={{ width: '100%', height: '100%' }}
        />
      </div>
      {/* Gradient overlays so text stays readable */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-dark/95 via-primary-dark/70 to-primary-dark/30" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary-dark via-transparent to-primary-dark/50" />
    </div>
  )
}
