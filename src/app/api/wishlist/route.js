import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Wishlist from "@/models/Wishlist"
import { checkRateLimit } from "@/lib/rate-limit"

// Unlike Cart, the wishlist has no guest bucket — "save for later" only makes
// sense tied to an account, so every method requires a session.
async function requireSession() {
  const session = await getServerSession(authOptions)
  return session?.user?.id ? session : null
}

export async function GET() {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ message: "You must be signed in." }, { status: 401 })
  }

  try {
    await dbConnect()
    const items = await Wishlist.find({ user: session.user.id }).sort({ createdAt: -1 })
    return NextResponse.json(items, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function POST(req) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ message: "Sign in to save items to your wishlist." }, { status: 401 })
  }

  const rl = checkRateLimit(`wishlist:${session.user.id}`, { limit: 30, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "You're saving items too fast. Please slow down." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  try {
    const { productId, name, price, img, category } = await req.json()
    if (!productId) {
      return NextResponse.json({ message: "productId is required" }, { status: 400 })
    }

    await dbConnect()
    // Atomic upsert — avoids a find-then-create race against the unique index.
    await Wishlist.findOneAndUpdate(
      { user: session.user.id, product: productId },
      { $setOnInsert: { name, price, img, category } },
      { upsert: true, setDefaultsOnInsert: true }
    )
    return NextResponse.json({ success: true }, { status: 201 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}

export async function DELETE(req) {
  const session = await requireSession()
  if (!session) {
    return NextResponse.json({ message: "You must be signed in." }, { status: 401 })
  }

  const url = new URL(req.url, "http://localhost:3000")
  const productId = url.searchParams.get("productId")
  if (!productId) {
    return NextResponse.json({ message: "productId is required" }, { status: 400 })
  }

  try {
    await dbConnect()
    await Wishlist.findOneAndDelete({ user: session.user.id, product: productId })
    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 })
  }
}
