import React, { useEffect, useRef, useState } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import "react-spring-bottom-sheet/dist/style.css";
import LocationInfo from "./LocationInfo";
import RouteInfo from "./RouteInfo";
import { useDispatch, useSelector } from "react-redux";
import { Typography, Box } from "@mui/material";
import {
  // setChangeDrawerHeight,
  setDrawerHeightValue,
  setDrawerView,
  setShowFTC,
} from "../store/uiSlice";
import {
  setCurrentMarker,
  setCurrentPathRoutes,
  setCurrentRouteInfo,
} from "../store/mapSlice";
import { createIconForMarker, getRoutes } from "../helper";

export default function Drawer({
  mapRef,
  isOpen,
  toggleDrawer,
  currentPathRoutesRef,
  userLocationRef,
  drawerHeightValObj,
}) {
  // useSelector
  const currentPathRoutes = useSelector((state) => state.map.currentPathRoutes);
  const currentRouteInfo = useSelector((state) => state.map.currentRouteInfo);
  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  const currentMarker = useSelector((state) => state.map.currentMarker);
  const drawerView = useSelector((state) => state.ui.drawerView);
  const drawerHeightValue = useSelector((state) => state.ui.drawerHeightValue);
  //refs
  const sheetRef = useRef(null);
  const maxHeightRef = useRef(null);

  const dispatch = useDispatch();

  useEffect(() => {
    if (drawerHeightValue)
      sheetRef.current?.snapTo(drawerHeightValue * maxHeightRef.current);
  }, [drawerHeightValue]);

  const handleDrawerClose = () => {
    if (drawerView == "ROUTE_INFO") {
      dispatch(setDrawerView("LOCATION_INFO"));
      dispatch(setShowFTC(false));
      // changeDrawerHeight(drawerHeightValObj.maxHeight);
      if (drawerHeightValue !== drawerHeightValObj.maxHeight)
        dispatch(setDrawerHeightValue(drawerHeightValObj.maxHeight));
      if (currentPathRoutes) mapRef.current.removeLayer(currentPathRoutes);
    } else {
      dispatch(setDrawerView("CLOSED"));
      toggleDrawer(false);
      if (currentMarker && currentMarkerData?.icon) {
        currentMarker
          .setIcon(
            createIconForMarker(
              currentMarker.name,
              currentMarkerData.icon.options.iconUrl
            )
          )
          .addTo(mapRef.current);
      }
    }
  };

  const onClickDirection = async () => {
    dispatch(setDrawerView("ROUTE_INFO"));
    const routes = await getRoutes(
      userLocationRef.current.getLayers()[0].getLatLng(),
      currentMarkerData.coords
    );
    const routeLayer = L.polyline(routes[0].points, {
      color: "blue",
    }).addTo(mapRef.current);
    if (currentPathRoutesRef.current) {
      mapRef.current.removeLayer(currentPathRoutesRef.current);
    }
    currentPathRoutesRef.current = routeLayer;
    dispatch(setCurrentRouteInfo(routes));
    dispatch(setCurrentPathRoutes(routeLayer));
  };

  return (
    <BottomSheet
      ref={sheetRef}
      onClick={() => {}}
      open={isOpen}
      onDismiss={() => {
        if (drawerView == "ROUTE_INFO")
          dispatch(setDrawerView("LOCATION_INFO"));
        else dispatch(setDrawerView("CLOSED"));

        toggleDrawer(false);
        mapRef.current.removeLayer(currentPathRoutes);
      }}
      snapPoints={({ maxHeight }) => {
        maxHeightRef.current = maxHeight;
        return [
          drawerHeightValObj.minHeight * maxHeight,
          drawerHeightValObj.maxHeight * maxHeight,
          drawerHeightValObj.middleHeight * maxHeight,
        ];
      }}
      animationConfig={{ duration: 100 }}
      defaultSnap={({ maxHeight }) => drawerHeightValObj.maxHeight * maxHeight}
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
              {drawerView == "ROUTE_INFO" && currentRouteInfo?.length > 0
                ? `Walk - ${(currentRouteInfo[0].time / 60000).toFixed(
                    1
                  )} min (${(currentRouteInfo[0].distance / 1000).toFixed(
                    2
                  )} km)`
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
            onClick={handleDrawerClose}
            style={{ width: 24, height: 24, cursor: "pointer" }}
          />
        </Box>
      }
      style={{
        zIndex: 2000,
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
                if (drawerHeightValue !== drawerHeightValObj.minHeight)
                  dispatch(setDrawerHeightValue(drawerHeightValObj.minHeight));
              }}
            />
          )}
        {currentMarkerData && drawerView === "ROUTE_INFO" && <RouteInfo />}
      </div>
    </BottomSheet>
  );
}
