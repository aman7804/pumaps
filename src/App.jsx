import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "leaflet.markercluster";
import Drawer from "./components/Drawer";
import Search from "./components/Search";
import { useDispatch, useSelector } from "react-redux";
import FTC from "./components/FTC";
import MapView from "./components/MapView";
import { setDrawerView, setShowFTC } from "./store/uiSlice";
import { changeMarkerIconOnClick } from "./helper";
import { setCurrentMarker, setCurrentMarkerData } from "./store/mapSlice";

function App() {
  const mapRef = useRef(null);
  const userLocationRef = useRef(null);
  const currentPathRoutesRef = useRef(null);
  const markerClusterRef = useRef({});

  const dispatch = useDispatch();

  // --- state
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [showFullFTC, setShowFullFTC] = useState(false);
  const [expandDrawer, setExpandDrawer] = useState(false);
  const [expanded, setExpanded] = useState(false);

  // --- toggle methods
  const toggleFullFTC = (isOpen) => setShowFullFTC(isOpen);
  const handleDrawerVisibility = (isOpen) => {
    setIsDrawerVisible(isOpen);
  };
  const handleExpandDrawer = (isOpen) => {
    setExpandDrawer(isOpen);
    if (isOpen) setDrawerView("LOCATION_INFO");
  };

  useEffect(() => {
    console.log("expandDrawer", expandDrawer);
  }, [expandDrawer]);

  // --- Redux states
  const showFTC = useSelector((state) => state.ui.showFTC);
  const drawerView = useSelector((state) => state.ui.drawerView);

  // --- Handle drawer view → FTC
  useEffect(() => {
    if (drawerView === "ROUTE_INFO") dispatch(setShowFTC(true));
    else dispatch(setShowFTC(false));
  }, [drawerView]);

  // --- Responsive check
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // --- Drawer height config
  const drawerHeightValObj = {
    minHeight: 0.11,
    maxHeight: 0.5,
    middleHeight: 0.75,
  };

  // --- Handle clicking on a search result
  const handleResultClick = (marker) => {
    handleExpandDrawer(true);
    const { lat, lng } = marker.coords;
    const map = mapRef.current;
    const clusters = markerClusterRef.current;
    if (!map) return;

    Object.values(clusters).forEach((group) => {
      group.eachLayer((m) => {
        if (m.options.myData.name === marker.name) {
          let parentCluster = group.getVisibleParent
            ? group.getVisibleParent(m)
            : null;

          // Keep zooming in until marker is no longer clustered
          const revealMarker = () => {
            parentCluster = group.getVisibleParent
              ? group.getVisibleParent(m)
              : null;
            if (parentCluster && parentCluster !== m) {
              const nextZoom = Math.min(map.getZoom() + 2, 20); // increase zoom gradually
              map.flyTo(parentCluster.getLatLng(), nextZoom, { duration: 0.4 });
              setTimeout(revealMarker, 400); // keep zooming until visible
            } else {
              // finally focus directly on marker
              map.flyTo([lat, lng], 20, { duration: 0.5 });
              changeMarkerIconOnClick(m, map);
              dispatch(setCurrentMarker(marker));
            }
          };
          revealMarker();
        }
      });
    });

    setExpanded(false);
    handleDrawerVisibility(true);
    dispatch(setCurrentMarkerData(marker));
  };

  return (
    <>
      <MapView
        mapRef={mapRef}
        userLocationRef={userLocationRef}
        handleDrawerVisibility={handleDrawerVisibility}
        currentPathRoutesRef={currentPathRoutesRef}
        drawerHeightValObj={drawerHeightValObj}
        handleExpandDrawer={handleExpandDrawer}
        markerClusterRef={markerClusterRef}
      />

      {showFTC ? (
        <FTC userLocationRef={userLocationRef} />
      ) : (
        <Search
          mapRef={mapRef}
          markerClusterRef={markerClusterRef}
          handleResultClick={handleResultClick}
          expanded={expanded}
          setExpanded={setExpanded}
        />
      )}

      {isMobile && isDrawerVisible && (
        <Drawer
          mapRef={mapRef}
          isOpen={expandDrawer}
          handleDrawerVisibility={handleDrawerVisibility}
          currentPathRoutesRef={currentPathRoutesRef}
          userLocationRef={userLocationRef}
          drawerHeightValObj={drawerHeightValObj}
        />
      )}
    </>
  );
}

export default App;
