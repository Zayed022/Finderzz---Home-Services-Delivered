import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
{
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true
  },

  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },

  invoiceUrl: String,

  subtotal: Number,
  extraCharge: Number,
  totalAmount: Number,

  generatedAt: {
    type: Date,
    default: Date.now
  }
},
{ timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);