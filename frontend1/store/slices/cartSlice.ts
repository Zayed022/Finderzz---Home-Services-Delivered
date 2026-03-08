import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  _id: string;
  name: string;
  price: number;
  duration: number;
  quantity?: number;
  bookingType?: "service" | "inspection";
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existing = state.items.find(
        (item) =>
          item._id === action.payload._id &&
          item.bookingType === action.payload.bookingType
      );
  
      if (existing) {
        existing.quantity = (existing.quantity ?? 0) + 1;
      } else {
        state.items.push({
          ...action.payload,
          quantity: 1,
        });
      }
    },
  
    increaseQty: (
      state,
      action: PayloadAction<{ _id: string; bookingType: "service" | "inspection" }>
    ) => {
      const item = state.items.find(
        (i) =>
          i._id === action.payload._id &&
          i.bookingType === action.payload.bookingType
      );
  
      if (item) {
        item.quantity = (item.quantity ?? 0) + 1;
      }
    },
  
    decreaseQty: (
      state,
      action: PayloadAction<{ _id: string; bookingType: "service" | "inspection" }>
    ) => {
      const item = state.items.find(
        (i) =>
          i._id === action.payload._id &&
          i.bookingType === action.payload.bookingType
      );
  
      if (item && (item.quantity ?? 0) > 1) {
        item.quantity = (item.quantity ?? 1) - 1;
      }
    },
  
    removeFromCart: (
      state,
      action: PayloadAction<{ _id: string; bookingType: "service" | "inspection" }>
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item._id === action.payload._id &&
            item.bookingType === action.payload.bookingType
          )
      );
    },
  
    clearCart: () => initialState,
  }
});

export const {
  addToCart,
  increaseQty,
  decreaseQty,
  removeFromCart,
  clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;