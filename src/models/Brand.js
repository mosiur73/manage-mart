import mongoose from "mongoose"

const BrandSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a brand name."],
      trim: true,
      maxlength: [80, "Name cannot be more than 80 characters"],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Brand || mongoose.model("Brand", BrandSchema)
