import React, { useRef, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import LocationInfo from "./LocationInfo";
import RouteInfo from "./RouteInfo";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import { setShowFTC } from "../store/uiSlice";

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
    middleHeight: 0.75,
  };

  const [currentDrawerHeight, setCurrentDrawerHeight] = useState(null);
  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  const sheetRef = useRef(null);

  const changeDrawerHeight = (value) => {
    sheetRef.current?.snapTo(value * maxHeightRef.current);
  };

  const dispatch = useDispatch();
  const maxHeightRef = useRef(null);

  return (
    <BottomSheet
      ref={sheetRef}
      onClick={() => {}}
      open={isOpen}
      onDismiss={() => toggleDrawer(false)}
      snapPoints={({ maxHeight }) => {
        maxHeightRef.current = maxHeight;
        return [
          drawerHeightVal.minHeight * maxHeight,
          drawerHeightVal.maxHeight * maxHeight,
          drawerHeightVal.middleHeight * maxHeight,
        ];
      }}
      animationConfig={{ duration: 100 }}
      defaultSnap={({ maxHeight }) => drawerHeightVal.maxHeight * maxHeight}
      blocking={false}
      // Header
      header={
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
          <Box sx={{ textAlign: "left" }} height="45px">
            <Typography sx={{ fontWeight: 600, color: "black" }}>
              {drawerView == "ROUTE_INFO"
                ? "Walk - 10 min (1 km)"
                : currentMarkerData?.name || ""}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {(drawerView == "LOCATION_INFO" && currentMarkerData?.type) || ""}
            </Typography>
          </Box>

          {/* Close button */}
          <img
            src="assets/close.svg"
            alt="Close"
            onClick={() => {
              if (drawerView == "ROUTE_INFO") {
                setDrawerView("LOCATION_INFO");
                dispatch(setShowFTC(false));
                changeDrawerHeight(drawerHeightVal.maxHeight);
              } else {
                setDrawerView("CLOSED");
                toggleDrawer(false);
              }
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
      {/*LocationInfo and RouteInfo*/}
      <div style={{ padding: 2 }}>
        {currentMarkerData &&
          (drawerView === "OPEN" ||
            drawerView === "MINIMIZED" ||
            drawerView === "LOCATION_INFO") && (
            <LocationInfo
              currentMarkerData={currentMarkerData}
              handleDirectionClick={() => {
                onClickDirection();
                changeDrawerHeight(drawerHeightVal.minHeight);
              }}
            />
          )}
        {currentMarkerData && drawerView === "ROUTE_INFO" && <RouteInfo />}
      </div>
    </BottomSheet>
  );
}
