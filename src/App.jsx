import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "leaflet.markercluster";
import Drawer from "./components/Drawer";
import Search from "./components/Search";
import { useDispatch, useSelector } from "react-redux";
import FTC from "./components/FTC";
import MapView from "./components/MapView";
import { setShowFTC } from "./store/uiSlice";

function App() {
  const mapRef = useRef(null);
  const userLocationRef = useRef(null);
  const currentPathRoutesRef = useRef(null);

  //state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFullFTC, setShowFullFTC] = useState(false);
  const [expandDrawer, setExpandDrawer] = useState(false);

  //toggle methods
  const toggleFullFTC = (isOpen) => setShowFullFTC(isOpen);
  const toggleDrawer = (isOpen) => setIsDrawerOpen(isOpen);

  // useSelector
  const showFTC = useSelector((state) => state.ui.showFTC);

  // isMobile screen?
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const drawerHeightValObj = {
    minHeight: 0.11,
    maxHeight: 0.5,
    middleHeight: 0.75,
  };

  const drawerView = useSelector((state) => state.ui.drawerView);
  const dispatch = useDispatch();
  useEffect(() => {
    if (drawerView == "ROUTE_INFO") dispatch(setShowFTC(true));
    else dispatch(setShowFTC(false));
  }, [drawerView]);

  return (
    <>
      <MapView
        mapRef={mapRef}
        userLocationRef={userLocationRef}
        toggleDrawer={toggleDrawer}
        currentPathRoutesRef={currentPathRoutesRef}
        drawerHeightValObj={drawerHeightValObj}
        setExpandDrawer={setExpandDrawer}
      />
      {showFTC ? (
        <FTC showFullFTC={showFullFTC} toggleFullFTC={toggleFullFTC} />
      ) : (
        <Search />
      )}
      {isMobile && isDrawerOpen && (
        <Drawer
          mapRef={mapRef}
          isOpen={expandDrawer}
          toggleDrawer={toggleDrawer}
          currentPathRoutesRef={currentPathRoutesRef}
          userLocationRef={userLocationRef}
          drawerHeightValObj={drawerHeightValObj}
        />
      )}
    </>
  );
}

export default App;
