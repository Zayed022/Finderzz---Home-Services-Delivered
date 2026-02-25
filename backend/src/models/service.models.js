import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    icon: {
      type: String, // Cloudinary URL
      required: true,
    },

    bannerImage: {
      type: String, // Large service banner
    },

    description: {
      type: String,
    },

    isPopular: {
      type: Boolean,
      default: false,
    },

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

serviceSchema.index({ categoryId: 1, order: 1 });

export default mongoose.model("Service", serviceSchema);