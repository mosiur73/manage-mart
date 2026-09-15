import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import Order from "@/models/Order"
// Imported for its model-registration side effect — required by Cart.find().populate("product").
import "@/models/Product"
import { stripe } from "@/lib/stripe"
import { checkRateLimit } from "@/lib/rate-limit"

export async function POST(req) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return NextResponse.json({ message: "You must be signed in to checkout." }, { status: 401 })
  }

  const rl = checkRateLimit(`checkout:${session.user.id}`, { limit: 5, windowMs: 60_000 })
  if (!rl.allowed) {
    return NextResponse.json(
      { message: "Too many checkout attempts. Please wait a moment and try again." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) } }
    )
  }

  try {
    await dbConnect()

    const { shippingAddress } = await req.json()
    if (!shippingAddress?.name || !shippingAddress?.email || !shippingAddress?.address) {
      return NextResponse.json({ message: "Shipping details are required." }, { status: 400 })
    }

    const cartItems = await Cart.find({ user: session.user.id }).populate("product", "seller")
    if (cartItems.length === 0) {
      return NextResponse.json({ message: "Your cart is empty." }, { status: 400 })
    }

    // A product can be deleted after being added to someone's cart — drop those rows
    // rather than checking out a line item that no longer resolves to a real product.
    const validItems = cartItems.filter((item) => item.product)
    if (validItems.length === 0) {
      return NextResponse.json(
        { message: "The items in your cart are no longer available." },
        { status: 400 }
      )
    }

    const items = validItems.map((item) => ({
      product: item.product._id,
      seller: item.product.seller,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
    }))
    const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

    const order = await Order.create({
      user: session.user.id,
      items,
      total,
      status: "pending",
      shippingAddress,
    })

    const origin = req.headers.get("origin") || process.env.NEXTAUTH_URL

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      customer_email: session.user.email,
      line_items: items.map((item) => ({
        price_data: {
          currency: "usd",
          unit_amount: Math.round(item.price * 100),
          product_data: { name: item.name },
        },
        quantity: item.quantity,
      })),
      metadata: { orderId: order._id.toString(), userId: session.user.id },
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout/cancel`,
    })

    order.stripeSessionId = checkoutSession.id
    await order.save()

    return NextResponse.json({ url: checkoutSession.url }, { status: 200 })
  } catch (error) {
    console.error("Checkout error:", error)
    return NextResponse.json({ message: "Failed to start checkout. Please try again." }, { status: 500 })
  }
}
