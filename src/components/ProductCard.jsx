import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"

/**
 * @typedef {import('../lib/types').Product} Product
 */

/**
 * @param {{ product: Product }} props
 */
export default function ProductCard({ product }) {
  return (
    <Card className="w-full max-w-sm rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
      <Image
        src={product.img || "/placeholder.svg?height=300&width=300&query=product image"}
        alt={product.name}
        width={300}
        height={300}
        className="w-full h-48 object-cover"
      />
      <CardHeader className="p-4 pb-2">
        <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
        <CardDescription className="text-sm text-muted-foreground">
          {product.category} by {product.seller}
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
        {/* Wrap the buttons in a single div to ensure CardFooter has one child */}
        <div className="flex gap-2 w-full">
          <Button className="flex-1">Add to Cart</Button>
          <Button asChild variant="outline" className="flex-1 bg-transparent">
            <Link href={`/products/${product.id}`} prefetch={false}>
              Details
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
