import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Clock, CheckCircle2, XCircle } from "lucide-react"

export const metadata = {
  title: "Orders — Dashboard",
}

const mockOrders = [
  {
    id: "ORD-001",
    customer: "Rahim Uddin",
    email: "rahim@example.com",
    product: "Banana",
    amount: "$12.00",
    status: "pending",
    date: "2025-08-24",
  },
  {
    id: "ORD-002",
    customer: "Karim Hossain",
    email: "karim@example.com",
    product: "Apple",
    amount: "$8.50",
    status: "completed",
    date: "2025-08-23",
  },
  {
    id: "ORD-003",
    customer: "Fatema Begum",
    email: "fatema@example.com",
    product: "Banana",
    amount: "$15.00",
    status: "pending",
    date: "2025-08-23",
  },
  {
    id: "ORD-004",
    customer: "Salam Mia",
    email: "salam@example.com",
    product: "Apple",
    amount: "$9.00",
    status: "cancelled",
    date: "2025-08-22",
  },
  {
    id: "ORD-005",
    customer: "Nadia Islam",
    email: "nadia@example.com",
    product: "Apple",
    amount: "$11.00",
    status: "pending",
    date: "2025-08-22",
  },
]

const statusConfig = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 border-amber-200",
    icon: Clock,
  },
  completed: {
    label: "Completed",
    className: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: CheckCircle2,
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-50 text-red-700 border-red-200",
    icon: XCircle,
  },
}

export default function OrdersPage() {
  const pending = mockOrders.filter((o) => o.status === "pending").length
  const completed = mockOrders.filter((o) => o.status === "completed").length
  const cancelled = mockOrders.filter((o) => o.status === "cancelled").length

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
            <p className="text-sm text-gray-400">{mockOrders.length} orders total</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
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
            <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-400">Completed</p>
              <p className="text-lg font-bold text-gray-900">{completed}</p>
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
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Order ID</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Customer</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden md:table-cell">Product</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide hidden sm:table-cell">Date</th>
                  <th className="text-left text-xs font-medium text-gray-400 px-3 py-3 uppercase tracking-wide">Amount</th>
                  <th className="text-right text-xs font-medium text-gray-400 px-5 py-3 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {mockOrders.map((order) => {
                  const status = statusConfig[order.status]
                  const StatusIcon = status.icon
                  return (
                    <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{order.id}</td>
                      <td className="px-3 py-3.5">
                        <p className="font-medium text-gray-800 text-sm">{order.customer}</p>
                        <p className="text-xs text-gray-400">{order.email}</p>
                      </td>
                      <td className="px-3 py-3.5 text-gray-600 hidden md:table-cell">{order.product}</td>
                      <td className="px-3 py-3.5 text-xs text-gray-400 hidden sm:table-cell">
                        {new Date(order.date).toLocaleDateString("en-US", {
                          month: "short", day: "numeric", year: "numeric",
                        })}
                      </td>
                      <td className="px-3 py-3.5 font-semibold text-gray-800">{order.amount}</td>
                      <td className="px-5 py-3.5 text-right">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full border ${status.className}`}>
                          <StatusIcon className="h-3 w-3" />
                          {status.label}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </>
  )
}