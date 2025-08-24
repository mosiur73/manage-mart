import Image from "next/image"
import { notFound } from "next/navigation"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"

/**
 * @typedef {import('../../../lib/types').Product} Product
 */

/**
 * Fetches all products to find a specific one by ID.
 * In a real application, you might fetch directly from a database with the ID.
 * @returns {Promise<Product[]>}
 */
async function getAllProducts() {
  try {
    // Construct a full absolute URL for fetching static assets
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const url = `${baseUrl}/product.json`

    const res = await fetch(url, {
      cache: "no-store", // Ensure fresh data
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`Failed to fetch products for detail page: HTTP Status ${res.status} - ${res.statusText}`)
      console.error("Response body:", errorBody)
      throw new Error(`Failed to fetch products for detail page: ${res.status} ${res.statusText}`)
    }

    /** @type {Product[]} */
    const products = await res.json()
    return products
  } catch (error) {
    console.error(
      "Error fetching all products for detail page:",
      error instanceof Error ? error.message : String(error),
    )
    if (error instanceof Error) {
      console.error(error)
    } else {
      console.error("Non-Error object caught:", error)
    }
    return [] // Return empty array to prevent further errors if fetch fails
  }
}

/**
 * Generates static paths for all products.
 * This is useful for static site generation (SSG) if you want to pre-render all product pages at build time.
 * @returns {Promise<{ paths: { id: string }[] }>}
 */
export async function generateStaticParams() {
  const products = await getAllProducts()
  return products.map((product) => ({
    id: product.id,
  }))
}

/**
 * Product detail page component.
 * @param {{ params: { id: string } }} props
 */
export default async function ProductDetailPage({ params }) {
  console.log(`PostDetailPage received slug: "${params.id}"`) // Debug log
  const products = await getAllProducts()
  const product = products.find((p) => p.id ===params.id)

  if (!product) {
    console.log(`Post with slug "${params.id}" not found, rendering 404.`) // Debug log
    notFound() // Renders the closest not-found.jsx or a default 404 page
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <Image
            src={product.img || "/placeholder.svg?height=600&width=600&query=product detail image"}
            alt={product.name}
            width={600}
            height={600}
            className="max-w-full h-auto object-contain"
          />
        </div>
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
              <span className="font-medium">Category:</span> {product.category}
            </p>
            <p>
              <span className="font-medium">Seller:</span> {product.seller}
            </p>
            <p>
              <span className="font-medium">In Stock:</span>{" "}
              {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
            </p>
            <p>
              <span className="font-medium">Shipping Cost:</span>{" "}
              {product.shipping === 0 ? "Free" : `$${product.shipping.toFixed(2)}`}
            </p>
          </div>
          <Button size="lg" className="w-full md:w-auto">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}
