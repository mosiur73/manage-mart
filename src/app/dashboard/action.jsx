"use server"

import dbConnect from "@/lib/mongodb"
import Product from "@/models/Product"
import Category from "@/models/Category"
import Brand from "@/models/Brand"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import { z } from "zod"

const SELLER_ROLES = ["seller", "admin"]

const productSchema = z.object({
  name: z.string().min(1, "Name is required").max(120, "Name cannot exceed 120 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(160, "Slug cannot exceed 160 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  description: z.string().min(1, "Description is required"),
  price: z.coerce.number().min(0, "Price cannot be negative"),
  category: z.string().min(1, "Category is required"),
  brand: z.string().min(1, "Brand is required"),
  stock: z.coerce.number().min(0, "Stock cannot be negative"),
  shipping: z.coerce.number().min(0, "Shipping cost cannot be negative").default(0),
  images: z.array(z.string().min(1)).min(1, "At least one product image is required"),
})

// category/brand come back as populated {_id, name, slug} sub-documents when
// serializeProduct(populated: true) — pass through as-is; otherwise they're
// bare ObjectIds (e.g. straight off .lean() with no populate), stringified.
function serializeRef(ref) {
  if (!ref) return null
  if (typeof ref === "object" && ref._id) {
    return { _id: ref._id.toString(), name: ref.name, slug: ref.slug }
  }
  return ref.toString?.() ?? ref
}

function serializeProduct(product) {
  return {
    ...product,
    _id: product._id.toString(),
    seller: product.seller?.toString?.() ?? product.seller,
    category: serializeRef(product.category),
    brand: serializeRef(product.brand),
    createdAt: product.createdAt?.toISOString?.() ?? product.createdAt,
    updatedAt: product.updatedAt?.toISOString?.() ?? product.updatedAt,
  }
}

const STOREFRONT_PAGE_SIZE = 12

/**
 * Server-side search/filter/pagination for the public storefront (`/service`).
 * Filtering happens in the DB query, not after loading everything into the browser.
 * `category`/`brand` are Category/Brand `_id` strings (from the filter dropdowns),
 * not names — matching an ObjectId field directly is simpler and more correct than
 * matching by name string.
 */
export async function getStorefrontProducts({ search = "", category = "", brand = "", priceRange = "", page = 1 } = {}) {
  try {
    await dbConnect()

    const filter = {}
    if (search) {
      filter.name = { $regex: search.trim(), $options: "i" }
    }
    if (category) {
      filter.category = category
    }
    if (brand) {
      filter.brand = brand
    }
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        filter.price = { $gte: min, $lte: max }
      }
    }

    const safePage = Math.max(1, Number(page) || 1)
    const skip = (safePage - 1) * STOREFRONT_PAGE_SIZE

    // Only offer categories/brands that currently have at least one product —
    // no point letting someone pick a filter that's guaranteed to show nothing.
    const [products, total, usedCategoryIds, usedBrandIds] = await Promise.all([
      Product.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(STOREFRONT_PAGE_SIZE)
        .populate("category", "name slug")
        .populate("brand", "name slug")
        .lean(),
      Product.countDocuments(filter),
      Product.distinct("category"),
      Product.distinct("brand"),
    ])

    const [categories, brands] = await Promise.all([
      Category.find({ _id: { $in: usedCategoryIds } }).sort({ name: 1 }).lean(),
      Brand.find({ _id: { $in: usedBrandIds } }).sort({ name: 1 }).lean(),
    ])

    return {
      products: products.map(serializeProduct),
      total,
      page: safePage,
      totalPages: Math.max(1, Math.ceil(total / STOREFRONT_PAGE_SIZE)),
      categories: categories.map((c) => ({ _id: c._id.toString(), name: c.name })),
      brands: brands.map((b) => ({ _id: b._id.toString(), name: b.name })),
    }
  } catch (error) {
    console.error("Failed to fetch storefront products:", error)
    return { products: [], total: 0, page: 1, totalPages: 1, categories: [], brands: [] }
  }
}

/**
 * Fetches products for the dashboard — an admin sees everything, a seller only
 * sees their own listings. Callers must already be route-gated to seller/admin
 * (see src/middleware.js); a customer session here simply gets an empty list.
 */
