import { useNavigate, useParams } from "react-router-dom";
import { useServiceDetails } from "../hooks/useServiceDetails";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  increaseQty,
  decreaseQty,
} from "../store/cartSlice";

export default function ServiceDetails() {
  const { id } = useParams();
  const { data, isLoading } = useServiceDetails(id);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  if (isLoading) {
    return (
      <div className="py-32 text-center">
        <p className="text-gray-500 text-lg">Loading service...</p>
      </div>
    );
  }

  const { service, subServices } = data;

  /* 🔥 FIND ITEM */
  const getItem = (subServiceId) => {
    return cartItems.find(
      (item) =>
        item.subServiceId === subServiceId &&
        item.bookingType === "service"
    );
  };

  /* 🔥 TOTAL */
  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="bg-[#f8fafc] min-h-screen">

      {/* 🔷 HERO */}
      <div className="relative py-20 bg-gradient-to-b from-white via-blue-50/30 to-white">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-400/10 blur-3xl rounded-full" />
          <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/10 blur-3xl rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-gray-900"
          >
            {service.name}
          </motion.h1>

          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            {service.description}
          </p>
        </div>
      </div>

      {/* 🔷 CONTENT */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-[2fr_1fr] gap-12">

        {/* LEFT */}
        <div className="space-y-10">

          {/* 🔷 Inspection */}
          {service.inspection?.available && (
            <div className="rounded-3xl p-7 bg-white shadow border border-blue-100 flex justify-between items-center">
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Inspection Service
                </h2>
                <p className="text-gray-500 text-sm">
                  {service.inspection.description}
                </p>
                <p className="text-xs text-gray-400 mt-1">
                  ~{service.inspection.duration} mins
                </p>
              </div>

              <div className="text-right">
                <p className="text-xl font-bold text-[#0077B6]">
                  ₹{service.inspection.price}
                </p>

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
                  className="mt-2 bg-[#0077B6] text-white px-5 py-2 rounded-xl"
                >
                  Book
                </button>
              </div>
            </div>
          )}

          {/* 🔷 Sub Services */}
          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Available Services
            </h2>

            <div className="space-y-6">
              {subServices.map((sub) => {
                const item = getItem(sub._id);

                return (
                  <motion.div
                    key={sub._id}
                    className="bg-white p-6 rounded-3xl border shadow-sm flex justify-between items-center"
                  >

                    {/* LEFT */}
                    <div>
                      <h3 className="font-semibold text-lg">
                        {sub.name}
                      </h3>

                      <p className="text-sm text-gray-500">
                        {sub.description}
                      </p>

                      <p className="text-xs text-gray-400 mt-1">
                        ~{sub.durationEstimate} mins
                      </p>
                    </div>

                    {/* RIGHT */}
                    <div className="text-right">

                      <p className="font-bold text-[#0077B6] text-lg">
                        ₹{sub.customerPrice}
                      </p>

                      {/* 🔥 CART UI */}
                      {item ? (
                        <div className="flex items-center gap-3 mt-2">
                          <button
                            onClick={() =>
                              dispatch(
                                decreaseQty({
                                  subServiceId: sub._id,
                                  bookingType: "service",
                                })
                              )
                            }
                            className="px-3 py-1 border rounded"
                          >
                            -
                          </button>

                          <span>{item.quantity}</span>

                          <button
                            onClick={() =>
                              dispatch(
                                increaseQty({
                                  subServiceId: sub._id,
                                  bookingType: "service",
                                })
                              )
                            }
                            className="px-3 py-1 border rounded"
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
                          className="mt-2 border border-[#0077B6] text-[#0077B6] px-4 py-2 rounded-xl"
                        >
                          Add
                        </button>
                      )}

                    </div>

                  </motion.div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 🔷 RIGHT SIDEBAR */}
        <div className="hidden lg:block">
          <div className="sticky top-24 bg-white p-6 rounded-3xl shadow border">

            <h3 className="font-semibold mb-4">Booking Summary</h3>

            {cartItems.length === 0 ? (
              <p className="text-sm text-gray-500">
                No items added yet
              </p>
            ) : (
              <>
                {cartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm mb-2">
                    <span>
                      {item.name} x {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}

                <div className="border-t mt-4 pt-4 font-semibold">
                  Total: ₹{total}
                </div>
              </>
            )}

<button
  onClick={() => navigate("/cart")}
  className="w-full mt-6 bg-[#0077B6] text-white py-3 rounded-xl"
>
  Continue
</button>

          </div>
        </div>

      </div>

      {/* 🔷 MOBILE CTA */}
      <div className="fixed bottom-0 left-0 w-full bg-white border-t p-4 lg:hidden">
      <button
  onClick={() => navigate("/cart")}
  className="w-full bg-[#0077B6] text-white py-3 rounded-xl"
>
  Continue Booking (₹{total})
</button>
      </div>

    </div>
  );
}