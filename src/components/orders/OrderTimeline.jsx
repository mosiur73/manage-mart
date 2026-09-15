import { Check, X, Undo2 } from "lucide-react"

const STEPS = ["pending", "paid", "shipped"]

/**
 * @param {{ status: string }} props
 */
export default function OrderTimeline({ status }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-red-600">
        <X className="h-4 w-4" /> Order Cancelled
      </div>
    )
  }

  if (status === "refunded") {
    return (
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600">
        <Undo2 className="h-4 w-4" /> Order Refunded
      </div>
    )
  }

  const currentIndex = STEPS.indexOf(status)

  return (
    <div className="flex items-center">
      {STEPS.map((step, index) => {
        const reached = index <= currentIndex
        const isLast = index === STEPS.length - 1
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`h-6 w-6 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                  reached ? "bg-emerald-500 text-white" : "bg-gray-200 text-gray-400"
                }`}
              >
                {reached ? <Check className="h-3.5 w-3.5" /> : index + 1}
              </div>
              <span className={`text-xs mt-1 capitalize ${reached ? "text-gray-800" : "text-gray-400"}`}>
                {step}
              </span>
            </div>
            {!isLast && (
              <div className={`flex-1 h-0.5 mx-2 ${index < currentIndex ? "bg-emerald-500" : "bg-gray-200"}`} />
            )}
          </div>
        )
      })}
    </div>
  )
}
