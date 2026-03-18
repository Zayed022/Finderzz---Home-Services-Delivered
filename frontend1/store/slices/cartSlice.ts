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

/* 🔥 FIND ITEM (CORE LOGIC) */
const findItem = (items: CartItem[], payload: Partial<CartItem>) => {
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
    /* ADD */
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

    /* INCREASE */
    increaseQty: (state, action: PayloadAction<Partial<CartItem>>) => {
      const item = findItem(state.items, action.payload);
      if (item) item.quantity += 1;
    },

    /* DECREASE (AUTO REMOVE) */
    decreaseQty: (state, action: PayloadAction<Partial<CartItem>>) => {
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

    /* REMOVE */
    removeFromCart: (state, action: PayloadAction<Partial<CartItem>>) => {
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