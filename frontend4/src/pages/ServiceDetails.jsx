import { useNavigate, useParams } from "react-router-dom";
import { useServiceDetails } from "../hooks/useServiceDetails";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";
import { Clock, IndianRupee, Sparkles } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function ServiceDetails() {
  const { id } = useParams();
  const { data, isLoading } = useServiceDetails(id);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <p className="text-gray-500 text-lg animate-pulse">
          Loading service...
        </p>
      </div>
    );
  }

  const { service, subServices } = data;

  /* 🔍 FIND ITEM */
  const getItem = (subServiceId) => {
    return cartItems.find(
      (item) =>
        item.subServiceId === subServiceId &&
        item.bookingType === "service"
    );
  };

  /* 💰 TOTAL */
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <>
    <Navbar/>

    <Helmet>
  <title>{service?.name} Services in Bhiwandi | Finderzz</title>

  <meta
    name="description"
    content={`Book ${service?.name} services in Bhiwandi with verified professionals. Affordable pricing and quick service.`}
  />

  <link
    rel="canonical"
    href={`https://finderzz.com/service/${id}`}
  />

  <meta name="robots" content="index, follow" />

  {/* 🔥 STRUCTURED DATA */}
  <script type="application/ld+json">
    {JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Service",
      name: service?.name,
      areaServed: "Bhiwandi",
      provider: {
        "@type": "Organization",
        name: "Finderzz",
      },
    })}
  </script>
</Helmet>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HERO */}
      <div className="relative py-20 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-100/40 to-cyan-100/40 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
  {service.name} Services in Bhiwandi
</h1>

          <p className="mt-4 text-gray-600 max-w-xl mx-auto text-lg">
            {service.description}
          </p>
        </motion.div>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-[2fr_1fr] gap-12 pb-24">

        {/* 🔷 LEFT */}
        <div className="space-y-8">

          {/* 🔷 INSPECTION */}
          {service.inspection?.available && (
            <div className="p-6 rounded-3xl bg-white/80 backdrop-blur border shadow-md hover:shadow-xl transition">
              
              <div className="flex justify-between items-center">
                
                {/* LEFT */}
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Sparkles size={18} className="text-blue-500"/>
                    Inspection Service
                  </h2>

                  <p className="text-gray-500 text-sm mt-1 line-clamp-2">
                    {service.inspection.description}
                  </p>

                  <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                    <Clock size={14}/> {service.inspection.duration} mins
                  </div>
                </div>

                {/* RIGHT */}
                <div className="text-left">
                  <p className="text-xl font-bold text-blue-600 flex items-center gap-1">
                    <IndianRupee size={16}/> {service.inspection.price}
                  </p>

                  <div className="flex gap-2 mt-3 justify-end">

                    {/* 🔘 VIEW DETAILS */}
                    <button
                      onClick={() =>
                        navigate(`/inspection/${service._id}`, {
                          state: {
                            serviceId: service._id,
                            name: service.name,
                            price: service.inspection.price,
                            description: service.inspection.description,
                            duration: service.inspection.duration,
                          },
                        })
                      }
                      className="text-sm px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                    >
                      View Details
                    </button>

                    {/* 🔘 BOOK */}
                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            serviceId: service._id,
                            name: "Inspection",
                            price: service.inspection.price,
                            duration: service.inspection.duration,
                            bookingType: "inspection",
                          })
                        )
                      }
                      className="px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition shadow"
                    >
                      Book
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 🔷 SUB SERVICES */}
          <div>
            <h2 className="text-2xl font-semibold mb-4">
              Available Services
            </h2>

            <div className="space-y-5">
              {subServices.map((sub) => {
                const item = getItem(sub._id);

                return (
                  <motion.div
                    key={sub._id}
                    whileHover={{ y: -3 }}
                    className="p-6 rounded-2xl bg-white border shadow-sm hover:shadow-lg transition flex justify-between"
                  >

                    {/* LEFT */}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {sub.name}
                      </h3>

                      {/* 🔥 TRUNCATED DESCRIPTION */}
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                        {sub.description}
                      </p>

                      <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
                        <Clock size={14}/> {sub.durationEstimate} mins
                      </div>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right flex flex-col items-end justify-between">

                      <p className="text-lg font-bold text-blue-600 flex items-center gap-1">
                        <IndianRupee size={16}/> {sub.customerPrice}
                      </p>

                      {/* 🔘 ACTION BUTTONS */}
                      <div className="flex gap-2 mt-3">

                        {/* VIEW DETAILS */}
                        <button
                          onClick={() =>
                            navigate(`/sub-service/${sub._id}`)
                          }
                          className="text-sm px-4 py-2 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                        >
                          View Details
                        </button>

                        {/* CART UI */}
                        {item ? (
                          <div className="flex items-center gap-3 bg-gray-100 px-3 py-1 rounded-xl">
                            <button
                              onClick={() =>
                                dispatch(
                                  decreaseQty({
                                    subServiceId: sub._id,
                                    bookingType: "service",
                                  })
                                )
                              }
                              className="text-lg"
                            >
                              −
                            </button>

                            <span className="font-medium">
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
                              className="text-lg"
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
                            className="px-4 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
                          >
                            Add
                          </button>
                        )}

                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow border mt-8">
  <h2 className="text-xl font-semibold mb-4">
    Frequently Asked Questions
  </h2>

  <div className="space-y-4 text-sm text-gray-600">
    <div>
      <p className="font-medium">
        What is the cost of {service?.name } in Bhiwandi?
      </p>
      <p>Pricing depends on service type and inspection requirements.</p>
    </div>

    <div>
      <p className="font-medium">
        Do you provide inspection before service?
      </p>
      <p>Yes, inspection services are available to give accurate pricing.</p>
    </div>

    <div>
      <p className="font-medium">
        Are professionals verified?
      </p>
      <p>All professionals are background-verified and trained.</p>
    </div>
  </div>
</div>

        {/* 🔷 RIGHT SIDEBAR */}
        <div className="hidden lg:block">
          <div className="sticky top-24 p-6 rounded-3xl bg-white shadow-xl border">

            <h3 className="font-semibold text-lg mb-4">
              Booking Summary
            </h3>

            {cartItems.length === 0 ? (
              <p className="text-gray-500 text-sm">
                No items added yet
              </p>
            ) : (
              <>
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <span>{item.name} × {item.quantity}</span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="border-t mt-4 pt-4 flex justify-between font-bold text-lg">
                  <span>Total</span>
                  <span>₹{total}</span>
                </div>
              </>
            )}

            <button
              onClick={() => navigate("/cart")}
              className="mt-6 w-full py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow"
            >
              Continue Booking
            </button>
          </div>
        </div>
      </div>

      {/* 🔷 MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 w-full p-4 bg-white border-t shadow">
        <button
          onClick={() => navigate("/cart")}
          className="w-full py-3 rounded-xl bg-blue-600 text-white font-semibold"
        >
          Continue • ₹{total}
        </button>
      </div>
    </div>


    <Footer/>
    </>
  );
}