"use client"

import { useState } from "react"
import { Heart } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"

/**
 * @param {{ product: Object, initialWishlisted?: boolean, className?: string }} props
 */
export default function WishlistButton({ product, initialWishlisted = false, className }) {
  const [wishlisted, setWishlisted] = useState(initialWishlisted)
  const [loading, setLoading] = useState(false)

  async function toggle() {
    setLoading(true)
    try {
      if (wishlisted) {
        const res = await fetch(`/api/wishlist?productId=${product._id}`, { method: "DELETE" })
        if (res.ok) {
          setWishlisted(false)
          toast.success("Removed from wishlist")
        } else {
          const data = await res.json().catch(() => ({}))
          toast.error(data.message || "Failed to update wishlist")
        }
      } else {
        const res = await fetch("/api/wishlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            productId: product._id,
            name: product.name,
            price: product.price,
            img: product.images?.[0],
            category: product.category?.name,
          }),
        })
        if (res.ok) {
          setWishlisted(true)
          toast.success("Added to wishlist")
        } else if (res.status === 401) {
          toast.error("Sign in to save items to your wishlist")
        } else {
          const data = await res.json().catch(() => ({}))
          toast.error(data.message || "Failed to update wishlist")
        }
      }
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      disabled={loading}
      onClick={toggle}
      className={className}
      aria-label={wishlisted ? "Remove from wishlist" : "Add to wishlist"}
    >
      <Heart className={`h-4 w-4 ${wishlisted ? "fill-red-500 text-red-500" : ""}`} />
    </Button>
  )
}
