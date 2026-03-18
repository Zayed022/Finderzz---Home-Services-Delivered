import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <Link to="/" className="flex items-center hover:opacity-90 transition">
              <img src="/Icon_footer.png" alt="Finderzz Logo" className="h-12 w-auto object-contain" />
            </Link>

      <div className="space-x-6">
        <Link to="/" className="hover:text-primary">Home</Link>
        <Link to="/services" className="hover:text-primary">Services</Link>
        <Link to="/profile" className="hover:text-primary">Profile</Link>
      </div>

      <button className="bg-primary text-white px-4 py-2 rounded-lg">
        Book Now
      </button>
    </nav>
  );
}