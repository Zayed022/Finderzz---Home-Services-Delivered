const bookingSchema = new mongoose.Schema(
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
      serviceId: { type: mongoose.Schema.Types.ObjectId, ref: "Service" },
      subServiceId: { type: mongoose.Schema.Types.ObjectId, ref: "SubService" },
      areaId: { type: mongoose.Schema.Types.ObjectId, ref: "Area" },
  
      address: String,
      scheduledDate: Date,
  
      basePrice: Number,
      extraCharge: Number,
      totalPrice: Number,
  
      workerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        default: null
      },
  
      status: {
        type: String,
        enum: [
          "pending",
          "assigned",
          "in_progress",
          "completed",
          "cancelled"
        ],
        default: "pending"
      }
    },
    { timestamps: true }
  );
  
  bookingSchema.index({ status: 1 });
  bookingSchema.index({ createdAt: -1 });
  
  export default mongoose.model("Booking", bookingSchema);