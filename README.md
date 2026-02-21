# LUXE — Modern Fashion E-Commerce

A full-stack e-commerce platform for a clothing brand built with Next.js 14 (App Router), Tailwind CSS, MongoDB/Mongoose, Stripe, and JWT authentication.

---

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS
- **Database**: MongoDB with Mongoose
- **Payments**: Stripe (test mode)
- **Auth**: JWT (jsonwebtoken) + bcryptjs
- **HTTP Client**: Axios

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd luxe-store
npm install
```

### 2. Environment Variables

Copy the example env file and fill in your values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/luxe-store
JWT_SECRET=your-super-secret-jwt-key-here
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP (or use `0.0.0.0/0` for development)
5. Get the connection string and add it to `MONGODB_URI`
6. Create a database named `luxe-store`

### 4. Stripe Setup

1. Create a [Stripe account](https://stripe.com)
2. Go to Developers → API Keys
3. Copy your **Publishable key** (`pk_test_...`) and **Secret key** (`sk_test_...`)
4. Add them to your `.env.local`
5. For webhooks (optional for local dev):
   - Install [Stripe CLI](https://stripe.com/docs/stripe-cli)
   - Run: `stripe listen --forward-to localhost:3000/api/stripe/webhook`
   - Copy the webhook secret to `STRIPE_WEBHOOK_SECRET`

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Admin Setup

To make a user an admin:

1. Register an account normally at `/register`
2. Open MongoDB Atlas and go to your `luxe-store` database
3. Find the `users` collection and locate your user document
4. Change the `role` field from `"user"` to `"admin"`
5. Log out and log back in
6. You will now see the Admin link in the navbar and can access `/admin`

Alternatively, using the MongoDB shell:
```js
db.users.updateOne({ email: "your@email.com" }, { $set: { role: "admin" } })
```

---

## Seeding Sample Products

1. Log in as an admin
2. Navigate to `/admin`
3. Click **"+ Add Product"**
4. Fill in the product details (name, description, price, category, sizes, stock)
5. Check "Featured product" to show it on the homepage

### Sample Products to Add

| Name | Category | Price | Sizes | Stock | Featured |
|------|----------|-------|-------|-------|----------|
| Classic White Tee | Men | 29.99 | S,M,L,XL | 50 | Yes |
| Slim Fit Chinos | Men | 79.99 | S,M,L,XL | 30 | No |
| Floral Summer Dress | Women | 89.99 | XS,S,M,L | 25 | Yes |
| Tailored Blazer | Women | 149.99 | S,M,L | 15 | Yes |
| Oversized Hoodie | New Arrivals | 69.99 | S,M,L,XL | 40 | Yes |

---

## Project Structure

```
app/
├── layout.jsx              # Root layout with Navbar, Footer, CartProvider
├── page.jsx                # Home page with hero, categories, featured products
├── globals.css             # Global styles and Tailwind directives
├── shop/page.jsx           # Shop with search and category filters
├── product/[id]/page.jsx   # Product detail page
├── cart/page.jsx           # Shopping cart
├── checkout/page.jsx       # Checkout with Stripe payment
├── login/page.jsx          # Login form
├── register/page.jsx       # Registration form
├── admin/page.jsx          # Admin panel (products + orders)
└── api/
    ├── auth/login/route.js
    ├── auth/register/route.js
    ├── products/route.js
    ├── products/[id]/route.js
    ├── orders/route.js
    ├── stripe/create-payment-intent/route.js
    └── stripe/webhook/route.js

components/
├── Navbar.jsx              # Sticky navbar with cart badge
├── Footer.jsx              # Site footer
├── ProductCard.jsx         # Product grid card
└── CartItem.jsx            # Cart line item

context/
└── CartContext.jsx         # Cart state (localStorage persisted)

lib/
├── mongodb.js              # Mongoose connection helper
└── auth.js                 # JWT sign/verify helpers

models/
├── User.js                 # User schema
├── Product.js              # Product schema
└── Order.js                # Order schema
```

---

## API Routes

### Authentication

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account, returns JWT |
| POST | `/api/auth/login` | Login, returns JWT |

### Products

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/products` | Public | List all products. Query params: `category`, `search`, `featured=true` |
| POST | `/api/products` | Admin | Create product |
| GET | `/api/products/[id]` | Public | Get single product |
| PUT | `/api/products/[id]` | Admin | Update product |
| DELETE | `/api/products/[id]` | Admin | Delete product |

### Orders

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| POST | `/api/orders` | Optional | Create order |
| GET | `/api/orders` | Required | Admin: all orders; User: own orders |

### Stripe

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/stripe/create-payment-intent` | Create Stripe payment intent |
| POST | `/api/stripe/webhook` | Stripe webhook handler |

---

## Database Schema

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: 'user' | 'admin',
  createdAt: Date
}
```

### Product
```js
{
  name: String,
  description: String,
  price: Number,
  category: 'Men' | 'Women' | 'New Arrivals',
  images: [String],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  stock: Number,
  featured: Boolean,
  createdAt: Date
}
```

### Order
```js
{
  user: ObjectId (ref: User),
  items: [{ productId, name, price, quantity, size }],
  shipping: { name, email, phone, address },
  total: Number,
  paymentIntentId: String,
  status: 'pending' | 'paid' | 'shipped' | 'delivered',
  createdAt: Date
}
```

---

## Testing Stripe Payments

Use Stripe's test card numbers:

| Card | Number | Result |
|------|--------|--------|
| Visa | 4242 4242 4242 4242 | Success |
| Visa (decline) | 4000 0000 0000 0002 | Declined |
| 3D Secure | 4000 0025 0000 3155 | Requires auth |

Use any future expiry date, any 3-digit CVC, and any ZIP code.

---

## Build for Production

```bash
npm run build
npm start
```

---

## License

MIT
