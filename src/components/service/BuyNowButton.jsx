"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

/**
 * Adds the product to the cart, then jumps straight to /checkout — checkout
 * reads from the same Cart collection as AddToCartButton, so this is just
 * that add-to-cart call followed by a redirect instead of staying on the page.
 * @param {{ product: Object, quantity?: number, className?: string, size?: string, variant?: string }} props
 */
export default function BuyNowButton({ product, quantity = 1, className, size, variant }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleBuyNow() {
    setLoading(true)
    try {
      const res = await fetch("/api/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product._id,
          name: product.name,
          price: product.sellingPrice,
          img: product.images?.[0],
          category: product.category?.name,
          quantity,
        }),
      })

      if (res.ok) {
        window.dispatchEvent(new Event("cart:updated"))
        router.push("/checkout")
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message || "Failed to start checkout")
        setLoading(false)
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
      setLoading(false)
    }
  }

  return (
    <Button variant={variant} className={className} size={size} onClick={handleBuyNow} disabled={loading}>
      <Zap className="h-4 w-4" />
      {loading ? "Processing..." : "Buy Now"}
    </Button>
  )
}
