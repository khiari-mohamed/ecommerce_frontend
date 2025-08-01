import { createSelector, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { RootState } from "../store";

type InitialState = {
  items: CartItem[];
};

type CartItem = {
  id: string;
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
  slug?: string;
  brand?: string;
  inStock?: boolean;
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
    const { id } = action.payload;
    const existingItem = state.items.find((item) => item.id === id);
    
    if (existingItem) {
    existingItem.quantity += action.payload.quantity;
    } else {
    state.items.push(action.payload);
    }
    if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
    }
    },
    removeItemFromCart: (state, action: PayloadAction<string>) => {
    const itemId = action.payload;
    state.items = state.items.filter((item) => item.id !== itemId);
    if (typeof window !== "undefined") {
    localStorage.setItem("cartItems", JSON.stringify(state.items));
    }
    },
    updateCartItemQuantity: (
    state,
    action: PayloadAction<{ id: string; quantity: number }>
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
