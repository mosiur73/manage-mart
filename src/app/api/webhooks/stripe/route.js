import { NextResponse } from "next/server"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import Cart from "@/models/Cart"
import { stripe } from "@/lib/stripe"
import { sendOrderConfirmationEmail } from "@/lib/email"

// Stripe requires the raw request body to verify the webhook signature —
// do NOT parse it as JSON before this point.
export async function POST(req) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET — cannot verify webhook signature.")
    return NextResponse.json({ message: "Webhook not configured" }, { status: 500 })
  }

  const signature = req.headers.get("stripe-signature")
  const rawBody = await req.text()

  let event
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error.message)
    return NextResponse.json({ message: "Invalid signature" }, { status: 400 })
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object

    try {
      await dbConnect()
      const order = await Order.findOne({ stripeSessionId: session.id })

      // Idempotent: ignore retried webhook deliveries for an already-fulfilled order.
      if (order && order.status === "pending") {
        order.status = "paid"
        order.paymentIntentId = session.payment_intent
        await order.save()
        await Cart.deleteMany({ user: order.user })
        await sendOrderConfirmationEmail(order)
      }
    } catch (error) {
      console.error("Failed to fulfill order from webhook:", error)
      return NextResponse.json({ message: "Webhook handler failed" }, { status: 500 })
    }
  }

  return NextResponse.json({ received: true })
}
