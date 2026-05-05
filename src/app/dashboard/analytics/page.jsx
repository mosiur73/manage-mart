import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { BarChart3, TrendingUp, Users, Eye, ArrowUpRight, ArrowDownRight } from "lucide-react"

export const metadata = {
  title: "Analytics — Dashboard",
}

const stats = [
  {
    label: "Total Views",
    value: "12,480",
    change: "+18%",
    up: true,
    icon: Eye,
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    label: "Total Revenue",
    value: "$3,240",
    change: "+12%",
    up: true,
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    label: "New Customers",
    value: "48",
    change: "+5%",
    up: true,
    icon: Users,
    color: "text-violet-600",
    bg: "bg-violet-50",
  },
  {
    label: "Conversion",
    value: "3.2%",
    change: "-0.4%",
    up: false,
    icon: BarChart3,
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
]

const monthlyData = [
  { month: "Mar", revenue: 820, orders: 12 },
  { month: "Apr", revenue: 940, orders: 15 },
  { month: "May", revenue: 760, orders: 10 },
  { month: "Jun", revenue: 1100, orders: 18 },
  { month: "Jul", revenue: 980, orders: 14 },
  { month: "Aug", revenue: 1240, orders: 20 },
]

const maxRevenue = Math.max(...monthlyData.map((d) => d.revenue))

const topProducts = [
  { name: "Banana", sales: 42, revenue: "$504", percent: 85 },
  { name: "Apple", sales: 38, revenue: "$380", percent: 72 },
]

export default function AnalyticsPage() {
  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <div className="h-9 w-9 rounded-lg bg-blue-50 flex items-center justify-center">
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Analytics</h2>
            <p className="text-sm text-gray-400">Performance overview — last 6 months</p>
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon
          return (
            <Card key={s.label} className="border border-gray-100 shadow-none">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className={`h-8 w-8 rounded-lg ${s.bg} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${s.color}`} />
                  </div>
                  <span className={`flex items-center text-xs font-medium ${s.up ? "text-emerald-600" : "text-red-500"}`}>
                    {s.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {s.change}
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bar Chart */}
        <div className="lg:col-span-2">
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-base font-semibold text-gray-900">Monthly Revenue</CardTitle>
              <CardDescription className="text-xs text-gray-400">Mar — Aug 2025</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="flex items-end gap-3 h-36">
                {monthlyData.map((d) => {
                  const heightPercent = (d.revenue / maxRevenue) * 100
                  return (
                    <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5">
                      <span className="text-xs font-medium text-gray-500">${(d.revenue / 1000).toFixed(1)}k</span>
                      <div className="w-full relative group">
                        <div
                          className="w-full bg-blue-100 rounded-md hover:bg-blue-200 transition-colors cursor-default"
                          style={{ height: `${(heightPercent / 100) * 96}px` }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">{d.month}</span>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Products */}
        <div>
          <Card className="border border-gray-100 shadow-none">
            <CardHeader className="pb-3 border-b border-gray-50">
              <CardTitle className="text-base font-semibold text-gray-900">Top Products</CardTitle>
              <CardDescription className="text-xs text-gray-400">By sales volume</CardDescription>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.name}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-gray-400">#{i + 1}</span>
                      <span className="text-sm font-medium text-gray-800">{p.name}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-900">{p.revenue}</span>
                      <span className="text-xs text-gray-400 ml-1">({p.sales} sales)</span>
                    </div>
                  </div>
                  <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: `${p.percent}%` }}
                    />
                  </div>
                </div>
              ))}

              <div className="pt-3 border-t border-gray-50">
                <div className="flex justify-between text-xs text-gray-400">
                  <span>Total Sales</span>
                  <span className="font-semibold text-gray-700">80 orders</span>
                </div>
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>Total Revenue</span>
                  <span className="font-semibold text-gray-700">$884</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}