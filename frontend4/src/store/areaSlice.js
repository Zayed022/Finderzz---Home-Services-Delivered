import { createSlice } from "@reduxjs/toolkit";

const areaSlice = createSlice({
  name: "area",
  initialState: {
    selectedArea: null,
    extraCharge: 0,
  },
  reducers: {
    setArea: (state, action) => {
        state.selectedArea = action.payload; // full object
        state.extraCharge = action.payload.extraCharge;
      },
    clearArea: (state) => {
      state.selectedArea = null;
      state.extraCharge = 0;
    },
  },
});

export const { setArea, clearArea } = areaSlice.actions;
export default areaSlice.reducer;