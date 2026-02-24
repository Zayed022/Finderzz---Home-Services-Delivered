import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    description: String,
    order: { type: Number, default: 0 },
    active: { type: Boolean, default: true }
  },
  { timestamps: true }
);

categorySchema.index({ order: 1 });
categorySchema.index({ active: 1 });

export default mongoose.model("Category", categorySchema);