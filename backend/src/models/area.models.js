import mongoose from "mongoose";

const areaSchema = new mongoose.Schema(
  {
    name: { 
      type: String, 
      required: true,
      unique: true,
      trim: true
    },

    extraCharge: { 
      type: Number, 
      default: 0,
      min: 0
    },

    active: { 
      type: Boolean, 
      default: true 
    }
  },
  { timestamps: true }
);

areaSchema.index({ active: 1 });
areaSchema.index({ name: 1 });

export default mongoose.model("Area", areaSchema); 