"use server"

import mongoose from "mongoose"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { revalidatePath } from "next/cache"

const SELLER_ROLES = ["seller", "admin"]

// Manual status transitions allowed via updateOrderStatus(), keyed by current status.
// Deliberately excludes anything that involves real money: a `paid` order can only
// become `shipped` here — moving it to `cancelled`/`refunded` must go through
// refundOrder() below, which actually calls Stripe. Without this restriction, the
// status dropdown could silently desync the DB from what Stripe actually charged.
const ALLOWED_TRANSITIONS = {
  pending: ["pending", "cancelled"],
  paid: ["paid", "shipped"],
  shipped: ["shipped"],
  cancelled: ["cancelled"],
  refunded: ["refunded"],
}

// Model.aggregate() bypasses Mongoose's normal query casting, so a raw string id
// in a $match against an ObjectId field silently matches nothing — every aggregate
// pipeline below must cast explicitly.
function toObjectId(id) {
  return new mongoose.Types.ObjectId(id)
}

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
 * Fetches orders for the dashboard — an admin sees every order, a seller sees
 * any order that contains at least one of their own products (the whole order,
 * not just their line items — real per-seller sub-orders are out of scope here).
 */
export async function getOrders() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return []
  }

  try {
    await dbConnect()
    const filter = session.user.role === "admin" ? {} : { "items.seller": session.user.id }
    const orders = await Order.find(filter).sort({ createdAt: -1 }).lean()
    return orders.map(serializeOrder)
  } catch (error) {
    console.error("Failed to fetch orders:", error)
    return []
  }
}

/**
 * Aggregate stats for the dashboard overview cards, scoped the same way as getOrders().
 */
