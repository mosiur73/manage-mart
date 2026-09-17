import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import dbConnect from "@/lib/mongodb"
import Cart from "@/models/Cart"
import { Button } from "@/components/ui/button"
import CheckoutForm from "@/components/checkout/CheckoutForm"

export const metadata = {
  title: "Checkout",
}

export default async function CheckoutPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/checkout")
  }

  await dbConnect()
  const cartItems = await Cart.find({ user: session.user.id }).sort({ createdAt: -1 }).lean()

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 text-center max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some products before checking out.</p>
        <Button asChild>
          <Link href="/service">Browse Products</Link>
        </Button>
      </div>
    )
  }

  const items = cartItems.map((item) => ({
    _id: item._id.toString(),
    product: item.product?.toString?.() ?? item.product,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }))
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <CheckoutForm
        items={items}
        total={total}
        userEmail={session.user.email}
        userName={session.user.name}
      />
    </div>
  )
}
