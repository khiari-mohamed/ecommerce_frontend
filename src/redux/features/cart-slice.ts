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
  cover?: string; // <-- Add this
  mainImage?: { url: string }; // <-- Add this
  images?: { url: string }[];  // <-- Add this
  designation_fr?: string;     // <-- Optional, for display
  designation?: string;  
  // <-- Add this line for the main image used in cart
};

const initialState: InitialState = {
  items: [],
};

export const cart = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
    const { id, title, price, quantity, discountedPrice, imgs, type, image } =
    action.payload;
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
        cover: action.payload.cover,           // <-- Add this line
        mainImage: action.payload.mainImage,   // <-- Add this line
        images: action.payload.images,         // <-- Add this line
        designation_fr: action.payload.designation_fr, // (optional, for display)
        designation: action.payload.designation,       // (optional, for display)
      });
    }
    },
    removeItemFromCart: (state, action: PayloadAction<number>) => {
      const itemId = action.payload;
      state.items = state.items.filter((item) => item.id !== itemId);
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
    },

    removeAllItemsFromCart: (state) => {
      state.items = [];
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
