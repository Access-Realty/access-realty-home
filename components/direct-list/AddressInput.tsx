// ABOUTME: Google Places Autocomplete input for property address entry
// ABOUTME: Returns structured address data including coordinates for map display

"use client";

import { useRef, useCallback, useEffect, useState } from "react";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";
import { HiOutlineMapPin } from "react-icons/hi2";

// Define libraries array outside component to prevent re-renders
const libraries: ("places")[] = ["places"];

export interface AddressData {
  formattedAddress: string;
  streetNumber?: string;
  streetName?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  lat: number;
  lng: number;
  placeId: string;
}

interface AddressInputProps {
  onAddressSelect: (address: AddressData) => void;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
}

export function AddressInput({
  onAddressSelect,
  placeholder = "Enter your property address",
  className = "",
  defaultValue = "",
}: AddressInputProps) {
  const [inputValue, setInputValue] = useState(defaultValue);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  const onLoad = useCallback((autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const onPlaceChanged = useCallback(() => {
    if (!autocompleteRef.current) return;

    const place = autocompleteRef.current.getPlace();
    if (!place.geometry?.location || !place.place_id) return;

    // Parse address components
    const addressComponents = place.address_components || [];
    const getComponent = (type: string) =>
      addressComponents.find((c) => c.types.includes(type))?.long_name || "";
    const getShortComponent = (type: string) =>
      addressComponents.find((c) => c.types.includes(type))?.short_name || "";

    const addressData: AddressData = {
      formattedAddress: place.formatted_address || "",
      streetNumber: getComponent("street_number"),
      streetName: getComponent("route"),
      city: getComponent("locality") || getComponent("sublocality"),
      state: getShortComponent("administrative_area_level_1"),
      zipCode: getComponent("postal_code"),
      lat: place.geometry.location.lat(),
      lng: place.geometry.location.lng(),
      placeId: place.place_id,
    };

    setInputValue(addressData.formattedAddress);
    onAddressSelect(addressData);
  }, [onAddressSelect]);

  // Update input value when defaultValue changes
  useEffect(() => {
    setInputValue(defaultValue);
  }, [defaultValue]);

  if (loadError) {
    return (
      <div className="text-red-500 text-sm">
        Error loading address lookup. Please enter address manually.
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`relative ${className}`}>
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <HiOutlineMapPin className="h-5 w-5 text-muted-foreground" />
        </div>
        <input
          type="text"
          placeholder="Loading..."
          disabled
          className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-muted text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <HiOutlineMapPin className="h-5 w-5 text-muted-foreground" />
      </div>
      <Autocomplete
        onLoad={onLoad}
        onPlaceChanged={onPlaceChanged}
        options={{
          componentRestrictions: { country: "us" },
          types: ["address"],
          fields: ["address_components", "formatted_address", "geometry", "place_id"],
        }}
      >
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-11 pr-4 py-3 border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-shadow"
        />
      </Autocomplete>
    </div>
  );
}
