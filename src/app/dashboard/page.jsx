import { Suspense } from "react"
import PostList from "@/components/dashboard/PostList"
import CreatePostForm from "@/components/dashboard/CreatePostForm"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
// import { Toaster } from "@/components/ui/toaster" // Assuming you have shadcn Toaster
import { Toaster } from "sonner" // Updated import to sonner
import { getPosts } from "./action"

export default async function DashboardPage() {
  const posts = await getPosts()

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center mb-10">Product Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card>
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
        <div>
          <Card>
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
    </div>
  )
}
