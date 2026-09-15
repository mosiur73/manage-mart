"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"

/**
 * Product ids the current session has wishlisted, as a plain string array
 * (server components can't pass a Set as props). Empty for guests.
 */
export async function getWishlistedProductIds() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  try {
    await dbConnect()
    const items = await Wishlist.find({ user: session.user.id }).select("product").lean()
    return items.map((item) => item.product.toString())
  } catch (error) {
    console.error("Failed to fetch wishlist status:", error)
    return []
  }
}
