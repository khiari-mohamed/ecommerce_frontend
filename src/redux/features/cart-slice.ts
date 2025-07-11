import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: number;
  title: string;
  price: number;
  discountedPrice: number;
  quantity: number;
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  type?: string;
  image: string; 
  cover?: string;
  mainImage?: { url: string };
  images?: { url: string }[];
  designation_fr?: string;
  designation?: string;
};

function loadCartItems(): CartItem[] {
  if (typeof window !== "undefined") {
    const data = localStorage.getItem("cartItems");
    if (data) return JSON.parse(data);
  }
  return [];
}

const initialState: InitialState = {
  items: loadCartItems(),
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const { id, title, price, quantity, discountedPrice, imgs, type, image } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          id,
          title,
          price,
          quantity,
          discountedPrice,
          imgs,
          type,
          image,
          cover: action.payload.cover,
          mainImage: action.payload.mainImage,
          images: action.payload.images,
          designation_fr: action.payload.designation_fr,
          designation: action.payload.designation,
        });
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
    updateCartItemQuantity: (
      state,
      action: PayloadAction<{ id: number; quantity: number }>
    ) => {
      const { id, quantity } = action.payload;
      const existingItem = state.items.find((item) => item.id === id);

      if (existingItem) {
        existingItem.quantity = quantity;
      }
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
      if (typeof window !== "undefined") {
        localStorage.setItem("cartItems", JSON.stringify(state.items));
      }
    },
  },
});

export const selectCartItems = (state: RootState) => state.cartReducer.items;

export const selectTotalPrice = createSelector([selectCartItems], (items) => {
  return items.reduce((total, item) => {
    return total + item.discountedPrice * item.quantity;
  }, 0);
});

export const {
  addItemToCart,
  removeItemFromCart,
  updateCartItemQuantity,
  removeAllItemsFromCart,
} = cart.actions;
export default cart.reducer;
