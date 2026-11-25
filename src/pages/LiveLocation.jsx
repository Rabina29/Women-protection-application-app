
import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function LiveLocation({ userEmail, token }) {
  const [position, setPosition] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [message, setMessage] = useState("");
  const watchId = useRef(null);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setMessage("Your browser does not support location sharing.");
      return;
    }

    if (!token) {
      setMessage("Please login again to share your location.");
      return;
    }

    setMessage("Requesting location permission...");

    watchId.current = navigator.geolocation.watchPosition(
      async (location) => {
        const latitude = location.coords.latitude;
        const longitude = location.coords.longitude;

        setPosition([latitude, longitude]);

        try {
          const response = await fetch(
            "http://localhost:5000/api/location/update",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({ latitude, longitude }),
            }
          );

          const data = await response.json();

          if (!response.ok) {
            setMessage(data.message || "Location update failed.");
            return;
          }

          setSharing(true);
          setMessage("Your live location is being shared.");
        } catch (error) {
          setMessage("Could not connect to the server.");
        }
      },
      (error) => {
        setMessage(
          error.code === 1
            ? "Location permission denied. Please allow location access."
            : "Unable to get your current location."
        );
      },
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
        timeout: 15000,
      }
    );
  };

  const stopSharing = async () => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current);
      watchId.current = null;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/location/stop",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || "Could not stop sharing.");
        return;
      }

      setSharing(false);
      setMessage("Location sharing stopped.");
    } catch (error) {
      setMessage("Could not connect to the server.");
    }
  };

  useEffect(() => {
    return () => {
      if (watchId.current !== null) {
        navigator.geolocation.clearWatch(watchId.current);
      }
    };
  }, []);

  return (
    <div className="live-location-page">
      <h2>📍 Live Location Sharing</h2>

      <p>
        Share your current location when you need someone you trust
        to know where you are. You can stop sharing anytime.
      </p>

      <div style={{ margin: "20px 0" }}>
        {!sharing ? (
          <button onClick={startSharing}>
            Start Sharing
          </button>
        ) : (
          <button onClick={stopSharing}>
            Stop Sharing
          </button>
        )}
      </div>

      {message && (
        <p role="status" style={{ marginBottom: "15px" }}>
          {message}
        </p>
      )}

      {position && (
        <MapContainer
          center={position}
          zoom={16}
          style={{
            height: "400px",
            width: "100%",
            borderRadius: "12px",
          }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <Marker position={position}>
            <Popup>Your current location</Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
}

export default LiveLocation;
