import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { getAuthUser } from '@/lib/auth'

export async function GET(request, { params }) {
  try {
    await connectDB()
    const product = await Product.findById(params.id)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function PUT(request, { params }) {
  try {
    const user = getAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const data = await request.json()
    const product = await Product.findByIdAndUpdate(params.id, data, { new: true, runValidators: true })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function DELETE(request, { params }) {
  try {
    const user = getAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    await connectDB()
    const product = await Product.findByIdAndDelete(params.id)
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json({ message: 'Product deleted' })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
