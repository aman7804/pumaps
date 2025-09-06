import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "mapSlice",
  initialState: {
    currentMarkerData: null,
    userLocation: null,
    currentPathRoutes: null,
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
  },
});

export const { setCurrentMarkerData, setUserLocation, setCurrentPathRoutes } =
  mapSlice.actions;
export default mapSlice.reducer;
