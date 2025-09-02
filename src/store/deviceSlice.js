import { createSlice } from "@reduxjs/toolkit";

const deviceSlice = createSlice({
  name: "device",
  initialState: { isMobile: window.innerWidth <= 480 },
  reducers: {
    setIsMobile: (state, action) => {
      state.isMobile = action.payload;
    },
  },
});

export const { setIsMobile } = deviceSlice.actions;
export default deviceSlice.reducer;
