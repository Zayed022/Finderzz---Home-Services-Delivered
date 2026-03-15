import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    verticalId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vertical",
      required: true,
    },

    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    phone:{
      type: Number,
      required: true,
    },

    responses: mongoose.Schema.Types.Mixed, // dynamic data

    status: {
      type: String,
      enum: [
        "pending",
        "quoted",
        "accepted",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Request",
  requestSchema
);