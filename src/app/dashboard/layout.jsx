"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  ShoppingCart,
  BarChart3,
  Settings,
  Tag,
  Tags,
  Award,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronsUpDown,
  User,
  LogOut,
  Search,
  Bell,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { getNotifications } from "@/app/notifications-actions"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const NOTIFICATIONS_POLL_MS = 60_000

function getInitials(name) {
  return (
    name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "U"
  )
}

function timeAgo(isoString) {
  const diffMs = Date.now() - new Date(isoString).getTime()
  const minutes = Math.round(diffMs / 60_000)
  if (minutes < 1) return "just now"
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? "" : "s"} ago`
  const hours = Math.round(minutes / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? "" : "s"} ago`
}

const sidebarItems = [
  {
    label: "Overview",
    href: "/dashboard",
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: "Products",
    icon: Package,
    children: [
      { label: "List Products", href: "/dashboard/products", icon: Package },
      { label: "Add Product", href: "/dashboard/create", icon: PlusCircle },
    ],
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
    label: "Tags",
    href: "/dashboard/tags",
    icon: Tags,
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
  const [openGroups, setOpenGroups] = useState({})
  const [search, setSearch] = useState("")
  const [notifications, setNotifications] = useState({ items: [], count: 0 })
  const pathname = usePathname()
  const router = useRouter()
  const { data: session } = useSession()
  const visibleItems = sidebarItems.filter((item) => !item.adminOnly || session?.user?.role === "admin")

  const userId = session?.user?.id

  useEffect(() => {
    if (!userId) {
      setNotifications({ items: [], count: 0 })
      return
    }

    let cancelled = false
    const load = async () => {
      const result = await getNotifications()
      if (!cancelled) setNotifications(result)
    }

    load()
    const interval = setInterval(load, NOTIFICATIONS_POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [userId])

  const isActive = (item) => {
    if (item.exact) return pathname === item.href
    return pathname.startsWith(item.href)
  }

  const isChildActive = (item) => item.children?.some((child) => pathname.startsWith(child.href))

  function handleSearchSubmit(e) {
    e.preventDefault()
    const q = search.trim()
    router.push(q ? `/dashboard/products?search=${encodeURIComponent(q)}` : "/dashboard/products")
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
    if (item.children) {
      const childActive = isChildActive(item)
      const Icon = item.icon

      if (collapsed) {
        return (
          <Link
            key={item.label}
            href={item.children[0].href}
            title={item.label}
            className={cn(
              "flex items-center justify-center px-2 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
              childActive
                ? "bg-blue-50 text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 flex-shrink-0",
                childActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )}
            />
          </Link>
        )
      }

      const isOpen = openGroups[item.label] ?? childActive

      return (
        <div key={item.label}>
          <button
            type="button"
            onClick={() => setOpenGroups((prev) => ({ ...prev, [item.label]: !isOpen }))}
            className={cn(
              "flex w-full items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 group",
              childActive
                ? "text-blue-700"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 flex-shrink-0",
                childActive ? "text-blue-600" : "text-gray-500 group-hover:text-gray-700"
              )}
            />
            <span className="flex-1 text-left truncate">{item.label}</span>
            <ChevronDown
              className={cn(
                "h-4 w-4 flex-shrink-0 text-gray-400 transition-transform duration-150",
                isOpen && "rotate-180"
              )}
            />
          </button>
          {isOpen && (
            <div className="mt-1 ml-4 space-y-1 border-l border-gray-100 pl-3">
              {item.children.map((child) => {
                const active = pathname.startsWith(child.href)
                const ChildIcon = child.icon
                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 rounded-md text-sm font-medium transition-colors",
                      active
                        ? "bg-blue-50 text-blue-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <ChildIcon
                      className={cn("h-3.5 w-3.5 flex-shrink-0", active ? "text-blue-600" : "text-gray-400")}
                    />
                    <span className="truncate">{child.label}</span>
                  </Link>
                )
              })}
            </div>
          )}
        </div>
      )
    }

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

        {/* User Profile */}
        <div className="border-t border-gray-100 p-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={cn(
                  "flex w-full items-center gap-2 rounded-lg p-2 text-left hover:bg-gray-100",
                  collapsed && "justify-center"
                )}
              >
                <Avatar className="h-8 w-8 border flex-shrink-0">
                  <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name} />
                  <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                </Avatar>
                {!collapsed && (
                  <>
                    <div className="flex-1 min-w-0 leading-tight">
                      <div className="truncate text-sm font-medium text-gray-800">
                        {session?.user?.name || "User"}
                      </div>
                      <div className="truncate text-xs text-gray-500">{session?.user?.email}</div>
                    </div>
                    <ChevronsUpDown className="h-4 w-4 flex-shrink-0 text-gray-400" />
                  </>
                )}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" side="top" className="w-56">
              <DropdownMenuLabel className="flex items-center gap-2">
                <Avatar className="h-8 w-8 border">
                  <AvatarImage src={session?.user?.image || "/placeholder.svg"} alt={session?.user?.name} />
                  <AvatarFallback>{getInitials(session?.user?.name)}</AvatarFallback>
                </Avatar>
                <div className="min-w-0 leading-tight">
                  <div className="truncate text-sm font-medium">{session?.user?.name || "User"}</div>
                  <div className="truncate text-xs text-gray-500">{session?.user?.email}</div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/dashboard">
                  <LayoutDashboard className="mr-2 h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/dashboard/settings">
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600" onClick={() => signOut({ callbackUrl: "/" })}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-gray-200 flex items-center gap-4 px-6">
          <form onSubmit={handleSearchSubmit} className="flex-1 flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full h-9 rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300"
              />
            </div>
          </form>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="relative flex-shrink-0">
                <Bell className="h-4 w-4 text-gray-500" />
                {notifications.count > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {notifications.count > 9 ? "9+" : notifications.count}
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-80">
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {notifications.items.length === 0 ? (
                <div className="p-3 text-sm text-muted-foreground">No new notifications</div>
              ) : (
                notifications.items.map((n) => (
                  <DropdownMenuItem key={n.id} asChild className="flex flex-col items-start space-y-1 p-3">
                    <Link href={n.href}>
                      <div className="font-medium">{n.title}</div>
                      <div className="text-sm text-muted-foreground">{n.description}</div>
                      <div className="text-xs text-muted-foreground">{timeAgo(n.time)}</div>
                    </Link>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}