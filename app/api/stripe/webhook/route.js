import { NextResponse } from 'next/server'
import Stripe from 'stripe'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })

export async function POST(request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  let event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (err) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 })
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object
    try {
      await connectDB()
      await Order.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'paid' }
      )
    } catch (err) {
      console.error('Error updating order status:', err)
    }
  }

  return NextResponse.json({ received: true })
}
