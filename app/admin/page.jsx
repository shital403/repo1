'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Men', 'Women', 'New Arrivals']
const STATUS_COLORS = {
  pending: 'bg-yellow-100 text-yellow-700',
  paid: 'bg-blue-100 text-blue-700',
  shipped: 'bg-purple-100 text-purple-700',
  delivered: 'bg-green-100 text-green-700',
}

function ProductModal({ product, onClose, onSave }) {
  const [form, setForm] = useState(product || {
    name: '', description: '', price: '', category: 'Men',
    images: '', sizes: [], stock: 0, featured: false,
  })

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  function toggleSize(size) {
    setForm(prev => ({
      ...prev,
      sizes: prev.sizes.includes(size)
        ? prev.sizes.filter(s => s !== size)
        : [...prev.sizes, size],
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const token = localStorage.getItem('luxe-token')
    const payload = {
      ...form,
      price: parseFloat(form.price),
      stock: parseInt(form.stock),
      images: form.images ? (typeof form.images === 'string' ? form.images.split(',').map(s => s.trim()).filter(Boolean) : form.images) : [],
    }
    try {
      if (product?._id) {
        await axios.put(`/api/products/${product._id}`, payload, { headers: { Authorization: `Bearer ${token}` } })
      } else {
        await axios.post('/api/products', payload, { headers: { Authorization: `Bearer ${token}` } })
      }
      onSave()
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to save product')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white w-full max-w-lg max-h-[90vh] overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-bold">{product ? 'Edit Product' : 'Add Product'}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-dark">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input name="name" value={form.name} onChange={handleChange} required className="input-field" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className="input-field resize-none" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price ($)</label>
              <input name="price" type="number" step="0.01" min="0" value={form.price} onChange={handleChange} required className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock</label>
              <input name="stock" type="number" min="0" value={form.stock} onChange={handleChange} className="input-field" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Category</label>
            <select name="category" value={form.category} onChange={handleChange} className="input-field">
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Image URLs (comma separated)</label>
            <input
              name="images"
              value={Array.isArray(form.images) ? form.images.join(', ') : form.images}
              onChange={handleChange}
              placeholder="https://..."
              className="input-field"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Sizes</label>
            <div className="flex flex-wrap gap-2">
              {SIZES.map(size => (
                <button
                  key={size}
                  type="button"
                  onClick={() => toggleSize(size)}
                  className={`px-3 py-1 text-sm border transition-colors ${
                    form.sizes.includes(size)
                      ? 'bg-dark text-white border-dark'
                      : 'border-gray-300 hover:border-dark'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} className="w-4 h-4" />
            <span className="text-sm font-medium">Featured product</span>
          </label>
          <button type="submit" className="w-full btn-primary">
            {product ? 'Save Changes' : 'Create Product'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [user, setUser] = useState(null)
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editProduct, setEditProduct] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('luxe-user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('luxe-user')
    }
  }, [])

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts()
      fetchOrders()
    } else {
      setLoading(false)
    }
  }, [user])

  async function fetchProducts() {
    setLoading(true)
    try {
      const res = await axios.get('/api/products')
      setProducts(res.data)
    } catch {
      setProducts([])
    } finally {
      setLoading(false)
    }
  }

  async function fetchOrders() {
    try {
      const token = localStorage.getItem('luxe-token')
      const res = await axios.get('/api/orders', { headers: { Authorization: `Bearer ${token}` } })
      setOrders(res.data)
    } catch {
      setOrders([])
    }
  }

  async function deleteProduct(id) {
    if (!confirm('Delete this product?')) return
    try {
      const token = localStorage.getItem('luxe-token')
      await axios.delete(`/api/products/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      fetchProducts()
    } catch (err) {
      alert(err.response?.data?.error || 'Delete failed')
    }
  }

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="animate-pulse h-8 bg-gray-100 w-40 mb-8" />
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => <div key={i} className="h-12 bg-gray-100 animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (!user || user.role !== 'admin') {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-6xl mb-6">🔒</div>
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-gray-500">You must be an administrator to view this page.</p>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center justify-between mb-10">
        <h1 className="text-3xl font-bold tracking-wider">ADMIN PANEL</h1>
        <span className="text-sm text-gray-500">Logged in as {user.name}</span>
      </div>

      {/* Tabs */}
      <div className="flex gap-0 border-b border-gray-200 mb-8">
        {['products', 'orders'].map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              tab === t
                ? 'border-dark text-dark'
                : 'border-transparent text-gray-500 hover:text-dark'
            }`}
          >
            {t} ({t === 'products' ? products.length : orders.length})
          </button>
        ))}
      </div>

      {/* Products Tab */}
      {tab === 'products' && (
        <div>
          <div className="flex justify-end mb-6">
            <button
              onClick={() => { setEditProduct(null); setShowModal(true) }}
              className="btn-primary text-sm"
            >
              + Add Product
            </button>
          </div>
          {products.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No products yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Price</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Stock</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Featured</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p._id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">{p.name}</td>
                      <td className="py-3 px-4 text-gray-500">{p.category}</td>
                      <td className="py-3 px-4">${p.price.toFixed(2)}</td>
                      <td className="py-3 px-4">{p.stock}</td>
                      <td className="py-3 px-4">{p.featured ? '✓' : '—'}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-3">
                          <button
                            onClick={() => { setEditProduct(p); setShowModal(true) }}
                            className="text-blue-600 hover:underline"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteProduct(p._id)}
                            className="text-red-500 hover:underline"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Orders Tab */}
      {tab === 'orders' && (
        <div>
          {orders.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No orders yet.</p>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order._id} className="border border-gray-100 p-6 hover:shadow-sm transition-shadow">
                  <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                    <div>
                      <p className="font-semibold">{order.shipping?.name}</p>
                      <p className="text-sm text-gray-500">{order.shipping?.email}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs px-2 py-1 rounded font-medium ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-600'}`}>
                        {order.status}
                      </span>
                      <p className="text-sm font-bold mt-1">${order.total?.toFixed(2)}</p>
                    </div>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    {order.items?.map((item, i) => (
                      <p key={i}>{item.name} × {item.quantity} ({item.size}) — ${(item.price * item.quantity).toFixed(2)}</p>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400 mt-3">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Product Modal */}
      {showModal && (
        <ProductModal
          product={editProduct}
          onClose={() => { setShowModal(false); setEditProduct(null) }}
          onSave={() => { setShowModal(false); setEditProduct(null); fetchProducts() }}
        />
      )}
    </div>
  )
}
