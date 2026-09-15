import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ShoppingCart, Clock, CheckCircle2, Truck, XCircle, Undo2 } from "lucide-react"
import { getOrders } from "@/app/dashboard/order-actions"
import OrdersTable from "@/components/dashboard/OrdersTable"

export const metadata = {
  title: "Orders — Dashboard",
}

export default async function OrdersPage() {
  const orders = await getOrders()

  const pending = orders.filter((o) => o.status === "pending").length
  const paid = orders.filter((o) => o.status === "paid").length
  const shipped = orders.filter((o) => o.status === "shipped").length
  const cancelled = orders.filter((o) => o.status === "cancelled").length
  const refunded = orders.filter((o) => o.status === "refunded").length

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-violet-50 flex items-center justify-center">
            <ShoppingCart className="h-5 w-5 text-violet-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Orders</h2>
            <p className="text-sm text-gray-400">{orders.length} order{orders.length !== 1 ? "s" : ""} total</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <Clock className="h-4 w-4 text-amber-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Pending</p>
              <p className="text-lg font-bold text-gray-900">{pending}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <CheckCircle2 className="h-4 w-4 text-blue-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Paid</p>
              <p className="text-lg font-bold text-gray-900">{paid}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <Truck className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Shipped</p>
              <p className="text-lg font-bold text-gray-900">{shipped}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <XCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Cancelled</p>
              <p className="text-lg font-bold text-gray-900">{cancelled}</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border border-gray-100 shadow-none">
          <CardContent className="p-4 flex items-center gap-3">
            <Undo2 className="h-4 w-4 text-gray-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Refunded</p>
              <p className="text-lg font-bold text-gray-900">{refunded}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders Table */}
      <Card className="border border-gray-100 shadow-none">
        <CardHeader className="pb-3 border-b border-gray-50">
          <CardTitle className="text-base font-semibold text-gray-900">Recent Orders</CardTitle>
          <CardDescription className="text-xs text-gray-400">
            Manage and track customer orders
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <OrdersTable orders={orders} />
        </CardContent>
      </Card>
    </>
  )
}
