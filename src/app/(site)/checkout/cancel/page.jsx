import Link from "next/link"
import { XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

export const metadata = {
  title: "Payment Cancelled",
}

export default function CheckoutCancelPage() {
  return (
    <div className="container mx-auto px-4 py-20 text-center max-w-lg">
      <XCircle className="h-16 w-16 text-red-500 mx-auto mb-6" />
      <h1 className="text-3xl font-bold mb-2">Payment Cancelled</h1>
      <p className="text-muted-foreground mb-8">No charge was made — your cart is still saved.</p>
      <Button asChild>
        <Link href="/myProduct">Back to Cart</Link>
      </Button>
    </div>
  )
}
