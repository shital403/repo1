'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export function CartProvider({ children }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    try {
      const stored = localStorage.getItem('luxe-cart')
      if (stored) setItems(JSON.parse(stored))
    } catch {
      localStorage.removeItem('luxe-cart')
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('luxe-cart', JSON.stringify(items))
  }, [items])

  function addToCart(product, size = 'M', quantity = 1) {
    setItems(prev => {
      const existing = prev.find(
        item => item.productId === product._id && item.size === size
      )
      if (existing) {
        return prev.map(item =>
          item.productId === product._id && item.size === size
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, {
        productId: product._id,
        name: product.name,
        price: product.price,
        image: product.images?.[0] || '',
        size,
        quantity,
      }]
    })
  }

  function removeFromCart(productId, size) {
    setItems(prev => prev.filter(item => !(item.productId === productId && item.size === size)))
  }

  function updateQuantity(productId, size, quantity) {
    if (quantity <= 0) {
      removeFromCart(productId, size)
      return
    }
    setItems(prev =>
      prev.map(item =>
        item.productId === productId && item.size === size
          ? { ...item, quantity }
          : item
      )
    )
  }

  function clearCart() {
    setItems([])
  }

  const cartTotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used within CartProvider')
  return context
}
