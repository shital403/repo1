'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { useCart } from '@/context/CartContext'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder')

function CheckoutForm({ total, onSuccess }) {
  const stripe = useStripe()
  const elements = useElements()
  const { items, clearCart } = useCart()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' })

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!stripe || !elements) return
    setLoading(true)
    setError('')

    try {
      const { data } = await axios.post('/api/stripe/create-payment-intent', { amount: total })

      const result = await stripe.confirmCardPayment(data.clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: form.name, email: form.email },
        },
      })

      if (result.error) {
        setError(result.error.message)
      } else if (result.paymentIntent.status === 'succeeded') {
        const token = localStorage.getItem('luxe-token')
        await axios.post('/api/orders', {
          items: items.map(item => ({
            productId: item.productId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
          })),
          shipping: form,
          total,
          paymentIntentId: result.paymentIntent.id,
          status: 'paid',
        }, { headers: token ? { Authorization: `Bearer ${token}` } : {} })

        clearCart()
        onSuccess()
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input name="name" value={form.name} onChange={handleChange} required placeholder="John Doe" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input name="email" type="email" value={form.email} onChange={handleChange} required placeholder="john@example.com" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" className="input-field" />
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">Shipping Address</label>
        <textarea name="address" value={form.address} onChange={handleChange} required rows={3} placeholder="123 Main St, City, State, ZIP" className="input-field resize-none" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Card Details</label>
        <div className="border border-gray-300 px-4 py-3 focus-within:border-dark transition-colors">
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#1a1a1a' } } }} />
        </div>
        <p className="text-xs text-gray-400 mt-2">Use test card: 4242 4242 4242 4242</p>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading || !stripe}
        className="w-full bg-dark text-white py-4 font-medium tracking-widest text-sm hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Processing...' : `PAY $${total.toFixed(2)}`}
      </button>
    </form>
  )
}

export default function CheckoutPage() {
  const { items, cartTotal } = useCart()
  const router = useRouter()
  const [success, setSuccess] = useState(false)

  const shipping = cartTotal >= 100 ? 0 : 9.99
  const total = cartTotal + shipping

  useEffect(() => {
    if (items.length === 0 && !success) {
      router.push('/cart')
    }
  }, [items, success, router])

  if (success) {
    return (
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-3">Order Confirmed!</h2>
        <p className="text-gray-500 mb-8">Thank you for your purchase. You'll receive a confirmation email shortly.</p>
        <button onClick={() => router.push('/shop')} className="btn-primary">Continue Shopping</button>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-3xl font-bold tracking-wider mb-10">CHECKOUT</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Form */}
        <div>
          <h2 className="text-lg font-semibold mb-6">Shipping & Payment</h2>
          <Elements stripe={stripePromise}>
            <CheckoutForm total={total} onSuccess={() => setSuccess(true)} />
          </Elements>
        </div>

        {/* Summary */}
        <div>
          <h2 className="text-lg font-semibold mb-6">Order Summary</h2>
          <div className="bg-gray-50 p-6">
            <div className="space-y-3 mb-6">
              {items.map(item => (
                <div key={`${item.productId}-${item.size}`} className="flex justify-between text-sm">
                  <span className="text-gray-700">{item.name} × {item.quantity} <span className="text-gray-400">({item.size})</span></span>
                  <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Shipping</span>
                <span>{shipping === 0 ? <span className="text-green-600">Free</span> : `$${shipping.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between font-bold text-base pt-2 border-t border-gray-200">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
