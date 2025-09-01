import React from "react";
import { IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";

export default function ZoomControls({ onZoomIn, onZoomOut }) {
  return (
    <Box
      sx={{
        position: "absolute",
        bottom: 14, // slightly above bottom
        right: 14, // same as GPS button
        display: "flex",
        flexDirection: "column",
        width: "40px",
        borderRadius: "4px",
        overflow: "hidden",
        zIndex: 1000, // make sure it's above map
      }}
    >
      <IconButton
        onClick={onZoomIn}
        sx={{
          bgcolor: "#e0e0e0",
          borderRadius: 0,
          width: "40px",
          height: "40px",
          "&:hover": { bgcolor: "#d5d5d5" },
        }}
      >
        <AddIcon />
      </IconButton>
      <IconButton
        onClick={onZoomOut}
        sx={{
          bgcolor: "#e0e0e0",
          borderRadius: 0,
          width: "40px",
          height: "40px",
          "&:hover": { bgcolor: "#d5d5d5" },
        }}
      >
        <RemoveIcon />
      </IconButton>
    </Box>
  );
}
