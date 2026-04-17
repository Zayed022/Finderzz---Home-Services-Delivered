import { useEffect, useState } from "react";
import { Search, Star, Clock, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function ServicesPage() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [subServices, setSubServices] = useState([]);
  const [activeService, setActiveService] = useState("All Services");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  /* FETCH SERVICES */
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await API.get("/service");
        setServices(res.data.data || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchServices();
  }, []);

  /* FETCH SUB SERVICES */
  useEffect(() => {
    const fetchSubServices = async () => {
      try {
        setLoading(true);

        let res;

        if (activeService === "All Services") {
          res = await API.get("/subService/");
        } else {
          const selected = services.find(
            (item) => item.name === activeService
          );

          if (!selected) return;

          res = await API.get(
            `/subService/service/${selected._id}`
          );
        }

        setSubServices(res.data.data || []);
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

  /* SEARCH FILTER */
  const filteredSubServices = subServices.filter((sub) =>
    sub.name.toLowerCase().includes(search.toLowerCase())
  );

  /* STRUCTURED DATA */
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://finderzz.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://finderzz.com/services",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: filteredSubServices.slice(0, 12).map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: `https://finderzz.com/sub-service/${item._id}`,
    })),
  };

  return (
    <>
      <Helmet>
        <title>
          All Home Services in Bhiwandi | Plumbing, Maid & Cleaning | Finderzz
        </title>

        <meta
          name="description"
          content="Book trusted home services in Bhiwandi including plumbing, maid service, painting, cleaning and inspections. Affordable pricing and verified professionals."
        />

        <meta
          name="keywords"
          content="home services bhiwandi, plumber bhiwandi, maid service bhiwandi, cleaning service bhiwandi, painting service bhiwandi"
        />

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <link
          rel="canonical"
          href="https://finderzz.com/services"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="All Home Services in Bhiwandi | Finderzz"
        />
        <meta
          property="og:description"
          content="Explore verified plumbing, maid, cleaning, painting and inspection services in Bhiwandi."
        />
        <meta
          property="og:url"
          content="https://finderzz.com/services"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(itemListSchema)}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

        {/* HERO */}
        <section className="max-w-7xl mx-auto px-6 py-10">
          <h1 className="text-4xl font-bold text-gray-900">
            Home Services in Bhiwandi
          </h1>

          <p className="text-gray-500 mt-3 text-lg max-w-3xl">
            Book trusted professionals for plumbing, maid service, painting,
            cleaning, repairs, and inspection services in Bhiwandi.
          </p>

          {/* SEO CONTENT BLOCK */}
          <div className="mt-5 max-w-3xl text-sm text-gray-600 leading-relaxed">
            Finderzz helps customers in Bhiwandi discover affordable home
            services with transparent pricing, verified professionals, quick
            booking, and responsive customer support.
          </div>

          {/* SEARCH */}
          <div className="flex flex-col md:flex-row gap-4 mt-8">
            <div className="flex items-center gap-2 flex-1 bg-white border rounded-xl px-4 py-3 shadow-sm focus-within:ring-2 focus-within:ring-blue-500">
              <Search size={18} className="text-gray-400" />

              <input
                placeholder="Search services..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full outline-none text-sm"
              />
            </div>

            <div className="bg-white border rounded-xl px-4 py-3 text-sm shadow-sm flex items-center">
              {filteredSubServices.length} Services
            </div>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="max-w-7xl mx-auto px-6 pb-4 grid sm:grid-cols-3 gap-4">
          <div className="bg-white border rounded-xl p-4 text-center">
            <ShieldCheck className="mx-auto text-green-600 mb-2" />
            <p className="text-sm font-medium">
              Verified Professionals
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4 text-center">
            <Clock className="mx-auto text-blue-600 mb-2" />
            <p className="text-sm font-medium">
              Fast Service Booking
            </p>
          </div>

          <div className="bg-white border rounded-xl p-4 text-center">
            <Star className="mx-auto text-yellow-500 mb-2" />
            <p className="text-sm font-medium">
              Highly Rated Services
            </p>
          </div>
        </section>

        {/* CATEGORY FILTER */}
        <section className="max-w-7xl mx-auto px-6 overflow-x-auto pb-2">
          <div className="flex gap-3">

            <button
              onClick={() => setActiveService("All Services")}
              className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                activeService === "All Services"
                  ? "bg-blue-600 text-white shadow"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All Services
            </button>

            {services.map((service) => (
              <button
                key={service._id}
                onClick={() => setActiveService(service.name)}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition ${
                  activeService === service.name
                    ? "bg-blue-600 text-white shadow"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {service.name}
              </button>
            ))}
          </div>
        </section>

        {/* GRID */}
        <section className="max-w-7xl mx-auto px-6 py-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {loading && (
            <p className="col-span-full text-center text-gray-500">
              Loading services...
            </p>
          )}

          {!loading && filteredSubServices.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No services found
            </p>
          )}

          {!loading &&
            filteredSubServices.map((sub) => (
              <article
                key={sub._id}
                onClick={() =>
                  navigate(`/sub-service/${sub._id}`)
                }
                className="cursor-pointer bg-white rounded-2xl border shadow-sm hover:shadow-xl transition p-5 group"
              >
                <h2 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition">
                  {sub.name}
                </h2>

                <p className="text-sm text-gray-500 mt-2 line-clamp-2">
                  {sub.description}
                </p>

                <div className="border-t my-4" />

                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-bold text-gray-900">
                      ₹{sub.customerPrice}
                    </p>

                    <p className="text-xs text-gray-400">
                      starting price
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <Star
                        size={14}
                        className="text-yellow-500"
                      />
                      4.8
                    </span>

                    <span className="flex items-center gap-1">
                      <Clock size={14} />
                      {sub.durationEstimate} min
                    </span>
                  </div>
                </div>
              </article>
            ))}
        </section>

        {/* EXTRA SEO TEXT */}
        <section className="max-w-5xl mx-auto px-6 pb-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Choose Finderzz in Bhiwandi?
          </h2>

          <p className="text-sm text-gray-600 leading-relaxed">
            Finderzz offers reliable home services in Bhiwandi with verified
            experts, transparent pricing, and quick customer support. Whether
            you need a plumber, maid, cleaner, painter, or inspection service,
            we make booking simple and hassle-free.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
}