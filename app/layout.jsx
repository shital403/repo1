import './globals.css'
import { CartProvider } from '@/context/CartContext'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export const metadata = {
  title: 'LUXE — Modern Fashion',
  description: 'Modern fashion for the bold. Shop the latest in men\'s and women\'s clothing.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="font-inter min-h-screen flex flex-col">
        <CartProvider>
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  )
}
