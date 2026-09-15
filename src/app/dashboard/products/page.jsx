import { Suspense } from "react"
import ProductList from "@/components/dashboard/ProductList"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Toaster } from "sonner"
import { getDashboardProducts } from "@/app/dashboard/action"
import { Package } from "lucide-react"

export const metadata = {
  title: "All Products — Dashboard",
}

export default async function ProductsPage() {
  const products = await getDashboardProducts()

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <Package className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">All Products</h2>
            <p className="text-sm text-gray-400">{products.length} product{products.length !== 1 ? "s" : ""} in total</p>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <Card className="border border-gray-100 shadow-none">
        <CardHeader className="pb-3 border-b border-gray-50">
          <CardTitle className="text-base font-semibold text-gray-900">Product List</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            View, edit, or delete your existing products
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                Loading products...
              </div>
            }
          >
            <ProductList products={products} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  )
}
