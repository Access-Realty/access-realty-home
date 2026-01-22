// ABOUTME: Google Maps component showing agent's closed deals
// ABOUTME: Client component with markers for each sold property

"use client";

import { useCallback, useState, useMemo } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { GOOGLE_MAPS_LIBRARIES } from "@/lib/google-maps";
import type { ClosedDeal } from "@/lib/listings";

interface ClosedDealsMapProps {
  deals: ClosedDeal[];
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

export default function ClosedDealsMap({ deals, agentName }: ClosedDealsMapProps) {
  const [selectedDeal, setSelectedDeal] = useState<ClosedDeal | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries: GOOGLE_MAPS_LIBRARIES,
  });

  // Calculate center from deals or use default
  const center = deals.length > 0
    ? {
        lat: deals.reduce((sum, d) => sum + (d.latitude || 0), 0) / deals.length,
        lng: deals.reduce((sum, d) => sum + (d.longitude || 0), 0) / deals.length,
      }
    : defaultCenter;

  // Memoize marker icons - only compute when Google Maps is loaded
  // This prevents "google is not defined" errors on mobile
  const markerIcons = useMemo(() => {
    if (!isLoaded || typeof google === "undefined" || !google.maps?.SymbolPath) {
      return { listing: undefined, buyer: undefined };
    }
    return {
      listing: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#284b70", // Navy - listing side (seller's agent)
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
      buyer: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 8,
        fillColor: "#d6b283", // Gold/tan - buyer side (buyer's agent)
        fillOpacity: 0.9,
        strokeColor: "#ffffff",
        strokeWeight: 2,
      },
    };
  }, [isLoaded]);

  const onLoad = useCallback((map: google.maps.Map) => {
    // Safety check for google object
    if (typeof google === "undefined" || !google.maps) return;

    if (deals.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      deals.forEach((deal) => {
        if (deal.latitude && deal.longitude) {
          bounds.extend({ lat: deal.latitude, lng: deal.longitude });
        }
      });
      map.fitBounds(bounds);
      // Add slight zoom out for padding
      google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
        const zoom = map.getZoom();
        if (zoom && zoom > 12) map.setZoom(12);
      });
    }
  }, [deals]);

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
        onClick={() => setSelectedDeal(null)}
      >
        {deals.map((deal) => (
          deal.latitude && deal.longitude && (
            <Marker
              key={deal.id}
              position={{ lat: deal.latitude, lng: deal.longitude }}
              onClick={() => setSelectedDeal(deal)}
              icon={markerIcons[deal.side]}
            />
          )
        ))}

        {selectedDeal && selectedDeal.latitude && selectedDeal.longitude && (
          <InfoWindow
            position={{ lat: selectedDeal.latitude, lng: selectedDeal.longitude }}
            onCloseClick={() => setSelectedDeal(null)}
          >
            <div className="flex gap-3 p-1" style={{ maxWidth: 320 }}>
              {selectedDeal.photo_urls?.[0] && (
                <img
                  src={selectedDeal.photo_urls[0]}
                  alt={selectedDeal.unparsed_address || "Property"}
                  className="w-24 h-20 object-cover rounded flex-shrink-0"
                />
              )}
              <div className="min-w-0">
                <p className="font-bold text-gray-900">
                  {formatPrice(selectedDeal.list_price)}
                </p>
                <p className="text-xs text-gray-700 truncate">
                  {selectedDeal.unparsed_address}
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {[
                    selectedDeal.bedrooms_total && `${selectedDeal.bedrooms_total} bed`,
                    selectedDeal.bathrooms_total_decimal && `${selectedDeal.bathrooms_total_decimal} bath`,
                    selectedDeal.living_area && `${selectedDeal.living_area.toLocaleString()} sqft`,
                  ].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="bg-card px-4 py-3 border-t border-border">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{deals.length}</span> closed transactions by {agentName}
          </p>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-primary"></span>
              Seller&apos;s Agent ({deals.filter(d => d.side === "listing").length})
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-secondary"></span>
              Buyer&apos;s Agent ({deals.filter(d => d.side === "buyer").length})
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
