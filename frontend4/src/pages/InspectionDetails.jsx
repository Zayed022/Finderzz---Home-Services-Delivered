import { useLocation, useNavigate } from "react-router-dom";
import { Clock, IndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function InspectionDetails() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const cartItems = useSelector((state) => state.cart.items);

  const {
    serviceId,
    name,
    price,
    description,
    duration,
  } = state || {};

  /* 🔍 FIND ITEM */
  const item = cartItems.find(
    (i) =>
      i.serviceId === serviceId &&
      i.bookingType === "inspection"
  );

  if (!state) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500">Invalid inspection data</p>
      </div>
    );
  }

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HERO */}
      <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white py-16">
        <div className="max-w-5xl mx-auto px-6">

          <button
            onClick={() => navigate(-1)}
            className="mb-6 text-sm bg-white/20 px-3 py-1 rounded-lg backdrop-blur"
          >
            ← Back
          </button>

          <h1 className="text-4xl font-bold">
            {name} Inspection
          </h1>

          <div className="flex gap-6 mt-4 text-sm opacity-90">
            <span className="flex items-center gap-1">
              <Clock size={16}/> {duration} mins
            </span>

            <span className="flex items-center gap-1 font-semibold">
              <IndianRupee size={16}/> {price}
            </span>
          </div>
        </div>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">

        {/* 🔥 CTA CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border flex justify-between items-center">
          
          <div>
            <p className="font-semibold text-lg">
              {name} Inspection
            </p>
            <p className="text-sm text-gray-500">
              ₹{price}
            </p>
          </div>

          {item ? (
            <div className="flex items-center gap-4 bg-gray-100 px-5 py-2 rounded-xl">
              <button
                onClick={() =>
                  dispatch(
                    decreaseQty({
                      serviceId,
                      bookingType: "inspection",
                    })
                  )
                }
                className="text-xl"
              >
                −
              </button>

              <span className="font-semibold text-lg">
                {item.quantity}
              </span>

              <button
                onClick={() =>
                  dispatch(
                    increaseQty({
                      serviceId,
                      bookingType: "inspection",
                    })
                  )
                }
                className="text-xl"
              >
                +
              </button>
            </div>
          ) : (
            <button
              onClick={() =>
                dispatch(
                  addToCart({
                    serviceId,
                    name: `${name} Inspection`,
                    price,
                    duration,
                    bookingType: "inspection",
                  })
                )
              }
              className="px-6 py-3 rounded-xl bg-orange-500 text-white font-semibold hover:bg-orange-600 transition shadow"
            >
              Add Inspection
            </button>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-3">
            What’s Included
          </h2>

          <p className="text-gray-600 leading-relaxed">
            {description ||
              "Our professional will inspect the issue and provide an accurate diagnosis along with repair recommendations."}
          </p>
        </div>

        {/* BENEFITS */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4">
            Why Inspection?
          </h2>

          <ul className="space-y-2 text-gray-700">
            <li>• Accurate problem diagnosis</li>
            <li>• Avoid unnecessary repairs</li>
            <li>• Get expert recommendation</li>
            <li>• Transparent pricing after inspection</li>
          </ul>
        </div>

        {/* EXTRA TRUST CARD */}
        <div className="bg-amber-50 border border-amber-200 p-5 rounded-xl">
          <p className="text-sm text-amber-800">
            Inspection fee will be adjusted in final service cost if you proceed with repair.
          </p>
        </div>
      </div>

      {/* 🔷 MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white border-t p-4 shadow">
        {item ? (
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold"
          >
            Go to Cart ({item.quantity})
          </button>
        ) : (
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  serviceId,
                  name: `${name} Inspection`,
                  price,
                  duration,
                  bookingType: "inspection",
                })
              )
            }
            className="w-full py-3 rounded-xl bg-orange-500 text-white font-semibold"
          >
            Add Inspection • ₹{price}
          </button>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}