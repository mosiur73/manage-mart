import Link from "next/link"
import { CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { stripe } from "@/lib/stripe"

export const metadata = {
  title: "Payment Successful",
}

export default async function CheckoutSuccessPage({ searchParams }) {
  const { session_id } = await searchParams

  let checkoutSession = null
  if (session_id) {
    try {
      checkoutSession = await stripe.checkout.sessions.retrieve(session_id)
    } catch (error) {
      console.error("Failed to retrieve checkout session:", error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <CheckCircle2 className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
      <p className="text-muted-foreground mb-2">
        {checkoutSession?.amount_total
          ? `We've received your payment of $${(checkoutSession.amount_total / 100).toFixed(2)}.`
          : "Thank you for your order!"}
      </p>
      <p className="text-sm text-muted-foreground mb-8">
        Your order status will update to &quot;Paid&quot; automatically — this can take a few
        seconds while Stripe confirms the payment.
      </p>
      <div className="flex gap-3 justify-center">
        <Button asChild>
          <Link href="/service">Continue Shopping</Link>
        </Button>
      </div>
    </div>
  )
}
