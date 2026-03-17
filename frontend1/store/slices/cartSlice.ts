import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CartItem {
  serviceId?: string;
  subServiceId?: string;

  name: string;
  price: number;
  duration: number;

  quantity: number;
  bookingType: "service" | "inspection";
}

interface CartState {
  items: CartItem[];
}

const initialState: CartState = {
  items: [],
};

const findItem = (items: CartItem[], payload: CartItem) => {
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
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
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

    increaseQty: (state, action: PayloadAction<CartItem>) => {
      const item = findItem(state.items, action.payload);
      if (item) item.quantity += 1;
    },

    decreaseQty: (state, action: PayloadAction<CartItem>) => {
      const item = findItem(state.items, action.payload);
      if (item && item.quantity > 1) item.quantity -= 1;
    },

    removeFromCart: (state, action: PayloadAction<CartItem>) => {
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

    clearCart: () => initialState,
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