"use server"

import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Order from "@/models/Order"

const SELLER_ROLES = ["seller", "admin"]

const CUSTOMER_STATUS_COPY = {
  paid: "Order confirmed",
  shipped: "Your order has shipped",
  cancelled: "Order cancelled",
  refunded: "Order refunded",
}

function toNotification(order, { title, time, href }) {
  return {
    id: order._id.toString(),
    title,
    description: `Order #${order._id.toString().slice(-6).toUpperCase()} • $${order.total.toFixed(2)}`,
    time: time?.toISOString?.() ?? time,
    href,
  }
}

/**
 * Real, role-scoped notifications for the navbar bell — a seller/admin sees
 * orders needing action (new/paid, or a customer's cancellation request), a
 * customer sees their own recent order status changes. There's no persisted
 * read/unread state; `count` is the true total so the badge stays accurate
 * even though `items` is capped at 5 for the dropdown.
 * @returns {Promise<{ items: Array<Object>, count: number }>}
 */
export async function getNotifications() {
  const empty = { items: [], count: 0 }

  const session = await getServerSession(authOptions)
  if (!session?.user?.id) return empty

  try {
    await dbConnect()

    if (SELLER_ROLES.includes(session.user.role)) {
      const filter = {
        ...(session.user.role === "admin" ? {} : { "items.seller": session.user.id }),
        status: { $in: ["pending", "paid"] },
      }
      const [orders, count] = await Promise.all([
        Order.find(filter).sort({ createdAt: -1 }).limit(5).lean(),
        Order.countDocuments(filter),
      ])

      const items = orders.map((order) =>
        toNotification(order, {
          title: order.cancellationRequested
            ? "Cancellation requested"
            : order.status === "pending"
              ? "New order received"
              : "Payment received",
          time: order.createdAt,
          href: "/dashboard/orders",
        })
      )
      return { items, count }
    }

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    const filter = {
      user: session.user.id,
      status: { $in: Object.keys(CUSTOMER_STATUS_COPY) },
      updatedAt: { $gte: sevenDaysAgo },
    }
    const [orders, count] = await Promise.all([
      Order.find(filter).sort({ updatedAt: -1 }).limit(5).lean(),
      Order.countDocuments(filter),
    ])

    const items = orders.map((order) =>
      toNotification(order, {
        title: CUSTOMER_STATUS_COPY[order.status] ?? "Order updated",
        time: order.updatedAt,
        href: "/orders",
      })
    )
    return { items, count }
  } catch (error) {
    console.error("Failed to fetch notifications:", error)
    return empty
  }
}
