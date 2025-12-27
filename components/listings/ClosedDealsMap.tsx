// ABOUTME: Google Maps component showing agent's closed deals
// ABOUTME: Client component with markers for each sold property

"use client";

import { useCallback, useState } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
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
  });

  // Calculate center from deals or use default
  const center = deals.length > 0
    ? {
        lat: deals.reduce((sum, d) => sum + (d.latitude || 0), 0) / deals.length,
        lng: deals.reduce((sum, d) => sum + (d.longitude || 0), 0) / deals.length,
      }
    : defaultCenter;

  const onLoad = useCallback((map: google.maps.Map) => {
    if (deals.length > 1) {
      const bounds = new google.maps.LatLngBounds();
      deals.forEach((deal) => {
        if (deal.latitude && deal.longitude) {
          bounds.extend({ lat: deal.latitude, lng: deal.longitude });
        }
      });
      map.fitBounds(bounds);
      // Add slight zoom out for padding
      const listener = google.maps.event.addListenerOnce(map, 'bounds_changed', () => {
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
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        options={mapOptions}
        onLoad={onLoad}
      >
        {deals.map((deal) => (
          deal.latitude && deal.longitude && (
            <Marker
              key={deal.id}
              position={{ lat: deal.latitude, lng: deal.longitude }}
              onClick={() => setSelectedDeal(deal)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: "#284b70",
                fillOpacity: 0.9,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              }}
            />
          )
        ))}

        {selectedDeal && selectedDeal.latitude && selectedDeal.longitude && (
          <InfoWindow
            position={{ lat: selectedDeal.latitude, lng: selectedDeal.longitude }}
            onCloseClick={() => setSelectedDeal(null)}
          >
            <div className="p-2 min-w-[200px]">
              <p className="font-bold text-gray-900 text-lg">
                {formatPrice(selectedDeal.list_price)}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                {selectedDeal.unparsed_address}
              </p>
              <p className="text-sm text-gray-600 mt-2 flex gap-3">
                {selectedDeal.bedrooms_total && (
                  <span>{selectedDeal.bedrooms_total} bed</span>
                )}
                {selectedDeal.bathrooms_total_decimal && (
                  <span>{selectedDeal.bathrooms_total_decimal} bath</span>
                )}
                {selectedDeal.living_area && (
                  <span>{selectedDeal.living_area.toLocaleString()} sqft</span>
                )}
              </p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="bg-card px-4 py-3 border-t border-border">
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">{deals.length}</span> properties sold by {agentName}
        </p>
      </div>
    </div>
  );
}
