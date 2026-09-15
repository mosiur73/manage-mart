"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function WishlistPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  async function fetchWishlist() {
    try {
      const res = await fetch("/api/wishlist");
      if (res.status === 401) {
        setItems([]);
        setLoading(false);
        return;
      }
      const data = await res.json();
      setItems(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  async function handleRemove(productId) {
    try {
      const res = await fetch(`/api/wishlist?productId=${productId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Remove failed");
      toast.success("Removed from wishlist");
      setItems((prev) => prev.filter((item) => item.product !== productId));
    } catch (err) {
      toast.error(err.message);
    }
  }

  async function handleAddToCart(item) {
    try {
      const res = await fetch("/api/Cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: item.product,
          name: item.name,
          price: item.price,
          img: item.img,
          category: item.category,
        }),
      });
      if (res.ok) {
        toast.success(`${item.name} added to cart`);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }
  }

  if (loading) return <p className="container mx-auto p-6">Loading...</p>;

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Wishlist</h1>
      {items.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
          <Button asChild>
            <Link href="/service">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded rounded-tl-2xl rounded-tr-2xl shadow relative">
              <img
                src={item.img || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-52 object-cover mb-4 rounded-tl-2xl rounded-tr-2xl"
              />
              <div className="py-2 space-y-2">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-xl font-semibold">{item.name}</CardTitle>
                  <CardDescription className="text-sm text-muted-foreground">{item.category}</CardDescription>
                </CardHeader>
                <CardContent className="p-4 pt-0">
                  <span className="text-2xl font-bold text-primary">${item.price.toFixed(2)}</span>
                </CardContent>
                <CardFooter className="p-4 pt-0 flex gap-2">
                  <Button size="sm" className="flex-1" onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleRemove(item.product)}>
                    Remove
                  </Button>
                </CardFooter>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
