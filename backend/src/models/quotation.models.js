import mongoose from "mongoose";

const quotationSchema = new mongoose.Schema(
  {
    workerName:{
      type: String,
      required: true,
    },

    clientName:{
      type: String,
      required: true,
    },
    

    quotationImages: {
      type: String,
      required: true,
    }, // Cloudinary URLs

    description: {
      type: String,
    }, // worker notes

    estimatedPrice: Number,


    status: {
      type: String,
      enum: ["pending", "approved", "rejected", "sent_to_customer"],
      default: "pending",
    },

    adminNotes: String,

    approvedPrice: Number, // admin can override

    customerAccepted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Quotation", quotationSchema);