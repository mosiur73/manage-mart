import products from "@/../public/product.json"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { StarIcon } from "lucide-react"

export default function ProductDetails({ params }) {
  const product = products.find((p) => p.id === String(params.id))

  if (!product) {
    return <div className="text-center py-20">Product Not Found</div>
  }



  return (
   
     <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12 items-start">
        <div className="flex justify-center items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-6">
          <Image
            src={product.img || "/placeholder.svg?height=600&width=600&query=product detail image"}
            alt={product.name}
            width={600}
            height={600}
            className="max-w-full h-auto object-contain"
          />
        </div>
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{product.name}</h1>
          <p className="text-2xl font-semibold text-primary">${product.price.toFixed(2)}</p>
          <div className="flex items-center text-sm text-muted-foreground">
            <StarIcon className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
            <span>
              {product.ratings} ({product.ratingsCount} ratings)
            </span>
          </div>
          <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">{product.description}</p>
          <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
            <p>
              <span className="font-medium">Category:</span> {product.category}
            </p>
            <p>
              <span className="font-medium">Seller:</span> {product.seller}
            </p>
            <p>
              <span className="font-medium">In Stock:</span>{" "}
              {product.stock > 0 ? `${product.stock} units` : "Out of Stock"}
            </p>
            <p>
              <span className="font-medium">Shipping Cost:</span>{" "}
              {product.shipping === 0 ? "Free" : `$${product.shipping.toFixed(2)}`}
            </p>
          </div>
          <div className="gap-4 flex">
             <Button className="" >
                      Add to Cart
                    </Button>
         
          <Button size="lg" className=" bg-gray-600 w-full md:w-auto">
            <Link href="/service" className="ml-4  text-white">
            Back to Products
          </Link>
          </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
