'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import axios from 'axios'
import { useCart } from '@/context/CartContext'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { addToCart } = useCart()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [selectedSize, setSelectedSize] = useState('')
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await axios.get(`/api/products/${id}`)
        setProduct(res.data)
        if (res.data.sizes?.length > 0) setSelectedSize(res.data.sizes[0])
      } catch {
        setProduct(null)
      } finally {
        setLoading(false)
      }
    }
    if (id) fetchProduct()
  }, [id])

  function handleAddToCart() {
    if (!product) return
    addToCart(product, selectedSize, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 animate-pulse">
          <div className="aspect-[3/4] bg-gray-100" />
          <div className="space-y-4 py-4">
            <div className="h-8 bg-gray-100 rounded w-3/4" />
            <div className="h-6 bg-gray-100 rounded w-1/4" />
            <div className="h-24 bg-gray-100 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-400 text-lg">Product not found.</p>
        <Link href="/shop" className="mt-4 inline-block text-sm text-dark underline">Back to Shop</Link>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <Link href="/shop" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-dark transition-colors mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">
        {/* Image */}
        <div className="aspect-[3/4] bg-beige overflow-hidden">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <span className="text-8xl font-bold text-gray-200">
                {product.name.slice(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="py-4">
          <span className="text-xs tracking-widest text-gray-500 uppercase">{product.category}</span>
          <h1 className="text-3xl font-bold text-dark mt-2 mb-4">{product.name}</h1>
          <p className="text-2xl font-semibold mb-6">${product.price.toFixed(2)}</p>
          <p className="text-gray-600 leading-relaxed mb-8">{product.description}</p>

          {/* Sizes */}
          {product.sizes?.length > 0 && (
            <div className="mb-6">
              <p className="text-sm font-semibold tracking-wider uppercase mb-3">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 text-sm font-medium border transition-colors ${
                      selectedSize === size
                        ? 'bg-dark text-white border-dark'
                        : 'bg-white text-dark border-gray-300 hover:border-dark'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-8">
            <p className="text-sm font-semibold tracking-wider uppercase mb-3">Quantity</p>
            <div className="flex items-center border border-gray-300 w-fit">
              <button
                onClick={() => setQuantity(q => Math.max(1, q - 1))}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(q => q + 1)}
                className="w-10 h-10 flex items-center justify-center hover:bg-gray-50 transition-colors"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 font-medium tracking-widest text-sm transition-colors duration-200 ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-dark text-white hover:bg-gray-800'
            }`}
          >
            {added ? '✓ ADDED TO CART' : 'ADD TO CART'}
          </button>

          {product.stock <= 5 && product.stock > 0 && (
            <p className="text-sm text-amber-600 mt-3">Only {product.stock} left in stock!</p>
          )}
          {product.stock === 0 && (
            <p className="text-sm text-red-500 mt-3">Out of stock</p>
          )}
        </div>
      </div>
    </div>
  )
}
