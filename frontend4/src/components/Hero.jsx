import { motion } from "framer-motion";
import { Star, Shield, Clock, CheckCircle } from "lucide-react";

export default function Hero() {
  return (
    <section className="bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white py-16 md:py-24">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">

        {/* LEFT CONTENT */}
        <div>
          {/* TRUST BADGE */}
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-6">
            <Shield size={16} />
            <span className="text-sm">
              Trusted by 10,000+ homes in Bhiwandi
            </span>
          </div>

          {/* HEADING */}
          <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-6">
            Home Services, <br /> Done Right.
          </h1>

          {/* DESCRIPTION */}
          <p className="text-white/90 text-lg mb-8 max-w-lg">
            Book verified professionals for plumbing, electrical,
            cleaning, AC repair & more. Fast, affordable, and guaranteed quality.
          </p>

          {/* CTA BUTTON */}
          <button className=" bg-white text-[#0077B6] text-primary font-semibold border-white px-6 py-3 rounded-lg flex items-center gap-2  hover:bg-white hover:text-[#0077B6] hover:scale-105 transition">
            Explore Services →
          </button>

          {/* FEATURES */}
          <div className="flex flex-wrap gap-6 mt-8 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <CheckCircle size={16} /> Verified Pros
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} /> Same Day Service
            </div>
            <div className="flex items-center gap-2">
              <Shield size={16} /> Quality Guaranteed
            </div>
          </div>
        </div>

        {/* RIGHT IMAGE */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <img
            src="/image.png" // 🔥 replace with your image in public folder
            alt="Worker"
            className="rounded-2xl shadow-2xl w-full"
          />

          {/* FLOATING RATING CARD */}
          <div className="absolute bottom-6 left-6 bg-white text-black px-4 py-3 rounded-xl shadow-lg flex items-center gap-3">
            <div className="bg-primary text-white p-2 rounded-full">
              <Star size={16} />
            </div>
            <div>
              <p className="font-semibold text-sm">4.8★ Average Rating</p>
              <p className="text-xs text-gray-500">
                Based on 5,000+ reviews
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </section>
  );
}