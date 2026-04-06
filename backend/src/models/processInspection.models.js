import mongoose from "mongoose";

const processInspectionStepSchema = new mongoose.Schema({
  stepNumber: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, { _id: false });

const processInspectionSchema = new mongoose.Schema({
    serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Service",
    required: true,
    unique: true // one process per sub-service
  },
  

  steps: {
    type: [processInspectionStepSchema],
    required: true,
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "At least one process step is required"
    }
  }

}, { timestamps: true });

export default mongoose.model("ProcessInspection", processInspectionSchema);