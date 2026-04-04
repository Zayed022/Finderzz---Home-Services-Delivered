import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ allow guest
    },

    services: [
      {
        subServiceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "SubService",
          default: null,
        },
    
        serviceId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Service",
          default: null,
        },
    
        quantity: { type: Number, default: 1 },
    
        price: Number,
    
        bookingType: {
          type: String,
          enum: ["service", "inspection"],
          default: "service",
        },
      },
    ],

    inspectionNotes: {
      type: String,
    },

    areaId: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },

    customerDetails: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
    },

    address: {
      houseNumber: String,
      floorNumber: String,
      buildingName: String,
      landmark: String,
      fullAddress: String,
    },

    requirements:{
      type: String,
    },
    budget:{
      type: Number,
    },

    scheduledDate: Date,
    timeSlot: String,

    subtotal: Number,
    extraCharge: Number,
    totalPrice: Number,

    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
      default: null,
    },

    status: {
      type: String,
      enum: [
        "pending",
        "assigned",
        "in_progress",
        "completed",
        "cancelled",
      ],
      default: "pending",
    },
  },
  { timestamps: true }
);
  
  bookingSchema.index({ status: 1 });
  bookingSchema.index({ createdAt: -1 });
  
  export default mongoose.model("Booking", bookingSchema);