import Booking from "../models/booking.models.js";
import SubService from "../models/subService.models.js";
import Area from "../models/area.models.js";

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

    /* ================= CALCULATE SERVICE SUBTOTAL ================= */

    let subtotal = 0;
    const enrichedServices = [];

    for (const item of services) {
      const subService = await SubService.findById(
        item.subServiceId
      );

      if (!subService) {
        return res.status(400).json({
          success: false,
          message: "Invalid subservice",
        });
      }

      const itemTotal =
        subService.customerPrice * item.quantity;

      subtotal += itemTotal;

      enrichedServices.push({
        subServiceId: subService._id,
        quantity: item.quantity,
        price: subService.customerPrice,
      });
    }

    /* ================= GET AREA EXTRA CHARGE ================= */

    const area = await Area.findById(areaId);

    if (!area) {
      return res.status(400).json({
        success: false,
        message: "Invalid area",
      });
    }

    const extraCharge = area.extraCharge || 0;

    const totalPrice = subtotal + extraCharge;

    /* ================= CREATE BOOKING ================= */

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

    /* ================= POPULATE SERVICES FOR RESPONSE ================= */

    const populatedBooking = await Booking.findById(
      booking._id
    )
      .populate("services.subServiceId", "name")
      .populate("areaId", "name extraCharge")
      .lean();

    res.json({
      success: true,
      data: populatedBooking,
    });
  } catch (error) {
    next(error);
  }
};