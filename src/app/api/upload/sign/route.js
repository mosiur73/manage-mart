import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import cloudinary from "@/lib/cloudinary"

const SELLER_ROLES = ["seller", "admin"]

// Signs an upload request so the browser can talk directly to Cloudinary without
// ever seeing CLOUDINARY_API_SECRET. The client then POSTs the file straight to
// Cloudinary using this signature — our server never touches the file bytes.
export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return NextResponse.json({ message: "Only sellers can upload product images." }, { status: 403 })
  }

  const timestamp = Math.round(Date.now() / 1000)
  const folder = "manage-mart/products"

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder },
    process.env.CLOUDINARY_API_SECRET
  )

  return NextResponse.json({
    timestamp,
    signature,
    folder,
    apiKey: process.env.CLOUDINARY_API_KEY,
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
  })
}
