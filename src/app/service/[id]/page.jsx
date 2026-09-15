import Link from "next/link"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"
import { getProductById } from "@/app/dashboard/action"
import { getProductReviews, getReviewGate } from "@/app/service/review-actions"
import { getWishlistedProductIds } from "@/app/service/wishlist-actions"
import AddToCartButton from "@/components/service/AddToCartButton"
import ProductGallery from "@/components/service/ProductGallery"
import ProductReviews from "@/components/service/ProductReviews"
import WishlistButton from "@/components/service/WishlistButton"

export default async function ProductDetails({ params }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const [reviews, gate, wishlistedIds] = await Promise.all([
    getProductReviews(id),
    getReviewGate(id),
    getWishlistedProductIds(),
  ])
  const isWishlisted = wishlistedIds.includes(id)

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span>
              {product.ratings} ({product.ratingsCount} ratings)
            </span>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Brand:</span> {product.brand?.name}
            </p>
            <p>
              <span className="font-medium">Category:</span> {product.category?.name}
            </p>
            <p>
              <span className="font-medium">In Stock:</span>{" "}
              {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
            </p>
            <p>
              <span className="font-medium">Shipping Cost:</span>{" "}
              {!product.shipping ? "Free" : `$${product.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="gap-4 flex">
            <AddToCartButton product={product} />
            <Button size="lg" variant="outline" asChild className="w-full md:w-auto">
              <Link href="/service">Back to Products</Link>
            </Button>
            <WishlistButton product={product} initialWishlisted={isWishlisted} />
          </div>
        </div>
      </div>

      <ProductReviews productId={id} reviews={reviews} gate={gate} />
    </div>
  )
}
