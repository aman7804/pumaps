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

function FTC() {
  const [expanded, setExpanded] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // "source" or "destination"
  const [locations, setLocations] = useState({
    source: "",
    destination: "",
  });

  const sourceRef = useRef(null);
  const destRef = useRef(null);

  // Focus the correct field after expansion
  useEffect(() => {
    if (expanded) {
      if (focusedField === "source") {
        sourceRef.current?.focus();
      } else if (focusedField === "destination") {
        destRef.current?.focus();
      }
    }
  }, [expanded, focusedField]);

  const handleSwap = () => {
    setLocations((prev) => ({
      source: prev.destination,
      destination: prev.source,
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
        zIndex: 2000,
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          position: "relative",
          p: 2,
        }}
      >
        {/* Left icons column */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mr: 2,
          }}
        >
          <RadioButtonUncheckedIcon fontSize="small" color="primary" />
          <MoreVertIcon sx={{ my: 0.5, fontSize: "1rem" }} />
          <RoomIcon fontSize="small" color="error" />
        </Box>

        {/* Location inputs */}
        <Box flex={1}>
          {expanded ? (
            <TextField
              inputRef={sourceRef}
              variant="standard"
              fullWidth
              placeholder="Location A"
              value={locations.source}
              onChange={(e) =>
                setLocations((prev) => ({ ...prev, source: e.target.value }))
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
            position: "absolute",
            right: 8,
            top: "50%",
            transform: "translateY(-50%)",
            bgcolor: "white",
            boxShadow: 2,
          }}
        >
          <SwapVertIcon />
        </IconButton>
      </Box>

      {/* Expanded Search Results */}
      {expanded && (
        <Box sx={{ p: 2, borderTop: "1px solid #ddd" }}>
          <Typography variant="body2" color="text.secondary">
            🔍 Search results will appear here...
          </Typography>

          <Box
            sx={{ mt: 2, textAlign: "right", cursor: "pointer" }}
            onClick={() => setExpanded(false)}
          >
            <Typography color="primary">Close</Typography>
          </Box>
        </Box>
      )}
    </Paper>
  );
}

export default FTC;
