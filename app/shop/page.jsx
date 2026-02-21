'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import ProductCard from '@/components/ProductCard'

const CATEGORIES = ['All', 'Men', 'Women', 'New Arrivals']

function ShopContent() {
  const searchParams = useSearchParams()
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState(searchParams.get('category') || 'All')

  useEffect(() => {
    const cat = searchParams.get('category')
    if (cat) setCategory(cat)
  }, [searchParams])

  useEffect(() => {
    async function fetchProducts() {
      setLoading(true)
      try {
        const params = {}
        if (category !== 'All') params.category = category
        if (search) params.search = search
        const res = await axios.get('/api/products', { params })
        setProducts(res.data)
      } catch {
        setProducts([])
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [category, search])

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-wider mb-8">SHOP</h1>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search products..."
            className="input-field pl-10 text-sm"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-10">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setCategory(cat)}
            className={`px-5 py-2 text-sm font-medium border transition-colors duration-200 ${
              category === cat
                ? 'bg-dark text-white border-dark'
                : 'bg-white text-dark border-gray-300 hover:border-dark'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-gray-100 animate-pulse">
              <div className="aspect-[3/4]" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-9 bg-gray-200 rounded mt-3" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-gray-400 text-lg">No products found.</p>
          <button onClick={() => { setCategory('All'); setSearch('') }} className="mt-4 text-sm text-dark underline">
            Clear filters
          </button>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-500 mb-6">{products.length} product{products.length !== 1 ? 's' : ''}</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

export default function ShopPage() {
  return (
    <Suspense fallback={<div className="max-w-7xl mx-auto px-4 py-12"><div className="animate-pulse h-8 bg-gray-100 w-32 mb-8" /></div>}>
      <ShopContent />
    </Suspense>
  )
}
