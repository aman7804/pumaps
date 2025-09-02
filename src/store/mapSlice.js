import { createSlice } from "@reduxjs/toolkit";

const mapSlice = createSlice({
  name: "mapSlice",
  initialState: {
    currentMarkerData: null,
    userLocation: null,
  },
  reducers: {
    setCurrentMarkerData: (state, action) => {
      state.currentMarkerData = action.payload;
    },
    setUserLocation: (state, action) => {
      state.userLocation = action.payload;
    },
  },
});

export const { setCurrentMarkerData, setUserLocation } = mapSlice.actions;
export default mapSlice.reducer;
