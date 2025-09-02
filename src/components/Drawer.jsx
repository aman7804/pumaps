import * as React from "react";
import { Global } from "@emotion/react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { grey } from "@mui/material/colors";
import SwipeableDrawer from "@mui/material/SwipeableDrawer";
import LocationInfo from "./LocationInfo";
import RouteInfo from "./RouteInfo";
import { useSelector } from "react-redux";

const drawerBleeding = 56;

const Root = styled("div")({
  height: "100%",
  backgroundColor: grey[100],
  touchAction: "none",
});

const StyledBox = styled("div")({
  backgroundColor: "#fff",
});

const Puller = styled("div")({
  width: 30,
  height: 6,
  backgroundColor: grey[300],
  borderRadius: 3,
  position: "absolute",
  top: 8,
  left: "calc(50% - 15px)",
});

function Drawer({
  isOpen,
  toggleDrawerVisibility,
  toggleDrawer,
  onClickDirection,
  setDrawerView,
  drawerView,
}) {
  const [isDirectionClicked, setIsDirectionClicked] = React.useState(false);

  React.useEffect(() => {
    console.log("isOpen:", isOpen, "drawerView: ", drawerView);
  }, [isOpen, drawerView]);

  const handleDirectionClick = () => {
    onClickDirection();
    setDrawerView("ROUTE_INFO");
    setIsDirectionClicked(true);
  };

  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  React.useEffect(() => {
    console.log("currentMarkerData ", currentMarkerData);
  }, [currentMarkerData]);
  return (
    <Root>
      <CssBaseline />
      <Global
        styles={{
          ".MuiDrawer-root > .MuiPaper-root": {
            height: `calc(50% - ${drawerBleeding}px)`,
            overflow: "visible",
          },
        }}
      />

      <SwipeableDrawer
        anchor="bottom"
        open={isOpen}
        onClose={() => {
          setDrawerView("MINIMIZED");
          toggleDrawerVisibility(false)();
        }}
        onOpen={() => {
          setDrawerView("OPEN");
          toggleDrawerVisibility(true)();
        }}
        swipeAreaWidth={drawerBleeding}
        disableSwipeToOpen={false}
        keepMounted
      >
        <StyledBox
          sx={{
            position: "absolute",
            top: -drawerBleeding,
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            visibility: "visible",
            right: 0,
            left: 0,
          }}
        >
          <Puller />

          {currentMarkerData &&
            (drawerView === "OPEN" || drawerView === "MINIMIZED") && (
              <LocationInfo
                currentMarkerData={currentMarkerData}
                handleDirectionClick={handleDirectionClick}
              />
            )}

          {currentMarkerData && drawerView === "ROUTE_INFO" && <RouteInfo />}

          <img
            src="assets/close.svg"
            alt="Close"
            onClick={() => {
              setDrawerView("CLOSED");
              toggleDrawer(false);
            }}
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              width: 24,
              height: 24,
              cursor: "pointer",
              pointerEvents: "auto",
            }}
          />
        </StyledBox>
      </SwipeableDrawer>
    </Root>
  );
}

export default Drawer;
