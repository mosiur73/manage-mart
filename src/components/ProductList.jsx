/**
 * @typedef {import('../lib/types').Product} Product
 */

import ProductCard from "./ProductCard"
import PaginationControls from "./PaginationControls" // Import the new component

/**
 * @param {{ products: Product[], currentPage: number, totalPages: number }} props
 */
export default function ProductList({ products, currentPage, totalPages }) {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      <PaginationControls currentPage={currentPage} totalPages={totalPages} />
    </div>
  )
}
