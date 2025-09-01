import React, { useState } from "react";
import { TextField, IconButton, MenuItem } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";

const locationTypes = [
  "Restaurant",
  "Cafe",
  "Park",
  "Mall",
  "Hospital",
  "School",
  "Gym",
  "Bank",
  "ATM",
  "Gas",
  "Hotel",
  "Museum",
  "Cinema",
  "Station",
  "Library",
  "Market",
  "Pharmacy",
];

export default function SearchToggle() {
  const [isSearchMode, setIsSearchMode] = useState(true);
  const [searchVal, setSearchVal] = useState(""); // 🔹 separate state
  const [dropDownVal, setDropDownVal] = useState(""); // 🔹 separate state

  const toggleMode = () =>
    setIsSearchMode((prev) => {
      if (prev) setSearchVal(""); // clear search when switching to dropdown
      else setDropDownVal(""); // clear dropdown when switching to search

      return !prev;
    });

  return (
    <div
      style={{
        position: "absolute",
        top: "20px",
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 1000,
        width: "80%",
        maxWidth: "500px",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
        {/* Toggle Button */}
        <IconButton
          onClick={toggleMode}
          style={{
            border: "1px solid #ccc",
            borderRadius: "8px",
            backgroundColor: "#fff",
          }}
        >
          {isSearchMode ? <SearchIcon /> : <ArrowDropDownIcon />}
        </IconButton>

        {/* Search or Dropdown */}
        {isSearchMode ? (
          <TextField
            fullWidth
            variant="filled"
            hiddenLabel
            placeholder="Search..."
            value={searchVal}
            onChange={(e) => setSearchVal(e.target.value)} // 🔹 controlled
            InputProps={{
              disableUnderline: true,
            }}
          />
        ) : (
          <TextField
            select
            fullWidth
            variant="filled"
            hiddenLabel
            value={dropDownVal}
            onChange={(e) => setDropDownVal(e.target.value)} // 🔹 controlled
            InputProps={{
              disableUnderline: true,
            }}
            SelectProps={{
              displayEmpty: true,
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
    </div>
  );
}
