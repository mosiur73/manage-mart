import { notFound } from "next/navigation"
import { StarIcon } from "lucide-react"
import { getProductById } from "@/app/dashboard/action"
import { getProductReviews, getReviewGate } from "@/app/(site)/service/review-actions"
import ProductGallery from "@/components/service/ProductGallery"
import ProductInfoTabs from "@/components/service/ProductInfoTabs"
import ProductPurchasePanel from "@/components/service/ProductPurchasePanel"
import ProductReviews from "@/components/service/ProductReviews"

export default async function ProductDetails({ params }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    notFound()
  }

  const [reviews, gate] = await Promise.all([getProductReviews(id), getReviewGate(id)])

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <ProductGallery images={product.images} alt={product.name} />
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <div className="flex items-baseline gap-3">
            <p className="text-3xl font-bold text-blue-600">${product.sellingPrice.toFixed(2)}</p>
            {product.regularPrice > product.sellingPrice && (
              <p className="text-lg text-muted-foreground line-through">${product.regularPrice.toFixed(2)}</p>
            )}
          </div>
          <hr className="border-gray-200 dark:border-gray-800" />
          {product.sku && <p className="text-xs text-muted-foreground">SKU: {product.sku}</p>}
          <div className="flex items-center text-sm text-muted-foreground">
            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span>
              {product.ratings} ({product.ratingsCount} ratings)
            </span>
          </div>
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
            {product.tags?.length > 0 && (
              <p>
                <span className="font-medium">Tags:</span> {product.tags.join(", ")}
              </p>
            )}
          </div>
          <ProductPurchasePanel product={product} />
        </div>
      </div>

      <ProductInfoTabs description={product.description} reviewsCount={reviews.length}>
        <ProductReviews productId={id} reviews={reviews} gate={gate} />
      </ProductInfoTabs>
    </div>
  )
}
