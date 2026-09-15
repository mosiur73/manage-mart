import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // null = guest cart (no logged-in user); scoping tightens once auth-gated checkout lands
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    name: String,
    price: Number,
    img: String,
    category: String,
    quantity: {
      type: Number,
      default: 1,
      min: [1, "Quantity cannot be less than 1"],
    },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
