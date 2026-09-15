import mongoose from "mongoose"

const ReviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Proof of purchase — the order that makes this review "verified."
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },
    // Denormalized at write time so the review list doesn't need a populate() per load.
    userName: {
      type: String,
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 2000,
      default: "",
    },
  },
  { timestamps: true }
)

// One review per customer per product.
ReviewSchema.index({ product: 1, user: 1 }, { unique: true })

export default mongoose.models.Review || mongoose.model("Review", ReviewSchema)
