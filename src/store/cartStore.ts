import { create } from 'zustand'

export interface CartItem {
  product_id: number
  product_name: string
  price: number
  quantity: number
}

interface CartState {
  items: CartItem[]
  customer: { customer_id: number; full_name: string } | null
  discount: number
  addItem: (item: Omit<CartItem, 'quantity'>) => void
  removeItem: (product_id: number) => void
  updateQty: (product_id: number, qty: number) => void
  setCustomer: (c: CartState['customer']) => void
  setDiscount: (d: number) => void
  clear: () => void
  total: () => number
  subtotal: () => number
}

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  customer: null,
  discount: 0,
  addItem: (item) => set((s) => {
    const existing = s.items.find(i => i.product_id === item.product_id)
    if (existing) return { items: s.items.map(i => i.product_id === item.product_id ? { ...i, quantity: i.quantity + 1 } : i) }
    return { items: [...s.items, { ...item, quantity: 1 }] }
  }),
  removeItem: (id) => set((s) => ({ items: s.items.filter(i => i.product_id !== id) })),
  updateQty: (id, qty) => set((s) => ({
    items: qty <= 0 ? s.items.filter(i => i.product_id !== id) : s.items.map(i => i.product_id === id ? { ...i, quantity: qty } : i)
  })),
  setCustomer: (c) => set({ customer: c }),
  setDiscount: (d) => set({ discount: d }),
  clear: () => set({ items: [], customer: null, discount: 0 }),
  subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
  total: () => {
    const sub = get().subtotal()
    return Math.max(0, sub - get().discount)
  },
}))