export async function getOrderStats() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return { activeOrders: 0, revenue: 0 }
  }

  try {
    await dbConnect()
    const isAdmin = session.user.role === "admin"
    const countFilter = isAdmin ? {} : { "items.seller": session.user.id }
    const aggMatch = isAdmin ? {} : { "items.seller": toObjectId(session.user.id) }

    const [activeOrders, revenueAgg] = await Promise.all([
      Order.countDocuments({ ...countFilter, status: { $in: ["pending", "paid"] } }),
      Order.aggregate([
        { $match: { ...aggMatch, status: { $in: ["paid", "shipped"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ])
    return { activeOrders, revenue: revenueAgg[0]?.total ?? 0 }
  } catch (error) {
    console.error("Failed to compute order stats:", error)
    return { activeOrders: 0, revenue: 0 }
  }
}

const MONTH_LABELS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

/**
 * Real analytics for the dashboard Analytics page — monthly revenue (last 6
 * months), top products by revenue, and headline totals. Scoped like getOrders():
 * a seller only sees revenue from their own line items, not the whole order.
 */
export async function getAnalytics() {
  const empty = {
    monthlyRevenue: [],
    topProducts: [],
    totals: { revenue: 0, orders: 0, customers: 0, avgOrderValue: 0 },
  }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return empty
  }

  try {
    await dbConnect()
    const isAdmin = session.user.role === "admin"
    const sellerFilter = isAdmin ? [] : [{ $match: { "items.seller": toObjectId(session.user.id) } }]

    const now = new Date()
    const windowStart = new Date(now.getFullYear(), now.getMonth() - 5, 1)

    const fulfilledMatch = { status: { $in: ["paid", "shipped"] } }

    const [monthlyAgg, topProductsAgg, customerAgg] = await Promise.all([
      Order.aggregate([
        { $match: { ...fulfilledMatch, createdAt: { $gte: windowStart } } },
        { $unwind: "$items" },
        ...sellerFilter,
        {
          $group: {
            _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
            orderIds: { $addToSet: "$_id" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]),
      Order.aggregate([
        { $match: fulfilledMatch },
        { $unwind: "$items" },
        ...sellerFilter,
        {
          $group: {
            _id: "$items.name",
            sales: { $sum: "$items.quantity" },
            revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } },
          },
        },
        { $sort: { revenue: -1 } },
        { $limit: 5 },
      ]),
      Order.aggregate([
        { $match: fulfilledMatch },
        ...(isAdmin ? [] : [{ $match: { "items.seller": toObjectId(session.user.id) } }]),
        { $group: { _id: "$user" } },
        { $count: "customers" },
      ]),
    ])

    // Fill in the full 6-month window so months with no orders still render as a 0 bar.
    const monthlyByKey = new Map(
      monthlyAgg.map((m) => [`${m._id.year}-${m._id.month}`, { revenue: m.revenue, orders: m.orderIds.length }])
    )
    const monthlyRevenue = []
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
      const key = `${d.getFullYear()}-${d.getMonth() + 1}`
      const entry = monthlyByKey.get(key)
      monthlyRevenue.push({
        month: MONTH_LABELS[d.getMonth()],
        revenue: entry?.revenue ?? 0,
        orders: entry?.orders ?? 0,
      })
    }

    const totalRevenue = monthlyRevenue.reduce((sum, m) => sum + m.revenue, 0)
    const totalOrders = monthlyRevenue.reduce((sum, m) => sum + m.orders, 0)

    return {
      monthlyRevenue,
      topProducts: topProductsAgg.map((p) => ({ name: p._id, sales: p.sales, revenue: p.revenue })),
      totals: {
        revenue: totalRevenue,
        orders: totalOrders,
        customers: customerAgg[0]?.customers ?? 0,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
      },
    }
  } catch (error) {
    console.error("Failed to compute analytics:", error)
    return empty
  }
}

/**
 * Transitions an order's status (dashboard-only action). A seller may only act
 * on orders that include at least one of their own products; an admin may act
 * on any order.
 */
export async function updateOrderStatus(id, status) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "You must be signed in as a seller or admin." }
  }

  try {
    await dbConnect()
    const order = await Order.findById(id)
    if (!order) {
      return { success: false, message: "Order not found." }
    }
    if (
      session.user.role !== "admin" &&
      !order.items.some((item) => item.seller?.toString() === session.user.id)
    ) {
      return { success: false, message: "You can only update orders containing your own products." }
    }
    if (!ALLOWED_TRANSITIONS[order.status]?.includes(status)) {
      return {
        success: false,
        message: `Cannot move an order from "${order.status}" to "${status}" this way — use the Refund action for a paid order.`,
      }
    }

    const wasAlreadyShipped = order.status === "shipped"
    order.status = status
    // A cancellation request only makes sense while still `paid` — clear it on any
    // other transition (e.g. the seller shipped anyway instead of refunding).
    if (status !== "paid") {
      order.cancellationRequested = false
    }
    await order.save()

    if (status === "shipped" && !wasAlreadyShipped) {
      // Dynamically imported so this file's other exports (getOrders/getOrderStats,
      // read on every dashboard page load) don't inherit a hard RESEND_API_KEY
      // requirement they have nothing to do with — same reasoning as the Cloudinary
      // dynamic import in dashboard/action.jsx's deleteProduct (Phase 5).
      const { sendShippingNotificationEmail } = await import("@/lib/email")
      await sendShippingNotificationEmail(order)
    }

    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard")
    revalidatePath("/orders")
    return { success: true, message: "Order status updated." }
  } catch (error) {
    console.error("Failed to update order status:", error)
    return { success: false, message: "Failed to update order status." }
  }
}

/**
 * Refunds a paid order via Stripe, then marks it `refunded`. The only path that
 * can move an order out of `paid` into a money-returned state — updateOrderStatus()
 * deliberately can't reach `refunded`/`cancelled` from `paid` on its own.
 */
export async function refundOrder(id) {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id || !SELLER_ROLES.includes(session.user.role)) {
    return { success: false, message: "You must be signed in as a seller or admin." }
  }

  try {
    await dbConnect()
    const order = await Order.findById(id)
    if (!order) {
      return { success: false, message: "Order not found." }
    }
    if (
      session.user.role !== "admin" &&
      !order.items.some((item) => item.seller?.toString() === session.user.id)
    ) {
      return { success: false, message: "You can only refund orders containing your own products." }
    }
    if (order.status !== "paid") {
      return { success: false, message: "Only paid orders can be refunded." }
    }
    if (!order.paymentIntentId) {
      return { success: false, message: "This order has no recorded payment to refund." }
    }

    // Dynamically imported for the same reason as the email import above — this
    // file's other exports shouldn't inherit a hard STRIPE_SECRET_KEY requirement.
    const { stripe } = await import("@/lib/stripe")
    await stripe.refunds.create({ payment_intent: order.paymentIntentId })

    order.status = "refunded"
    order.cancellationRequested = false
    await order.save()

    revalidatePath("/dashboard/orders")
    revalidatePath("/dashboard")
    revalidatePath("/orders")
    return { success: true, message: "Order refunded." }
  } catch (error) {
    console.error("Failed to refund order:", error)
    return { success: false, message: "Failed to process refund. Please try again." }
  }
}
