import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema(
  {
    stepNumber: { type: Number, required: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
  },
  { _id: false }
);

const processSchema = new mongoose.Schema(
  {
    serviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      default: null,
    },

    subServiceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubService",
      default: null,
    },

    steps: {
      type: [processStepSchema],
      required: true,
      validate: {
        validator: (val) => val.length > 0,
        message: "At least one step required",
      },
    },
  },
  { timestamps: true }
);

// ✅ Enforce exactly ONE reference


// ✅ UNIQUE per entity (NO duplicate processes)
processSchema.index({ serviceId: 1 }, { unique: true, sparse: true });
processSchema.index({ subServiceId: 1 }, { unique: true, sparse: true });

export default mongoose.model("Process", processSchema);