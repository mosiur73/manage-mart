"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

/**
 * @param {{ product: Object, className?: string, size?: string }} props
 */
export default function AddToCartButton({ product, className, size }) {
  const [loading, setLoading] = useState(false)

  async function handleAddToCart() {
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
        }),
      })

      if (res.ok) {
        toast.success(`${product.name} added to cart`)
        window.dispatchEvent(new Event("cart:updated"))
      } else {
        const data = await res.json().catch(() => ({}))
        toast.error(data.message || "Failed to add to cart")
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button className={className} size={size} onClick={handleAddToCart} disabled={loading}>
      {loading ? "Adding..." : "Add to Cart"}
    </Button>
  )
}
