// ===== Cart Context - backend /api/cart se live cart =====
// Pehle localStorage me tha, ab cart MongoDB me user ke saath tied hai.
// Har response me poora cart aata hai, isliye setCart se hi UI update hota hai.
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import {
  getCart,
  addToCart as apiAddToCart,
  updateCartItem as apiUpdateCartItem,
  removeCartItem as apiRemoveCartItem,
  clearCart as apiClearCart,
} from '../services/api'
import { useAuth } from './AuthContext'

const CartContext = createContext(null)
const EMPTY_CART = { items: [], totalPrice: 0 }

export function CartProvider({ children }) {
  const { token } = useAuth()
  const [cart, setCart] = useState(EMPTY_CART)
  const [loading, setLoading] = useState(false)

  // Cart server se laao - sirf tab jab login ho
  const refresh = useCallback(async () => {
    if (!token) {
      setCart(EMPTY_CART)
      return null
    }
    try {
      setLoading(true)
      const { data } = await getCart()
      setCart(data.cart || EMPTY_CART)
      return data.cart
    } catch {
      // Cart fetch fail ho to UI khali rahega - page crash nahi hoga
      setCart(EMPTY_CART)
      return null
    } finally {
      setLoading(false)
    }
  }, [token])

  // Login/logout par cart refresh
  useEffect(() => {
    refresh()
  }, [refresh])

  // ===== Add to cart =====
  // Backend har response me poora cart deta hai - wahi set kar do
  const addToCart = async (product, quantity = 1) => {
    if (!token) throw new Error('Please login to add items to your cart')
    const { data } = await apiAddToCart({ productId: product._id, quantity })
    setCart(data.cart)
    return data
  }

  // ===== Quantity update (replace, add nahi) =====
  const updateQty = async (productId, quantity) => {
    const { data } = await apiUpdateCartItem(productId, quantity)
    setCart(data.cart)
    return data
  }

  // ===== Item remove =====
  const removeItem = async (productId) => {
    const { data } = await apiRemoveCartItem(productId)
    setCart(data.cart)
    return data
  }

  // ===== Poora cart khaali =====
  const clearCart = async () => {
    const { data } = await apiClearCart()
    setCart(data.cart)
    return data
  }

  const items = cart.items || []
  const count = items.reduce((sum, i) => sum + i.quantity, 0)
  const total = cart.totalPrice || 0

  return (
    <CartContext.Provider
      value={{
        items,
        count,
        total,
        cart,
        loading,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        refresh,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
