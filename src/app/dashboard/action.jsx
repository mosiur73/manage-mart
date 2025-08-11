"use server"

import dbConnect from "@/lib/mongodb"
import Post from "@/models/post"
import { revalidatePath } from "next/cache"
import { z } from "zod"

// Define Zod schema for validation
const postSchema = z.object({
  title: z.string().min(1, "Title is required").max(60, "Title cannot exceed 60 characters"),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9-]+$/, "Slug must be lowercase alphanumeric with hyphens"),
  content: z.string().min(1, "Content is required"),
})

/**
 * Fetches all posts from the database.
 * @returns {Promise<Array<Object>>} An array of post objects.
 */
export async function getPosts() {
  try {
    await dbConnect() // Ensure connection is established
    const posts = await Post.find({}).sort({ createdAt: -1 }).lean()
    // Convert _id to string for client-side compatibility
    return posts.map((post) => ({
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }))
  } catch (error) {
    console.error("Failed to fetch posts:", error) // This will log the specific error
    return []
  }
}

/**
 * Creates a new post.
 * @param {Object} prevState - The previous state from useActionState.
 * @param {FormData} formData - The form data.
 * @returns {Promise<{ success: boolean, message: string, errors?: Object }>}
 */
export async function createPost(prevState, formData) {
  try {
    await dbConnect() // Ensure connection is established
  } catch (dbError) {
    console.error("Database connection failed during createPost:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, slug, content } = validatedFields.data

  try {
    if (!Post) {
      console.error("Post model is undefined before create operation.")
      return { success: false, message: "Internal server error: Post model not loaded." }
    }
    await Post.create({ title, slug, content })
    revalidatePath("/dashboard") // Revalidate the dashboard page to show new post
    return { success: true, message: "Post created successfully!" }
  } catch (error) {
    console.error("Failed to create post in DB:", error) // This will log the specific database error
    if (error.code === 11000) {
      // Duplicate key error for slug
      return {
        success: false,
        message: "Slug already exists. Please choose a different one.",
        errors: { slug: ["Slug already exists."] },
      }
    }
    return { success: false, message: "Failed to create post. Please try again." }
  }
}

/**
 * Updates an existing post.
 * @param {string} id - The ID of the post to update.
 * @param {Object} prevState - The previous state from useActionState.
 * @param {FormData} formData - The form data.
 * @returns {Promise<{ success: boolean, message: string, errors?: Object }>}
 */
export async function updatePost(id, prevState, formData) {
  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during updatePost:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }

  const validatedFields = postSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug"),
    content: formData.get("content"),
  })

  if (!validatedFields.success) {
    return {
      success: false,
      message: "Validation failed.",
      errors: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { title, slug, content } = validatedFields.data

  try {
    if (!Post) {
      console.error("Post model is undefined before update operation.")
      return { success: false, message: "Internal server error: Post model not loaded." }
    }
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, slug, content, updatedAt: Date.now() },
      { new: true, runValidators: true },
    )

    if (!updatedPost) {
      return { success: false, message: "Post not found." }
    }

    revalidatePath("/dashboard") // Revalidate the dashboard page
    revalidatePath(`/post/${slug}`) // Revalidate the specific post page
    return { success: true, message: "Post updated successfully!" }
  } catch (error) {
    console.error("Failed to update post in DB:", error)
    if (error.code === 11000) {
      // Duplicate key error for slug
      return {
        success: false,
        message: "Slug already exists. Please choose a different one.",
        errors: { slug: ["Slug already exists."] },
      }
    }
    return { success: false, message: "Failed to update post. Please try again." }
  }
}

/**
 * Deletes a post.
 * @param {string} id - The ID of the post to delete.
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export async function deletePost(id) {
  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during deletePost:", dbError)
    return { success: false, message: "Database connection error. Please check MONGODB_URI." }
  }
  try {
    if (!Post) {
      console.error("Post model is undefined before delete operation.")
      return { success: false, message: "Internal server error: Post model not loaded." }
    }
    const deletedPost = await Post.findByIdAndDelete(id)
    if (!deletedPost) {
      return { success: false, message: "Post not found." }
    }
    revalidatePath("/dashboard") // Revalidate the dashboard page
    return { success: true, message: "Post deleted successfully!" }
  } catch (error) {
    console.error("Failed to delete post in DB:", error)
    return { success: false, message: "Failed to delete post. Please try again." }
  }
}

/**
 * Fetches a single post by slug.
 * @param {string} slug - The slug of the post.
 * @returns {Promise<Object|null>} The post object or null if not found.
 */
export async function getPostBySlug(slug) {
  try {
    await dbConnect()
  } catch (dbError) {
    console.error("Database connection failed during getPostBySlug:", dbError)
    return null // Or throw an error to be caught by an error boundary
  }
  try {
    if (!Post) {
      console.error("Post model is undefined before get by slug operation.")
      return null // Or throw an error
    }
    console.log(`Attempting to fetch post with slug: "${slug}"`) // Debug log
    const post = await Post.findOne({ slug }).lean()
    console.log(`Result for slug "${slug}":`, post ? "Found" : "Not Found") // Debug log
    if (!post) return null
    return {
      ...post,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    }
  } catch (error) {
    console.error("Failed to fetch post by slug in DB:", error)
    return null
  }
}
