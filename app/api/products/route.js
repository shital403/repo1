import { NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Product from '@/models/Product'
import { getAuthUser } from '@/lib/auth'

export async function GET(request) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const featured = searchParams.get('featured')

    const query = {}
    if (category && category !== 'All') query.category = category
    if (featured === 'true') query.featured = true
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ]
    }

    const products = await Product.find(query).sort({ createdAt: -1 })
    return NextResponse.json(products)
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    const user = getAuthUser(request)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()
    const data = await request.json()
    const product = await Product.create(data)
    return NextResponse.json(product, { status: 201 })
  } catch (err) {
    return NextResponse.json({ error: err.message || 'Server error' }, { status: 500 })
  }
}
