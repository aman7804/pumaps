import React, { useRef, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import LocationInfo from "./LocationInfo";
import RouteInfo from "./RouteInfo";
import { useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";

export default function Drawer({
  isOpen,
  toggleDrawer,
  drawerView,
  setDrawerView,
  onClickDirection,
}) {
  const drawerHeightVal = {
    minHeight: 0.11,
    maxHeight: 0.5,
  };

  const [currentDrawerHeight, setCurrentDrawerHeight] = useState(null);
  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  const sheetRef = useRef(null);
  const minimizeDrawer = () => {
    // if (!sheetRef.current) return;
    sheetRef.current?.snapTo(1);
  };

  return (
    <BottomSheet
      ref={sheetRef}
      open={isOpen}
      onDismiss={() => toggleDrawer(false)}
      snapPoints={({ maxHeight }) => [
        drawerHeightVal.minHeight * maxHeight,
        drawerHeightVal.maxHeight * maxHeight,
      ]}
      animationConfig={{ duration: 100 }}
      defaultSnap={({ maxHeight }) => drawerHeightVal.maxHeight * maxHeight}
      blocking={false}
      header={
        // Header
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            px: 2,
            py: 1,
          }}
        >
          {/* Puller in the center */}
          <Box
            sx={{
              position: "absolute",
              top: 8,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 4,
              bgcolor: "grey.400",
              borderRadius: 2,
            }}
          />

          {/* Name & type */}
          <Box sx={{ textAlign: "left" }}>
            <Typography sx={{ fontWeight: 600, color: "black" }}>
              {drawerView == "ROUTE_INFO"
                ? currentMarkerData?.type
                : currentMarkerData?.name || ""}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {drawerView == "ROUTE_INFO"
                ? currentMarkerData?.name
                : currentMarkerData?.type || ""}
            </Typography>
          </Box>

          {/* Close button */}
          <img
            src="assets/close.svg"
            alt="Close"
            onClick={() => {
              setDrawerView("CLOSED");
              toggleDrawer(false);
            }}
            style={{ width: 24, height: 24, cursor: "pointer" }}
          />
        </Box>
      }
      style={{
        zIndex: 9999,
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
      }}
    >
      <div style={{ padding: 2 }}>
        {currentMarkerData &&
          (drawerView === "OPEN" || drawerView === "MINIMIZED") && (
            <LocationInfo
              currentMarkerData={currentMarkerData}
              handleDirectionClick={onClickDirection}
            />
          )}
        {currentMarkerData && drawerView === "ROUTE_INFO" && <RouteInfo />}
      </div>
    </BottomSheet>
  );
}
