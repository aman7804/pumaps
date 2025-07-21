import React from "react";
import GpsFixedIcon from "@mui/icons-material/GpsFixed";
import GpsNotFixedIcon from "@mui/icons-material/GpsNotFixed";
import { IconButton } from "@mui/material";

function GPS({ toggleGps, isGpsOn }) {
  return (
    <>
      <IconButton aria-label="locate" onClick={toggleGps}>
        {isGpsOn ? <GpsFixedIcon /> : <GpsNotFixedIcon />}
      </IconButton>
    </>
  );
}

export default GPS;
