import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Divider,
  IconButton,
  Paper,
  TextField,
} from "@mui/material";
import SwapVertIcon from "@mui/icons-material/SwapVert";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked"; // circle for A
import RoomIcon from "@mui/icons-material/Room"; // location pin for B
import MoreVertIcon from "@mui/icons-material/MoreVert"; // 3 vertical dots
import { useSelector } from "react-redux";

function FTC({ userLocationRef }) {
  const [expanded, setExpanded] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // "source" or "destination"
  const [locations, setLocations] = useState({
    source: "Your Location",
    sourceCoords: userLocationRef?.current?.getLayers?.()[0]?.getLatLng?.() ?? {
      lat: 0,
      lng: 0,
    },
    destination: "",
    destinationCoords: { lat: 0, lng: 0 },
  });

  const currentMarkerData = useSelector((state) => state.map.currentMarkerData);
  useEffect(() => {
    if (currentMarkerData) {
      setLocations((prev) => ({
        ...prev,
        destination: currentMarkerData.name ?? "",
        destinationCoords: currentMarkerData.coords ?? { lat: 0, lng: 0 },
      }));
    }
  }, [currentMarkerData]);

  useEffect(() => {
    console.log("locations: ", locations);
  }, [locations]);

  const sourceRef = useRef(null);
  const destRef = useRef(null);

  // Focus the correct field after expansion
  useEffect(() => {
    if (expanded) {
      if (focusedField === "source") sourceRef.current?.focus();
      else if (focusedField === "destination") destRef.current?.focus();
    }
  }, [expanded, focusedField]);

  const handleSwap = () => {
    setLocations((prev) => ({
      source: prev.destination,
      sourceCoords: prev.destinationCoords,
      destination: prev.source,
      destinationCoords: prev.sourceCoords,
    }));
  };

  const expandAndFocus = (field) => {
    setFocusedField(field);
    setExpanded(true);
  };

  return (
    <Paper
      elevation={4}
      sx={{
        position: "absolute",
        top: expanded ? 0 : 20,
        left: 0,
        right: 0,
        bottom: expanded ? 0 : "auto",
        margin: "0 auto",
        width: expanded ? "100%" : "90%",
        maxWidth: 500,
        borderRadius: expanded ? 0 : 3,
        overflow: "hidden",
        transition: "all 0.3s ease",
        zIndex: expanded ? 3000 : 2000,
      }}
    >
      {/* Floating Close Button (instead of header) */}
      {expanded && (
        <IconButton
          onClick={() => setExpanded(false)}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            bgcolor: "white",
            boxShadow: 2,
            width: 36,
            height: 36,
            "&:hover": { bgcolor: "#f5f5f5" },
            zIndex: 20,
          }}
        >
          <img
            src="assets/close.svg"
            alt="Close"
            style={{ width: 18, height: 18 }}
          />
        </IconButton>
      )}

      {/* Input Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "center", // centers everything horizontally
          alignItems: "center",
          position: "relative",
          p: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-start",
            justifyContent: "center",
            gap: 2,
            width: "100%",
            maxWidth: 400,
          }}
        >
          {/* Left icons column */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              pt: 0.5,
            }}
          >
            <RadioButtonUncheckedIcon fontSize="small" color="primary" />
            <MoreVertIcon sx={{ my: 0.5, fontSize: "1rem" }} />
            <RoomIcon fontSize="small" color="error" />
          </Box>

          {/* Location inputs */}
          <Box sx={{ flex: 1, position: "relative" }}>
            {expanded ? (
              <TextField
                inputRef={sourceRef}
                variant="standard"
                fullWidth
                placeholder="Location A"
                value={locations.source}
                onChange={(e) =>
                  setLocations((prev) => ({
                    ...prev,
                    source: e.target.value,
                  }))
                }
                sx={{ mb: 1 }}
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => expandAndFocus("source")}
              >
                {locations.source || "Location A"}
              </Typography>
            )}

            <Divider sx={{ my: 1 }} />

            {expanded ? (
              <TextField
                inputRef={destRef}
                variant="standard"
                fullWidth
                placeholder="Location B"
                value={locations.destination}
                onChange={(e) =>
                  setLocations((prev) => ({
                    ...prev,
                    destination: e.target.value,
                  }))
                }
              />
            ) : (
              <Typography
                variant="body1"
                sx={{ fontWeight: 600, cursor: "pointer" }}
                onClick={() => expandAndFocus("destination")}
              >
                {locations.destination || "Location B"}
              </Typography>
            )}
          </Box>

          {/* Swap button */}
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              handleSwap();
            }}
            sx={{
              alignSelf: "center",
              bgcolor: "white",
              boxShadow: 2,
              ml: 1,
              "&:hover": { bgcolor: "#f9f9f9" },
            }}
          >
            <SwapVertIcon />
          </IconButton>
        </Box>
      </Box>

      {/* Expanded Search Results */}
      {expanded && (
        <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
          <Typography variant="body2" color="text.secondary">
            🔍 Search results will appear here...
          </Typography>
        </Box>
      )}
    </Paper>
  );
}

export default FTC;
