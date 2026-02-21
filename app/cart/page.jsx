'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import CartItem from '@/components/CartItem'

export default function CartPage() {
  const { items, cartTotal, clearCart } = useCart()

  const shipping = cartTotal >= 100 ? 0 : 9.99
  const total = cartTotal + shipping

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-20 w-20 mx-auto text-gray-200 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started.</p>
        <Link href="/shop" className="btn-primary inline-block">Shop Now</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-wider">CART</h1>
        <button onClick={clearCart} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
          Clear all
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Items */}
        <div className="lg:col-span-2">
          {items.map(item => (
            <CartItem key={`${item.productId}-${item.size}`} item={item} />
          ))}
        </div>

        {/* Summary */}
        <div className="lg:col-span-1">
          <div className="bg-gray-50 p-6 sticky top-24">
            <h2 className="text-lg font-bold mb-6">ORDER SUMMARY</h2>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span className="font-medium">${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span className="font-medium">
                  {shipping === 0 ? (
                    <span className="text-green-600">Free</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </span>
              </div>
              {cartTotal < 100 && (
                <p className="text-xs text-gray-500">
                  Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}
              <div className="border-t border-gray-200 pt-3 flex justify-between font-bold text-base">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <Link href="/checkout" className="block mt-6 bg-dark text-white text-center py-4 font-medium tracking-widest text-sm hover:bg-gray-800 transition-colors">
              PROCEED TO CHECKOUT
            </Link>
            <Link href="/shop" className="block mt-3 text-center text-sm text-gray-500 hover:text-dark transition-colors">
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
