import Invoice from "../models/invoice.models.js";
import Booking from "../models/booking.models.js";
import { generateInvoicePDF } from "../utils/generateInvoice.js";
import { generateInvoiceNumber } from "../utils/generateInvoiceNumber.js";

/* ================= GENERATE INVOICE ================= */

export const createInvoice = async (bookingId) => {

  const booking = await Booking.findById(bookingId)
  .populate("services.subServiceId", "name")
  .populate("services.serviceId", "name")
  .lean();

  if (!booking) {
    throw new Error("Booking not found");
  }

  const invoiceNumber = generateInvoiceNumber();

  const relativePath = await generateInvoicePDF(booking);

const invoiceUrl = `${relativePath}`;

  const invoice = await Invoice.create({
    bookingId: booking._id,
    invoiceNumber,
    invoiceUrl,
    subtotal: booking.subtotal,
    extraCharge: booking.extraCharge,
    totalAmount: booking.totalPrice
  });

  return invoice;
};


/* ================= GET INVOICE ================= */

export const getInvoiceByBooking = async (req, res, next) => {

  try {

    const { bookingId } = req.params;

    const invoice = await Invoice.findOne({
      bookingId
    });

    if (!invoice) {
      return res.status(404).json({
        success: false,
        message: "Invoice not found"
      });
    }

    res.json({
      success: true,
      data: invoice
    });

  } catch (error) {
    next(error);
  }

};