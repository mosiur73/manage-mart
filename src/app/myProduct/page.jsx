"use client";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

export default function MyProductPage() {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCart();
  }, []);

  async function fetchCart() {
    try {
      const res = await fetch("/api/Cart");
      const data = await res.json();
      setCartItems(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  }

  // 🔹 Delete function
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/api/Cart?id=${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      alert("✅ Item deleted");

      // update UI
      setCartItems(cartItems.filter(item => item._id !== id));
    } catch (err) {
      alert("❌ " + err.message);
    }
  }

  if (loading) return <p>Loading...</p>;

  return (
    <section className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Products</h1>
      {cartItems.length === 0 ? (
        <p>No products in cart yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {cartItems.map((product) => (
            <div key={product._id} className="bg-white  rounded rounded-tl-2xl rounded-tr-2xl shadow relative">
              <img
                src={product.img || "/placeholder.svg"}
                alt={product.name}
                className="w-full h-52 object-cover mb-4  rounded-tl-2xl rounded-tr-2xl"
              />
             <div className=" py-2 space-y-2">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {product.category} by {product.seller}
                </CardDescription>
              </CardHeader>
             <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                </div> 
              </CardContent>
             <CardFooter className="p-4 pt-0">
             <button
                onClick={() => handleDelete(product._id)}
                className=" flex items-center bg-red-500 text-white px-2 py-1 rounded"
              >
                Delete
              </button>
              </CardFooter>
              
             </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
