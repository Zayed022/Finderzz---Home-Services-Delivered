import mongoose from "mongoose";

const fieldSchema = new mongoose.Schema({
  label: String,
  name: String,
  type: {
    type: String,
    enum: [
      "text",
      "textarea",
      "date",
      "time",
      "number",
      "select",
      "image",
      "location",
    ],
  },
  required: Boolean,
  options: [String], // for select dropdown
});

const verticalSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    icon: String,
    bannerImage: String,
    description: String,
    dynamicFields: [fieldSchema], // 🔥 important
    active: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model(
  "Vertical",
  verticalSchema
);