import { useEffect, useState } from "react";
import { Search, Star, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function ServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [activeService, setActiveService] = useState("All Services");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* 🔷 FETCH SERVICES */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/service");
        setServices(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  /* 🔷 FETCH SUB SERVICES (CORE LOGIC) */
  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        setLoading(true);

        let res;

        if (activeService === "All Services") {
          res = await API.get("/subService/");
        } else {
          const selected = services.find(
            (s) => s.name === activeService
          );

          if (!selected) return;

          res = await API.get(
            `/subService/service/${selected._id}`
          );
        }

        setSubServices(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (services.length) {
      fetchSubServices();
    }
  }, [activeService, services]);

  /* 🔷 FILTER (SEARCH ONLY) */
  const filteredSubServices = subServices.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
    <Navbar/>
    <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

      {/* 🔷 HERO */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h1 className="text-4xl font-bold text-gray-900">
          All Services
        </h1>

        <p className="text-gray-500 mt-2 text-lg">
          Find the right professional for your home needs
        </p>

        {/* 🔍 SEARCH + SORT */}
        <div className="flex flex-col md:flex-row gap-4 mt-6">

          <div className="flex items-center gap-2 flex-1 bg-white border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
            <Search size={18} className="text-gray-400" />
            <input
              placeholder="Search services..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full outline-none text-sm"
            />
          </div>

          <select className="bg-white border rounded-xl px-4 py-3 text-sm shadow-sm">
            <option>Top Rated</option>
            <option>Price Low to High</option>
            <option>Price High to Low</option>
          </select>
        </div>
      </div>

      {/* 🔷 CATEGORY PILLS */}
      <div className="max-w-7xl mx-auto px-6 overflow-x-auto pb-2">
        <div className="flex gap-3">

          {/* ALL SERVICES */}
          <button
            onClick={() => setActiveService("All Services")}
            className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
              activeService === "All Services"
                ? "bg-blue-600 text-white shadow"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All Services
          </button>

          {/* DYNAMIC SERVICES */}
          {services.map((service) => (
            <button
              key={service._id}
              onClick={() => setActiveService(service.name)}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                activeService === service.name
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {service.name}
            </button>
          ))}

        </div>
      </div>

      {/* 🔷 GRID */}
      <div className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* 🔄 LOADING */}
        {loading && (
          <p className="col-span-full text-center text-gray-500">
            Loading services...
          </p>
        )}

        {/* ❌ EMPTY */}
        {!loading && filteredSubServices.length === 0 && (
          <p className="col-span-full text-center text-gray-500">
            No services found
          </p>
        )}

        {/* ✅ DATA */}
        {!loading &&
          filteredSubServices.map((sub) => (
            <div
              key={sub._id}
              onClick={() => navigate(`/sub-service/${sub._id}`)}
              className="cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-xl transition p-5 group"
            >

              {/* TITLE */}
              <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition">
                {sub.name}
              </h3>

              {/* DESC */}
              <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                {sub.description}
              </p>

              {/* DIVIDER */}
              <div className="border-t my-4" />

              {/* BOTTOM */}
              <div className="flex justify-between items-center">

                {/* PRICE */}
                <div>
                  <p className="text-lg font-bold text-gray-900">
                    ₹{sub.customerPrice}
                  </p>
                  <p className="text-xs text-gray-400">
                    starting
                  </p>
                </div>

                {/* META */}
                <div className="flex items-center gap-3 text-sm text-gray-500">

                  <span className="flex items-center gap-1">
                    <Star size={14} className="text-yellow-500" />
                    4.8
                  </span>

                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {sub.durationEstimate} min
                  </span>

                </div>
              </div>

            </div>
          ))}

      </div>
    </div>
    <Footer/>
    </>
  );
}