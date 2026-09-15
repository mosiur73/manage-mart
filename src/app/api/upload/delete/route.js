import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary, { extractCloudinaryPublicId } from "@/lib/cloudinary"

const SELLER_ROLES = ["seller", "admin"]

// Best-effort cleanup for a single image removed from a product form — see
// IMPLEMENTATION_PLAN.md Phase 5 for when callers are/aren't safe to invoke this.
export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Only sellers can manage product images." }, { status: 403 })
  }

  const { url } = await req.json()
  const publicId = extractCloudinaryPublicId(url)
  if (!publicId) {
    return NextResponse.json({ message: "Could not resolve a Cloudinary asset for that URL." }, { status: 400 })
  }

  try {
    await cloudinary.uploader.destroy(publicId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Cloudinary destroy failed:", error)
    return NextResponse.json({ message: "Failed to delete image." }, { status: 500 })
  }
}
