import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./cartSlice";
import areaReducer from "./areaSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    area: areaReducer,
  },
});