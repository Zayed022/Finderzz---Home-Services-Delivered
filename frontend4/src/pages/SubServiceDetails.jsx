import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import API from "../api/axios";
import { Clock, IndianRupee } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* 🔥 UI ENRICHMENT */
const badges = ["Most Booked", "Recommended", "Top Rated", null];

const highlightsPool = [
  ["Professional staff", "Safe cleaning", "Quick service"],
  ["Eco-friendly products", "Trained experts"],
  ["Affordable pricing", "High quality"],
  ["Trusted by 1000+ users", "Instant booking"],
];

function enrichSubService(sub) {
  return {
    ...sub,
    rating: (Math.random() * (4.9 - 4.1) + 4.1).toFixed(1),
    bookings: Math.floor(Math.random() * 500) + 50,
    badge: badges[Math.floor(Math.random() * badges.length)],
    highlights:
      highlightsPool[Math.floor(Math.random() * highlightsPool.length)],
    image: `https://source.unsplash.com/1200x500/?home,service&sig=${sub._id}`,
    isFast: sub.durationEstimate <= 30,
  };
}

export default function SubServiceDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const { data, isLoading } = useQuery({
    queryKey: ["subService", id],
    queryFn: async () => {
      const res = await API.get(`/subService/${id}`);
      return res.data;
    },
    enabled: !!id,
  });

  const getItem = (id) =>
    cartItems.find(
      (i) => i.subServiceId === id && i.bookingType === "service"
    );

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 animate-pulse">
          Loading service...
        </p>
      </div>
    );
  }

  const sub = enrichSubService(data?.data);
  const item = getItem(sub._id);

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HERO */}
      <div className="relative h-[300px] w-full">
        

        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

        <div className="absolute bottom-8 left-8 text-white max-w-xl">
          {sub.badge && (
            <span className="bg-white/20 backdrop-blur px-3 py-1 rounded-full text-sm">
              {sub.badge}
            </span>
          )}

          <h1 className="text-4xl font-bold mt-3 leading-tight">
            {sub.name}
          </h1>

          <div className="flex gap-4 mt-3 text-sm opacity-90">
            <span>⭐ {sub.rating}</span>
            <span>• {sub.bookings} bookings</span>
          </div>
        </div>

        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/90 px-4 py-2 rounded-xl text-sm shadow"
        >
          ← Back
        </button>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-8">

        {/* INFO CARDS */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-xs text-gray-500">Duration</p>
            <p className="font-semibold flex items-center gap-1 mt-1">
              <Clock size={14}/> {sub.durationEstimate} mins
            </p>
          </div>

          <div className="bg-white p-4 rounded-xl shadow border">
            <p className="text-xs text-gray-500">Price</p>
            <p className="font-semibold text-blue-600 flex items-center gap-1 mt-1">
              <IndianRupee size={14}/> {sub.customerPrice}
            </p>
          </div>

          {sub.isFast && (
            <div className="bg-green-50 p-4 rounded-xl border border-green-200">
              <p className="text-green-700 font-medium">
                ⚡ Fast Service
              </p>
            </div>
          )}
        </div>

        {/* 🔥 CTA CARD */}
        <div className="bg-white p-6 rounded-2xl shadow-lg border flex justify-between items-center">

          <div>
            <p className="font-semibold text-lg">{sub.name}</p>
            <p className="text-sm text-gray-500">
              ₹{sub.customerPrice}
            </p>
          </div>

          {item ? (
            <div className="flex items-center gap-4 bg-gray-100 px-5 py-2 rounded-xl">
              <button
                onClick={() =>
                  dispatch(
                    decreaseQty({
                      subServiceId: sub._id,
                      bookingType: "service",
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
                      subServiceId: sub._id,
                      bookingType: "service",
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
                    subServiceId: sub._id,
                    name: sub.name,
                    price: sub.customerPrice,
                    duration: sub.durationEstimate,
                    bookingType: "service",
                  })
                )
              }
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
            >
              Add to Cart
            </button>
          )}
        </div>

        {/* DESCRIPTION */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-3">
            About this service
          </h2>
          <p className="text-gray-600 leading-relaxed">
            {sub.description}
          </p>
        </div>

        {/* HIGHLIGHTS */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="text-xl font-semibold mb-4">
            Highlights
          </h2>

          <div className="flex flex-wrap gap-3">
            {sub.highlights.map((h, i) => (
              <span
                key={i}
                className="bg-gray-100 px-4 py-1 rounded-full text-sm"
              >
                {h}
              </span>
            ))}
          </div>
        </div>

        {/* FEATURES */}
        {sub.features?.length > 0 && (
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-xl font-semibold mb-3">
              What's Included
            </h2>

            <ul className="list-disc pl-5 text-gray-600 space-y-2">
              {sub.features.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 🔷 MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 w-full bg-white border-t p-4 shadow">
        {item ? (
          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Go to Cart ({item.quantity})
          </button>
        ) : (
          <button
            onClick={() =>
              dispatch(
                addToCart({
                  subServiceId: sub._id,
                  name: sub.name,
                  price: sub.customerPrice,
                  duration: sub.durationEstimate,
                  bookingType: "service",
                })
              )
            }
            className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
          >
            Add • ₹{sub.customerPrice}
          </button>
        )}
      </div>
    </div>
    <Footer/>
    </>
  );
}