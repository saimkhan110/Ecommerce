// ===== Wishlist Context - localStorage me wishlist save =====
import { createContext, useContext, useEffect, useState } from 'react'

const WishlistContext = createContext(null)
const STORAGE_KEY = 'antiqor_wishlist'

export function WishlistProvider({ children }) {
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

  const isWishlisted = (id) => items.some((i) => i._id === id)

  // Add / remove toggle
  const toggleWishlist = (product) => {
    setItems((prev) =>
      prev.some((i) => i._id === product._id)
        ? prev.filter((i) => i._id !== product._id)
        : [
            ...prev,
            {
              _id: product._id,
              name: product.name,
              price: product.price,
              image: product.image,
              category: product.category,
            },
          ]
    )
  }

  const removeFromWishlist = (id) =>
    setItems((prev) => prev.filter((i) => i._id !== id))

  const clearWishlist = () => setItems([])

  return (
    <WishlistContext.Provider
      value={{
        items,
        count: items.length,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  )
}

export const useWishlist = () => useContext(WishlistContext)
