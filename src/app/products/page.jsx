import ProductList from "@/components/ProductList"
import { Suspense } from "react"
import Loading from "./loadings"
// import Loading from "./loading"

/**
 * @typedef {import('../../lib/types').Product} Product
 */

/**
 * Fetches all products from the public JSON file.
 * @returns {Promise<Product[]>}
 */
async function getAllProducts() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/product.json`, {
      cache: "no-store", // Ensure fresh data on each request
    })

    if (!res.ok) {
      throw new Error("Failed to fetch products")
    }

    /** @type {Product[]} */
    const products = await res.json()
    return products
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

/**
 * Product listing page with pagination.
 * @param {{ searchParams: { page?: string, limit?: string } }} props
 */
export default async function ProductsPage({ searchParams }) {
  const allProducts = await getAllProducts()

  const currentPage = Number.parseInt(searchParams.page || "1", 10)
  const productsPerPage = Number.parseInt(searchParams.limit || "20", 10) // Default to 20 cards

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
