import { NextResponse } from "next/server"
import { mkdir, unlink, writeFile } from "node:fs/promises"
import path from "node:path"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import User from "@/models/User"

const MAX_SIZE = 3 * 1024 * 1024 // 3MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"]
const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "avatars")

// Stored locally on disk rather than through the Cloudinary pipeline used for
// product images — that route requires CLOUDINARY_* credentials that aren't
// needed just to let any signed-in user (not only sellers) set an avatar.
export async function POST(request) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "You must be signed in." }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get("file")
  if (!file || typeof file === "string") {
    return NextResponse.json({ message: "No file provided." }, { status: 400 })
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return NextResponse.json({ message: "Only JPEG, PNG, WEBP, or GIF images are allowed." }, { status: 400 })
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ message: "Image must be 3MB or smaller." }, { status: 400 })
  }

  try {
    await dbConnect()
    const user = await User.findById(session.user.id)
    if (!user) {
      return NextResponse.json({ message: "User not found." }, { status: 404 })
    }

    await mkdir(UPLOAD_DIR, { recursive: true })

    const ext = path.extname(file.name) || `.${file.type.split("/")[1]}`
    const filename = `${session.user.id}-${Date.now()}${ext}`
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(UPLOAD_DIR, filename), buffer)

    const url = `/uploads/avatars/${filename}`

    // Best-effort cleanup of the previous locally-stored avatar (not a Google photo URL).
    if (user.image?.startsWith("/uploads/avatars/")) {
      await unlink(path.join(process.cwd(), "public", user.image)).catch(() => {})
    }

    user.image = url
    await user.save()

    return NextResponse.json({ success: true, url })
  } catch (error) {
    console.error("Avatar upload failed:", error)
    return NextResponse.json({ message: "Failed to upload image. Please try again." }, { status: 500 })
  }
}
