import React, { useEffect, useState } from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { searchMarkers, dropDownSearch, toLowerCamelCase } from "../helper";

const locationTypes = [
  "Food Place",
  "Academic Block",
  "Admin Block",
  "Food Court",
  "Residentials",
  "Auditorium",
  "PU Circle",
  "Gate",
  "Hospital",
  "Gym",
  "Mart",
  "Temple",
  "Study",
  "Tourist Attraction",
  "Service",
  "Park",
  "Sports",
];

export default function SearchToggle({ mapRef, markerClusterRef }) {
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [dropDownVal, setDropDownVal] = useState("");
  const [expanded, setExpanded] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  // Dropdown filter effect
  useEffect(() => {
    if (!mapRef.current) return;
    const allGroups = markerClusterRef.current;

    Object.values(allGroups).forEach((group) =>
      mapRef.current.removeLayer(group)
    );

    if (dropDownVal) {
      const key = toLowerCamelCase(dropDownVal);
      const selectedGroup = allGroups[key];
      if (selectedGroup) mapRef.current.addLayer(selectedGroup);
    } else {
      Object.values(allGroups).forEach((group) =>
        mapRef.current.addLayer(group)
      );
    }
  }, [dropDownVal]);

  // Update search results whenever searchVal changes
  useEffect(() => {
    if (searchVal.trim() === "") {
      setSearchResults([]);
      return;
    }
    setSearchResults(searchMarkers(searchVal));
  }, [searchVal]);

  const toggleMode = () => {
    setIsSearchMode((prev) => {
      const newMode = !prev;
      if (prev) setSearchVal("");
      else setDropDownVal("");
      return newMode;
    });
  };

  return (
    <div
      style={{
        position: "absolute",
        top: expanded ? 0 : 20,
        left: "50%",
        transform: "translateX(-50%)",
        bottom: expanded ? 0 : "auto",
        width: expanded ? "100%" : "90%",
        maxWidth: 480,
        borderRadius: expanded ? 0 : 12,
        transition: "all 0.3s ease",
        zIndex: expanded ? 3000 : 1000,
        backdropFilter: expanded ? "blur(8px)" : "none",
        backgroundColor: expanded
          ? "rgba(255, 255, 255, 0.6)"
          : "rgba(255, 255, 255, 0.2)",
        padding: "10px",
        boxShadow: expanded ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
        boxSizing: "border-box",
      }}
    >
      {/* Input Row */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          width: "100%",
          flexWrap: "nowrap",
        }}
      >
        <IconButton
          onClick={toggleMode}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
            flexShrink: 0,
          }}
        >
          {isSearchMode ? <SearchIcon /> : <ArrowDropDownIcon />}
        </IconButton>

        <div style={{ flexGrow: 1, minWidth: 0 }}>
          {isSearchMode ? (
            <TextField
              fullWidth
              variant="filled"
              hiddenLabel
              placeholder="Search..."
              value={searchVal}
              onFocus={() => setExpanded(true)}
              onChange={(e) => setSearchVal(e.target.value)}
              InputProps={{ disableUnderline: true }}
            />
          ) : (
            <TextField
              select
              fullWidth
              variant="filled"
              hiddenLabel
              value={dropDownVal}
              onChange={(e) => setDropDownVal(e.target.value)}
              InputProps={{ disableUnderline: true }}
              SelectProps={{
                displayEmpty: true,
                MenuProps: { sx: { zIndex: 4000 } },
              }}
            >
              <MenuItem value="">
                <span style={{ opacity: 0.5 }}>Drop-down</span>
              </MenuItem>
              {locationTypes.map((lt) => (
                <MenuItem key={lt} value={lt}>
                  {lt}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>

        {expanded && (
          <IconButton
            onClick={() => setExpanded(false)}
            style={{
              backgroundColor: "white",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)",
              width: 32,
              height: 32,
              flexShrink: 0,
            }}
          >
            <img
              src="assets/close.svg"
              alt="Close"
              style={{ width: 16, height: 16 }}
            />
          </IconButton>
        )}
      </div>

      {/* Expanded content: search results */}
      {expanded && isSearchMode && searchResults.length > 0 && (
        <div
          style={{
            marginTop: "10px",
            maxHeight: "300px",
            overflowY: "auto",
            background: "rgba(255,255,255,0.8)",
            borderRadius: 8,
            padding: "8px",
          }}
        >
          {searchResults.map((marker, index) => (
            <div
              key={index}
              style={{
                padding: "6px 8px",
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
              }}
              onClick={() => {
                mapRef.current.setView(
                  [marker.coords.lat, marker.coords.lng],
                  18
                );
              }}
            >
              <strong>{marker.name}</strong>
              <p style={{ margin: 0, fontSize: "0.8rem" }}>{marker.type}</p>
            </div>
          ))}
        </div>
      )}

      {expanded && isSearchMode && searchResults.length === 0 && searchVal && (
        <div style={{ marginTop: "10px", fontSize: "0.85rem", color: "#666" }}>
          No results found.
        </div>
      )}
    </div>
  );
}
