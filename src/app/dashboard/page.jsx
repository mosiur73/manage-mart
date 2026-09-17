import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Toaster } from "sonner"
import { getDashboardProducts } from "./action"
import { getOrderStats } from "./order-actions"
import { LayoutDashboard, Package, TrendingUp, ShoppingCart, AlertTriangle, ArrowRight } from "lucide-react"

const RECENT_PRODUCTS_LIMIT = 5
const LOW_STOCK_LIMIT = 5

function StatusBadge({ stock, lowStockThreshold }) {
  if (stock <= 0) {
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-red-50 text-red-600">Out of Stock</span>
  }
  if (stock <= (lowStockThreshold ?? 5)) {
    return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-amber-50 text-amber-600">Low Stock</span>
  }
  return <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-600">In Stock</span>
}

export default async function DashboardPage() {
  const [products, orderStats] = await Promise.all([getDashboardProducts(), getOrderStats()])

  // getDashboardProducts() already sorts by createdAt desc, so the first N are the
  // most recently added — no extra query needed.
  const recentProducts = products.slice(0, RECENT_PRODUCTS_LIMIT)

  const lowStockProducts = products
    .filter((p) => p.stock <= (p.lowStockThreshold ?? 5))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, LOW_STOCK_LIMIT)
  const lowStockCount = products.filter((p) => p.stock <= (p.lowStockThreshold ?? 5)).length

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
    {
      label: "Low Stock",
      value: lowStockCount,
      icon: AlertTriangle,
      color: "text-amber-600",
      bg: "bg-amber-50",
      change: "Needs restocking",
    },
  ]

  return (
    <>
      <Toaster richColors position="top-right" />

      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <LayoutDashboard className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Overview</h2>
            <p className="text-sm text-gray-400">A quick look at your store</p>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Products */}
        <Card className="border border-gray-100 shadow-none">
          <CardHeader className="pb-3 border-b border-gray-50 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Recent Products</CardTitle>
              <CardDescription className="text-xs text-gray-400">Latest additions to your catalog</CardDescription>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 flex-shrink-0"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {recentProducts.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">No products yet.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {recentProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.category?.name}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-semibold text-gray-800">${Number(p.sellingPrice).toFixed(2)}</p>
                      <StatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Needs Attention: low & out of stock */}
        <Card className="border border-gray-100 shadow-none">
          <CardHeader className="pb-3 border-b border-gray-50 flex-row items-center justify-between">
            <div>
              <CardTitle className="text-base font-semibold text-gray-900">Needs Attention</CardTitle>
              <CardDescription className="text-xs text-gray-400">Low or out-of-stock products</CardDescription>
            </div>
            <Link
              href="/dashboard/products"
              className="text-xs font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 flex-shrink-0"
            >
              View all <ArrowRight className="h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent className="p-0">
            {lowStockProducts.length === 0 ? (
              <p className="text-center text-sm text-gray-400 py-10">All products are well stocked.</p>
            ) : (
              <div className="divide-y divide-gray-50">
                {lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between gap-3 px-5 py-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.stock} left in stock</p>
                    </div>
                    <StatusBadge stock={p.stock} lowStockThreshold={p.lowStockThreshold} />
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  )
}
