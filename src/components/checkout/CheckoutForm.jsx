"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().min(1, "Email is required").email("Enter a valid email"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
})

/**
 * @param {{ items: Array<Object>, total: number, userEmail?: string, userName?: string }} props
 */
export default function CheckoutForm({ items, total, userEmail, userName }) {
  const [submitting, setSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: userName || "",
      email: userEmail || "",
      address: "",
      city: "",
      postalCode: "",
      country: "",
    },
  })

  async function onSubmit(values) {
    setSubmitting(true)
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ shippingAddress: values }),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.message || "Checkout failed. Please try again.")
        setSubmitting(false)
        return
      }

      window.location.href = data.url
    } catch (error) {
      console.error(error)
      toast.error("Something went wrong. Please try again.")
      setSubmitting(false)
    }
  }

  return (
    <div className="grid md:grid-cols-5 gap-8">
      <Card className="md:col-span-3">
        <CardHeader>
          <CardTitle>Shipping Details</CardTitle>
          <CardDescription>Where should we send your order?</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Jane Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="jane@example.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="123 Main St" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="Dhaka" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="postalCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Postal Code</FormLabel>
                      <FormControl>
                        <Input placeholder="1207" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder="Bangladesh" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                {submitting ? "Redirecting to payment..." : `Pay $${total.toFixed(2)}`}
              </Button>
              <p className="text-xs text-muted-foreground text-center">
                You'll be redirected to Stripe to complete payment securely.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 h-fit">
        <CardHeader>
          <CardTitle>Order Summary</CardTitle>
          <CardDescription>{items.length} item{items.length !== 1 ? "s" : ""}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {items.map((item) => (
            <div key={item._id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.name} <span className="text-muted-foreground">× {item.quantity}</span>
              </span>
              <span className="font-medium">${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
          <div className="border-t pt-3 flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
