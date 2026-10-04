import React, { useState, useEffect, useRef, useCallback } from "react";

let googleMapsLoaded = false;
let loadCallbacks = [];

function loadGoogleMaps(apiKey, callback) {
  if (window.google && window.google.maps) {
    callback();
    return;
  }
  loadCallbacks.push(callback);
  if (googleMapsLoaded) return;
  googleMapsLoaded = true;

  window.__googleMapsInit = () => {
    loadCallbacks.forEach(cb => cb());
    loadCallbacks = [];
  };

  const script = document.createElement("script");
  script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=__googleMapsInit`;
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);
}

function LocationPicker({ onLocationSelect }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [mapsReady, setMapsReady] = useState(false);

  const apiKey = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || "";

  const getAddressFromCoordinates = useCallback((lat, lng) => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        const components = results[0].address_components;

        const extract = (type) => {
          const comp = components.find(c => c.types.includes(type));
          return comp ? comp.long_name : "";
        };

        const street = extract("route") || extract("sublocality") || extract("neighborhood");
        const city = extract("locality");
        const state = extract("administrative_area_level_1");
        const pincode = extract("postal_code");

        const formattedAddress = results[0].formatted_address;
        setAddress(formattedAddress);

        if (onLocationSelect) {
          onLocationSelect({
            latitude: lat,
            longitude: lng,
            address: street || formattedAddress,
            city,
            state,
            pincode
          });
        }
      } else {
        // Fallback to secondary geocoder (Nominatim) if Google is restricted/unbilled
        console.warn("Google Geocoder failed (Status:", status, "). Trying secondary fallback...");
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.address) {
              const addr = data.address;
              const street = addr.road || addr.suburb || addr.neighbourhood || addr.subdivision || "";
              const city = addr.city || addr.town || addr.village || "";
              const state = addr.state || "";
              const pincode = addr.postcode || "";

              setAddress(data.display_name);
              if (onLocationSelect) {
                onLocationSelect({
                  latitude: lat,
                  longitude: lng,
                  address: street || data.display_name,
                  city,
                  state,
                  pincode
                });
              }
            } else {
              // Final fallback: coordinates
              const coordAddress = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
              setAddress(coordAddress);
              if (onLocationSelect) onLocationSelect({ latitude: lat, longitude: lng, address: coordAddress });
            }
          })
          .catch(err => {
            console.error("Secondary fallback failed:", err);
            const coordAddress = `Lat: ${lat.toFixed(5)}, Lng: ${lng.toFixed(5)}`;
            setAddress(coordAddress);
            if (onLocationSelect) onLocationSelect({ latitude: lat, longitude: lng, address: coordAddress });
          });
      }
    });
  }, [onLocationSelect]);

  useEffect(() => {
    loadGoogleMaps(apiKey, () => setMapsReady(true));
  }, [apiKey]);

  useEffect(() => {
    if (!mapsReady || !mapRef.current) return;

    const defaultCenter = { lat: 13.0827, lng: 80.2707 };

    const map = new window.google.maps.Map(mapRef.current, {
      center: defaultCenter,
      zoom: 16,
    });
    mapInstanceRef.current = map;

    map.addListener("click", (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();

      if (markerRef.current) {
        markerRef.current.setPosition({ lat, lng });
      } else {
        markerRef.current = new window.google.maps.Marker({
          position: { lat, lng },
          map,
        });
      }
      getAddressFromCoordinates(lat, lng);
    });
  }, [mapsReady, getAddressFromCoordinates]);

  const handleUseCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const pos = { lat, lng };

        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(pos);
          mapInstanceRef.current.setZoom(17);
        }

        if (markerRef.current) {
          markerRef.current.setPosition(pos);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position: pos,
            map: mapInstanceRef.current,
          });
        }

        getAddressFromCoordinates(lat, lng);
        setLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Failed to get current location. Please allow location access.");
        setLoading(false);
      }
    );
  };

  return (
    <div style={{ margin: "20px 0" }}>
      <button
        type="button"
        onClick={handleUseCurrentLocation}
        disabled={loading || !mapsReady}
        style={{
          marginBottom: "15px",
          padding: "10px",
          backgroundColor: "#f0f0f0",
          border: "1px solid #ccc",
          borderRadius: "6px",
          cursor: "pointer",
          fontWeight: "bold",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          gap: "8px"
        }}
      >
        {loading ? "Searching..." : "📍 Use Current Location"}
      </button>

      <div
        ref={mapRef}
        style={{ width: "100%", height: "1px", overflow: "hidden", visibility: "hidden", position: "absolute", left: "-9999px" }}
      />
    </div>
  );
}

export default LocationPicker;
