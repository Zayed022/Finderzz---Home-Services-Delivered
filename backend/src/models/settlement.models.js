import mongoose from "mongoose";

const settlementSchema = new mongoose.Schema({

  workerId:{
    type: mongoose.Schema.Types.ObjectId,
    ref:"Worker",
    required:true
  },

  date:{
    type:String,
    required:true
  },

  totalCollected:Number,
  workerEarnings:Number,
  adminShare:Number,

  status:{
    type:String,
    enum:["pending","submitted","approved"],
    default:"pending"
  },

  submittedAt:Date,
  approvedAt:Date

},{timestamps:true});

export default mongoose.model("Settlement",settlementSchema);