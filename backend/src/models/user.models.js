import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      unique: true,
      sparse: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
    },

    role: {
      type: String,
      enum: ["user", "admin", "worker"],
      default: "user",
    },

    phone: {
      type: String,
    },

    avatar: String,

    isActive: {
      type: Boolean,
      default: true,
    },
    defaultAddress: {
      name: String,
      phone: String,
      houseNumber: String,
      floorNumber: String,
      buildingName: String,
      landmark: String,
      fullAddress: String,
      areaId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Area",
      }
    }
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

export default mongoose.model("User", userSchema);