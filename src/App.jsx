import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import "leaflet.markercluster";
import Drawer from "./components/Drawer";
import Search from "./components/Search";
import { useSelector } from "react-redux";
import FTC from "./components/FTC";
import MapView from "./components/MapView";

function App() {
  const mapRef = useRef(null);
  const userLocationRef = useRef(null);
  const currentPathRoutesRef = useRef(null);

  //state
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [showFullFTC, setShowFullFTC] = useState(false);

  //toggle methods
  const toggleFullFTC = (isOpen) => setShowFullFTC(isOpen);
  const toggleDrawer = (isOpen) => setIsDrawerOpen(isOpen);

  // useSelector
  const showFTC = useSelector((state) => state.ui.showFTC);
  const openDrawerFully = useSelector((state) => state.ui.openDrawerFully);

  // isMobile screen?
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <MapView
        mapRef={mapRef}
        userLocationRef={userLocationRef}
        toggleDrawer={toggleDrawer}
        currentPathRoutesRef={currentPathRoutesRef}
      />
      {showFTC ? (
        <FTC showFullFTC={showFullFTC} toggleFullFTC={toggleFullFTC} />
      ) : (
        <Search />
      )}
      {isMobile && isDrawerOpen && (
        <Drawer
          mapRef={mapRef}
          isOpen={openDrawerFully}
          toggleDrawer={toggleDrawer}
          currentPathRoutesRef={currentPathRoutesRef}
          userLocationRef={userLocationRef}
        />
      )}
    </>
  );
}

export default App;
