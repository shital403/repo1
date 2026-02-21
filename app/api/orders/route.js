import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Order from '@/models/Order'
import { getAuthUser } from '@/lib/auth'

export async function POST(request) {
  try {
    await connectDB()
    const data = await request.json()
    const user = getAuthUser(request)
    if (user) data.user = user.id
    const order = await Order.create(data)
    return NextResponse.json(order, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function GET(request) {
  try {
    const user = getAuthUser(request)
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    await connectDB()
    let orders
    if (user.role === 'admin') {
      orders = await Order.find().sort({ createdAt: -1 }).populate('user', 'name email')
    } else {
      orders = await Order.find({ user: user.id }).sort({ createdAt: -1 })
    }
    return NextResponse.json(orders)
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
