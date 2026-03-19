import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { clearCart } from "../store/cartSlice";
import AreaModal from "../components/AreaModal";
import { MapPin, User, Calendar } from "lucide-react";

export default function Checkout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);
  const { selectedArea, extraCharge } = useSelector((state) => state.area);

  const [openAreaModal, setOpenAreaModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    houseNumber: "",
    street: "",
    city: "",
    date: "",
    timeSlot: "",
  });

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  const total = subtotal + extraCharge;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const inputStyle =
    "w-full p-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition";

  const handleSubmit = async () => {
    try {
      if (!cartItems.length) return alert("Cart is empty");
      if (!selectedArea?._id) return alert("Select area");

      setLoading(true);

      const payload = {
        services: cartItems,
        areaId: selectedArea._id,
        address: {
          houseNumber: form.houseNumber,
          street: form.street,
          city: form.city,
        },
        customerDetails: {
          name: form.name,
          phone: form.phone,
        },
        scheduledDate: form.date,
        timeSlot: form.timeSlot,
      };

      const res = await API.post("/booking", payload);

      const existing =
  JSON.parse(localStorage.getItem("guest_bookings")) || [];

const updatedBookings = [res.data.data, ...existing];

localStorage.setItem(
  "guest_bookings",
  JSON.stringify(updatedBookings)
);

      dispatch(clearCart());

      navigate("/booking-success", {
        state: res.data.data,
      });
    } catch (err) {
      alert("Booking Failed ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HEADER */}
      <div className="bg-white border-b px-6 py-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Checkout
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[2fr_1fr] gap-10">

        {/* 🔷 LEFT */}
        <div className="space-y-8">

          {/* CUSTOMER */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <User size={18}/> Customer Details
            </h2>

            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className={inputStyle + " mb-3"}
            />

            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* AREA */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center">
            <div>
              <h2 className="font-semibold flex items-center gap-2">
                <MapPin size={18}/> Service Area
              </h2>

              {selectedArea ? (
                <>
                  <p className="text-sm text-gray-600 mt-1">
                    {selectedArea.name}
                  </p>
                  <p className="text-xs text-gray-400">
                    Extra Charge: ₹{extraCharge}
                  </p>
                </>
              ) : (
                <p className="text-sm text-red-500 mt-1">
                  Select your area
                </p>
              )}
            </div>

            <button
              onClick={() => setOpenAreaModal(true)}
              className="text-blue-600 font-medium hover:underline"
            >
              {selectedArea ? "Change" : "Select"}
            </button>
          </div>

          <AreaModal
            isOpen={openAreaModal}
            onClose={() => setOpenAreaModal(false)}
          />

          {/* ADDRESS */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold text-lg mb-4">
              Address
            </h2>

            <input
              name="houseNumber"
              placeholder="House / Flat No."
              onChange={handleChange}
              className={inputStyle + " mb-3"}
            />

            <input
              name="street"
              placeholder="Street / Area"
              onChange={handleChange}
              className={inputStyle + " mb-3"}
            />

            <input
              name="city"
              placeholder="City"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

          {/* SCHEDULE */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
              <Calendar size={18}/> Schedule
            </h2>

            <input
              type="date"
              name="date"
              onChange={handleChange}
              className={inputStyle + " mb-3"}
            />

            <input
              type="time"
              name="timeSlot"
              onChange={handleChange}
              className={inputStyle}
            />
          </div>

        </div>

        {/* 🔷 RIGHT */}
        <div>
          <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border">

            <h2 className="font-semibold text-lg mb-4">
              Order Summary
            </h2>

            {/* ITEMS */}
            <div className="space-y-2 text-sm text-gray-600">
              {cartItems.map((item, i) => (
                <div key={i} className="flex justify-between">
                  <span>{item.name} × {item.quantity}</span>
                  <span>₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            {/* BREAKDOWN */}
            <div className="border-t my-4" />

            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            {selectedArea && (
              <div className="flex justify-between text-sm">
                <span>Area Charge</span>
                <span>₹{extraCharge}</span>
              </div>
            )}

            {/* TOTAL */}
            <div className="flex justify-between text-lg font-bold mt-4">
              <span>Total</span>
              <span className="text-blue-600">₹{total}</span>
            </div>

            {/* CTA */}
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
            >
              {loading ? "Processing..." : "Confirm Booking"}
            </button>

            <p className="text-xs text-gray-400 text-center mt-3">
              Secure booking • Verified professionals
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}