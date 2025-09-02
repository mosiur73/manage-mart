import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    productId: String,
    name: String,
    price: Number,
    img: String,
    category: String,
    seller: String,
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", CartSchema);
