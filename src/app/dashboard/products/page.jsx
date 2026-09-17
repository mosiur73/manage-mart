import { Suspense } from "react"
import ProductList from "@/components/dashboard/ProductList"
import { Toaster } from "sonner"
import { getDashboardProducts } from "@/app/dashboard/action"
import { Package } from "lucide-react"

export const metadata = { title: "All Products — Dashboard" }

export default async function ProductsPage() {
  const products = await getDashboardProducts()
  return (
    <>
      <Toaster richColors position="top-right" />
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12 text-sm text-gray-400">
            Loading...
          </div>
        }
      >
        <ProductList
          products={products}
          header={{
            title: "All Products",
            description: `${products.length} product${products.length !== 1 ? "s" : ""} in total`,
            icon: <Package className="h-5 w-5 text-blue-600" />,
            iconBg: "bg-blue-50",
          }}
        />
      </Suspense>
    </>
  )
}