export async function getDashboardProducts() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return []
  }

  try {
    await dbConnect()
    const filter = session.user.role === "admin" ? {} : { seller: session.user.id }
    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .lean()
    return products.map(serializeProduct)
  } catch (error) {
    console.error("Failed to fetch dashboard products:", error)
    return []
  }
}

/**
 * Fetches a single product by its Mongo _id.
 */
export async function getProductById(id) {
  try {
    await dbConnect()
    const product = await Product.findById(id)
      .populate("category", "name slug")
      .populate("brand", "name slug")
      .lean()
    if (!product) return null
    return serializeProduct(product)
  } catch (error) {
    // Includes invalid ObjectId CastErrors
    console.error("Failed to fetch product by id:", error)
    return null
  }
}

/**
 * Creates a new product, owned by the currently signed-in user.
 */
export async function createProduct(prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to create a product." }
  }
  if (!SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "Only sellers can create products." }
  }

  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during createProduct:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    brand: formData.get("brand"),
    stock: formData.get("stock"),
    shipping: formData.get("shipping") || 0,
    images: formData.getAll("images"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    await Product.create({ ...validatedFields.data, seller: session.user.id })
    revalidatePath("/dashboard")
    revalidatePath("/dashboard/products")
    revalidatePath("/service")
    return { success: true, message: "Product created successfully!" }
  } catch (error) {
    console.error("Failed to create product in DB:", error)
    if (error.code === 11000) {
      return {
        success: false,
        message: "Slug already exists. Please choose a different one.",
        errors: { slug: ["Slug already exists."] },
      }
    }
    return { success: false, message: "Failed to create product. Please try again." }
  }
}

/**
 * Updates an existing product.
 */
export async function updateProduct(id, prevState, formData) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to update a product." }
  }
  if (!SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "Only sellers can update products." }
  }

  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during updateProduct:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }

  const validatedFields = productSchema.safeParse({
    name: formData.get("name"),
    slug: formData.get("slug"),
    description: formData.get("description"),
    price: formData.get("price"),
    category: formData.get("category"),
    brand: formData.get("brand"),
    stock: formData.get("stock"),
    shipping: formData.get("shipping") || 0,
    images: formData.getAll("images"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  try {
    const existing = await Product.findById(id)
    if (!existing) {
      return { success: false, message: "Product not found." }
    }
    if (session.user.role !== "admin" && existing.seller.toString() !== session.user.id) {
      return { success: false, message: "You can only edit your own products." }
    }

    const updated = await Product.findByIdAndUpdate(id, validatedFields.data, {
      new: true,
      runValidators: true,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/products")
    revalidatePath("/service")
    revalidatePath(`/service/${updated._id.toString()}`)
    return { success: true, message: "Product updated successfully!" }
  } catch (error) {
    console.error("Failed to update product in DB:", error)
    if (error.code === 11000) {
      return {
        success: false,
        message: "Slug already exists. Please choose a different one.",
        errors: { slug: ["Slug already exists."] },
      }
    }
    return { success: false, message: "Failed to update product. Please try again." }
  }
}

/**
 * Deletes a product.
 */
export async function deleteProduct(id) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to delete a product." }
  }
  if (!SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "Only sellers can delete products." }
  }

  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during deleteProduct:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }

  try {
    const existing = await Product.findById(id)
    if (!existing) {
      return { success: false, message: "Product not found." }
    }
    if (session.user.role !== "admin" && existing.seller.toString() !== session.user.id) {
      return { success: false, message: "You can only delete your own products." }
    }

    await Product.findByIdAndDelete(id)

    // Best-effort Cloudinary cleanup. Dynamically imported so this file's many other
    // exports (getDashboardProducts/getStorefrontProducts, read on every storefront
    // page load) don't inherit a hard CLOUDINARY_* env requirement they have nothing
    // to do with.
    try {
      const { default: cloudinary, extractCloudinaryPublicId } = await import("@/lib/cloudinary")
      await Promise.all(
        (existing.images || [])
          .map(extractCloudinaryPublicId)
          .filter(Boolean)
          .map((publicId) => cloudinary.uploader.destroy(publicId))
      )
    } catch (cleanupError) {
      console.error("Cloudinary cleanup failed for deleted product:", cleanupError)
    }

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/products")
    revalidatePath("/service")
    return { success: true, message: "Product deleted successfully!" }
  } catch (error) {
    console.error("Failed to delete product in DB:", error)
    return { success: false, message: "Failed to delete product. Please try again." }
  }
}
