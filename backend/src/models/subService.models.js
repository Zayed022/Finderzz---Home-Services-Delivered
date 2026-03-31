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

  withMaterial:{
    type: Boolean,
    default: false,
  },

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

  active: {
    type: Boolean,
    default: true
  },
  processId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Process",
    default: null
  }

},
{ timestamps: true }
);

subServiceSchema.index({ serviceId: 1 });
subServiceSchema.index({ active: 1 });

export default mongoose.model("SubService", subServiceSchema);