// import { getPostBySlug } from "@/app/dashboard/actions"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { getPostBySlug } from "@/app/dashboard/action"

/**
 * @param {{ params: { slug: string } }} props
 */
export default async function PostDetailPage({ params }) {
  console.log(`PostDetailPage received slug: "${params.slug}"`) // Debug log
  const post = await getPostBySlug(params.slug)

  if (!post) {
    console.log(`Post with slug "${params.slug}" not found, rendering 404.`) // Debug log
    notFound() // Renders the closest not-found.jsx
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
        <Button asChild variant="outline" className="mb-6 bg-transparent">
          <Link href="/dashboard">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-gray-100">{post.title}</h1>
        <p className="text-sm text-muted-foreground mb-6">
          Published on {new Date(post.createdAt).toLocaleDateString()} | Last updated on{" "}
          {new Date(post.updatedAt).toLocaleDateString()}
        </p>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <p>{post.content}</p>
          {/* You can add more rich content rendering here if needed */}
        </div>
      </div>
    </div>
  )
}
