import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
  {
    bannerImage: {
      type: String,
      required: true,
    },

    title: String,
    redirectUrl: String,

    order: {
      type: Number,
      default: 0,
    },

    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ order: 1 });
bannerSchema.index({ active: 1 });

export default mongoose.model("Banner", bannerSchema);