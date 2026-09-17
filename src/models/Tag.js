import mongoose from "mongoose"

const TagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide a tag name."],
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
    image: {
      type: String,
      default: "",
    },
    status: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
)

export default mongoose.models.Tag || mongoose.model("Tag", TagSchema)
