import Link from "next/link"
import { Package, Twitter, Facebook, Instagram, Linkedin, ArrowUpRight } from "lucide-react"

const linkColumns = [
  {
    title: "Shop",
    links: [
      { label: "Browse Products", href: "/service" },
      { label: "My Cart", href: "/myProduct" },
      { label: "Wishlist", href: "/wishlist" },
      { label: "My Orders", href: "/orders" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/auth/signin" },
      { label: "Create Account", href: "/auth/signup" },
    ],
  },
]

const socialLinks = [
  { label: "Twitter", href: "https://twitter.com", icon: Twitter },
  { label: "Facebook", href: "https://facebook.com", icon: Facebook },
  { label: "Instagram", href: "https://instagram.com", icon: Instagram },
  { label: "LinkedIn", href: "https://linkedin.com", icon: Linkedin },
]

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400">
      <div className="container mx-auto px-4 md:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr_1fr] gap-10 md:gap-8">
          {/* Brand */}
          <div className="space-y-5 max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600">
                <Package className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Manage Mart</span>
            </Link>
            <p className="text-sm leading-relaxed">
              A multi-vendor marketplace — shop from independent sellers, or start selling your
              own products in minutes.
            </p>
            <div className="flex items-center gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors hover:bg-blue-600 hover:text-white"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                )
              })}
            </div>
          </div>

          {/* Link columns */}
          {linkColumns.map((column) => (
            <div key={column.title} className="space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-white">{column.title}</h3>
              <ul className="space-y-2.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="group inline-flex items-center gap-1 text-sm text-slate-400 transition-colors hover:text-white"
                    >
                      {link.label}
                      <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1 transition-all group-hover:opacity-100 group-hover:translate-x-0" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container mx-auto px-4 md:px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Manage Mart. All rights reserved.</p>
          <p>Built for independent sellers, everywhere.</p>
        </div>
      </div>
    </footer>
  )
}
