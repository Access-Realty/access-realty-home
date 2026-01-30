// ABOUTME: High-performance deck.gl map for closed listings visualization
// ABOUTME: Uses MapLibre for base map + ScatterplotLayer for GPU-accelerated points

"use client";

import { useState, useMemo, useCallback } from "react";
import DeckGL from "@deck.gl/react";
import { ScatterplotLayer } from "@deck.gl/layers";
import { Map } from "react-map-gl/maplibre";
import type { PickingInfo } from "@deck.gl/core";
import type { ClosedListing } from "@/lib/listings";
import "maplibre-gl/dist/maplibre-gl.css";

interface DeckGLListingsMapProps {
  listings: ClosedListing[];
}

// DFW center
const INITIAL_VIEW_STATE = {
  latitude: 32.7767,
  longitude: -96.797,
  zoom: 9,
  pitch: 0,
  bearing: 0,
};

// CARTO Positron - light gray with labels
const MAP_STYLE = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json";

// Access Realty colors
const COLORS = {
  primary: [40, 75, 112] as [number, number, number], // #284b70 - Navy
  accent: [79, 129, 189] as [number, number, number], // Lighter blue for buyer side
};

export default function DeckGLListingsMap({ listings }: DeckGLListingsMapProps) {
  const [selectedListing, setSelectedListing] = useState<ClosedListing | null>(null);
  const [selectedPosition, setSelectedPosition] = useState<{ x: number; y: number } | null>(null);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  // Filter to listings with valid coordinates
  const validListings = useMemo(
    () => listings.filter((l) => l.latitude && l.longitude),
    [listings]
  );

  // Calculate center from listings
  const center = useMemo(() => {
    if (validListings.length === 0) return INITIAL_VIEW_STATE;
    const avgLat = validListings.reduce((sum, l) => sum + l.latitude!, 0) / validListings.length;
    const avgLng = validListings.reduce((sum, l) => sum + l.longitude!, 0) / validListings.length;
    return { ...INITIAL_VIEW_STATE, latitude: avgLat, longitude: avgLng };
  }, [validListings]);

  // Set initial view to center on listings
  useState(() => {
    setViewState(center);
  });

  const onClick = useCallback((info: PickingInfo) => {
    if (info.object) {
      setSelectedListing(info.object as ClosedListing);
      setSelectedPosition({ x: info.x, y: info.y });
    }
  }, []);

  const closePanel = useCallback(() => {
    setSelectedListing(null);
    setSelectedPosition(null);
  }, []);

  const layers = useMemo(
    () => [
      new ScatterplotLayer({
        id: "listings",
        data: validListings,
        getPosition: (d: ClosedListing) => [d.longitude!, d.latitude!],
        getFillColor: (d: ClosedListing) => (d.side === "listing" ? COLORS.primary : COLORS.accent),
        getRadius: (d: ClosedListing) => {
          const price = d.list_price || 100000;
          return Math.max(200, Math.sqrt(price) / 10);
        },
        radiusMinPixels: 5,
        radiusMaxPixels: 18,
        pickable: true,
        opacity: 0.85,
        stroked: true,
        lineWidthMinPixels: 1.5,
        getLineColor: [255, 255, 255],
      }),
    ],
    [validListings]
  );

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      <div className="relative" style={{ height: 400 }}>
        <DeckGL
          viewState={viewState}
          onViewStateChange={({ viewState: vs }) => {
            setViewState(vs as typeof INITIAL_VIEW_STATE);
            if (selectedListing) closePanel();
          }}
          controller={true}
          layers={layers}
          onClick={onClick}
          getCursor={({ isHovering }) => (isHovering ? "pointer" : "grab")}
        >
          <Map
            mapStyle={MAP_STYLE}
            onClick={closePanel}
            attributionControl={false}
          />
        </DeckGL>

        {/* Property info panel */}
        {selectedListing && selectedPosition && (
          <div
            className="absolute bg-white rounded-xl shadow-2xl z-10 overflow-hidden"
            style={{
              left: Math.min(selectedPosition.x + 15, window.innerWidth - 340),
              top: Math.max(selectedPosition.y - 100, 10),
              width: 300,
            }}
          >
            {selectedListing.photo_urls?.[0] ? (
              <>
                <button
                  onClick={closePanel}
                  className="absolute top-2 right-2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
                >
                  ×
                </button>
                <img
                  src={selectedListing.photo_urls[0]}
                  alt={selectedListing.unparsed_address || "Property"}
                  className="w-full h-36 object-cover"
                />
              </>
            ) : (
              <button
                onClick={closePanel}
                className="absolute top-2 right-2 z-10 bg-gray-200 hover:bg-gray-300 text-gray-600 rounded-full w-6 h-6 flex items-center justify-center text-sm transition-colors"
              >
                ×
              </button>
            )}

            <div className="p-3">
              <p className="text-sm font-medium text-gray-900 truncate">{selectedListing.unparsed_address}</p>
              <p className="text-xs text-gray-500">{selectedListing.city}</p>

              {(selectedListing.bedrooms_total ||
                selectedListing.bathrooms_total_decimal ||
                selectedListing.living_area) && (
                <div className="flex gap-4 mt-2 pt-2 border-t border-gray-100 text-sm">
                  {selectedListing.bedrooms_total && (
                    <span className="text-gray-600">
                      <strong>{selectedListing.bedrooms_total}</strong> bed
                    </span>
                  )}
                  {selectedListing.bathrooms_total_decimal && (
                    <span className="text-gray-600">
                      <strong>{selectedListing.bathrooms_total_decimal}</strong> bath
                    </span>
                  )}
                  {selectedListing.living_area && (
                    <span className="text-gray-600">
                      <strong>{selectedListing.living_area.toLocaleString()}</strong> sqft
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
