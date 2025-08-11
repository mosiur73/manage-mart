import ProductList from "@/components/ProductList"
import { Suspense } from "react"
import Loading from "./loadings"

/**
 * @typedef {import('../../lib/types').Product} Product
 */

/**
 * Fetches all products from the public JSON file.
 * @returns {Promise<Product[]>}
 */
async function getAllProducts() {
  try {
    // Construct a full absolute URL for fetching static assets
    const baseUrl = process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000"
    const url = `${baseUrl}/product.json`

    const res = await fetch(url, {
      cache: "no-store", // Ensure fresh data on each request
    })

    if (!res.ok) {
      const errorBody = await res.text()
      console.error(`Failed to fetch products: HTTP Status ${res.status} - ${res.statusText}`)
      console.error("Response body:", errorBody)
      throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`)
    }

    /** @type {Product[]} */
    const products = await res.json()
    return products
  } catch (error) {
    console.error("Error fetching products:", error instanceof Error ? error.message : String(error))
    if (error instanceof Error) {
      console.error(error)
    } else {
      console.error("Non-Error object caught:", error)
    }
    return []
  }
}

/**
 * Product listing page with pagination.
 * @param {{ searchParams: { page?: string, limit?: string } }} props
 */
export default async function ProductsPage({ searchParams }) {
  // Await searchParams before accessing its properties
  const awaitedSearchParams = await searchParams

  const allProducts = await getAllProducts()

  const currentPage = Number.parseInt(awaitedSearchParams.page || "1", 10)
  const productsPerPage = Number.parseInt(awaitedSearchParams.limit || "20", 10) // Default to 20 cards

  const startIndex = (currentPage - 1) * productsPerPage
  const endIndex = startIndex + productsPerPage
  const paginatedProducts = allProducts.slice(startIndex, endIndex)

  const totalPages = Math.ceil(allProducts.length / productsPerPage)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Our Products</h1>
      <Suspense fallback={<Loading />}>
        <ProductList products={paginatedProducts} currentPage={currentPage} totalPages={totalPages} />
      </Suspense>
    </div>
  )
}
