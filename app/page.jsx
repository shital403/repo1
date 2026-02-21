import Link from 'next/link'
import ProductCard from '@/components/ProductCard'

async function getFeaturedProducts() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/products?featured=true`, { cache: 'no-store' })
    if (!res.ok) return []
    return res.json()
  } catch {
    return []
  }
}

export default async function HomePage() {
  const featured = await getFeaturedProducts()

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-beige min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-beige via-white to-beige opacity-80" />
        <div className="relative text-center px-4 max-w-4xl mx-auto">
          <p className="text-sm tracking-[0.3em] text-gray-500 uppercase mb-6">New Collection 2024</p>
          <h1 className="text-6xl md:text-8xl lg:text-9xl font-bold tracking-tight text-dark mb-6">
            LUXE
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light mb-10 tracking-wide">
            Modern Fashion for the Bold
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/shop" className="btn-primary inline-block text-center tracking-widest text-sm">
              SHOP NOW
            </Link>
            <Link href="/shop?category=New+Arrivals" className="btn-outline inline-block text-center tracking-widest text-sm">
              NEW ARRIVALS
            </Link>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-400">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-center mb-12 tracking-wider">SHOP BY CATEGORY</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Men', href: '/shop?category=Men', bg: 'bg-gray-100' },
            { label: 'Women', href: '/shop?category=Women', bg: 'bg-rose-50' },
            { label: 'New Arrivals', href: '/shop?category=New+Arrivals', bg: 'bg-emerald-50' },
          ].map(cat => (
            <Link
              key={cat.label}
              href={cat.href}
              className={`${cat.bg} aspect-[4/3] flex flex-col items-center justify-center hover:opacity-90 transition-opacity group`}
            >
              <span className="text-2xl font-bold tracking-wider group-hover:tracking-widest transition-all duration-300">
                {cat.label.toUpperCase()}
              </span>
              <span className="text-sm text-gray-500 mt-2 tracking-widest">Shop →</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      {featured.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <h2 className="text-2xl font-bold tracking-wider">FEATURED</h2>
              <Link href="/shop" className="text-sm text-gray-500 hover:text-dark transition-colors tracking-widest">
                View All →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {featured.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Brand Statement */}
      <section className="bg-dark text-white py-24">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold leading-tight mb-6">
            Wear Your Confidence
          </h2>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            Every piece in our collection is designed with precision and crafted for those who refuse to blend in.
          </p>
          <Link href="/shop" className="inline-block bg-white text-dark px-8 py-4 font-medium tracking-widest text-sm hover:bg-beige transition-colors">
            EXPLORE COLLECTION
          </Link>
        </div>
      </section>
    </div>
  )
}
