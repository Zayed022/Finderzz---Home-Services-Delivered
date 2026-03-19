import {
  Facebook,
  Instagram,
  Twitter,
  Mail,
  Phone,
} from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-950 text-gray-300 pt-14 pb-6">

      <div className="max-w-7xl mx-auto px-6 grid gap-10 md:grid-cols-2 lg:grid-cols-4">

        {/* 🔷 BRAND */}
        <div>
          <Link
            to="/"
            className="flex items-center mb-4 hover:opacity-90"
          >
            <img src="/logo.png" className="h-12" />
          </Link>

          <p className="text-sm text-gray-400 leading-relaxed">
            Finderzz is your trusted platform for reliable home
            services. Book professionals easily with transparent
            pricing and fast service delivery.
          </p>
        </div>

        {/* 🔷 QUICK LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Quick Links
          </h3>

          <ul className="space-y-2 text-sm">

            <li>
              <Link to="/" className="hover:text-white transition">
                Home
              </Link>
            </li>

            <li>
              <Link to="/services" className="hover:text-white transition">
                Services
              </Link>
            </li>

            <li>
              <Link to="/about" className="hover:text-white transition">
                About Us
              </Link>
            </li>

            <li>
              <Link to="/cart" className="hover:text-white transition">
                Cart
              </Link>
            </li>

            <li>
              <Link to="/my-bookings" className="hover:text-white transition">
                My Bookings
              </Link>
            </li>

          </ul>
        </div>

        {/* 🔷 LEGAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Legal
          </h3>

          <ul className="space-y-2 text-sm">

            <li>
              <Link to="/terms" className="hover:text-white transition">
                Terms & Conditions
              </Link>
            </li>

            <li>
              <Link to="/privacy" className="hover:text-white transition">
                Privacy Policy
              </Link>
            </li>

            <li>
              <Link to="/contact" className="hover:text-white transition">
                Customer Care
              </Link>
            </li>

          </ul>
        </div>

        {/* 🔷 CONTACT */}
        <div>
          <h3 className="text-white font-semibold mb-4">
            Contact
          </h3>

          <div className="space-y-3 text-sm">

            <div className="flex items-center gap-2">
              <Phone size={14} />
              <span>+91 9876543210</span>
            </div>

            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>support@finderzz.com</span>
            </div>

          </div>

          {/* SOCIAL */}
          <div className="flex gap-4 mt-5">

            <a href="#" className="hover:text-white transition">
              <Facebook size={18} />
            </a>

            <a href="#" className="hover:text-white transition">
              <Instagram size={18} />
            </a>

            <a href="#" className="hover:text-white transition">
              <Twitter size={18} />
            </a>

          </div>
        </div>
      </div>

      {/* 🔷 BOTTOM */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} Finderzz. All rights reserved.
      </div>

    </footer>
  );
}