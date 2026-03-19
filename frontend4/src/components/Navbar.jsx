import {
  Link,
  useNavigate,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useRef, useEffect } from "react";
import {
  MapPin,
  ChevronDown,
  MoreVertical,
  Menu,
  X,
} from "lucide-react";
import AreaModal from "../components/AreaModal";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const area = useSelector((state) => state.area.selectedArea);

  const [openArea, setOpenArea] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuRef = useRef();

  /* 🔥 CLOSE DROPDOWN ON OUTSIDE CLICK */
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold"
      : "text-gray-600 hover:text-gray-900";

  return (
    <>
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b shadow-sm">

        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* 🔷 LEFT */}
          <div className="flex items-center gap-4">

            {/* MOBILE MENU BTN */}
            <button
              className="md:hidden"
              onClick={() => setMobileOpen(true)}
            >
              <Menu />
            </button>

            {/* LOGO */}
            <Link to="/" className="flex items-center gap-2">
              <img src="/Icon_footer.png" className="h-10" />
            </Link>
          </div>

          {/* 🔷 NAV LINKS (DESKTOP) */}
          <div className="hidden md:flex items-center gap-10 text-[14px] font-medium">

  <Link
    to="/"
    className={`relative transition ${
      isActive("/") 
        ? "text-blue-600 font-semibold" 
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    Home
    {location.pathname === "/" && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
    )}
  </Link>

  <Link
    to="/services"
    className={`relative transition ${
      isActive("/services") 
        ? "text-blue-600 font-semibold" 
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    Services
    {location.pathname === "/services" && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
    )}
  </Link>

  <Link
    to="/about"
    className={`relative transition ${
      isActive("/about") 
        ? "text-blue-600 font-semibold" 
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    About Us
    {location.pathname === "/about" && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
    )}
  </Link>

  <Link
    to="/my-bookings"
    className={`relative transition ${
      isActive("/my-bookings") 
        ? "text-blue-600 font-semibold" 
        : "text-gray-600 hover:text-gray-900"
    }`}
  >
    My Bookings
    {location.pathname === "/my-bookings" && (
      <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-blue-600 rounded-full" />
    )}
  </Link>

</div>
          {/* 🔷 RIGHT */}
          <div className="flex items-center gap-3">

            {/* 📍 LOCATION */}
            <button
              onClick={() => setOpenArea(true)}
              className="hidden sm:flex items-center gap-3 bg-gray-50 border px-4 py-2 rounded-full hover:shadow-md transition group"
            >
              <div className="bg-blue-100 text-blue-600 p-2 rounded-full">
                <MapPin size={16} />
              </div>

              <div className="text-left leading-tight">
                <p className="text-[10px] text-gray-400 uppercase">
                  Location
                </p>
                <p className="text-sm font-medium text-gray-800 max-w-[100px] truncate">
                  {area || "Select Area"}
                </p>
              </div>

              <ChevronDown size={14} />
            </button>

            {/* 🔥 CART */}
            <button
              onClick={() => navigate("/cart")}
              className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition shadow"
            >
              Cart
            </button>

            {/* 🔥 MORE MENU */}
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setOpenMenu(!openMenu)}
                className="p-2 rounded-full hover:bg-gray-100"
              >
                <MoreVertical size={18} />
              </button>

              {openMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg py-2 z-50">

                  <button
                    onClick={() => navigate("/customer-care")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Customer Care
                  </button>

                  <button
                    onClick={() => navigate("/terms")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Terms & Conditions
                  </button>

                  <button
                    onClick={() => navigate("/policy")}
                    className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-50"
                  >
                    Privacy Policy
                  </button>

                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* 🔷 MOBILE MENU */}
      {mobileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50">

          <div className="bg-white w-64 h-full p-6 shadow-lg">

            {/* HEADER */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-semibold text-lg">Menu</h2>

              <button onClick={() => setMobileOpen(false)}>
                <X />
              </button>
            </div>

            {/* LINKS */}
            <div className="flex flex-col gap-4 text-sm">

              <Link to="/" onClick={() => setMobileOpen(false)}>
                Home
              </Link>

              <Link to="/services" onClick={() => setMobileOpen(false)}>
                Services
              </Link>

              <Link to="/about" onClick={() => setMobileOpen(false)}>
                About Us
              </Link>

              <Link to="/my-bookings" onClick={() => setMobileOpen(false)}>
                My Bookings
              </Link>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/contact");
                }}
              >
                Customer Care
              </button>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/terms");
                }}
              >
                Terms & Conditions
              </button>

              <button
                onClick={() => {
                  setMobileOpen(false);
                  navigate("/privacy");
                }}
              >
                Privacy Policy
              </button>

            </div>
          </div>
        </div>
      )}

      <AreaModal
        isOpen={openArea}
        onClose={() => setOpenArea(false)}
      />
    </>
  );
}