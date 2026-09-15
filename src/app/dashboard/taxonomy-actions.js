"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongodb"
import Category from "@/models/Category"
import Brand from "@/models/Brand"
import Product from "@/models/Product"

function slugify(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "")
}

function serialize(doc) {
  return {
    ...doc,
    _id: doc._id.toString(),
    createdAt: doc.createdAt?.toISOString?.() ?? doc.createdAt,
    updatedAt: doc.updatedAt?.toISOString?.() ?? doc.updatedAt,
  }
}

// Category/Brand are public read data — the storefront filter bar and every
// seller's product form need this list, not just admins. Only create/delete
// are admin-gated below.
async function listAll(Model) {
  try {
    await dbConnect()
    const docs = await Model.find({}).sort({ name: 1 }).lean()
    return docs.map(serialize)
  } catch (error) {
    console.error("Failed to fetch list:", error)
    return []
  }
}

async function createEntry(Model, label, name) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." }
  }
  if (session.user.role !== "admin") {
    return { success: false, message: `Only admins can manage ${label.toLowerCase()}s.` }
  }
  if (!name || !name.trim()) {
    return { success: false, message: "Name is required." }
  }

  try {
    await dbConnect()
    await Model.create({ name: name.trim(), slug: slugify(name) })
    return { success: true, message: `${label} created.` }
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: `A ${label.toLowerCase()} with that name already exists.` }
    }
    console.error(`Failed to create ${label}:`, error)
    return { success: false, message: `Failed to create ${label.toLowerCase()}. Please try again.` }
  }
}

async function deleteEntry(Model, label, id, productField) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: `Only admins can manage ${label.toLowerCase()}s.` }
  }

  try {
    await dbConnect()
    const inUse = await Product.exists({ [productField]: id })
    if (inUse) {
      return {
        success: false,
        message: `Can't delete — still used by one or more products.`,
      }
    }
    const deleted = await Model.findByIdAndDelete(id)
    if (!deleted) {
      return { success: false, message: `${label} not found.` }
    }
    return { success: true, message: `${label} deleted.` }
  } catch (error) {
    console.error(`Failed to delete ${label}:`, error)
    return { success: false, message: `Failed to delete ${label.toLowerCase()}.` }
  }
}

export async function getCategories() {
  return listAll(Category)
}

export async function createCategory(prevState, formData) {
  const result = await createEntry(Category, "Category", formData.get("name"))
  if (result.success) {
    revalidatePath("/dashboard/categories")
    revalidatePath("/dashboard/create")
    revalidatePath("/service")
  }
  return result
}

export async function deleteCategory(id) {
  const result = await deleteEntry(Category, "Category", id, "category")
  if (result.success) {
    revalidatePath("/dashboard/categories")
  }
  return result
}

export async function getBrands() {
  return listAll(Brand)
}

export async function createBrand(prevState, formData) {
  const result = await createEntry(Brand, "Brand", formData.get("name"))
  if (result.success) {
    revalidatePath("/dashboard/brands")
    revalidatePath("/dashboard/create")
    revalidatePath("/service")
  }
  return result
}

export async function deleteBrand(id) {
  const result = await deleteEntry(Brand, "Brand", id, "brand")
  if (result.success) {
    revalidatePath("/dashboard/brands")
  }
  return result
}
