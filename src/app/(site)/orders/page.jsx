import Link from "next/link"
import { redirect } from "next/navigation"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { getMyOrders } from "./actions"
import OrderTimeline from "@/components/orders/OrderTimeline"
import CancelOrderButton from "@/components/orders/CancelOrderButton"

export const metadata = {
  title: "My Orders",
}

export default async function OrdersPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    redirect("/auth/signin?callbackUrl=/orders")
  }

  const orders = await getMyOrders()

  return (
    <div className="container mx-auto px-4 py-10 md:py-16">
      <h1 className="text-3xl font-bold mb-8">My Orders</h1>

      {orders.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">You haven&apos;t placed any orders yet.</p>
          <Button asChild>
            <Link href="/service">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-6 max-w-2xl">
          {orders.map((order) => (
            <Card key={order._id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-mono">
                    #{order._id.slice(-8).toUpperCase()}
                  </CardTitle>
                  <CardDescription>
                    {new Date(order.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </CardDescription>
                </div>
                <span className="text-lg font-bold">${order.total.toFixed(2)}</span>
              </CardHeader>
              <CardContent className="space-y-4">
                <OrderTimeline status={order.status} />
                <div className="space-y-1 text-sm text-muted-foreground border-t pt-3">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between">
                      <span>
                        {item.name} <span className="text-xs">× {item.quantity}</span>
                      </span>
                      <span>${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <CancelOrderButton
                  orderId={order._id}
                  status={order.status}
                  cancellationRequested={order.cancellationRequested}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
