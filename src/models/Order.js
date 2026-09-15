import mongoose from "mongoose"

const OrderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
    // Denormalized at checkout time so seller-scoped order queries (Phase 3 RBAC)
    // don't need to join back through Product for every order.
    seller: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    price: Number,
    quantity: { type: Number, min: 1, default: 1 },
  },
  { _id: false }
)

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "An order must contain at least one item.",
      },
    },
    total: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "cancelled", "refunded"],
      default: "pending",
    },
    // Customer asked to cancel a `paid` order — a real refund needs a seller/admin to
    // action it (see refundOrder in order-actions.js), not a one-click customer action.
    cancellationRequested: {
      type: Boolean,
      default: false,
    },
    stripeSessionId: {
      type: String,
      unique: true,
      sparse: true,
    },
    paymentIntentId: String,
    shippingAddress: {
      name: String,
      email: String,
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
  },
  { timestamps: true }
)

OrderSchema.index({ "items.seller": 1 })

export default mongoose.models.Order || mongoose.model("Order", OrderSchema)
