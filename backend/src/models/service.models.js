import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
    {
      categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required: true
      },
      name: { type: String, required: true },
      bannerImage: String,
      description: String,
      active: { type: Boolean, default: true }
    },
    { timestamps: true }
  );

  serviceSchema.index({ categoryId: 1 });
serviceSchema.index({ active: 1 });
  
  export default mongoose.model("Service", serviceSchema);