import { Suspense } from "react"
import ProductList from "@/components/dashboard/ProductList"
import CreateProductForm from "@/components/dashboard/CreateProductForm"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Toaster } from "sonner"
import { getDashboardProducts } from "./action"
import { getOrderStats } from "./order-actions"
import { Package, PlusCircle, TrendingUp, ShoppingCart } from "lucide-react"

export default async function DashboardPage() {
  const [products, orderStats] = await Promise.all([getDashboardProducts(), getOrderStats()])

  const stats = [
    {
      label: "Total Products",
      value: products.length,
      icon: Package,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Active Orders",
      value: orderStats.activeOrders,
      icon: ShoppingCart,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
      change: "Pending + paid",
    },
    {
      label: "Revenue",
      value: `$${orderStats.revenue.toFixed(2)}`,
      icon: TrendingUp,
      color: "text-violet-600",
      bg: "bg-violet-50",
      change: "Paid + shipped orders",
    },
  ]

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border border-gray-100 shadow-none">
              <CardContent className="p-5 flex items-center gap-4">
                <div className={`h-10 w-10 rounded-lg ${s.bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`h-5 w-5 ${s.color}`} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                  <p className="text-xl font-bold text-gray-900 leading-tight">{s.value}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{s.change}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Product List — takes 2/3 */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-base font-semibold text-gray-900">
                All Products
              </CardTitle>
              <CardDescription className="text-xs text-gray-400">
                {products.length} product{products.length !== 1 ? "s" : ""} total
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Suspense
                fallback={
                  <div className="flex items-center justify-center py-12 text-sm text-gray-400">
                    Loading...
                  </div>
                }
              >
                <ProductList products={products} />
              </Suspense>
            </CardContent>
          </Card>
        </div>

        {/* Create Form — takes 1/3 */}
        <div>
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-3 border-b border-gray-50">
              <div className="flex items-center gap-2">
                <div className="h-7 w-7 rounded-md bg-blue-600 flex items-center justify-center">
                  <PlusCircle className="h-3.5 w-3.5 text-white" />
                </div>
                <CardTitle className="text-base font-semibold text-gray-900">
                  New Product
                </CardTitle>
              </div>
              <CardDescription className="text-xs text-gray-400 mt-1">
                Fill in the details to add a product
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <CreateProductForm />
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}