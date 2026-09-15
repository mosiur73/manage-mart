import { getStorefrontProducts } from "@/app/dashboard/action"
import { getWishlistedProductIds } from "@/app/service/wishlist-actions"
import ProductFilters from "@/components/service/ProductFilters"
import ProductCard from "@/components/service/ProductCard"
import Pagination from "@/components/service/Pagination"

export const metadata = {
  title: "Products",
}

export default async function ServicePage({ searchParams }) {
  const sp = await searchParams
  const search = sp.search || ""
  const category = sp.category || ""
  const brand = sp.brand || ""
  const priceRange = sp.price || ""
  const page = Number(sp.page) || 1

  const [{ products, total, totalPages, categories, brands }, wishlistedIds] = await Promise.all([
    getStorefrontProducts({ search, category, brand, priceRange, page }),
    getWishlistedProductIds(),
  ])
  const wishlistedSet = new Set(wishlistedIds)

  return (
    <section className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

      <ProductFilters categories={categories} brands={brands} />

      {total === 0 ? (
        <p className="text-center text-muted-foreground py-16">
          {search || category || brand || priceRange
            ? "No products match your filters."
            : "No products available yet. Check back soon."}
        </p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                isWishlisted={wishlistedSet.has(product._id)}
              />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} searchParams={sp} />
        </>
      )}
    </section>
  )
}
