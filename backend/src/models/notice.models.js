import mongoose from "mongoose";

const noticeSchema = new mongoose.Schema(
{
  heading: {
    type: String,
    required: true,
    trim: true,
  },

  message: {
    type: String,
    required: true,
    trim: true,
  },

  // Predefined icon set (controlled UI)
  icon: {
    type: String,
    enum: [
      "info",
      "warning",
      "time",
      "alert",
      "shield"
    ],
    default: "info",
  },

  // Determines color theme automatically
  type: {
    type: String,
    enum: ["info", "warning", "delay", "critical"],
    default: "info",
  },

  active: {
    type: Boolean,
    default: true,
  },

},
{ timestamps: true }
);

export default mongoose.model("Notice", noticeSchema);