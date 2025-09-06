import L from "leaflet";
import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import GPS from "./components/GPS";
import { Fab } from "@mui/material";
import { addAllMarkers, getRoutes } from "./helper";
import getMarkerData from "./getMarkerData";
import getIcons from "./getIcons";
import "leaflet.markercluster";
import Drawer from "./components/Drawer";
import Search from "./components/Search";
import ZoomControls from "./components/ZoomControls";
import {
  setCurrentMarkerData,
  setCurrentPathRoutes,
  setCurrentRouteInfo,
} from "./store/mapSlice";
import { useDispatch, useSelector } from "react-redux";
import FTC from "./components/FTC";
import { setShowFTC } from "./store/uiSlice";

function App() {
  const icons = useRef(getIcons()).current;
  const markerData = useRef(getMarkerData(icons)).current;

  const mapRef = useRef(null);
  const userLocationRef = useRef(null);
  const hasCenteredRef = useRef(false);
  const userMovedRef = useRef(true);
  const watchIdRef = useRef(null);

  const [isGpsOn, setIsGpsOn] = useState(false);
  const [openDrawerFully, setOpenDrawerFully] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerView, setDrawerView] = useState("CLOSED");
  const [showFullFTC, setShowFullFTC] = useState(false);

  const toggleFTC = (isOpen) => setShowFTC(isOpen);
  const toggleFullFTC = (isOpen) => setShowFullFTC(isOpen);

  const dispatch = useDispatch();

  // useSelector
  const showFTC = useSelector((state) => state.ui.showFTC);
  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  const currentMarker = useSelector((state) => state.map.currentMarker);

  const currentMarkerRef = useRef(null);
  currentMarkerRef.current = currentMarker;

  const getCurrentMarkerData = (markerSmallData) => {
    const [markerFullData] = Object.values(markerData)
      .flat()
      .filter((m) => m.name === markerSmallData.name);

    dispatch(setCurrentMarkerData(markerFullData));
  };

  const onClickDirection = async () => {
    setDrawerView("ROUTE_INFO");
    dispatch(setShowFTC(true));
    const routes = await getRoutes(
      userLocationRef.current.getLayers()[0].getLatLng(),
      currentMarkerData.coords
    );
    const currentPathRoutes = L.polyline(routes[0].points, {
      color: "blue",
    }).addTo(mapRef.current);
    dispatch(setCurrentRouteInfo(routes));
    dispatch(setCurrentPathRoutes(currentPathRoutes));
  };

  // isMobile screen?
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isGpsOnRef = useRef(isGpsOn);
  useEffect(() => {
    isGpsOnRef.current = isGpsOn;
  }, [isGpsOn]);

  const toggleDrawerVisibility = (isOpen) => () => {
    setOpenDrawerFully(isOpen);
  };

  const toggleDrawer = (isOpen) => setIsDrawerOpen(isOpen);

  useEffect(() => {
    const map = L.map("map", {
      maxBounds: [
        [22.28402, 73.35657],
        [22.29755, 73.36966],
      ],
      minZoom: 16,
      maxBoundsViscosity: 1.0,
    }).setView([22.2908, 73.36438], 16);

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: "&copy; OpenStreetMap & CartoDB",
        maxZoom: 20,
      }
    ).addTo(map);

    map.zoomControl.remove();
    // L.control.zoom({ position: "bottomright" }).addTo(map);

    map.on("zoomstart", () => {
      userMovedRef.current = true;
      setIsGpsOn(false);
    });

    map.on("dragstart", () => {
      userMovedRef.current = true;
      setIsGpsOn(false);
    });

    addAllMarkers(
      map,
      markerData,
      toggleDrawerVisibility,
      toggleDrawer,
      getCurrentMarkerData,
      setDrawerView,
      dispatch,
      currentMarkerRef
    );

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
        map.setView(
          userLocationRef.current.getBounds().getCenter(),
          map.getZoom()
        );
        hasCenteredRef.current = true;
      }
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
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 5000 }
    );

    mapRef.current = map;

    return () => {
      map.remove();
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);

  useEffect(() => {
    if (isGpsOnRef.current) {
      mapRef.current.panTo(userLocationRef.current.getLayers()[0].getLatLng());
    }
  }, [isGpsOnRef.current]);

  const toggleGps = () => {
    setIsGpsOn((prev) => {
      if (!prev) {
        hasCenteredRef.current = false;
        userMovedRef.current = false;
      }
      return !prev;
    });
  };

  return (
    <>
      <div id="map" style={{ height: "100vh" }}></div>
      {showFTC ? (
        <FTC showFullFTC={showFullFTC} toggleFullFTC={toggleFullFTC} />
      ) : (
        <Search />
      )}
      <Fab
        size="small"
        color="white"
        component="span"
        style={{
          position: "absolute",
          bottom: "110px",
          right: "13.5px",
          zIndex: 1000,
        }}
      >
        <GPS id="gps" toggleGps={toggleGps} isGpsOn={isGpsOn} />
      </Fab>
      <ZoomControls
        onZoomIn={() => mapRef.current.zoomIn()}
        onZoomOut={() => mapRef.current.zoomOut()}
      />

      {isMobile && isDrawerOpen && (
        <Drawer
          mapRef={mapRef}
          isOpen={openDrawerFully}
          toggleDrawer={toggleDrawer}
          drawerView={drawerView}
          setDrawerView={setDrawerView}
          onClickDirection={onClickDirection}
        />
      )}
    </>
  );
}

export default App;
