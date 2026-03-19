import { useLocation, useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Calendar,
  User,
  FileText,
} from "lucide-react";

export default function BookingSuccess() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid Booking</p>
      </div>
    );
  }

  const {
    _id,
    services,
    subtotal,
    extraCharge,
    totalPrice,
    areaId,
    customerDetails,
    scheduledDate,
    timeSlot,
    invoice,
  } = state;

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* 🔷 HERO */}
      <div className="bg-white border-b py-12 text-center">
        <CheckCircle className="text-green-500 mx-auto mb-4" size={60} />

        <h1 className="text-3xl font-bold text-gray-900">
          Booking Confirmed 🎉
        </h1>

        <p className="text-gray-500 mt-2">
          Your service has been successfully scheduled
        </p>

        <p className="text-sm text-gray-400 mt-2">
          Booking ID: {_id}
        </p>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[2fr_1fr] gap-10">

        {/* 🔷 LEFT */}
        <div className="space-y-6">

          {/* CUSTOMER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
              <User size={18}/> Customer Details
            </h2>

            <p className="font-medium text-gray-900">
              {customerDetails?.name}
            </p>
            <p className="text-sm text-gray-500">
              {customerDetails?.phone}
            </p>
          </div>

          {/* SCHEDULE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
              <Calendar size={18}/> Schedule
            </h2>

            <p className="text-gray-900">{scheduledDate}</p>
            <p className="text-sm text-gray-500">{timeSlot}</p>
          </div>

          {/* SERVICES */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">
              Services Booked
            </h2>

            <div className="space-y-3">
              {services.map((item, i) => {
                const name =
                  item.subServiceId?.name ||
                  item.serviceId?.name ||
                  "Service";

                return (
                  <div
                    key={i}
                    className="flex justify-between items-center bg-gray-50 px-4 py-2 rounded-lg"
                  >
                    <span className="text-sm text-gray-700">
                      {name} × {item.quantity}
                    </span>
                    <span className="font-medium text-gray-900">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 🔷 RIGHT */}
        <div>
          <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border">

            <h2 className="flex items-center gap-2 font-semibold text-lg mb-4">
              <FileText size={18}/> Invoice
            </h2>

            {/* BREAKDOWN */}
            <div className="space-y-2 text-sm text-gray-600">

              <div className="flex justify-between">
                <span>Service Charges</span>
                <span>₹{subtotal}</span>
              </div>

              <div className="flex justify-between">
                <span>Area ({areaId?.name})</span>
                <span>₹{extraCharge}</span>
              </div>

            </div>

            {/* TOTAL */}
            <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
              <span>Total Paid</span>
              <span className="text-blue-600">₹{totalPrice}</span>
            </div>

            {/* DOWNLOAD */}
            {invoice?.invoiceUrl && (
              <a
                href={`https://finderzz-home-services-delivered.onrender.com${invoice.invoiceUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full mt-6 text-center bg-gray-100 hover:bg-gray-200 text-gray-800 py-3 rounded-xl transition"
              >
                Download Invoice
              </a>
            )}

            {/* CTA */}
            <button
              onClick={() => navigate("/")}
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition shadow"
            >
              Back to Home
            </button>

            {/* TRUST NOTE */}
            <p className="text-xs text-gray-400 text-center mt-3">
              You’ll receive updates via SMS/Call
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}