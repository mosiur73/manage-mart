"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useSession } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  BarChart3,
  Settings,
  Tag,
  Award,
  ChevronLeft,
  ChevronRight,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const sidebarItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "All Products",
    href: "/dashboard/products",
    icon: Package,
  },
  {
    label: "Create Product",
    href: "/dashboard/create",
    icon: PlusCircle,
  },
  {
    label: "Orders",
    href: "/dashboard/orders",
    icon: ShoppingCart,
    badge: "3",
  },
  {
    label: "Categories",
    href: "/dashboard/categories",
    icon: Tag,
    adminOnly: true,
  },
  {
    label: "Brands",
    href: "/dashboard/brands",
    icon: Award,
    adminOnly: true,
  },
  {
    label: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export default function DashboardLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()
  const { data: session } = useSession()
  const visibleItems = sidebarItems.filter((item) => !item.adminOnly || session?.user?.role === "admin")

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside
        className={cn(
          "sticky top-0 h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 z-40",
          collapsed ? "w-16" : "w-60"
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center justify-between px-4 h-16 border-b border-gray-100">
          {!collapsed && (
            <span className="font-semibold text-sm text-gray-800 truncate">Dashboard</span>
          )}
          <Button
            variant="ghost"
            size="icon"
            className={cn("h-7 w-7 rounded-md text-gray-400 hover:text-gray-700", collapsed && "mx-auto")}
            onClick={() => setCollapsed(!collapsed)}
          >
            {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
          </Button>
        </div>

        {/* Nav Items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
  {visibleItems.map((item) => {
    const active = isActive(item)
    const Icon = item.icon

    return (
      <Link
        key={item.href}
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
          active
            ? "bg-blue-50 text-blue-700"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900",
          collapsed && "justify-center px-2"
        )}
      >
        <Icon
          className={cn(
            "h-4 w-4 flex-shrink-0",
            active ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
          )}
        />
        {!collapsed && <span className="truncate">{item.label}</span>}
        {!collapsed && item.badge && (
          <Badge className="ml-auto h-5 px-1.5 text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
            {item.badge}
          </Badge>
        )}
      </Link>
    )
  })}
</nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-3 border-t border-gray-100">
            <div className="rounded-lg bg-blue-50 p-3">
              <p className="text-xs font-medium text-blue-800">Pro Plan</p>
              <p className="text-xs text-blue-600 mt-0.5">Upgrade for more features</p>
            </div>
          </div>
        )}
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <div className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {visibleItems.find((i) => isActive(i))?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="relative h-8 w-8">
              <Bell className="h-4 w-4 text-gray-500" />
              <span className="absolute -top-0.5 -right-0.5 h-2 w-2 rounded-full bg-red-500" />
            </Button>
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}