import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: {
    isGpsOn: false,
    isDrawerOpen: false,
    drawerView: "CLOSED", // could be "CLOSED" | "INFO" | "DIRECTION"
    prevDrawerView: "CLOSED",
    showFTC: false,
    drawerHeightValue: null,
  },
  reducers: {
    toggleGps: (state) => {
      state.isGpsOn = !state.isGpsOn;
    },
    setDrawerOpen: (state, action) => {
      state.isDrawerOpen = action.payload;
    },
    setDrawerView: (state, action) => {
      state.prevDrawerView = state.drawerView;
      state.drawerView = action.payload;
    },
    setShowFTC: (state, action) => {
      state.showFTC = action.payload;
    },
    setDrawerHeightValue: (state, action) => {
      state.drawerHeightValue = action.payload;
    },
  },
});

export const {
  toggleGps,
  setDrawerOpen,
  // setExpandDrawer,
  setDrawerView,
  setShowFTC,
  setDrawerHeightValue,
} = uiSlice.actions;
export default uiSlice.reducer;
