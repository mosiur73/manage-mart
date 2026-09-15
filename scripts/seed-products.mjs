// One-off seed script: imports public/product.json into the MongoDB `products`
// collection so the DB-backed storefront isn't empty on first run.
//
// Usage:
//   node scripts/seed-products.mjs
//
// Requires MONGODB_URI (and friends) in .env.local, same as the Next.js app.

import { readFile } from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import mongoose from "mongoose"
import bcrypt from "bcryptjs"
import Product from "../src/models/Product.js"
import Category from "../src/models/Category.js"
import Brand from "../src/models/Brand.js"
import User from "../src/models/User.js"

const __dirname = path.dirname(fileURLToPath(import.meta.url))

try {
  process.loadEnvFile(path.join(__dirname, "..", ".env.local"))
} catch {
  // .env.local not found — fall back to whatever is already in process.env
}

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  console.error("Missing MONGODB_URI. Add it to .env.local before seeding.")
  process.exit(1)
}

function slugify(name, id) {
  const base = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
  return id ? `${base}-${id}` : base
}

async function getOrCreateSeedSeller() {
  const email = "seed-seller@managemart.local"
  let seller = await User.findOne({ email })
  if (seller) return seller

  const password = await bcrypt.hash(crypto.randomUUID(), 10)
  seller = await User.create({
    name: "Adidas (Seed Store)",
    email,
    password,
    role: "seller",
  })
  console.log(`Created placeholder seller user: ${email}`)
  return seller
}

// product.json's "seller" field (e.g. "Adidas") is really the manufacturer brand,
// not a marketplace vendor account — the vendor is the single seed-seller User
// above. Every distinct name becomes a Brand; every distinct "category" becomes
// a Category. Both are upserted by slug, so re-running this script is safe.
async function getOrCreateTaxonomy(Model, name) {
  const slug = slugify(name)
  return Model.findOneAndUpdate(
    { slug },
    { $setOnInsert: { name, slug } },
    { upsert: true, new: true }
  )
}

async function main() {
  await mongoose.connect(MONGODB_URI)
  console.log("Connected to MongoDB")

  const seller = await getOrCreateSeedSeller()

  const jsonPath = path.join(__dirname, "..", "public", "product.json")
  const raw = await readFile(jsonPath, "utf-8")
  const products = JSON.parse(raw)

  const categoryCache = new Map()
  const brandCache = new Map()

  async function categoryIdFor(name) {
    if (!categoryCache.has(name)) {
      const doc = await getOrCreateTaxonomy(Category, name)
      categoryCache.set(name, doc._id)
    }
    return categoryCache.get(name)
  }

  async function brandIdFor(name) {
    if (!brandCache.has(name)) {
      const doc = await getOrCreateTaxonomy(Brand, name)
      brandCache.set(name, doc._id)
    }
    return brandCache.get(name)
  }

  let created = 0
  let updated = 0

  for (const p of products) {
    const slug = slugify(p.name, p.id)
    const [categoryId, brandId] = await Promise.all([
      categoryIdFor(p.category),
      brandIdFor(p.seller),
    ])

    const data = {
      name: p.name,
      slug,
      description: p.description,
      price: p.price,
      category: categoryId,
      brand: brandId,
      images: [p.img],
      stock: p.stock,
      shipping: p.shipping ?? 0,
      ratings: p.ratings ?? 0,
      ratingsCount: p.ratingsCount ?? 0,
      seller: seller._id,
    }

    const result = await Product.findOneAndUpdate(
      { slug },
      data,
      { upsert: true, new: true, runValidators: true, rawResult: true }
    )

    if (result.lastErrorObject?.updatedExisting) {
      updated++
    } else {
      created++
    }
  }

  console.log(`Seed complete: ${created} created, ${updated} updated (${products.length} total).`)
  console.log(`Categories: ${categoryCache.size}, Brands: ${brandCache.size}`)
  await mongoose.disconnect()
}

main().catch((error) => {
  console.error("Seed failed:", error)
  process.exit(1)
})
