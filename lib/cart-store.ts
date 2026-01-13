import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface CartItem {
  _id: string
  name: string
  price: number
  image: string
  quantity: number
}

export interface OrderReceipt {
  orderNumber: string
  items: CartItem[]
  total: number
  date: string
  status: string
}

interface CartState {
  items: CartItem[]
  orderHistory: OrderReceipt[]
  addItem: (item: Omit<CartItem, "quantity">) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  addOrder: (order: OrderReceipt) => void
  clearOrderHistory: () => void; // <--- NEW ACTION
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      orderHistory: [],

      addItem: (data) => {
        const currentItems = get().items
        const existingItem = currentItems.find((item) => item._id === data._id)

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item._id === data._id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          })
        } else {
          set({ items: [...currentItems, { ...data, quantity: 1 }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item._id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set({
          items: get().items.map((item) =>
            item._id === id ? { ...item, quantity } : item
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      addOrder: (order) => set((state) => ({ 
        orderHistory: [order, ...state.orderHistory] 
      })),

      // NEW: Clears history (Call this on Logout)
      clearOrderHistory: () => set({ orderHistory: [] }),

      getTotalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((total, item) => total + item.price * item.quantity, 0),
    }),
    {
      name: "intellicafe-cart",
      storage: createJSONStorage(() => localStorage),
    }
  )
)