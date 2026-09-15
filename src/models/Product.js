import mongoose from "mongoose"

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a product name."],
      trim: true,
      maxlength: [120, "Name cannot be more than 120 characters"],
    },
    slug: {
      type: String,
      required: [true, "Please provide a slug."],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: [160, "Slug cannot be more than 160 characters"],
    },
    description: {
      type: String,
      required: [true, "Please provide a description."],
    },
    price: {
      type: Number,
      required: [true, "Please provide a price."],
      min: [0, "Price cannot be negative"],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Please select a category."],
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      required: [true, "Please select a brand."],
    },
    images: {
      type: [String],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one product image is required.",
      },
    },
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },
    shipping: {
      type: Number,
      default: 0,
      min: [0, "Shipping cost cannot be negative"],
    },
    ratings: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    ratingsCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "A product must belong to a seller."],
    },
  },
  { timestamps: true }
)

ProductSchema.index({ category: 1 })
ProductSchema.index({ brand: 1 })

export default mongoose.models.Product || mongoose.model("Product", ProductSchema)
