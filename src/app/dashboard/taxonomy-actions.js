"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongodb"
import Category from "@/models/Category"
import Brand from "@/models/Brand"
import Tag from "@/models/Tag"
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

// Category/Brand/Tag are public read data — the storefront filter bar and every
// seller's product form need this list, not just admins. Only create/update/delete
// are admin-gated below.
//
// `getCount(doc)` computes each row's "Total Products" — Category/Brand count by
// ObjectId reference; Tag counts by name (Product.tags is a plain string array,
// not a reference to this Tag collection — see getTags() below).
async function listAllWithCounts(Model, getCount) {
  try {
    await dbConnect()
    const docs = await Model.find({}).sort({ name: 1 }).lean()
    return await Promise.all(
      docs.map(async (doc) => ({ ...serialize(doc), productCount: await getCount(doc) }))
    )
  } catch (error) {
    console.error("Failed to fetch list:", error)
    return []
  }
}

function readEntryFields(formData) {
  return {
    name: formData.get("name"),
    image: formData.get("image") || "",
    status: formData.get("status") !== "false", // default true unless explicitly "false"
  }
}

async function createEntry(Model, label, { name, image, status }) {
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
    await Model.create({ name: name.trim(), slug: slugify(name), image, status })
    return { success: true, message: `${label} created.` }
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: `A ${label.toLowerCase()} with that name already exists.` }
    }
    console.error(`Failed to create ${label}:`, error)
    return { success: false, message: `Failed to create ${label.toLowerCase()}. Please try again.` }
  }
}

async function updateEntry(Model, label, id, { name, image, status }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: `Only admins can manage ${label.toLowerCase()}s.` }
  }
  if (!name || !name.trim()) {
    return { success: false, message: "Name is required." }
  }

  try {
    await dbConnect()
    const updated = await Model.findByIdAndUpdate(
      id,
      { name: name.trim(), slug: slugify(name), image, status },
      { new: true, runValidators: true }
    )
    if (!updated) {
      return { success: false, message: `${label} not found.` }
    }
    return { success: true, message: `${label} updated.` }
  } catch (error) {
    if (error.code === 11000) {
      return { success: false, message: `A ${label.toLowerCase()} with that name already exists.` }
    }
    console.error(`Failed to update ${label}:`, error)
    return { success: false, message: `Failed to update ${label.toLowerCase()}. Please try again.` }
  }
}

async function toggleStatus(Model, label, id) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: `Only admins can manage ${label.toLowerCase()}s.` }
  }

  try {
    await dbConnect()
    const doc = await Model.findById(id)
    if (!doc) {
      return { success: false, message: `${label} not found.` }
    }
    doc.status = !doc.status
    await doc.save()
    return { success: true, message: `${label} ${doc.status ? "activated" : "deactivated"}.` }
  } catch (error) {
    console.error(`Failed to toggle ${label} status:`, error)
    return { success: false, message: `Failed to update ${label.toLowerCase()}.` }
  }
}

// `productField` is the Product schema path referencing this entity (e.g. "category") —
// pass null when nothing on Product references it yet, which skips the in-use check.
async function deleteEntry(Model, label, id, productField) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || session.user.role !== "admin") {
    return { success: false, message: `Only admins can manage ${label.toLowerCase()}s.` }
  }

  try {
    await dbConnect()
    if (productField) {
      const inUse = await Product.exists({ [productField]: id })
      if (inUse) {
        return {
          success: false,
          message: `Can't delete — still used by one or more products.`,
        }
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

function revalidateTaxonomyPaths(dashboardPath) {
  revalidatePath(dashboardPath)
  revalidatePath("/dashboard/create")
  revalidatePath("/service")
}

// ---- Category ----

export async function getCategories() {
  return listAllWithCounts(Category, (doc) => Product.countDocuments({ category: doc._id }))
}

export async function createCategory(prevState, formData) {
  const result = await createEntry(Category, "Category", readEntryFields(formData))
  if (result.success) revalidateTaxonomyPaths("/dashboard/categories")
  return result
}

export async function updateCategory(id, prevState, formData) {
  const result = await updateEntry(Category, "Category", id, readEntryFields(formData))
  if (result.success) revalidateTaxonomyPaths("/dashboard/categories")
  return result
}

export async function toggleCategoryStatus(id) {
  const result = await toggleStatus(Category, "Category", id)
  if (result.success) revalidatePath("/dashboard/categories")
  return result
}

export async function deleteCategory(id) {
  const result = await deleteEntry(Category, "Category", id, "category")
  if (result.success) revalidatePath("/dashboard/categories")
  return result
}

// ---- Brand ----

export async function getBrands() {
  return listAllWithCounts(Brand, (doc) => Product.countDocuments({ brand: doc._id }))
}

export async function createBrand(prevState, formData) {
  const result = await createEntry(Brand, "Brand", readEntryFields(formData))
  if (result.success) revalidateTaxonomyPaths("/dashboard/brands")
  return result
}

export async function updateBrand(id, prevState, formData) {
  const result = await updateEntry(Brand, "Brand", id, readEntryFields(formData))
  if (result.success) revalidateTaxonomyPaths("/dashboard/brands")
  return result
}

export async function toggleBrandStatus(id) {
  const result = await toggleStatus(Brand, "Brand", id)
  if (result.success) revalidatePath("/dashboard/brands")
  return result
}

export async function deleteBrand(id) {
  const result = await deleteEntry(Brand, "Brand", id, "brand")
  if (result.success) revalidatePath("/dashboard/brands")
  return result
}

// ---- Tag ----
// Product.tags is a free-text [String] array (sellers type tags directly on the
// product form), not a reference to this Tag collection — so "in use" and
// "Total Products" match by name here, not by _id.

export async function getTags() {
  return listAllWithCounts(Tag, (doc) => Product.countDocuments({ tags: doc.name }))
}

export async function createTag(prevState, formData) {
  const result = await createEntry(Tag, "Tag", readEntryFields(formData))
  if (result.success) revalidatePath("/dashboard/tags")
  return result
}

export async function updateTag(id, prevState, formData) {
  const result = await updateEntry(Tag, "Tag", id, readEntryFields(formData))
  if (result.success) revalidatePath("/dashboard/tags")
  return result
}

export async function toggleTagStatus(id) {
  const result = await toggleStatus(Tag, "Tag", id)
  if (result.success) revalidatePath("/dashboard/tags")
  return result
}

export async function deleteTag(id) {
  // No Product field references Tag _id (see note above), so nothing to guard against.
  const result = await deleteEntry(Tag, "Tag", id, null)
  if (result.success) revalidatePath("/dashboard/tags")
  return result
}
