"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"

function serializeOrder(order) {
  return {
    ...order,
    _id: order._id.toString(),
    user: order.user?.toString?.() ?? order.user,
    items: order.items.map((item) => ({
      ...item,
      product: item.product?.toString?.() ?? item.product,
      seller: item.seller?.toString?.() ?? item.seller,
    })),
    createdAt: order.createdAt?.toISOString?.() ?? order.createdAt,
    updatedAt: order.updatedAt?.toISOString?.() ?? order.updatedAt,
  }
}

/**
 * A customer's own order history — distinct from the seller/admin dashboard's
 * getOrders() (src/app/dashboard/order-actions.js), which is scoped by seller
 * ownership across ALL customers instead of by the signed-in buyer.
 */
export async function getMyOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return []

  try {
    await dbConnect()
    const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 }).lean()
    return orders.map(serializeOrder)
  } catch (error) {
    console.error("Failed to fetch order history:", error)
    return []
  }
}

/**
 * Customer-initiated cancellation. A `pending` order was never charged, so it
 * cancels immediately. A `paid` order involves real money — this only flags it
 * (`cancellationRequested`); the actual refund is a seller/admin action
 * (refundOrder() in dashboard/order-actions.js) that calls Stripe. Real refunds
 * shouldn't be a one-click customer self-service action with no review step.
 */
export async function requestCancelOrder(orderId) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { success: false, message: "You must be signed in." }
  }

  try {
    await dbConnect()
    const order = await Order.findOne({ _id: orderId, user: session.user.id })
    if (!order) {
      return { success: false, message: "Order not found." }
    }

    if (order.status === "pending") {
      order.status = "cancelled"
      await order.save()
      revalidatePath("/orders")
      revalidatePath("/dashboard/orders")
      return { success: true, message: "Order cancelled." }
    }

    if (order.status === "paid") {
      if (order.cancellationRequested) {
        return { success: false, message: "You've already requested cancellation — the seller will process your refund." }
      }
      order.cancellationRequested = true
      await order.save()
      revalidatePath("/orders")
      revalidatePath("/dashboard/orders")
      return { success: true, message: "Cancellation requested. The seller will process your refund." }
    }

    return { success: false, message: "This order can no longer be cancelled." }
  } catch (error) {
    console.error("Failed to request order cancellation:", error)
    return { success: false, message: "Failed to cancel order. Please try again." }
  }
}
