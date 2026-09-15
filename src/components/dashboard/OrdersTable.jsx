"use client"

import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Clock, CheckCircle2, XCircle, Truck, Undo2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { updateOrderStatus, refundOrder } from "@/app/dashboard/order-actions"

const statusConfig = {
  pending: { label: "Pending", className: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  paid: { label: "Paid", className: "bg-blue-50 text-blue-700 border-blue-200", icon: CheckCircle2 },
  shipped: { label: "Shipped", className: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Truck },
  cancelled: { label: "Cancelled", className: "bg-red-50 text-red-700 border-red-200", icon: XCircle },
  refunded: { label: "Refunded", className: "bg-gray-100 text-gray-700 border-gray-200", icon: Undo2 },
}

// Mirrors ALLOWED_TRANSITIONS in order-actions.js — a `paid` order can only be
// manually moved to `shipped` here; getting to `refunded`/`cancelled` from `paid`
// requires the dedicated Refund button (it's the only path that touches Stripe).
const DROPDOWN_OPTIONS = {
  pending: ["pending", "cancelled"],
  paid: ["paid", "shipped"],
}

export default function OrdersTable({ orders }) {
  const [isPending, startTransition] = useTransition()
  const [busyId, setBusyId] = useState(null)

  function handleStatusChange(id, status) {
    setBusyId(id)
    startTransition(async () => {
      const result = await updateOrderStatus(id, status)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setBusyId(null)
    })
  }

  function handleRefund(id) {
    if (!window.confirm("Refund this order via Stripe? This cannot be undone.")) return
    setBusyId(id)
    startTransition(async () => {
      const result = await refundOrder(id)
      if (result.success) {
        toast.success(result.message)
      } else {
        toast.error(result.message)
      }
      setBusyId(null)
    })
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-sm font-medium text-gray-600">No orders yet</p>
        <p className="text-xs text-gray-400 mt-1">Orders will appear here once customers check out</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100">
            <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Order ID</th>
            <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Customer</th>
            <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden md:table-cell">Items</th>
            <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden sm:table-cell">Date</th>
            <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Amount</th>
            <th className="text-right text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {orders.map((order) => {
            const status = statusConfig[order.status] ?? statusConfig.pending
            const StatusIcon = status.icon
            const itemCount = order.items.reduce((sum, item) => sum + item.quantity, 0)
            const isBusy = isPending && busyId === order._id
            const dropdownOptions = DROPDOWN_OPTIONS[order.status]

            return (
              <tr key={order._id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-5 py-3.5 font-mono text-xs text-gray-500">
                  #{order._id.slice(-8).toUpperCase()}
                </td>
                <td className="px-3 py-3.5">
                  <p className="font-medium text-gray-800 text-sm">{order.shippingAddress?.name || "—"}</p>
                  <p className="text-xs text-gray-400">{order.shippingAddress?.email}</p>
                </td>
                <td className="px-3 py-3.5 text-gray-600 hidden md:table-cell">
                  {itemCount} item{itemCount !== 1 ? "s" : ""}
                </td>
                <td className="px-3 py-3.5 text-xs text-gray-400 hidden sm:table-cell">
                  {new Date(order.createdAt).toLocaleDateString("en-US", {
                    month: "short", day: "numeric", year: "numeric",
                  })}
                </td>
                <td className="px-3 py-3.5 font-semibold text-gray-800">${order.total.toFixed(2)}</td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2 flex-wrap">
                    {order.cancellationRequested && (
                      <span className="inline-flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full border bg-orange-50 text-orange-700 border-orange-200">
                        <AlertCircle className="h-3 w-3" />
                        Cancellation requested
                      </span>
                    )}
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
                      <StatusIcon className="h-3 w-3" />
                      {status.label}
                    </span>
                    {dropdownOptions && (
                      <select
                        value={order.status}
                        disabled={isBusy}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        className="text-xs border border-gray-200 rounded-md px-1.5 py-1 text-gray-600 disabled:opacity-50"
                      >
                        {dropdownOptions.map((value) => (
                          <option key={value} value={value}>
                            {statusConfig[value].label}
                          </option>
                        ))}
                      </select>
                    )}
                    {order.status === "paid" && (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        disabled={isBusy}
                        onClick={() => handleRefund(order._id)}
                        className="h-7 text-xs text-red-600 border-red-200 hover:bg-red-50"
                      >
                        Refund
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
