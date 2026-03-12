import { createContext, useContext, useEffect, useState } from "react"
import type { CartItem } from "../types/cart"

type CartContextType = {
  cart: CartItem[]
  addToCart: (item: CartItem) => void
  removeFromCart: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateOptions: (id: string, options: Record<string, string>) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

const STORAGE_KEY = "cabinet_cart"
const EXPIRATION_TIME = 24 * 60 * 60 * 1000 // 24 hours

type StoredCart = {
  items: CartItem[]
  expires: number
}

export const CartProvider = ({ children }: { children: React.ReactNode }) => {

  const [cart, setCart] = useState<CartItem[]>([])

  /**
   * LOAD CART FROM STORAGE
   */
  useEffect(() => {

    try {
      const stored = localStorage.getItem(STORAGE_KEY)

      if (!stored) return

      const parsed: StoredCart = JSON.parse(stored)

      if (Date.now() > parsed.expires) {
        localStorage.removeItem(STORAGE_KEY)
        return
      }

      setCart(parsed.items)

    } catch (error) {
      console.error("Cart load error", error)
      localStorage.removeItem(STORAGE_KEY)
    }

  }, [])

  /**
   * SAVE CART TO STORAGE
   */
  useEffect(() => {

    const data: StoredCart = {
      items: cart,
      expires: Date.now() + EXPIRATION_TIME
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))

  }, [cart])

  /**
   * ADD ITEM
   */
  const addToCart = (item: CartItem) => {

    setCart(prev => {

      const existing = prev.find(
        p =>
          p.id === item.id &&
          JSON.stringify(p.options) === JSON.stringify(item.options)
      )

      if (existing) {
        return prev.map(p =>
          p === existing
            ? { ...p, quantity: p.quantity + item.quantity }
            : p
        )
      }

      return [...prev, item]

    })

  }

  /**
   * REMOVE ITEM
   */
  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id))
  }

  /**
   * UPDATE QUANTITY
   */
  const updateQuantity = (id: string, quantity: number) => {

    if (quantity < 1) return

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, quantity } : item
      )
    )

  }

  /**
   * UPDATE OPTIONS
   */
  const updateOptions = (id: string, options: Record<string, string>) => {

    setCart(prev =>
      prev.map(item =>
        item.id === id ? { ...item, options } : item
      )
    )

  }

  /**
   * CLEAR CART
   */
  const clearCart = () => {
    setCart([])
    localStorage.removeItem(STORAGE_KEY)
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    updateOptions,
    clearCart
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )

}

export const useCart = () => {

  const context = useContext(CartContext)

  if (!context) {
    throw new Error("useCart must be used inside CartProvider")
  }

  return context
}