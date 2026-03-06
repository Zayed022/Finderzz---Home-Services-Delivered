import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import jwt from "jsonwebtoken"

const workerSchema = new mongoose.Schema(
  {
    name:{
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    password:{
      type: String,
      required: true,
    },

    aadhaarNumber: {
      type: String,
      required: true,
      trim: true,
    },

    panNumber: {
      type: String,
      required: true,
      trim: true,
    },

    aadhaarImage: {
      type: String,
      required: true,
    },
    panImage: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: true,
    },

    address: String,

    skills: {
      type: String,
      required: true,
    },

    refreshToken: {
      type: String,
    },
    accessToken:{
      type: String,
    },

    

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
      index: true,
    },

    rejectionReason: String,

    isAvailable: {
      type: Boolean,
      default: true,
      index: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },

    totalJobs: {
      type: Number,
      default: 0,
    },

    

    rating: {
      type: Number,
      default: 5,
      min: 0,
      max: 5,
    }
  },
  { timestamps: true }
);

workerSchema.index({ skills: 1 });
workerSchema.index({ assignedAreas: 1 });

workerSchema.pre("save",async function(){
  if(!this.isModified("password")) return ;
  this.password = await bcrypt.hash(this.password,10);
});

workerSchema.methods.isPasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
};

workerSchema.methods.generateAccessToken = function(){
  return jwt.sign(
      {
          _id:this._id,
          name:this.name,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn:process.env.ACCESS_TOKEN_EXPIRY
      }
  )
}


workerSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
      {
          _id:this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn:process.env.REFRESH_TOKEN_EXPIRY,
      }
  )
}

export default mongoose.model("Worker", workerSchema);