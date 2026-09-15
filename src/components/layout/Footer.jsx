import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-12">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-4">
          <Link href="/" className="flex items-center justify-start">
            <ShoppingBag className="h-7 w-7 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground ml-2">Manage Mart</span>
          </Link>
          <p className="text-sm leading-relaxed">
            A multi-vendor marketplace — shop from independent sellers, or start selling your
            own products in minutes.
          </p>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-foreground">Shop</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/service" className="text-sm hover:underline">
                Browse Products
              </Link>
            </li>
            <li>
              <Link href="/#features" className="text-sm hover:underline">
                Features
              </Link>
            </li>
            <li>
              <Link href="/#sell" className="text-sm hover:underline">
                Sell With Us
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-foreground">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/#about" className="text-sm hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/#testimonials" className="text-sm hover:underline">
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-sm hover:underline">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} Manage Mart. All rights reserved.</p>
      </div>
    </footer>
  )
}
