import { Phone, Mail, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function CustomerCare() {
  return (
    <>
    <Helmet>
  <title>Customer Support in Bhiwandi | Finderzz</title>
  <meta name="description" content="Contact Finderzz for home service support, bookings, and queries in Bhiwandi. Available 24/7." />
  <link rel="canonical" href="https://finderzz.com/customer-care" />
</Helmet>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      <div className="max-w-5xl mx-auto px-6 py-12 text-center">

      <h1 className="text-3xl font-bold text-gray-900">
  Customer Support for Home Services in Bhiwandi
</h1>

        <p className="text-gray-500 mt-3">
          We're here to help you 24/7. Reach out to us anytime.
        </p>

      </div>

      {/* CONTACT OPTIONS */}
      <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">

        {/* PHONE */}
        <div className="bg-white p-6 rounded-2xl border shadow text-center">
          <Phone className="mx-auto text-blue-600 mb-3" />
          <h3 className="font-semibold">Call Us</h3>
          <p className="text-sm text-gray-500 mt-1">
            +91 9876543210
          </p>
        </div>

        {/* EMAIL */}
        <div className="bg-white p-6 rounded-2xl border shadow text-center">
          <Mail className="mx-auto text-green-600 mb-3" />
          <h3 className="font-semibold">Email</h3>
          <p className="text-sm text-gray-500 mt-1">
            support@finderzz.com
          </p>
        </div>

        {/* CHAT */}
        <div className="bg-white p-6 rounded-2xl border shadow text-center">
          <MessageCircle className="mx-auto text-purple-600 mb-3" />
          <h3 className="font-semibold">Live Chat</h3>
          <p className="text-sm text-gray-500 mt-1">
            Available 24/7
          </p>
        </div>

      </div>

      {/* FAQ SECTION */}
      <div className="max-w-4xl mx-auto px-6 py-12">

        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Frequently Asked Questions
        </h2>

        <div className="space-y-4">

          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-medium">
              How can I cancel my booking?
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              You can cancel from your bookings page or contact support.
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border">
            <h3 className="font-medium">
              When will I get a refund?
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Refunds depend on eligibility and are processed within 3–5 days.
            </p>
          </div>

        </div>

      </div>
    </div>
    <Footer/>
    </>
  );
}