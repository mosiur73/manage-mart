"use client"
import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import products from "@/../public/product.json"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { StarIcon } from "lucide-react"

export default function ServicePage() {
  const [search, setSearch] = useState("")
  const [priceRange, setPriceRange] = useState("")
  const [category, setCategory] = useState("All categories")
  const [currentPage, setCurrentPage] = useState(1)

  const productsPerPage = 12

  // category ber kora
  const categories = ["All categories", ...new Set(products.map((p) => p.category))]

  // price range list
  const priceRanges = [
    { label: "All price", value: "" },
    { label: "100 - 200", value: "100-200" },
    { label: "200 - 300", value: "200-300" },
    { label: "300 - 400", value: "300-400" },
  ]

  // Filter logic
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory =
      category === "" || category === "All categories" || product.category === category

    let matchesPrice = true
    if (priceRange) {
      const [min, max] = priceRange.split("-").map(Number)
      matchesPrice = product.price >= min && product.price <= max
    }

    return matchesSearch && matchesCategory && matchesPrice
  })

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct)
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage)

 // Add to cart function
  async function handleAddToCart(product) {
  try {
    const res = await fetch("/api/Cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(product),
    });

    if (res.ok) {
      alert("✅ Added to cart!");
    } else {
      alert("❌ Failed to add.");
    }
  } catch (err) {
    console.error(err);
  }
}


  

  return (
    <section className="container mx-auto px-6 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">Our Products</h1>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
        {/* Search */}
        <input
          type="text"
          placeholder="Search products..."
          className="border rounded-md px-4 py-2 w-full sm:w-64"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value)
            setCurrentPage(1)
          }}
        />

        {/* Category Dropdown */}
        <select
          className="border rounded-md px-4 py-2 w-full sm:w-48"
          value={category}
          onChange={(e) => {
            setCategory(e.target.value)
            setCurrentPage(1)
          }}
        >
          {categories.map((cat, i) => (
            <option key={i} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        {/* Price Dropdown */}
        <select
          className="border rounded-md px-4 py-2 w-full sm:w-48"
          value={priceRange}
          onChange={(e) => {
            setPriceRange(e.target.value)
            setCurrentPage(1)
          }}
        >
          {priceRanges.map((range, i) => (
            <option key={i} value={range.value}>
              {range.label}
            </option>
          ))}
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {currentProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden flex flex-col"
          >
            <Image
              src={product.img}
              alt={product.name}
              width={400}
              height={300}
              className="w-full h-56 object-cover"
            />

            <div className="flex flex-col flex-1">
              <CardHeader className="p-4 pb-2">
                <CardTitle className="text-xl font-semibold">{product.name}</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  {product.category} by {product.seller}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-2xl font-bold text-primary">${product.price.toFixed(2)}</span>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <StarIcon className="w-4 h-4 fill-yellow-400 text-yellow-400 mr-1" />
                    <span>
                      {product.ratings} ({product.ratingsCount})
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">{product.description}</p>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <div className="flex gap-2 w-full">
                  {/* <Button className="flex-1">Add to Cart</Button> */}
                  <Button className="flex-1" onClick={() => handleAddToCart(product)}>
                      Add to Cart
                    </Button>
                                      
                  <Button asChild variant="outline" className="flex-1 bg-transparent">
                    <Link href={`/service/${product.id}`} prefetch={false}>
                      Details
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-8">
        <Button
          variant="outline"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
        >
          Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="outline"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
        >
          Next
        </Button>
      </div>
    </section>
  )
}
