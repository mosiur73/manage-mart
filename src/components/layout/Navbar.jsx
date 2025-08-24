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
  { name: "Dashboard", href: "/dashboard", protected: true },
  // { name: "Products", href: "/products" },
  { name: "Products", href: "/service" },
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

  // Filter navigation items based on auth status
  const visibleNavItems = navigationItems.filter((item) => !item.protected || (item.protected && session))

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-primary-foreground">
              <Package className="h-4 w-4" />
            </div>
            <span className="hidden font-bold sm:inline-block">ProductHub</span>
          </Link>
        </div>

        {/* Centered Navigation and Search */}
        <div className="flex flex-1 justify-center">
          <div className="flex items-center space-x-8">
            {/* Desktop Navigation - Centered */}
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

            {/* Search Bar - Centered and only shown when authenticated */}
            {session && (
              <div className="hidden md:block w-64">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="pl-10"
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                </div>
              </div>
            )} 
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center space-x-2">
          {session ? (
            <>
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    <Badge className="absolute -right-1 -top-1 h-5 w-5 rounded-full p-0 text-xs">3</Badge>
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
                  <DropdownMenuItem className="flex flex-col items-start space-y-1 p-3">
                    <div className="font-medium">Sprint completed</div>
                    <div className="text-sm text-muted-foreground">Development team completed Sprint 24</div>
                    <div className="text-xs text-muted-foreground">1 hour ago</div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center space-x-2 px-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name} />
                      <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                    </Avatar>
                    <div className="hidden md:flex flex-col items-start">
                      <span className="text-sm font-medium">{session.user?.name}</span>
                      <span className="text-xs text-muted-foreground">{session.user?.role || "User"}</span>
                    </div>
                    <ChevronDown className="h-4 w-4" />
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
            /* Sign In Button for unauthenticated users */
            <div className="flex items-center space-x-2">
              <Link href="/auth/signin">
                <Button variant="ghost">
                  <LogIn className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </Link>
              <Link href="/auth/signup">
                <Button>Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu */}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <div className="flex flex-col space-y-4 mt-4">
                {session ? (
                  <>
                    <div className="flex items-center space-x-2 pb-4 border-b">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={session.user?.image || "/placeholder.svg"} alt={session.user?.name} />
                        <AvatarFallback>{getInitials(session.user?.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col">
                        <span className="font-medium">{session.user?.name}</span>
                        <span className="text-sm text-muted-foreground">{session.user?.role || "User"}</span>
                      </div>
                    </div>

                    {/* Mobile Search */}
                    {session && (
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="search"
                          placeholder="Search..."
                          className="pl-10"
                        />
                      </div>
                    )}

                    <nav className="flex flex-col space-y-2">
                      {visibleNavItems.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          className="rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-accent"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </nav>

                    <div className="pt-4 border-t">
                      <div className="flex flex-col space-y-2">
                        <Button variant="ghost" className="justify-start">
                          <Settings className="mr-2 h-4 w-4" />
                          Settings
                        </Button>
                        <Button variant="ghost" className="justify-start text-red-600" onClick={handleSignOut}>
                          <LogOut className="mr-2 h-4 w-4" />
                          Log out
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col space-y-2">
                    <Link href="/auth/signin">
                      <Button variant="ghost" className="w-full justify-start">
                        <LogIn className="mr-2 h-4 w-4" />
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/auth/signup">
                      <Button className="w-full">Sign Up</Button>
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  )
}