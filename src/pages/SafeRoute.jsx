
import { useState } from "react";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
  useMap
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

// Default map center (only for initial map view)
const DEFAULT_CENTER = [23.8103, 90.4125];

// Automatically move map when location or route changes
function MapUpdater({ currentPosition, routePoints }) {
  const map = useMap();

  if (routePoints.length > 0) {
    map.fitBounds(routePoints, { padding: [40, 40] });
  } else if (currentPosition) {
    map.setView(currentPosition, 15);
  }

  return null;
}

function SafeRoute() {
  const [destination, setDestination] = useState("");

  const [currentPosition, setCurrentPosition] = useState(null);

  const [destinationPosition, setDestinationPosition] = useState(null);

  const [routePoints, setRoutePoints] = useState([]);

  const [distance, setDistance] = useState("");

  const [duration, setDuration] = useState("");

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  // Get actual current location
  function getCurrentLocation() {
    setMessage("");

    if (!navigator.geolocation) {
      setMessage("Your browser does not support location.");
      return;
    }

    setLoading(true);
    setMessage("Getting your current location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const userPosition = [
          position.coords.latitude,
          position.coords.longitude
        ];

        setCurrentPosition(userPosition);

        setRoutePoints([]);
        setDestinationPosition(null);
        setDistance("");
        setDuration("");

        setLoading(false);
        setMessage("Your current location detected successfully!");
      },

      (error) => {
        setLoading(false);

        if (error.code === 1) {
          setMessage("Location permission denied. Please allow location access in Chrome.");
        } else if (error.code === 2) {
          setMessage("Your location is currently unavailable.");
        } else {
          setMessage("Location request timed out. Please try again.");
        }
      },

      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  }

  // Find destination and route
  async function findRoute() {
    if (!currentPosition) {
      setMessage("Please click Get Current Location first.");
      return;
    }

    if (!destination.trim()) {
      setMessage("Please enter your destination.");
      return;
    }

    setLoading(true);
    setMessage("Searching for destination and route...");

    setRoutePoints([]);
    setDestinationPosition(null);
    setDistance("");
    setDuration("");

    try {
      // Search destination
      const searchUrl =
        "https://nominatim.openstreetmap.org/search?format=jsonv2&limit=1&q=" +
        encodeURIComponent(destination);

      const searchResponse = await fetch(searchUrl);

      if (!searchResponse.ok) {
        throw new Error("Destination search failed.");
      }

      const searchData = await searchResponse.json();

      if (!searchData || searchData.length === 0) {
        throw new Error("Destination not found. Try another address.");
      }

      const destinationLat = Number(searchData[0].lat);
      const destinationLon = Number(searchData[0].lon);

      const destinationCoords = [
        destinationLat,
        destinationLon
      ];

      setDestinationPosition(destinationCoords);

      // Get driving route from OSRM
      const startLat = currentPosition[0];
      const startLon = currentPosition[1];

      const routeUrl =
        `https://router.project-osrm.org/route/v1/driving/` +
        `${startLon},${startLat};${destinationLon},${destinationLat}` +
        `?overview=full&geometries=geojson`;

      const routeResponse = await fetch(routeUrl);

      if (!routeResponse.ok) {
        throw new Error("Could not calculate route.");
      }

      const routeData = await routeResponse.json();

      if (
        routeData.code !== "Ok" ||
        !routeData.routes ||
        routeData.routes.length === 0
      ) {
        throw new Error("No driving route found.");
      }

      const route = routeData.routes[0];

      // Convert [longitude, latitude] to [latitude, longitude]
      const coordinates = route.geometry.coordinates.map(
        (point) => [point[1], point[0]]
      );

      setRoutePoints(coordinates);

      setDistance((route.distance / 1000).toFixed(2) + " km");

      setDuration(
        Math.round(route.duration / 60) + " minutes"
      );

      setMessage("Route found successfully!");
    } catch (error) {
      console.error("Route Error:", error);
      setMessage(error.message || "Unable to find route. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ padding: "25px" }}>

      <h2>Safe Route Finder</h2>

      <p>
        Find a route from your current location to your destination.
      </p>

      {/* Current Location Button */}
      <div style={{ marginBottom: "15px" }}>

        <button
          onClick={getCurrentLocation}
          disabled={loading}
          style={{
            padding: "12px 18px",
            backgroundColor: "#35483A",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer",
            marginRight: "10px"
          }}
        >
          📍 Get Current Location
        </button>

      </div>

      {/* Destination Input */}
      <div
        style={{
          marginBottom: "15px",
          display: "flex",
          flexWrap: "wrap",
          gap: "10px"
        }}
      >

        <input
          type="text"
          placeholder="Enter your destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{
            padding: "12px",
            width: "250px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />

        <button
          onClick={findRoute}
          disabled={loading}
          style={{
            padding: "12px 20px",
            backgroundColor: "#35483A",
            color: "white",
            border: "none",
            borderRadius: "8px",
            cursor: "pointer"
          }}
        >
          {loading ? "Please wait..." : "Find Safe Route"}
        </button>

      </div>

      {/* Status Message */}
      {message && (
        <p style={{ color: "#35483A", fontWeight: "bold" }}>
          {message}
        </p>
      )}

      {/* Route Information */}
      {distance && duration && (
        <div
          style={{
            padding: "15px",
            marginBottom: "15px",
            backgroundColor: "#DCE5D7",
            borderRadius: "10px"
          }}
        >
          <h3>Route Information</h3>

          <p>📏 Distance: {distance}</p>

          <p>⏱️ Estimated Driving Time: {duration}</p>
        </div>
      )}

      {/* Map */}
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={12}
        style={{
          height: "450px",
          width: "100%",
          borderRadius: "12px"
        }}
      >

        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater
          currentPosition={currentPosition}
          routePoints={routePoints}
        />

        {/* Current Location Marker */}
        {currentPosition && (
          <Marker position={currentPosition}>
            <Popup>
              📍 Your Current Location
            </Popup>
          </Marker>
        )}

        {/* Destination Marker */}
        {destinationPosition && (
          <Marker position={destinationPosition}>
            <Popup>
              🎯 Your Destination
            </Popup>
          </Marker>
        )}

        {/* Route Line */}
        {routePoints.length > 0 && (
          <Polyline
            positions={routePoints}
            pathOptions={{
              color: "#2675D8",
              weight: 5
            }}
          />
        )}

      </MapContainer>

      <p style={{ marginTop: "12px", fontSize: "13px", color: "#666" }}>
        Note: This feature displays a driving route. It does not verify
        whether the roads are safe or guarantee personal safety.
      </p>

    </div>
  );
}

export default SafeRoute;
