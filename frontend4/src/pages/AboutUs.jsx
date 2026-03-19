import { Users, ShieldCheck, Clock, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function About() {
  const navigate = useNavigate();

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HERO */}
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
          About Finderzz
        </h1>

        <p className="text-gray-600 mt-4 text-lg max-w-2xl mx-auto">
          Finderzz is a modern home services platform connecting
          customers with trusted professionals for all their home needs —
          from cleaning and repairs to inspections and maintenance.
        </p>
      </div>

      {/* 🔷 STATS */}
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-6 pb-12">

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-2xl font-bold text-blue-600">10K+</p>
          <p className="text-sm text-gray-500">Bookings</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-2xl font-bold text-blue-600">500+</p>
          <p className="text-sm text-gray-500">Professionals</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-2xl font-bold text-blue-600">4.8⭐</p>
          <p className="text-sm text-gray-500">Average Rating</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border text-center">
          <p className="text-2xl font-bold text-blue-600">24/7</p>
          <p className="text-sm text-gray-500">Support</p>
        </div>

      </div>

      {/* 🔷 WHAT WE DO */}
      <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">

        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            What We Do
          </h2>

          <p className="text-gray-600 mt-4 leading-relaxed">
            We simplify home services by bringing verified professionals
            directly to your doorstep. Whether it’s a quick repair,
            full home cleaning, or detailed inspection — Finderzz ensures
            a seamless experience with transparent pricing and quality service.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow border space-y-4">
          <div className="flex items-center gap-3">
            <Users className="text-blue-600" />
            <span>Verified Professionals</span>
          </div>

          <div className="flex items-center gap-3">
            <ShieldCheck className="text-green-600" />
            <span>Safe & Secure Services</span>
          </div>

          <div className="flex items-center gap-3">
            <Clock className="text-orange-500" />
            <span>On-Time Service</span>
          </div>

          <div className="flex items-center gap-3">
            <Star className="text-yellow-500" />
            <span>Top Rated Experience</span>
          </div>
        </div>

      </div>

      {/* 🔷 WHY CHOOSE US */}
      <div className="bg-slate-50 py-14">
        <div className="max-w-6xl mx-auto px-6 text-center">

          <h2 className="text-2xl font-semibold text-gray-900">
            Why Choose Finderzz?
          </h2>

          <div className="grid md:grid-cols-3 gap-6 mt-8">

            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold">Transparent Pricing</h3>
              <p className="text-sm text-gray-500 mt-2">
                No hidden costs. Pay only for what you get.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold">Trusted Experts</h3>
              <p className="text-sm text-gray-500 mt-2">
                Background-verified professionals.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow border">
              <h3 className="font-semibold">Convenient Booking</h3>
              <p className="text-sm text-gray-500 mt-2">
                Book services in just a few clicks.
              </p>
            </div>

          </div>

        </div>
      </div>

      {/* 🔷 CTA */}
      <div className="max-w-5xl mx-auto px-6 py-16 text-center">

        <h2 className="text-2xl font-semibold text-gray-900">
          Ready to Book a Service?
        </h2>

        <p className="text-gray-500 mt-2">
          Explore services and get started in seconds.
        </p>

        <button
          onClick={() => navigate("/services")}
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition shadow"
        >
          Explore Services
        </button>

      </div>

    </div>
    <Footer/>
    </>
  );
}