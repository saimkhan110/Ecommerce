// ===== Cart Context - localStorage me cart save (backend cart API nahi hai) =====
import { createContext, useContext, useEffect, useState } from 'react'

const CartContext = createContext(null)
const STORAGE_KEY = 'antiqor_cart'

export function CartProvider({ children }) {
  // Page reload pe bhi cart bana rahe
  const [items, setItems] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  }, [items])

  // Add (already ho to qty badhao)
  const addToCart = (product, qty = 1) => {
    setItems((prev) => {
      const found = prev.find((i) => i._id === product._id)
      if (found) {
        return prev.map((i) =>
          i._id === product._id ? { ...i, qty: i.qty + qty } : i
        )
      }
      return [
        ...prev,
        {
          _id: product._id,
          name: product.name,
          price: product.price,
          image: product.image,
          category: product.category,
          qty,
        },
      ]
    })
  }

  const removeFromCart = (id) =>
    setItems((prev) => prev.filter((i) => i._id !== id))

  const updateQty = (id, qty) =>
    setItems((prev) =>
      prev.map((i) => (i._id === id ? { ...i, qty: Math.max(1, qty) } : i))
    )

  const clearCart = () => setItems([])

  const count = items.reduce((sum, i) => sum + i.qty, 0)
  const total = items.reduce((sum, i) => sum + i.price * i.qty, 0)

  return (
    <CartContext.Provider
      value={{ items, addToCart, removeFromCart, updateQty, clearCart, count, total }}
    >
      {children}
    </CartContext.Provider>
  )
}

export const useCart = () => useContext(CartContext)
