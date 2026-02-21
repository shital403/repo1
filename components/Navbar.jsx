'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'

export default function Navbar() {
  const { cartCount } = useCart()
  const [menuOpen, setMenuOpen] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('luxe-user')
      if (stored) setUser(JSON.parse(stored))
    } catch {
      localStorage.removeItem('luxe-user')
    }
  }, [])

  function handleLogout() {
    localStorage.removeItem('luxe-token')
    localStorage.removeItem('luxe-user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="text-2xl font-bold tracking-widest text-dark">
            LUXE
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="/" className="text-sm font-medium hover:text-gray-500 transition-colors">Home</Link>
            <Link href="/shop" className="text-sm font-medium hover:text-gray-500 transition-colors">Shop</Link>
            <Link href="/shop?category=Men" className="text-sm font-medium hover:text-gray-500 transition-colors">Men</Link>
            <Link href="/shop?category=Women" className="text-sm font-medium hover:text-gray-500 transition-colors">Women</Link>
          </div>

          {/* Right icons */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {user.role === 'admin' && (
                  <Link href="/admin" className="text-sm font-medium hover:text-gray-500 transition-colors">Admin</Link>
                )}
                <span className="text-sm text-gray-600">Hi, {user.name}</span>
                <button onClick={handleLogout} className="text-sm font-medium hover:text-gray-500 transition-colors">Logout</button>
              </>
            ) : (
              <Link href="/login" className="text-sm font-medium hover:text-gray-500 transition-colors">Login</Link>
            )}
            <Link href="/cart" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile buttons */}
          <div className="md:hidden flex items-center gap-4">
            <Link href="/cart" className="relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-dark text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Link>
            <button onClick={() => setMenuOpen(!menuOpen)} className="p-1">
              {menuOpen ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 px-4 py-4 space-y-3">
          <Link href="/" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Home</Link>
          <Link href="/shop" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Shop</Link>
          <Link href="/shop?category=Men" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Men</Link>
          <Link href="/shop?category=Women" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Women</Link>
          {user ? (
            <>
              {user.role === 'admin' && (
                <Link href="/admin" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Admin</Link>
              )}
              <button onClick={handleLogout} className="block text-sm font-medium py-2 w-full text-left">Logout</button>
            </>
          ) : (
            <Link href="/login" className="block text-sm font-medium py-2" onClick={() => setMenuOpen(false)}>Login</Link>
          )}
        </div>
      )}
    </nav>
  )
}
