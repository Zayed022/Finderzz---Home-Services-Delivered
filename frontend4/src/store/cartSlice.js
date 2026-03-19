import { createSlice } from "@reduxjs/toolkit";

/* 🔥 FIND ITEM */
const findItem = (items, payload) => {
  return items.find(
    (item) =>
      item.bookingType === payload.bookingType &&
      (
        (payload.subServiceId &&
          item.subServiceId === payload.subServiceId) ||
        (payload.serviceId &&
          item.serviceId === payload.serviceId)
      )
  );
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const existing = findItem(state.items, action.payload);

      if (existing) {
        existing.quantity += 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },

    increaseQty: (state, action) => {
      const item = findItem(state.items, action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action) => {
      const item = findItem(state.items, action.payload);

      if (!item) return;

      if (item.quantity === 1) {
        state.items = state.items.filter(
          (i) =>
            !(
              i.bookingType === action.payload.bookingType &&
              (
                (action.payload.subServiceId &&
                  i.subServiceId === action.payload.subServiceId) ||
                (action.payload.serviceId &&
                  i.serviceId === action.payload.serviceId)
              )
            )
        );
      } else {
        item.quantity -= 1;
      }
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.bookingType === action.payload.bookingType &&
            (
              (action.payload.subServiceId &&
                item.subServiceId === action.payload.subServiceId) ||
              (action.payload.serviceId &&
                item.serviceId === action.payload.serviceId)
            )
          )
      );
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;