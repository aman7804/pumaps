import L from "leaflet";
import "leaflet.markercluster/dist/leaflet.markercluster"; // explicit path

import { Drawer, Fab } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import GPS from "./GPS";
import ZoomControls from "./ZoomControls";
import getMarkerData from "../getMarkerData";
import getIcons from "../getIcons";
import { createIconForMarker } from "../helper";
import { setCurrentMarker, setCurrentMarkerData } from "../store/mapSlice";
import { setDrawerHeightValue, setDrawerView } from "../store/uiSlice";
import { useDispatch, useSelector } from "react-redux";

export default function MapView({
  mapRef,
  userLocationRef,
  toggleDrawer,
  currentPathRoutesRef,
  drawerHeightValObj,
  setExpandDrawer,
  markerClusterRef,
}) {
  //usesate
  const [isGpsOn, setIsGpsOn] = useState(false);

  //useSelector
  const drawerView = useSelector((state) => state.ui.drawerView);
  const prevDrawerView = useSelector((state) => state.ui.prevDrawerView);
  const currentMarker = useSelector((state) => state.map.currentMarker);
  const drawerHeightValue = useSelector((state) => state.ui.drawerHeightValue);
  //refs
  const isGpsOnRef = useRef(isGpsOn);
  const icons = useRef(getIcons()).current;
  const markerData = useRef(getMarkerData(icons)).current;
  const hasCenteredRef = useRef(false);
  const userMovedRef = useRef(true);
  const watchIdRef = useRef(null);
  const currentMarkerRef = useRef(null);

  currentMarkerRef.current = currentMarker;

  const dispatch = useDispatch();

  //setcurrentmarker data
  const getCurrentMarkerData = (markerSmallData) => {
    const [markerFullData] = Object.values(markerData)
      .flat()
      .filter((m) => m.name === markerSmallData.name);

    dispatch(setCurrentMarkerData(markerFullData));
  };

  //toggle methods
  //toggles drawer minizing and maximizing
  const toggleDrawerVisibility = (isOpen) => () => {
    setExpandDrawer(isOpen);
  };
  const toggleGps = () => {
    setIsGpsOn((prev) => {
      if (!prev) {
        hasCenteredRef.current = false;
        userMovedRef.current = false;
      }
      return !prev;
    });
  };

  function addAllMarkers(map) {
    Object.values(markerData).forEach((markerType) => {
      // markerCluster logic
      const markerCluster = L.markerClusterGroup({
        maxClusterRadius: (zoom) => {
          const sizes = {
            16: 80,
            17: 70,
            18: 60,
            19: 50,
            20: 40,
            21: 30,
            22: 20,
          };
          return sizes[zoom] || 10;
        },
        disableClusteringAtZoom: 25,
        iconCreateFunction: (cluster) => {
          const children = cluster.getAllChildMarkers();
          const color = children[0]?.options.iconColor || "#000";

          return L.divIcon({
            html: `
              <div style="
                width: 20px;
                height: 20px;
                background-color: ${color};
                border-radius: 50%;
                color: white;
                display: flex;
                justify-content: center;
                align-items: center;
                font-size: 16px;
              ">
                ${cluster.getChildCount()}
              </div>
            `,
            className: "",
            iconSize: L.point(25, 25),
          });
        },
      });

      //creating/adding marker to map
      markerType.forEach(({ coords, icon, name, iconColor, type }) => {
        const defaultIconUrl = icon.options.iconUrl;
        const marker = L.marker([coords.lat, coords.lng], {
          icon: createIconForMarker(name, defaultIconUrl),
          iconColor,
          myData: { coords, defaultIconUrl, name, iconColor, type: type },
        }).on("click", (e) => {
          toggleDrawerVisibility(true)();
          if (drawerView === "LOCATION_INFO") {
            if (drawerHeightValue !== drawerHeightValObj.minHeight)
              dispatch(setDrawerHeightValue(drawerHeightValObj.minHeight)); // LOCATION_INFO should open at max height
          } else {
            if (drawerHeightValue !== drawerHeightValObj.maxHeight)
              dispatch(setDrawerHeightValue(drawerHeightValObj.maxHeight)); // default or keep same
          }

          dispatch(
            setDrawerView(
              drawerView === "LOCATION_INFO" ? "ROUTE_INFO" : "LOCATION_INFO"
            )
          );
          toggleDrawer(true);

          getCurrentMarkerData(e.target.options.myData);

          const prevMarker = currentMarkerRef.current;
          if (prevMarker && prevMarker !== marker) {
            const { name, defaultIconUrl } = prevMarker.options.myData;
            prevMarker.setIcon(createIconForMarker(name, defaultIconUrl));

            if (currentPathRoutesRef.current)
              map.removeLayer(currentPathRoutesRef.current);

            // if (prevDrawerView === "ROUTE_INFO" && drawerView==) {
            //   changeDrawerHeight(drawerHeightValObj.maxHeight);
            // }
          }

          dispatch(setCurrentMarker(marker));

          marker.setIcon(
            createIconForMarker(name, "assets/redLocationIcon.png", true)
          );
        });
        marker.addTo(markerCluster);
        markerClusterRef.current[type] = markerCluster;
      });

      map.addLayer(markerCluster);
    });
  }
  useEffect(() => {
    isGpsOnRef.current = isGpsOn;
    if (isGpsOn) {
      mapRef.current.panTo(userLocationRef.current.getLayers()[0].getLatLng());
    }
  }, [isGpsOn]);

  // map core start
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

    mapRef.current = map;
    addAllMarkers(map);

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

    return () => {
      map.remove();
      navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, []);
  return (
    <>
      <div id="map" style={{ height: "100vh" }}></div>
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
    </>
  );
}
