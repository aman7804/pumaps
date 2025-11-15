import React, { useEffect, useState } from "react";
import { TextField, IconButton, MenuItem, InputAdornment } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import CloseIcon from "@mui/icons-material/Close"; // ← new
import { toLowerCamelCase } from "../helper";

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

export default function SearchToggle({
  mapRef,
  markerClusterRef,
  handleResultClick,
  expanded,
  setExpanded,
}) {
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchVal, setSearchVal] = useState("");
  const [dropDownVal, setDropDownVal] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  function searchMarkers(value) {
    const markers = Object.values(markerData).flat();
    const regex = new RegExp(value, "i"); // case-insensitive

    return markers.filter(
      (m) =>
        regex.test(m.type) || regex.test(m.name) || regex.test(m.description)
    );
  }

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setExpanded(false);
        document.activeElement.blur();
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

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

  useEffect(() => {
    if (searchVal.trim()) setSearchResults(searchMarkers(searchVal));
    else setSearchResults([]);
  }, [searchVal]);

  const toggleMode = () => {
    setIsSearchMode((prev) => {
      if (prev) setSearchVal("");
      else setDropDownVal("");
      return !prev;
    });
  };

  // --- New clear/close function
  const handleClear = () => {
    if (searchVal) setSearchVal("");
    else setExpanded(false);
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
        padding: 10,
        boxShadow: expanded ? "0 2px 8px rgba(0,0,0,0.2)" : "none",
        fontFamily: "Roboto, sans-serif",
      }}
    >
      <div
        style={{ display: "flex", alignItems: "center", gap: 6, width: "100%" }}
      >
        <IconButton
          onClick={toggleMode}
          style={{
            border: "1px solid #ccc",
            borderRadius: 8,
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
              autoComplete="off"
              variant="filled"
              hiddenLabel
              placeholder="Search..."
              value={searchVal}
              onFocus={() => setExpanded(true)}
              onChange={(e) => setSearchVal(e.target.value)}
              InputProps={{
                disableUnderline: true,
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={handleClear}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <TextField
              select
              autoComplete="off"
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
                <span style={{ opacity: 0.5 }}>Select category</span>
              </MenuItem>
              {locationTypes.map((lt) => (
                <MenuItem key={lt} value={lt}>
                  {lt}
                </MenuItem>
              ))}
            </TextField>
          )}
        </div>
      </div>

      {expanded && isSearchMode && (
        <div
          style={{
            marginTop: 10,
            maxHeight: 600,
            overflowY: "auto",
            background: "rgba(255,255,255,0.8)",
            borderRadius: 8,
            padding: 8,
          }}
        >
          {searchResults.length > 0 ? (
            searchResults.map((marker, i) => (
              <div
                key={i}
                style={{
                  padding: "6px 8px",
                  borderBottom: "1px solid #ccc",
                  cursor: "pointer",
                }}
                onClick={() => handleResultClick(marker)}
              >
                <strong>{marker.name}</strong>
                <p style={{ margin: 0, fontSize: "0.8rem" }}>{marker.type}</p>
              </div>
            ))
          ) : searchVal ? (
            <p style={{ margin: 0, color: "#666", fontSize: "0.85rem" }}>
              No results found.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}
