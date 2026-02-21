import mongoose from 'mongoose'

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  category: { type: String, enum: ['Men', 'Women', 'New Arrivals'], required: true },
  images: [{ type: String }],
  sizes: [{ type: String, enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }],
  stock: { type: Number, default: 0, min: 0 },
  featured: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
})

export default mongoose.models.Product || mongoose.model('Product', ProductSchema)
