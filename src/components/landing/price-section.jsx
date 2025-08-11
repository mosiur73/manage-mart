import Link from "next/link"
import { Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function PricingSection() {
  return (
    <section id="pricing" className="w-full py-12  animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            {/* <div className="inline-block rounded-lg bg-primary px-3 py-1 text-sm text-primary-foreground">Pricing</div> */}
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Simple, Transparent Pricing</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Choose the plan that best fits your team's needs. No hidden fees, no surprises.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-6xl items-start gap-10 py-12 lg:grid-cols-3">
          <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Starter</CardTitle>
              <CardDescription>Perfect for small teams getting started with product management.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">
                $19<span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Up to 5 Users
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Basic Dashboards
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Task Management
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Email Support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="#cta" prefetch={false}>
                  Choose Starter
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col justify-between border-2 border-primary hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Pro</CardTitle>
              <CardDescription>Ideal for growing teams needing advanced features and collaboration.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">
                $49<span className="text-base font-normal text-muted-foreground">/month</span>
              </div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Up to 20 Users
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Advanced Dashboards
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Analytics & Reporting
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Priority Support
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Seamless Collaboration
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full" asChild>
                <Link href="#cta" prefetch={false}>
                  Choose Pro
                </Link>
              </Button>
            </CardFooter>
          </Card>
          <Card className="flex flex-col justify-between hover:shadow-lg transition-shadow duration-300">
            <CardHeader>
              <CardTitle>Enterprise</CardTitle>
              <CardDescription>Custom solutions for large organizations with specific needs.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-4xl font-bold">Custom</div>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Unlimited Users
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Dedicated Account Manager
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  On-premise Deployment
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  Custom Integrations
                </li>
                <li>
                  <Check className="mr-2 inline-block h-4 w-4 text-primary" />
                  24/7 Premium Support
                </li>
              </ul>
            </CardContent>
            <CardFooter>
              <Button className="w-full bg-transparent" variant="outline" asChild>
                <Link href="#cta" prefetch={false}>
                  Contact Sales
                </Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </div>
    </section>
  )
}
