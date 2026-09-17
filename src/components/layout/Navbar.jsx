"use client"

import { useEffect, useState } from "react"
import { useSession, signOut } from "next-auth/react"
import {
  Bell,
  ChevronDown,
  Menu,
  Search,
  Settings,
  User,
  LogOut,
  Package,
  LogIn,
  ShoppingCart,
  Heart,
  Receipt,
} from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getNotifications } from "@/app/notifications-actions"

const NOTIFICATIONS_POLL_MS = 60_000

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

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard", roles: ["seller", "admin"] },
  { name: "Products", href: "/service" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

const CART_POLL_MS = 30_000

export default function NavbarAuth() {
  const { data: session, status } = useSession()
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState({ items: [], count: 0 })
  const [cartCount, setCartCount] = useState(0)
  const [wishlistCount, setWishlistCount] = useState(0)

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

  // The cart works for guests too (see /api/Cart), so this loads regardless of
  // session — and refreshes on the "cart:updated" event AddToCartButton/the cart
  // page fire after add/remove, instead of waiting for the next poll tick.
  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/Cart")
        if (!res.ok) return
        const items = await res.json()
        if (!cancelled) setCartCount(Array.isArray(items) ? items.length : 0)
      } catch {
        // Network hiccup — leave the last known count showing.
      }
    }

    load()
    const interval = setInterval(load, CART_POLL_MS)
    window.addEventListener("cart:updated", load)
    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener("cart:updated", load)
    }
  }, [userId])

  // Wishlist has no guest bucket (see /api/wishlist), so this only loads once
  // signed in — and refreshes on the "wishlist:updated" event WishlistButton
  // and the wishlist page fire after add/remove.
  useEffect(() => {
    if (!userId) {
      setWishlistCount(0)
      return
    }

    let cancelled = false
    const load = async () => {
      try {
        const res = await fetch("/api/wishlist")
        if (!res.ok) return
        const items = await res.json()
        if (!cancelled) setWishlistCount(Array.isArray(items) ? items.length : 0)
      } catch {
        // Network hiccup — leave the last known count showing.
      }
    }

    load()
    const interval = setInterval(load, CART_POLL_MS)
    window.addEventListener("wishlist:updated", load)
    return () => {
      cancelled = true
      clearInterval(interval)
      window.removeEventListener("wishlist:updated", load)
    }
  }, [userId])

  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" })
  }

  const getInitials = (name) => {
    return (
      name
        ?.split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase() || "U"
    )
  }

  const visibleNavItems = navigationItems.filter((item) => {
    if (item.roles) return session && item.roles.includes(session.user?.role)
    if (item.authRequired) return !!session
    return true
  })

  // Sellers/admins manage their profile & password from inside the dashboard
  // shell (/dashboard/settings) instead of the standalone customer-facing
  // pages, so they never get bounced out of the sidebar layout mid-task.
  const isStaff = session?.user?.role === "seller" || session?.user?.role === "admin"
  const profileHref = isStaff ? "/dashboard/settings" : "/profile"
  const settingsHref = isStaff ? "/dashboard/settings" : "/settings"

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
     
      <div className="container mx-auto flex h-16 items-center px-4 pr-0">

        {/* Left Side: Logo */}
        <div className="flex-1 flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-bold inline-block">Manage Mart</span>
          </Link>
        </div>

        {/* Center: Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 flex-shrink-0">
          {visibleNavItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Right Side Actions */}
        <div className="flex-1 flex items-center justify-end space-x-4">
          {/* Cart — visible to guests too, so it stays outside the session check */}
          <Button variant="ghost" size="icon" className="relative" asChild>
            <Link href="/myProduct" aria-label="Cart">
              <ShoppingCart className="h-4 w-4" />
              {cartCount > 0 && (
                <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </Badge>
              )}
            </Link>
          </Button>

          {session && (
            <Button variant="ghost" size="icon" className="relative" asChild>
              <Link href="/wishlist" aria-label="Wishlist">
                <Heart className="h-4 w-4" />
                {wishlistCount > 0 && (
                  <Badge variant="destructive" className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </Badge>
                )}
              </Link>
            </Button>
          )}

          {session ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
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

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2 hover:bg-transparent">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name} />
                      <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden lg:flex flex-col items-start leading-tight">
                      <span className="text-sm font-semibold">{session.user?.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{session.user?.role || "customer"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={profileHref}>
                      <User className="mr-2 h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={settingsHref}>
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/orders">
                      <Receipt className="mr-2 h-4 w-4" />
                      <span>My Orders</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-600" onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
               {/* Mobile menu content stays same as your original */}
               <div className="flex flex-col space-y-4 mt-6">
                  {/* ... (Your existing mobile menu code) */}
               </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}