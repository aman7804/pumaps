import { configureStore } from "@reduxjs/toolkit";
import uiReducer from "../store/uiSlice";
import deviceReducer from "../store/deviceSlice";
import mapReducer from "../store/mapSlice";

export const store = configureStore({
  reducer: {
    ui: uiReducer,
    device: deviceReducer,
    map: mapReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["mapSlice/setCurrentMarkerData"],
        ignoredPaths: ["map.currentMarkerData"],
      },
    }),
});
