import { useEffect, useState } from "react";
import API from "../api/axios";
import { Calendar, Clock, FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔷 LOAD BOOKINGS (localStorage instead of AsyncStorage) */
  useEffect(() => {
    loadBookings();

    const interval = setInterval(() => {
      refreshStatuses();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  const loadBookings = () => {
    const data = localStorage.getItem("guest_bookings");
    const parsed = data ? JSON.parse(data) : [];

    setBookings(parsed);
    setLoading(false);

    fetchStatuses(parsed);
  };

  /* 🔷 FETCH STATUS */
  const fetchStatuses = async (list) => {
    try {
      const updated = await Promise.all(
        list.map(async (booking) => {
          try {
            const res = await API.get(
              `/booking/status/${booking._id}`
            );

            return {
              ...booking,
              status: res.data.data.status,
            };
          } catch {
            return booking;
          }
        })
      );

      setBookings(updated);
      localStorage.setItem("guest_bookings", JSON.stringify(updated));
    } catch (err) {
      console.log(err);
    }
  };

  const refreshStatuses = () => {
    if (!bookings.length) return;
    fetchStatuses(bookings);
  };

  /* 🔷 STATUS COLOR */
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-600";
      case "assigned":
        return "bg-blue-100 text-blue-600";
      case "in_progress":
        return "bg-purple-100 text-purple-600";
      case "completed":
        return "bg-green-100 text-green-600";
      case "cancelled":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  /* 🔷 INVOICE */
  const openInvoice = (url) => {
    const fullUrl = `https://finderzz-home-services-delivered.onrender.com${url}`;
    window.open(fullUrl, "_blank");
  };

  /* 🔷 LOADING */
  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-500">
        Loading bookings...
      </div>
    );
  }

  return (
    <>
    <Helmet>
  <title>My Bookings | Finderzz</title>
  <meta name="robots" content="noindex, nofollow" />
</Helmet>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HEADER */}
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold text-gray-900">
          My Bookings
        </h1>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-6xl mx-auto px-6 pb-10 space-y-6">

        {bookings.length === 0 ? (
          <div className="text-center py-20 text-gray-500">
            <p className="text-lg">No bookings yet</p>
          </div>
        ) : (
          bookings.map((booking) => (
            <div
              key={booking._id}
              className="bg-white rounded-2xl shadow-md border p-6 hover:shadow-lg transition"
            >

              {/* 🔷 TOP */}
              <div className="flex justify-between items-center mb-4">
                <p className="font-semibold text-gray-900">
                  #{booking._id.slice(-6).toUpperCase()}
                </p>

                <span
                  className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(
                    booking.status
                  )}`}
                >
                  {booking.status?.replace("_", " ")}
                </span>
              </div>

              {/* 🔷 DATE + TIME */}
              <div className="flex gap-6 text-sm text-gray-600 mb-4">

                <div className="flex items-center gap-1">
                  <Calendar size={14} />
                  {new Date(
                    booking.scheduledDate
                  ).toDateString()}
                </div>

                <div className="flex items-center gap-1">
                  <Clock size={14} />
                  {booking.timeSlot}
                </div>

              </div>

              {/* 🔷 SERVICES */}
              <div className="bg-gray-50 p-4 rounded-xl mb-4 space-y-2">

                {booking.services?.map((service, i) => {
                  const name =
                    service.bookingType === "inspection"
                      ? service.serviceId?.name ||
                        service.subServiceId?.name ||
                        "Inspection"
                      : service.subServiceId?.name || "Service";

                  return (
                    <div
                      key={i}
                      className="flex justify-between text-sm"
                    >
                      <span>
                        {name}{" "}
                        {service.bookingType === "inspection" &&
                          "(Inspection)"}
                      </span>
                      <span>x{service.quantity}</span>
                    </div>
                  );
                })}

              </div>

              {/* 🔷 PRICE */}
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-500 text-sm">
                  Total
                </span>
                <span className="text-lg font-bold text-blue-600">
                  ₹{booking.totalPrice}
                </span>
              </div>

              {/* 🔷 INVOICE */}
              {booking?.invoice?.invoiceUrl && (
                <button
                  onClick={() =>
                    openInvoice(booking.invoice.invoiceUrl)
                  }
                  className="w-full py-3 rounded-xl bg-green-600 text-white font-semibold flex items-center justify-center gap-2 hover:bg-green-700 transition"
                >
                  <FileText size={16} />
                  View Invoice
                </button>
              )}

            </div>
          ))
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}