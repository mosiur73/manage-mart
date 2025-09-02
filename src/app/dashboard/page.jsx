import { Suspense } from "react"
import PostList from "@/components/dashboard/PostList"
import CreatePostForm from "@/components/dashboard/CreatePostForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Toaster } from "sonner"
import { getPosts } from "./action"
import Link from "next/link"
import { Package, PlusCircle } from "lucide-react" 

export default async function DashboardPage() {
  const posts = await getPosts()

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-200 text-white flex flex-col p-6 space-y-6">
        <h2 className="text-2xl text-black font-bold tracking-tight mb-6">Dashboard</h2>
        <nav className="flex flex-col space-y-4">
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-black text-xl hover:bg-gray-800 hover:text-white transition"
          >
            <Package size={20} /> All Products
          </Link>
          <Link
            href="#"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-black text-xl hover:bg-gray-800 hover:text-white transition"
          >
            <PlusCircle size={20} /> Create Product
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 bg-gray-50">
        <h1 className="text-4xl font-bold mb-10">Product Dashboard</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Posts List */}
          <div className="lg:col-span-2">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Existing Products/Posts</CardTitle>
              </CardHeader>
              <CardContent>
                <Suspense fallback={<div>Loading posts...</div>}>
                  <PostList posts={posts} />
                </Suspense>
              </CardContent>
            </Card>
          </div>

          {/* Create Form */}
          <div>
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Create New Product/Post</CardTitle>
              </CardHeader>
              <CardContent>
                <CreatePostForm />
              </CardContent>
            </Card>
          </div>
        </div>
        <Toaster />
      </main>
    </div>
  )
}
