"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { StarIcon, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { createReview, deleteReview } from "@/app/(site)/service/review-actions"

function StarPicker({ value, onChange, disabled }) {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          disabled={disabled}
          onClick={() => onChange(n)}
          className="p-0.5 disabled:opacity-50"
        >
          <StarIcon className={`h-6 w-6 ${n <= value ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        </button>
      ))}
    </div>
  )
}

function StaticStars({ rating }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => (
        <StarIcon key={n} className={`h-4 w-4 ${n <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
      ))}
    </div>
  )
}

/**
 * @param {{ productId: string, reviews: Array<Object>, gate: Object }} props
 */
export default function ProductReviews({ productId, reviews, gate }) {
  const router = useRouter()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState("")
  const [isPending, startTransition] = useTransition()

  function handleSubmit(e) {
    e.preventDefault()
    startTransition(async () => {
      const result = await createReview({ productId, rating, comment })
      if (result.success) {
        toast.success(result.message)
        setComment("")
        setRating(5)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  function handleDelete(reviewId) {
    if (!window.confirm("Delete your review?")) return
    startTransition(async () => {
      const result = await deleteReview(reviewId)
      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }
    })
  }

  return (
    <div className="mt-12 space-y-8">
      <h2 className="text-2xl font-bold">Reviews {reviews.length > 0 && `(${reviews.length})`}</h2>

      {/* Review gate: form, already-reviewed, not-purchased, or signed-out */}
      <div className="border rounded-lg p-5 bg-gray-50 dark:bg-gray-900">
        {gate.status === "can-review" && (
          <form onSubmit={handleSubmit} className="space-y-3">
            <p className="text-sm font-medium">Write a review</p>
            <StarPicker value={rating} onChange={setRating} disabled={isPending} />
            <Textarea
              placeholder="Share your thoughts about this product (optional)"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={isPending}
              rows={3}
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Submitting..." : "Submit Review"}
            </Button>
          </form>
        )}

        {gate.status === "already-reviewed" && gate.review && (
          <div>
            <p className="text-sm font-medium mb-2">Your review</p>
            <div className="flex items-start justify-between gap-4">
              <div>
                <StaticStars rating={gate.review.rating} />
                {gate.review.comment && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{gate.review.comment}</p>
                )}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                disabled={isPending}
                onClick={() => handleDelete(gate.review._id)}
                className="text-gray-400 hover:text-red-600 hover:bg-red-50 flex-shrink-0"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {gate.status === "not-purchased" && (
          <p className="text-sm text-muted-foreground">
            Only customers who've purchased this product can leave a review.
          </p>
        )}

        {gate.status === "signed-out" && (
          <p className="text-sm text-muted-foreground">
            <Link href={`/auth/signin?callbackUrl=/service/${productId}`} className="text-primary hover:underline">
              Sign in
            </Link>{" "}
            to write a review (purchase required).
          </p>
        )}
      </div>

      {/* Review list */}
      {reviews.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reviews yet — be the first to review this product.</p>
      ) : (
        <div className="space-y-5">
          {reviews.map((review) => (
            <div key={review._id} className="border-b pb-5 last:border-b-0">
              <div className="flex items-center justify-between mb-1">
                <span className="font-medium text-sm">{review.userName}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </div>
              <StaticStars rating={review.rating} />
              {review.comment && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{review.comment}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
