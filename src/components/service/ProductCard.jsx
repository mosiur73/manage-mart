"use client"

import { useRouter } from "next/navigation"
import Image from "next/image"
import { StarIcon } from "lucide-react"
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AddToCartButton from "./AddToCartButton"
import WishlistButton from "./WishlistButton"

/**
 * @param {{ product: Object, isWishlisted?: boolean }} props
 */
export default function ProductCard({ product, isWishlisted = false }) {
  const router = useRouter()

  // A plain div + router.push (rather than wrapping the whole card in a <Link>)
  // avoids nesting <button> inside <a> — invalid HTML that made clicks on the
  // Add to Cart / wishlist buttons unreliably fall through to the card's own
  // navigation. Those buttons stop propagation so this handler never fires for them.
  function goToDetails() {
    router.push(`/service/${product._id}`)
  }

  return (
    <div
      onClick={goToDetails}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") goToDetails()
      }}
      className="cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col transition hover:shadow-md"
    >
      <div className="relative">
        <Image
          src={product.images?.[0] || "/placeholder.svg"}
          alt={product.name}
          width={400}
          height={300}
          className="w-full h-56 object-cover"
        />
        <div className="absolute bottom-2 right-2" onClick={(e) => e.stopPropagation()}>
          <WishlistButton
            product={product}
            initialWishlisted={isWishlisted}
            className="bg-white shadow-sm hover:bg-white"
          />
        </div>
      </div>

      <div className="flex flex-col flex-1">
        <CardHeader className="p-4 pb-2">
          <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
          <CardDescription className="text-sm text-muted-foreground">
            {product.brand?.name}
            {product.brand && product.category && " · "}
            {product.category?.name}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-primary">${product.sellingPrice.toFixed(2)}</span>
              {product.regularPrice > product.sellingPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  ${product.regularPrice.toFixed(2)}
                </span>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>
                {product.ratings} ({product.ratingsCount})
              </span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0" onClick={(e) => e.stopPropagation()}>
          <AddToCartButton product={product} variant="outline" className="w-full" />
        </CardFooter>
      </div>
    </div>
  )
}
