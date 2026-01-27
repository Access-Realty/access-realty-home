// ABOUTME: Google Maps component showing agent's closed listings
// ABOUTME: Client component with markers for each sold property

"use client";

import { useCallback, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps";
import type { ClosedListing } from "@/lib/listings";

interface ClosedListingsMapProps {
  listings: ClosedListing[];
  agentName: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "400px",
};

// DFW center as default
const defaultCenter = {
  lat: 32.7767,
  lng: -96.7970,
};

const mapOptions: google.maps.MapOptions = {
  disableDefaultUI: false,
  zoomControl: true,
  streetViewControl: false,
  mapTypeControl: false,
  fullscreenControl: true,
  styles: [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
  ],
};

function formatPrice(price: number | null): string {
  if (!price) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);
}

export default function ClosedListingsMap({ listings, agentName }: ClosedListingsMapProps) {
  const [selectedListing, setSelectedListing] = useState<ClosedListing | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Calculate center from listings or use default
  const center = listings.length > 0
    ? {
        lat: listings.reduce((sum, d) => sum + (d.latitude || 0), 0) / listings.length,
        lng: listings.reduce((sum, d) => sum + (d.longitude || 0), 0) / listings.length,
      }
    : defaultCenter;

  // Memoize marker icon - single color for all listings
  // This prevents "google is not defined" errors on mobile
  const markerIcon = useMemo(() => {
    if (!isLoaded || typeof google === "undefined" || !google.maps?.SymbolPath) {
      return undefined;
    }
    return {
      path: google.maps.SymbolPath.CIRCLE,
      scale: 8,
      fillColor: "#284b70", // Navy - Access Realty primary
      fillOpacity: 0.9,
      strokeColor: "#ffffff",
      strokeWeight: 2,
    };
  }, [isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Safety check for google object
    if (typeof google === "undefined" || !google.maps) return;

    if (listings.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      listings.forEach((listing) => {
        if (listing.latitude && listing.longitude) {
          bounds.extend({ lat: listing.latitude, lng: listing.longitude });
        }
      });
      map.fitBounds(bounds);
      // Add slight zoom out for padding
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const zoom = map.getZoom();
        if (zoom && zoom > 12) map.setZoom(12);
      });
    }
  }, [listings]);

  if (loadError) {
    return (
      <div className="bg-muted rounded-xl p-8 text-center text-muted-foreground">
        Error loading map
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="bg-muted rounded-xl p-8 text-center text-muted-foreground animate-pulse">
        Loading map...
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden border border-border">
      {/* Hide Google Maps InfoWindow close button - clicking elsewhere closes it */}
      <style>{`.gm-ui-hover-effect { display: none !important; }`}</style>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={mapOptions}
        onLoad={onLoad}
        onClick={() => setSelectedListing(null)}
      >
        {listings.map((listing) => (
          listing.latitude && listing.longitude && (
            <Marker
              key={listing.id}
              position={{ lat: listing.latitude, lng: listing.longitude }}
              onClick={() => setSelectedListing(listing)}
              icon={markerIcon}
            />
          )
        ))}

        {selectedListing && selectedListing.latitude && selectedListing.longitude && (
          <InfoWindow
            position={{ lat: selectedListing.latitude, lng: selectedListing.longitude }}
            onCloseClick={() => setSelectedListing(null)}
          >
            <div className="flex gap-3 p-1" style={{ maxWidth: 320 }}>
              {selectedListing.photo_urls?.[0] && (
                <img
                  src={selectedListing.photo_urls[0]}
                  alt={selectedListing.unparsed_address || "Property"}
                  className="w-24 h-20 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900">
                  {formatPrice(selectedListing.list_price)}
                </p>
                <p className="text-xs text-gray-700 truncate">
                  {selectedListing.unparsed_address}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {[
                    selectedListing.bedrooms_total && `${selectedListing.bedrooms_total} bed`,
                    selectedListing.bathrooms_total_decimal && `${selectedListing.bathrooms_total_decimal} bath`,
                    selectedListing.living_area && `${selectedListing.living_area.toLocaleString()} sqft`,
                  ].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="bg-card px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{listings.length}</span> closed listings by {agentName}
        </p>
      </div>
    </div>
  );
}
