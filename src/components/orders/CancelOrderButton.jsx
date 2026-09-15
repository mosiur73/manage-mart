"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { requestCancelOrder } from "@/app/orders/actions"

/**
 * @param {{ orderId: string, status: string, cancellationRequested: boolean }} props
 */
export default function CancelOrderButton({ orderId, status, cancellationRequested }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  if (!["pending", "paid"].includes(status)) {
    return null
  }

  if (cancellationRequested) {
    return (
      <p className="text-xs font-medium text-orange-600 border-t pt-3">
        Cancellation requested — waiting on the seller
      </p>
    )
  }

  function handleCancel() {
    const confirmMessage =
      status === "paid"
        ? "Request cancellation for this order? The seller will review and process your refund."
        : "Cancel this order?"
    if (!window.confirm(confirmMessage)) return

    startTransition(async () => {
      const result = await requestCancelOrder(orderId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="flex justify-end border-t pt-3">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={isPending}
        onClick={handleCancel}
        className="text-red-600 border-red-200 hover:bg-red-50"
      >
        {isPending ? "Cancelling..." : status === "paid" ? "Request Cancellation" : "Cancel Order"}
      </Button>
    </div>
  )
}
