import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isGpsOn: false,
    isDrawerOpen: false,
    openDrawerFully: false,
    drawerView: "CLOSED", // could be "CLOSED" | "INFO" | "DIRECTION"
    showFTC: false,
  },
  reducers: {
    toggleGps: (state) => {
      state.isGpsOn = !state.isGpsOn;
    },
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setOpenDrawerFully: (state, action) => {
      state.openDrawerFully = action.payload;
    },
    setDrawerView: (state, action) => {
      state.drawerView = action.payload;
    },
    setShowFTC: (state, action) => {
      state.showFTC = action.payload;
    },
  },
});

export const {
  toggleGps,
  setDrawerOpen,
  setOpenDrawerFully,
  setDrawerView,
  setShowFTC,
} = uiSlice.actions;
export default uiSlice.reducer;
