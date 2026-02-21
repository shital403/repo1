import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-dark text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-2xl font-bold tracking-widest mb-4">LUXE</h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
              Modern fashion for the bold. Crafted with care, designed for those who move through life with intention.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-4">Shop</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/shop" className="hover:text-white transition-colors">All Products</Link></li>
              <li><Link href="/shop?category=Men" className="hover:text-white transition-colors">Men</Link></li>
              <li><Link href="/shop?category=Women" className="hover:text-white transition-colors">Women</Link></li>
              <li><Link href="/shop?category=New+Arrivals" className="hover:text-white transition-colors">New Arrivals</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-sm tracking-wider uppercase mb-4">Account</h3>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/register" className="hover:text-white transition-colors">Register</Link></li>
              <li><Link href="/cart" className="hover:text-white transition-colors">Cart</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LUXE. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
