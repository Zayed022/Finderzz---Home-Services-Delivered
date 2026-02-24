import mongoose from "mongoose";

const workerSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },

    phone: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaarNumber: {
      type: String,
      required: true,
      trim: true,
    },

    panNumber: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaarImage: String,
    panImage: String,
    profileImage: String,

    address: String,

    skills: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "SubService",
      }
    ],

    assignedAreas: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      }
    ],

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: String,

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    totalJobs: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    }
  },
  { timestamps: true }
);

workerSchema.index({ skills: 1 });
workerSchema.index({ assignedAreas: 1 });

export default mongoose.model("Worker", workerSchema);