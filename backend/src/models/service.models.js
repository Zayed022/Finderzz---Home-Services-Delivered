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
      type: String,
      required: true,
    },

    bannerImage: {
      type: String,
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

    /* ---------- NEW: INSPECTION AT SERVICE LEVEL ---------- */

    inspectionAvailable: {
      type: Boolean,
      default: false,
    },

    inspectionWorkerPrice: {
      type: Number,
      default: 0,
      min: 0,
    },

    inspectionPlatformFee: {
      type: Number,
      default: 0,
      min: 0,
    },

    inspectionPrice: {
      type: Number,
      default: 0,
    },

    inspectionDescription: {
      type: String,
    },

    inspectionDuration: {
      type: Number, // in minutes
    },
  },
  { timestamps: true }
);

serviceSchema.index({ categoryId: 1, order: 1 });

export default mongoose.model("Service", serviceSchema);