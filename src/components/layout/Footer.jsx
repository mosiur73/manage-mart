import Link from "next/link"
import { MountainIcon, TwitterIcon, LinkedinIcon, GithubIcon } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-400 py-12 md:py-12">
      <div className="container mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <Link href="#" className="flex items-center justify-start" prefetch={false}>
            <MountainIcon className="h-8 w-8 text-primary-foreground" />
            <span className="text-2xl font-bold text-primary-foreground ml-2">ProductFlow</span>
          </Link>
          <p className="text-sm leading-relaxed">
            Streamline your product management workflow with intuitive tools for planning, tracking, and launching.
          </p>
          <div className="flex space-x-4">
            <Link href="#" className="text-gray-400 hover:text-primary-foreground transition-colors" prefetch={false}>
              <TwitterIcon className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-primary-foreground transition-colors" prefetch={false}>
              <LinkedinIcon className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </Link>
            <Link href="#" className="text-gray-400 hover:text-primary-foreground transition-colors" prefetch={false}>
              <GithubIcon className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </Link>
          </div>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-foreground">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#features" className="text-sm hover:underline" prefetch={false}>
                Features
              </Link>
            </li>
            <li>
              <Link href="#pricing" className="text-sm hover:underline" prefetch={false}>
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Integrations
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Roadmap
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-foreground">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#about" className="text-sm hover:underline" prefetch={false}>
                About Us
              </Link>
            </li>
            <li>
              <Link href="#testimonials" className="text-sm hover:underline" prefetch={false}>
                Testimonials
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Blog
              </Link>
            </li>
          </ul>
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-primary-foreground">Legal</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="#" className="text-sm hover:underline" prefetch={false}>
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="container mx-auto px-4 md:px-6 mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} ProductFlow. All rights reserved.</p>
      </div>
    </footer>
  )
}
