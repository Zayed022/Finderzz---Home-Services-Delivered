import { Facebook, Instagram, Twitter } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-12 pb-6">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-4 gap-8">

        {/* BRAND */}
        <div>
        <Link to="/" className="flex items-center hover:opacity-90 transition">
              <img src="/logo.png" alt="Finderzz Logo" className="h-12 w-auto object-contain" />
            </Link>
          <p className="text-sm text-gray-400">
            Your trusted platform for home services in Bhiwandi. Fast, reliable,
            and professional.
          </p>
        </div>

        {/* LINKS */}
        <div>
          <h3 className="text-white font-semibold mb-4">Services</h3>
          <ul className="space-y-2 text-sm">
            <li>Plumbing</li>
            <li>Electrical</li>
            <li>Cleaning</li>
            <li>AC Repair</li>
          </ul>
        </div>

        <div>
          <h3 className="text-white font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-sm">
            <li>About Us</li>
            <li>Contact</li>
            <li>Careers</li>
            <li>Privacy Policy</li>
          </ul>
        </div>

        {/* SOCIAL */}
        <div>
          <h3 className="text-white font-semibold mb-4">Follow Us</h3>
          <div className="flex gap-4">
            <Facebook size={20} className="cursor-pointer hover:text-white" />
            <Instagram size={20} className="cursor-pointer hover:text-white" />
            <Twitter size={20} className="cursor-pointer hover:text-white" />
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="border-t border-gray-800 mt-10 pt-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} Finders. All rights reserved.
      </div>
    </footer>
  );
}