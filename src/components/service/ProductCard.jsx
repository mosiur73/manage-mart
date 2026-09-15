import Link from "next/link"
import Image from "next/image"
import { StarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import AddToCartButton from "./AddToCartButton"
import WishlistButton from "./WishlistButton"

/**
 * @param {{ product: Object, isWishlisted?: boolean }} props
 */
export default function ProductCard({ product, isWishlisted = false }) {
  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col">
      <Image
        src={product.images?.[0] || "/placeholder.svg"}
        alt={product.name}
        width={400}
        height={300}
        className="w-full h-56 object-cover"
      />

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
            <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
            <div className="flex items-center text-sm text-muted-foreground">
              <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
              <span>
                {product.ratings} ({product.ratingsCount})
              </span>
            </div>
          </div>
          <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div className="flex gap-2 w-full">
            <AddToCartButton product={product} className="flex-1" />
            <Button asChild variant="outline" className="flex-1 bg-transparent">
              <Link href={`/service/${product._id}`} prefetch={false}>
                Details
              </Link>
            </Button>
            <WishlistButton product={product} initialWishlisted={isWishlisted} />
          </div>
        </CardFooter>
      </div>
    </div>
  )
}
