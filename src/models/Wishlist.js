import mongoose from "mongoose"

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Denormalized display fields — same pattern as Cart, avoids a populate() per read.
    name: String,
    price: Number,
    img: String,
    category: String,
  },
  { timestamps: true }
)

// One saved entry per user per product.
WishlistSchema.index({ user: 1, product: 1 }, { unique: true })

export default mongoose.models.Wishlist || mongoose.model("Wishlist", WishlistSchema)
