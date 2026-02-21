'use client'

import { useCart } from '@/context/CartContext'

export default function CartItem({ item }) {
  const { removeFromCart, updateQuantity } = useCart()

  return (
    <div className="flex items-center gap-4 py-6 border-b border-gray-100">
      {/* Image placeholder */}
      <div className="w-20 h-24 bg-beige flex items-center justify-center flex-shrink-0">
        {item.image ? (
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-xl font-bold text-gray-300">
            {item.name.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-dark truncate">{item.name}</h3>
        <p className="text-sm text-gray-500 mt-1">Size: {item.size}</p>
        <p className="text-sm font-semibold mt-1">${item.price.toFixed(2)}</p>
      </div>

      {/* Quantity */}
      <div className="flex items-center border border-gray-200">
        <button
          onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          −
        </button>
        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
          className="w-8 h-8 flex items-center justify-center hover:bg-gray-50 transition-colors"
        >
          +
        </button>
      </div>

      {/* Subtotal */}
      <div className="text-right w-20 flex-shrink-0">
        <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
        <button
          onClick={() => removeFromCart(item.productId, item.size)}
          className="text-xs text-gray-400 hover:text-red-500 transition-colors mt-1"
        >
          Remove
        </button>
      </div>
    </div>
  )
}
