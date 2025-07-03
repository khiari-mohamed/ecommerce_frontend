/*import { create } from 'zustand';
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;

  quantity: number;
  cover: string;
  alt_cover: string;
  slug: string;
  designation_fr: string;
  promo: number;
  prix: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: CartItem["id"]) => void;
  increaseQuantity: (id: CartItem["id"]) => void;
  decreaseQuantity: (id: CartItem["id"]) => void;
  getTotal: () => number;
  isCartOpen: boolean;
  toggleCartOpen: () => void;
  setItemQuantity: (id: CartItem["id"], quantity: number) => void;
}

const useCartStore = create(
  persist<CartState>(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (item: CartItem) =>
        set((state) => ({
          items: [...state.items, item],
        })),
      removeItem: (id: CartItem["id"]) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      increaseQuantity: (id: CartItem["id"]) =>
        set((state) => {
          const items = state.items.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: item.quantity + 1 };
            }
            return item;
          });

          return { items };
        }),
      decreaseQuantity: (id: CartItem["id"]) =>
        set((state) => {
          const items = state.items.map((item) => {
            if (item.id === id && item.quantity > 1) {
              return { ...item, quantity: item.quantity - 1 };
            }
            return item;
          });

          return { items };
        }),
      getTotal: () => {
        return get().items.reduce((total, item) => {
          return total + item.prix * item.quantity;
        }, 0);
      },
      toggleCartOpen: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      setItemQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id ? { ...item, quantity } : item
          ),
        })),
    }),
    {
      name: "cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useCartStore;*/
