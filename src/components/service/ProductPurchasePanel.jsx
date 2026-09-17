"use client"

import { useState } from "react"
import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import AddToCartButton from "./AddToCartButton"
import BuyNowButton from "./BuyNowButton"

/**
 * Quantity stepper + the Add to Cart / Buy Now pair, both wired to the same
 * quantity so a shopper can bump it up before either action.
 * @param {{ product: Object }} props
 */
export default function ProductPurchasePanel({ product }) {
  const maxQty = product.stock > 0 ? product.stock : 1
  const [quantity, setQuantity] = useState(1)

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <span className="text-sm font-medium">Quantity:</span>
        <div className="flex items-center gap-2 rounded-full border px-1 py-1">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            disabled={quantity <= 1}
          >
            <Minus className="h-3.5 w-3.5" />
          </Button>
          <span className="w-6 text-center text-sm font-medium">{quantity}</span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
            disabled={quantity >= maxQty}
          >
            <Plus className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <AddToCartButton
          product={product}
          quantity={quantity}
          size="lg"
          className="bg-blue-600 hover:bg-blue-700 text-white"
        />
        <BuyNowButton
          product={product}
          quantity={quantity}
          size="lg"
          className="bg-gray-900 hover:bg-gray-800 text-white"
        />
      </div>
    </div>
  )
}
