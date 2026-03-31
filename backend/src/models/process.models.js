import mongoose from "mongoose";

const processStepSchema = new mongoose.Schema({
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

const processSchema = new mongoose.Schema({
  subServiceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "SubService",
    required: true,
    unique: true // one process per sub-service
  },

  steps: {
    type: [processStepSchema],
    required: true,
    validate: {
      validator: function (val) {
        return val.length > 0;
      },
      message: "At least one process step is required"
    }
  }

}, { timestamps: true });

export default mongoose.model("Process", processSchema);