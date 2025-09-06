import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "mapSlice",
  initialState: {
    currentMarkerData: null,
    userLocation: null,
    currentPathRoutes: null,
    currentRouteInfo: null,
    currentMarker: null,
  },
  reducers: {
    setCurrentMarkerData: (state, action) => {
      state.currentMarkerData = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
    setCurrentPathRoutes: (state, action) => {
      state.currentPathRoutes = action.payload;
    },
    setCurrentRouteInfo: (state, action) => {
      state.currentRouteInfo = action.payload;
    },
    setCurrentMarker: (state, action) => {
      state.currentMarker = action.payload;
    },
  },
});

export const {
  setCurrentMarkerData,
  setUserLocation,
  setCurrentPathRoutes,
  setCurrentRouteInfo,
  setCurrentMarker,
} = mapSlice.actions;
export default mapSlice.reducer;
