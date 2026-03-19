import { useDispatch, useSelector } from "react-redux";
import {
  increaseQty,
  decreaseQty,
  removeFromCart,
} from "../store/cartSlice";

export default function CartPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((state) => state.cart.items);

  const total = cartItems.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0
  );

  return (
    <div className="min-h-screen bg-[#f8fafc]">

      {/* HEADER */}
      <div className="bg-white border-b py-6 px-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Your Cart
        </h1>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-[2fr_1fr] gap-10">

        {/* LEFT - ITEMS */}
        <div className="space-y-6">

          {cartItems.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              Your cart is empty
            </div>
          ) : (
            cartItems.map((item, i) => (
              <div
                key={i}
                className="bg-white p-6 rounded-2xl shadow-sm border flex justify-between items-center"
              >

                {/* INFO */}
                <div>
                  <h3 className="font-semibold text-lg">
                    {item.name}
                  </h3>

                  <p className="text-sm text-gray-500">
                    {item.bookingType}
                  </p>

                  <p className="text-xs text-gray-400 mt-1">
                    ~{item.duration} mins
                  </p>
                </div>

                {/* ACTIONS */}
                <div className="text-right">

                  <p className="font-bold text-[#0077B6] text-lg mb-2">
                    ₹{item.price * item.quantity}
                  </p>

                  {/* Quantity */}
                  <div className="flex items-center justify-end gap-3 mb-3">
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
                      className="px-3 py-1 border rounded"
                    >
                      -
                    </button>

                    <span>{item.quantity}</span>

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
                      className="px-3 py-1 border rounded"
                    >
                      +
                    </button>
                  </div>

                  {/* Remove */}
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
                    className="text-sm text-red-500 hover:underline"
                  >
                    Remove
                  </button>

                </div>

              </div>
            ))
          )}

        </div>

        {/* RIGHT - SUMMARY */}
        <div>

          <div className="bg-white p-6 rounded-2xl shadow-sm border sticky top-24">

            <h2 className="font-semibold text-lg mb-4">
              Order Summary
            </h2>

            {cartItems.map((item, i) => (
              <div key={i} className="flex justify-between text-sm mb-2">
                <span>
                  {item.name} x {item.quantity}
                </span>
                <span>₹{item.price * item.quantity}</span>
              </div>
            ))}

            <div className="border-t mt-4 pt-4 font-semibold text-lg">
              Total: ₹{total}
            </div>

            <button className="w-full mt-6 bg-[#0077B6] text-white py-3 rounded-xl font-medium hover:shadow-md transition">
              Proceed to Checkout
            </button>

          </div>

        </div>

      </div>

    </div>
  );
}