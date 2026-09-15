import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="w-full py-12  border-t bg-gradient-to-r from-primary-foreground to-primary-background animate-fade-in"
    >
      <div className="container grid items-center justify-center gap-6 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Ready to Start Shopping — or Selling?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join Manage Mart today. Browse thousands of products, or set up your seller account
            in minutes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg" asChild>
            <Link href="/auth/signup">Create Free Account</Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/service">Browse Products</Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
