import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart";
import { checkRateLimit } from "@/lib/rate-limit";

function clientIp(req) {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
}

export async function POST(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    const rl = checkRateLimit(`cart-add:${userId ?? clientIp(req)}`, { limit: 30, windowMs: 60_000 });
    if (!rl.allowed) {
      return NextResponse.json(
        { message: "You're adding items too fast. Please slow down." },
        { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
      );
    }

    const body = await req.json();
    const { productId, name, price, img, category, quantity } = body;
    const qty = Number.isInteger(quantity) && quantity > 0 ? quantity : 1;

    if (!productId) {
      return NextResponse.json({ message: "productId is required" }, { status: 400 });
    }

    const existing = await Cart.findOne({ product: productId, user: userId });

    if (existing) {
      existing.quantity += qty;
      await existing.save();
      return NextResponse.json(existing, { status: 200 });
    }

    const newItem = await Cart.create({
      product: productId,
      user: userId,
      name,
      price,
      img,
      category,
      quantity: qty,
    });
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    const items = await Cart.find({ user: userId }).sort({ createdAt: -1 });
    return NextResponse.json(items, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: error.message }, { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id ?? null;

    const url = new URL(req.url, "http://localhost:3000");
    const id = url.searchParams.get("id");

    if (!id) {
      return NextResponse.json({ msg: "ID is required" }, { status: 400 });
    }

    const deletedItem = await Cart.findOneAndDelete({ _id: id, user: userId });

    if (!deletedItem) {
      return NextResponse.json({ msg: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ msg: "Cart item deleted" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ msg: "Delete failed", error: err.message }, { status: 500 });
  }
}
