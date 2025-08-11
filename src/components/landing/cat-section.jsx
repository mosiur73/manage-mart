import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export default function CTASection() {
  return (
    <section
      id="cta"
      className="w-full py-12  border-t bg-gradient-to-r from-primary-foreground to-primary-background animate-fade-in"
    >
      <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
            Ready to Transform Your Product Workflow?
          </h2>
          <p className="mx-auto max-w-[600px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
            Join thousands of product teams who are building better products with ProductFlow.
          </p>
        </div>
        <div className="mx-auto w-full max-w-2xl space-y-2">
          <form className="flex gap-2">
            <Input type="email" placeholder="Enter your email" className="max-w-lg flex-1" />
            <Link href="/auth/signup">
            <Button type="submit">Sign Up</Button>
            </Link>
          </form>
          <p className="text-xs text-muted-foreground">
            Sign up to get started. By signing up, you agree to our{" "}
            <Link href="#" className="underline underline-offset-2" prefetch={false}>
              Terms &amp; Conditions
            </Link>
            .
          </p>
        </div>
      </div>
    </section>
  )
}
