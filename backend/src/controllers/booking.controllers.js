import Booking from "../models/booking.models.js";
import SubService from "../models/subService.models.js";
import Area from "../models/area.models.js";
import Service from "../models/service.models.js";
import { createInvoice } from "./invoice.controllers.js";

export const createBooking = async (req, res, next) => {
  try {
    const {
      services,
      areaId,
      address,
      customerDetails,
      scheduledDate,
      timeSlot,
    } = req.body;

    if (!services || !services.length) {
      return res.status(400).json({
        success: false,
        message: "No services selected",
      });
    }

    if (!areaId) {
      return res.status(400).json({
        success: false,
        message: "Area is required",
      });
    }

    if (!customerDetails?.name || !customerDetails?.phone) {
      return res.status(400).json({
        success: false,
        message: "Customer details required",
      });
    }

    let subtotal = 0;
    const enrichedServices = [];

    for (const item of services) {
      const bookingType = item.bookingType || "service";
      const quantity = item.quantity || 1;

      let price = 0;

      /* ================= SERVICE BOOKING ================= */

      if (bookingType === "service") {
        const subService = await SubService.findById(item.subServiceId);

        if (!subService) {
          return res.status(400).json({
            success: false,
            message: "Invalid subservice",
          });
        }

        price = subService.customerPrice;

        enrichedServices.push({
          subServiceId: subService._id,
          serviceId: null,
          quantity,
          price,
          bookingType,
        });
      }

      /* ================= INSPECTION BOOKING ================= */

      else if (bookingType === "inspection") {
        const service = await Service.findById(item.serviceId);

        if (!service || !service.active) {
          return res.status(400).json({
            success: false,
            message: "Invalid service",
          });
        }

        if (!service.inspectionAvailable) {
          return res.status(400).json({
            success: false,
            message: "Inspection not available",
          });
        }

        price = service.inspectionPrice;

        enrichedServices.push({
          subServiceId: null,
          serviceId: service._id,
          quantity,
          price,
          bookingType,
        });
      }

      else {
        return res.status(400).json({
          success: false,
          message: "Invalid booking type",
        });
      }

      subtotal += price * quantity;
    }

    /* ================= AREA ================= */

    const area = await Area.findById(areaId);

    if (!area) {
      return res.status(400).json({
        success: false,
        message: "Invalid area",
      });
    }

    const extraCharge = area.extraCharge || 0;
    const totalPrice = subtotal + extraCharge;

    /* ================= CREATE ================= */

    const booking = await Booking.create({
      userId: null,
      services: enrichedServices,
      areaId,
      address,
      customerDetails,
      scheduledDate,
      timeSlot,
      subtotal,
      extraCharge,
      totalPrice,
      status: "pending",
    });

    const invoice = await createInvoice(booking._id);

    const populatedBooking = await Booking.findById(booking._id)
      .populate("services.subServiceId", "name")
      .populate("services.serviceId", "name inspectionPrice")
      .populate("areaId", "name extraCharge")
      .lean();

    res.json({
      success: true,
      data: {
        ...populatedBooking,
        invoice,
      },
    });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

export const updateBookingStatus = async (req,res,next)=>{
  try{

    const { id } = req.params;
    const { status } = req.body;

    const allowed = [
      "pending",
      "confirmed",
      "assigned",
      "in_progress",
      "completed",
      "cancelled"
    ];

    if(!allowed.includes(status)){
      return res.status(400).json({
        success:false,
        message:"Invalid status"
      });
    }

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new:true }
    );

    if(!booking){
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    res.json({
      success:true,
      data:booking
    });

  }catch(error){
    next(error);
  }
};

export const getAllBookings = async (req,res,next)=>{
  try{

    const {
      page = 1,
      limit = 10,
      status,
      areaId,
      search
    } = req.query;

    const skip = (page - 1) * limit;

    const query = {};

    if(status && status !== "all"){
      query.status = status;
    }

    if(areaId){
      query.areaId = areaId;
    }

    if(search){
      query["customerDetails.phone"] = {
        $regex: search,
        $options: "i"
      };
    }

    const bookings = await Booking.find(query)
  .populate("areaId","name")
  .populate("services.subServiceId","name")
  .populate({
    path: "services.serviceId",
    select: "name"
  })
  .populate("workerId","name phone")
  .sort({createdAt:-1})
  .skip(skip)
  .limit(Number(limit))
  .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success:true,
      data:bookings,
      pagination:{
        total,
        page:Number(page),
        limit:Number(limit),
        pages:Math.ceil(total/limit)
      }
    });

  }catch(error){
    next(error);
  }
};

export const getBookingById = async (req,res,next)=>{
  try{

    const { id } = req.params;

    const booking = await Booking.findById(id)
      .populate("areaId","name extraCharge")
      .populate("services.subServiceId")
      .populate("workerId","name phone")
      .lean();

    if(!booking){
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    res.json({
      success:true,
      data:booking
    });

  }catch(error){
    next(error);
  }
};

export const getBookingsByStatus = async (req,res,next)=>{
  try{

    const {
      status = "pending",
      page = 1,
      limit = 10
    } = req.query;

    const skip = (page - 1) * limit;

    const query = {};

    if(status !== "all"){
      query.status = status;
    }

    const bookings = await Booking.find(query)
      .populate("areaId","name")
      .populate("services.subServiceId","name")
      .sort({createdAt:-1})
      .skip(skip)
      .limit(Number(limit))
      .lean();

    const total = await Booking.countDocuments(query);

    res.json({
      success:true,
      data:bookings,
      pagination:{
        total,
        page:Number(page),
        limit:Number(limit),
        pages:Math.ceil(total/limit)
      }
    });

  }catch(error){
    next(error);
  }
};

export const getBookingStatus = async (req, res, next) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).select("status");

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: {
        status: booking.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const assignWorker = async (req,res,next)=>{
  try{

    const { id } = req.params;
    const { workerId } = req.body;

    const booking = await Booking.findById(id);

    if(!booking){
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    booking.workerId = workerId;
    booking.status = "assigned";

    await booking.save();

    res.json({
      success:true,
      data:booking
    });

  }catch(error){
    next(error);
  }
};

export const cancelBooking = async (req,res,next)=>{
  try{

    const { id } = req.params;

    const booking = await Booking.findByIdAndUpdate(
      id,
      { status:"cancelled" },
      { new:true }
    );

    if(!booking){
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    res.json({
      success:true,
      message:"Booking cancelled"
    });

  }catch(error){
    next(error);
  }
};

export const deleteBooking = async (req,res,next)=>{
  try{

    const { id } = req.params;

    const booking = await Booking.findByIdAndDelete(id);

    if(!booking){
      return res.status(404).json({
        success:false,
        message:"Booking not found"
      });
    }

    res.json({
      success:true,
      message:"Booking deleted"
    });

  }catch(error){
    next(error);
  }
};

export const getBookingStats = async (req,res,next)=>{
  try{

    const stats = await Booking.aggregate([
      {
        $group:{
          _id:"$status",
          count:{ $sum:1 }
        }
      }
    ]);

    res.json({
      success:true,
      data:stats
    });

  }catch(error){
    next(error);
  }
};