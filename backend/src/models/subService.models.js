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

    // What worker earns
    workerPrice: {
      type: Number,
      required: true,
      min: 0
    },

    // Platform margin (fixed amount)
    platformFee: {
      type: Number,
      required: true,
      min: 0
    },

    // Final price shown to customer
    customerPrice: {
      type: Number,
      required: true,
      min: 0
    },

    durationEstimate: Number,

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