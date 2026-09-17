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
    shortDescription: {
      type: String,
      trim: true,
      maxlength: [200, "Short description cannot be more than 200 characters"],
    },
    sku: {
      type: String,
      trim: true,
      uppercase: true,
      sparse: true,
      unique: true,
    },
    tags: {
      type: [String],
      default: [],
    },
    // Internal cost — never returned by public-facing product reads (see
    // serializeProduct/stripInternalFields in dashboard/action.jsx).
    purchasePrice: {
      type: Number,
      min: [0, "Purchase price cannot be negative"],
      default: 0,
    },
    // The "was" price shown struck through next to sellingPrice when a product is
    // discounted. Equal to sellingPrice for a non-discounted product.
    regularPrice: {
      type: Number,
      required: [true, "Please provide a regular price."],
      min: [0, "Regular price cannot be negative"],
    },
    // sellingPrice <= regularPrice is enforced at the application layer (zod, in
    // dashboard/action.jsx and the create/edit forms) — a Mongoose cross-field
    // validator here would need `this.regularPrice`, which isn't reliably
    // available during findOneAndUpdate (only on create/save).
    sellingPrice: {
      type: Number,
      required: [true, "Please provide a selling price."],
      min: [0, "Selling price cannot be negative"],
    },
    lowStockThreshold: {
      type: Number,
      min: [0, "Low stock threshold cannot be negative"],
      default: 5,
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
