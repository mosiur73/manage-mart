import mongoose from "mongoose"

const PostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title for this post."],
    maxlength: [60, "Title cannot be more than 60 characters"],
  },
  slug: {
    type: String,
    required: [true, "Please provide a slug for this post."],
    unique: true,
    maxlength: [100, "Slug cannot be more than 100 characters"],
  },
  content: {
    type: String,
    required: [true, "Please provide content for this post."],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// Ensure slug is updated on save
PostSchema.pre("save", function (next) {
  this.updatedAt = Date.now()
  next()
})

export default mongoose.models.Post || mongoose.model("Post", PostSchema)
