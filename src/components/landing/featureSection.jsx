"use client"
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Search, ShieldCheck, Sparkles, Star, Truck, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Search,
    bg: "bg-blue-100",
    title: "Smart Product Search",
    description: "Filter by category, brand, and price to find exactly what you're looking for — fast.",
  },
  {
    icon: ShieldCheck,
    bg: "bg-purple-100",
    title: "Secure Checkout",
    description: "Stripe-powered payments with webhook-verified order fulfillment. Your card details never touch our servers.",
  },
  {
    icon: Sparkles,
    bg: "bg-green-100",
    title: "AI-Generated Listings",
    description: "Sellers write better product descriptions in one click with built-in AI assistance.",
  },
  {
    icon: Star,
    bg: "bg-orange-100",
    title: "Verified Reviews",
    description: "Only customers who actually purchased a product can review it — no fake ratings.",
  },
  {
    icon: Truck,
    bg: "bg-cyan-100",
    title: "Real Order Tracking",
    description: "Follow every order from pending to shipped, with email updates along the way.",
  },
  {
    icon: BarChart3,
    bg: "bg-yellow-100",
    title: "Seller Analytics",
    description: "Real revenue, top-product, and customer insights — computed live, not mocked.",
  },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="w-full py-12 bg-gray-200  animate-fade-in">
      <div className="container px-4 md:px-6">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Everything You Need to Shop & Sell</h2>
            <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              From AI-assisted listings to secure checkout, Manage Mart brings buyers and sellers
              together on one platform.
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-7xl items-start gap-6 py-12 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon
            return (
              <Card
                key={feature.title}
                className={`flex flex-col items-center p-6 text-center ${feature.bg} hover:shadow-2xl transition-shadow duration-400`}
              >
                <Icon className="h-10 w-10 text-primary mb-4" />
                <CardHeader>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardDescription>{feature.description}</CardDescription>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}
