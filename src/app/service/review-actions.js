"use server"

import mongoose from "mongoose"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongodb"
import Review from "@/models/Review"
import Order from "@/models/Order"
import Product from "@/models/Product"

function serializeReview(review) {
  return {
    ...review,
    _id: review._id.toString(),
    product: review.product?.toString?.() ?? review.product,
    user: review.user?.toString?.() ?? review.user,
    order: review.order?.toString?.() ?? review.order,
    createdAt: review.createdAt?.toISOString?.() ?? review.createdAt,
    updatedAt: review.updatedAt?.toISOString?.() ?? review.updatedAt,
  }
}

/**
 * Recomputes Product.ratings (average) and Product.ratingsCount from the Review
 * collection, so the star display on ProductCard/detail stays in sync with reality
 * instead of the static numbers `public/product.json` seeded them with.
 */
async function recomputeProductRating(productId) {
  const agg = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    { $group: { _id: null, avg: { $avg: "$rating" }, count: { $sum: 1 } } },
  ])
  const ratings = agg[0] ? Math.round(agg[0].avg * 10) / 10 : 0
  const ratingsCount = agg[0]?.count ?? 0
  await Product.findByIdAndUpdate(productId, { ratings, ratingsCount })
}

/**
 * Public — all reviews for a product, newest first.
 */
export async function getProductReviews(productId) {
  try {
    await dbConnect()
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).lean()
    return reviews.map(serializeReview)
  } catch (error) {
    console.error("Failed to fetch reviews:", error)
    return []
  }
}

/**
 * Tells the product page what to show in the review-form slot: a form, "already
 * reviewed" (with their existing review so it can offer edit/delete), "you haven't
 * bought this," or "sign in first."
 */
export async function getReviewGate(productId) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { status: "signed-out" }
  }

  try {
    await dbConnect()
    const existing = await Review.findOne({ product: productId, user: session.user.id }).lean()
    if (existing) {
      return { status: "already-reviewed", review: serializeReview(existing) }
    }

    const hasPurchased = await Order.exists({
      user: session.user.id,
      status: { $in: ["paid", "shipped"] },
      "items.product": productId,
    })
    if (!hasPurchased) {
      return { status: "not-purchased" }
    }

    return { status: "can-review" }
  } catch (error) {
    console.error("Failed to compute review gate:", error)
    return { status: "not-purchased" }
  }
}

export async function createReview({ productId, rating, comment }) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in to write a review." }
  }

  const ratingNum = Number(rating)
  if (!Number.isInteger(ratingNum) || ratingNum < 1 || ratingNum > 5) {
    return { success: false, message: "Pick a rating between 1 and 5 stars." }
  }

  try {
    await dbConnect()

    // Verified-purchase gate, enforced again here (not just in the UI) — the whole
    // point of a "verified" review is that this can't be bypassed client-side.
    const order = await Order.findOne({
      user: session.user.id,
      status: { $in: ["paid", "shipped"] },
      "items.product": productId,
    }).sort({ createdAt: -1 })

    if (!order) {
      return { success: false, message: "You can only review products you've purchased." }
    }

    await Review.create({
      product: productId,
      user: session.user.id,
      order: order._id,
      rating: ratingNum,
      comment: comment?.trim().slice(0, 2000) || "",
      userName: session.user.name,
    })

    await recomputeProductRating(productId)

    revalidatePath(`/service/${productId}`)
    return { success: true, message: "Review submitted. Thanks!" }
  } catch (error) {
    console.error("Failed to create review:", error)
    if (error.code === 11000) {
      return { success: false, message: "You've already reviewed this product." }
    }
    return { success: false, message: "Failed to submit review. Please try again." }
  }
}

export async function deleteReview(reviewId) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." }
  }

  try {
    await dbConnect()
    const review = await Review.findById(reviewId)
    if (!review) {
      return { success: false, message: "Review not found." }
    }
    if (session.user.role !== "admin" && review.user.toString() !== session.user.id) {
      return { success: false, message: "You can only delete your own review." }
    }

    const productId = review.product
    await Review.findByIdAndDelete(reviewId)
    await recomputeProductRating(productId)

    revalidatePath(`/service/${productId.toString()}`)
    return { success: true, message: "Review deleted." }
  } catch (error) {
    console.error("Failed to delete review:", error)
    return { success: false, message: "Failed to delete review." }
  }
}
