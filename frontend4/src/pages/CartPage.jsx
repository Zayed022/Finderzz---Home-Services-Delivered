import { useDispatch, useSelector } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../store/cartSlice";
import { useNavigate } from "react-router-dom";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ShieldCheck,
} from "lucide-react";

export default function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">

      {/* 🔷 HEADER */}
      <div className="bg-white border-b px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <ShoppingCart className="text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">
            Your Cart
          </h1>
        </div>

        {cartItems.length > 0 && (
          <span className="text-sm text-gray-500">
            {cartItems.length} items
          </span>
        )}
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-[2fr_1fr] gap-10">

        {/* 🔷 LEFT - ITEMS */}
        <div className="space-y-6">

          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-28 text-gray-500">
              <ShoppingCart size={56} className="opacity-30 mb-4" />
              <p className="text-lg font-medium">
                Your cart is empty
              </p>

              <button
                onClick={() => navigate("/")}
                className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow"
              >
                Explore Services
              </button>
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div
                key={i}
                className="group bg-white p-6 rounded-2xl border shadow-sm hover:shadow-xl transition-all duration-300"
              >

                <div className="flex justify-between items-start">

                  {/* LEFT */}
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.name}
                    </h3>

                    <div className="flex items-center gap-3 mt-2 text-xs">

                      <span className="bg-blue-50 text-blue-600 px-2 py-1 rounded-full font-medium">
                        {item.bookingType}
                      </span>

                      <span className="text-gray-400">
                        ⏱ {item.duration} mins
                      </span>
                    </div>
                  </div>

                  {/* PRICE */}
                  <p className="font-bold text-blue-600 text-lg">
                    ₹{item.price * item.quantity}
                  </p>
                </div>

                {/* ACTION ROW */}
                <div className="flex justify-between items-center mt-5">

                  {/* REMOVE */}
                  <button
                    onClick={() =>
                      dispatch(
                        removeFromCart({
                          subServiceId: item.subServiceId,
                          serviceId: item.serviceId,
                          bookingType: item.bookingType,
                        })
                      )
                    }
                    className="flex items-center gap-1 text-sm text-red-500 hover:text-red-600"
                  >
                    <Trash2 size={14} />
                    Remove
                  </button>

                  {/* QUANTITY */}
                  <div className="flex items-center gap-3 bg-gray-100 px-3 py-1.5 rounded-xl">

                    <button
                      onClick={() =>
                        dispatch(
                          decreaseQty({
                            subServiceId: item.subServiceId,
                            serviceId: item.serviceId,
                            bookingType: item.bookingType,
                          })
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
                    >
                      <Minus size={14} />
                    </button>

                    <span className="font-semibold text-gray-800 w-5 text-center">
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          increaseQty({
                            subServiceId: item.subServiceId,
                            serviceId: item.serviceId,
                            bookingType: item.bookingType,
                          })
                        )
                      }
                      className="w-7 h-7 flex items-center justify-center rounded-lg bg-white shadow-sm hover:bg-gray-50"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>

        {/* 🔷 RIGHT - SUMMARY */}
        {cartItems.length > 0 && (
          <div>
            <div className="sticky top-24 bg-white p-6 rounded-3xl shadow-xl border">

              <h2 className="font-semibold text-lg mb-4">
                Order Summary
              </h2>

              {/* ITEMS */}
              <div className="space-y-3">
                {cartItems.map((item, i) => (
                  <div
                    key={i}
                    className="flex justify-between text-sm text-gray-600"
                  >
                    <span className="truncate max-w-[70%]">
                      {item.name} × {item.quantity}
                    </span>
                    <span>₹{item.price * item.quantity}</span>
                  </div>
                ))}
              </div>

              {/* DIVIDER */}
              <div className="border-t my-5" />

              {/* TOTAL */}
              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-blue-600">₹{total}</span>
              </div>

              {/* TRUST BADGE */}
              <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                <ShieldCheck size={14} className="text-green-500" />
                Secure checkout & verified professionals
              </div>

              {/* CTA */}
              <button
                onClick={() => navigate("/checkout")}
                className="w-full mt-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition shadow-lg"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>

      
    </div>
  );
}