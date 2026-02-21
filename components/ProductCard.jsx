'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'

const CATEGORY_COLORS = {
  Men: 'bg-blue-50 text-blue-700',
  Women: 'bg-pink-50 text-pink-700',
  'New Arrivals': 'bg-green-50 text-green-700',
}

function ProductImagePlaceholder({ name, category }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
  const bgColors = {
    Men: 'bg-gray-200',
    Women: 'bg-rose-100',
    'New Arrivals': 'bg-emerald-100',
  }
  return (
    <div className={`w-full h-full flex items-center justify-center ${bgColors[category] || 'bg-beige'}`}>
      <span className="text-4xl font-bold text-gray-400">{initials}</span>
    </div>
  )
}

export default function ProductCard({ product }) {
  const { addToCart } = useCart()

  function handleAddToCart(e) {
    e.preventDefault()
    addToCart(product, product.sizes?.[0] || 'M', 1)
  }

  return (
    <div className="group bg-white border border-gray-100 hover:shadow-md transition-shadow duration-300">
      <Link href={`/product/${product._id}`}>
        <div className="aspect-[3/4] overflow-hidden relative bg-gray-50">
          {product.images?.[0] ? (
            <img
              src={product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <ProductImagePlaceholder name={product.name} category={product.category} />
          )}
          <span className={`absolute top-3 left-3 text-xs px-2 py-1 font-medium rounded-sm ${CATEGORY_COLORS[product.category] || 'bg-gray-100 text-gray-600'}`}>
            {product.category}
          </span>
        </div>
      </Link>
      <div className="p-4">
        <Link href={`/product/${product._id}`}>
          <h3 className="font-medium text-dark hover:text-gray-600 transition-colors truncate">{product.name}</h3>
        </Link>
        <p className="text-gray-900 font-semibold mt-1">${product.price.toFixed(2)}</p>
        <button
          onClick={handleAddToCart}
          className="mt-3 w-full bg-dark text-white py-2 text-sm font-medium hover:bg-gray-800 transition-colors duration-200"
        >
          Add to Cart
        </button>
      </div>
    </div>
  )
}
