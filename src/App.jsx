import L, { featureGroup } from "leaflet";
import "./App.css";
import { useEffect, useRef, useState } from "react";
import GPS from "./GPS";
import { Fab } from "@mui/material";
import { addAllMarkers, getIcons, getMarkers } from "./helper";
import { Mp } from "@mui/icons-material";

function App() {
  // --- Icons & markers config ---
  const icons = useRef(getIcons()).current;
  const markers = useRef(getMarkers(icons)).current;

  // --- Setup ---
  const mapRef = useRef(null);
  const userLocationRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const userMovedRef = useRef(true);
  const watchIdRef = useRef(null);
  const zoomed = useRef(null);

  // --- State ---
  const [isGpsOn, setIsGpsOn] = useState(false);

  // const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  // useEffect(() => {
  //   const handleResize = () => setIsMobile(window.innerWidth <= 480);
  //   window.addEventListener("resize", handleResize);
  //   return () => window.removeEventListener("resize", handleResize);
  // }, []);

  useEffect(() => {
    const map = L.map("map", {
      maxBounds: [
        [22.28402, 73.35657],
        [22.29755, 73.36966],
      ],
      minZoom: 16,
      maxBoundsViscosity: 1.0,
    }).setView([22.2908, 73.36438], 16);

    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution:
        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    map.zoomControl.remove();
    L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("zoomstart", () => {
      userMovedRef.current = true;
      setIsGpsOn(false);
    });
    map.on("dragstart", () => {
      userMovedRef.current = true;
      setIsGpsOn(false);
    });

    addAllMarkers(map, markers);
    mapRef.current = map;

    return () => map.remove();
  }, []);

  useEffect(() => {
    // if (!isGpsOn || !mapRef.current) return;
    if (!mapRef.current) return;
    const map = mapRef.current;

    function updateLocation({ coords }) {
      const { latitude: lat, longitude: lng, accuracy } = coords;

      const marker = L.circleMarker([lat, lng], {
        radius: 8,
        color: "#FFFFFF",
        weight: 2,
        fillColor: "#2A93EE",
        fillOpacity: 0.7,
        className: "marker-glow",
      });

      const circle = L.circle([lat, lng], {
        radius: accuracy,
        color: "transparent",
        weight: 0,
        fillColor: "#2a92ee62",
        fillOpacity: 0.7,
      });

      if (userLocationRef.current) map.removeLayer(userLocationRef.current);
      userLocationRef.current = L.featureGroup([marker, circle]).addTo(map);

      if (!hasCenteredRef.current && !userMovedRef.current) {
        map.setView(userLocationRef.current.getLatLng(), map.getZoom());
        hasCenteredRef.current = true;
      }

      if (isGpsOn) map.setView([lat, lng]);
    }

    function handleError(e) {
      alert(
        e.code === 1
          ? "Please allow geolocation access"
          : "Cannot get current location"
      );
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      updateLocation,
      handleError,
      {
        enableHighAccuracy: true,
        maximumAge: 10000,
        timeout: 5000,
      }
    );

    return () => navigator.geolocation.clearWatch(watchIdRef.current);
  }, [isGpsOn]);

  useEffect(() => {});

  function toggleGps() {
    setIsGpsOn((prev) => {
      if (prev && userLocationRef && mapRef)
        mapRef.current.removeLayer(userLocationRef.current);
      if (!prev) {
        hasCenteredRef.current = false;
        userMovedRef.current = false;
      }
      return !prev;
    });
  }

  return (
    <>
      <div id="map" style={{ height: "100vh" }}></div>

      <Fab
        size="small"
        color="white"
        style={{
          position: "absolute",
          // bottom: isMobile ? "100px" : "90px",
          bottom: "90px",
          right: "14px",
          zIndex: 1000,
        }}
      >
        <GPS toggleGps={toggleGps} isGpsOn={isGpsOn} />
      </Fab>
    </>
  );
}

export default App;
