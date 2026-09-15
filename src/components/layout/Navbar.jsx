"use client"

import { useState } from "react"
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

const navigationItems = [
  { name: "Home", href: "/" },
  { name: "Dashboard", href: "/dashboard", roles: ["seller", "admin"] },
  { name: "Products", href: "/service" },
  { name: "My Cart", href: "/myProduct" },
  { name: "My Orders", href: "/orders", authRequired: true },
  { name: "Wishlist", href: "/wishlist", authRequired: true },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
]

export default function NavbarAuth() {
  const { data: session, status } = useSession()
  const [isSearchFocused, setIsSearchFocused] = useState(false)

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

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
     
      <div className="container mx-auto flex h-16 items-center justify-between px-4 pr-0">
        
        {/* Left Side: Logo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="font-bold inline-block">Manage Mart</span>
          </Link>

          {/* Desktop Navigation - Moved next to logo or centered based on preference */}
          <nav className="hidden md:flex items-center space-x-6">
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
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-4">
          {session ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs flex items-center justify-center">3</Badge>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                    <div className="font-medium">New product feedback</div>
                    <div className="text-sm text-muted-foreground">Sarah left feedback on the mobile app redesign</div>
                    <div className="text-xs text-muted-foreground">2 minutes ago</div>
                  </DropdownMenuItem>
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
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Settings</span>
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