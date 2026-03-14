import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function GetBookingById() {
  const { id } = useParams();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchBooking();
  }, []);

  const fetchBooking = async () => {
    try {
      setLoading(true);

      const res = await axios.get(`/booking/${id}`);

      setBooking(res.data.data);
    } catch (err) {
      setError("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-3 gap-6">
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
            <div className="h-40 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 font-medium">
        {error}
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="p-6 space-y-6">

      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-800">
          Booking Details
        </h1>

        <span className="px-4 py-1 text-sm rounded-full bg-blue-100 text-blue-600 capitalize">
          {booking.status}
        </span>
      </div>

      {/* Overview */}
      <div className="grid md:grid-cols-4 gap-6">

        <Card title="Booking ID">
          {booking._id}
        </Card>

        <Card title="Date">
          {new Date(booking.createdAt).toLocaleDateString()}
        </Card>

        <Card title="Area">
          {booking.areaId?.name || "-"}
        </Card>

        <Card title="Area Charge">
          ₹{booking.areaId?.extraCharge || 0}
        </Card>

      </div>


      {/* Customer + Worker */}
      <div className="grid md:grid-cols-2 gap-6">

        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Customer Information
          </h2>

          <div className="space-y-2 text-sm text-gray-600">

            <Info label="Name" value={booking.customerName} />
            <Info label="Phone" value={booking.customerPhone} />
            <Info label="Address" value={booking.address} />

          </div>
        </div>


        <div className="bg-white shadow-sm border rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">
            Worker Information
          </h2>

          {booking.workerId ? (
            <div className="space-y-2 text-sm text-gray-600">

              <Info label="Name" value={booking.workerId.name} />
              <Info label="Phone" value={booking.workerId.phone} />

            </div>
          ) : (
            <p className="text-gray-500 text-sm">
              Worker not assigned yet
            </p>
          )}

        </div>

      </div>


      {/* Services */}
      <div className="bg-white shadow-sm border rounded-lg p-6">

        <h2 className="text-lg font-semibold mb-4">
          Services
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">

            <thead>
              <tr className="text-left border-b text-gray-600">

                <th className="py-2">Service</th>
                <th>Price</th>
                <th>Worker Price</th>
                <th>Platform Fee</th>
                <th>Qty</th>

              </tr>
            </thead>

            <tbody>

              {booking.services?.map((service, index) => (
                <tr
                  key={index}
                  className="border-b hover:bg-gray-50"
                >

                  <td className="py-3">
                    {service.subServiceId?.name}
                  </td>

                  <td>
                    ₹{service.price}
                  </td>

                  <td>
                    ₹{service.workerPrice}
                  </td>

                  <td>
                    ₹{service.platformFee}
                  </td>

                  <td>
                    {service.quantity || 1}
                  </td>

                </tr>
              ))}

            </tbody>

          </table>
        </div>

      </div>


      {/* Pricing */}
      <div className="bg-white shadow-sm border rounded-lg p-6">

        <h2 className="text-lg font-semibold mb-4">
          Pricing Breakdown
        </h2>

        <div className="grid md:grid-cols-3 gap-6 text-sm">

          <Price label="Subtotal" value={booking.subtotal} />

          <Price
            label="Area Charge"
            value={booking.areaId?.extraCharge || 0}
          />

          <Price
            label="Total Amount"
            value={booking.totalAmount}
            highlight
          />

        </div>

      </div>

    </div>
  );
}


/* ---------- UI COMPONENTS ---------- */

function Card({ title, children }) {
  return (
    <div className="bg-white border rounded-lg p-4 shadow-sm">
      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>
      <p className="font-medium text-gray-800 break-all">
        {children}
      </p>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium">{value || "-"}</span>
    </div>
  );
}

function Price({ label, value, highlight }) {
  return (
    <div className={`p-4 rounded-lg border ${highlight ? "bg-green-50 border-green-200" : "bg-gray-50"}`}>
      <p className="text-gray-500 text-xs">{label}</p>
      <p className={`text-lg font-semibold ${highlight ? "text-green-600" : ""}`}>
        ₹{value || 0}
      </p>
    </div>
  );
}