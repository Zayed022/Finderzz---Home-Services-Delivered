import mongoose from "mongoose";

const subServiceSchema = new mongoose.Schema(
{
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true
  },

  name: {
    type: String,
    required: true
  },

  description: String,

  workerPrice: {
    type: Number,
    required: true,
    min: 0
  },

  platformFee: {
    type: Number,
    required: true,
    min: 0
  },

  customerPrice: {
    type: Number,
    required: true,
    min: 0
  },

  durationEstimate: Number,

  /* ---------- INSPECTION FEATURE ---------- */

  inspectionAvailable: {
    type: Boolean,
    default: false
  },

  inspectionPrice: {
    type: Number,
    default: 0
  },

  inspectionDescription: {
    type: String
  },

  inspectionDuration: {
    type: Number
  },

  active: {
    type: Boolean,
    default: true
  }

},
{ timestamps: true }
);

subServiceSchema.index({ serviceId: 1 });
subServiceSchema.index({ active: 1 });

export default mongoose.model("SubService", subServiceSchema);