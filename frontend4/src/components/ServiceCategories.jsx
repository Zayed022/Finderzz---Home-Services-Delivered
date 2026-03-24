import { motion } from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.06, duration: 0.5, ease: "easeOut" },
  }),
};

// 🎨 Elegant gradient system (premium tones)
const gradients = [
  "from-blue-500/15 to-cyan-400/10",
  "from-indigo-500/15 to-blue-400/10",
  "from-emerald-500/15 to-green-400/10",
  "from-purple-500/15 to-pink-400/10",
  "from-orange-400/15 to-yellow-300/10",
  "from-rose-400/15 to-red-300/10",
];

export default function ServiceCategories() {
  const { data, isLoading } = useCategories();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <section className="py-28 text-center">
        <p className="text-gray-500">Loading services...</p>
      </section>
    );
  }

  const services = data?.flatMap((cat) => cat.services) || [];

  return (
    <section className="relative py-28 bg-gradient-to-b from-white via-blue-50/30 to-white overflow-hidden">

      {/* 🔥 subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-72 h-72 bg-cyan-400/10 rounded-full blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900">
  Explore Home Services in Bhiwandi
</h2>

<h3 className="text-gray-600 mt-4 mb-16 max-w-2xl mx-auto text-lg">
  Choose from a wide range of professional services including cleaning, repair, and inspection.
</h3>

        <p className="text-gray-600 mt-4 mb-16 max-w-2xl mx-auto text-lg">
          Professional services for every need, delivered by verified experts in Bhiwandi.
        </p>

        {/* Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {services.map((service, i) => {
            const isPopular = service.isPopular;
            const gradient = gradients[i % gradients.length];

            return (
              <motion.div
                key={service._id}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="group relative"
              >

                {/* 🌟 Glow Layer */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-[#0077B6]/20 to-[#00B4D8]/20 opacity-0 group-hover:opacity-100 blur-xl transition duration-500" />

                {/* Card */}
                <div
                onClick={() => navigate(`/service/${service._id}`)}
                  className={`
                    relative rounded-3xl p-6 text-left transition-all duration-500
                    backdrop-blur-xl
                    bg-gradient-to-br ${gradient}
                    border
                    ${isPopular
                      ? "border-[#0077B6]/60 shadow-lg"
                      : "border-white/40"}
                    hover:-translate-y-3 hover:shadow-2xl
                  `}
                >

                  {/* Popular Ribbon */}
                  {isPopular && (
                    <div className="absolute -top-3 left-4 bg-[#0077B6] text-white text-xs px-3 py-1 rounded-full shadow-md">
                      ⭐ Most Booked
                    </div>
                  )}

                  {/* Icon */}
                  <div className="w-14 h-14 rounded-xl bg-white/80 backdrop-blur flex items-center justify-center mb-5 shadow-md group-hover:scale-110 transition">
                    <img
                      src={service.icon}
                      alt={service.name}
                      className="w-7 h-7 object-contain"
                    />
                  </div>

                  {/* Title */}
                  <h3 className="font-semibold text-gray-900 text-lg mb-1 group-hover:text-[#0077B6] transition">
                    {service.name}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {getServiceDescription(service.name)}
                  </p>

                  {/* CTA */}
                  <div className="mt-5 text-sm font-medium text-[#0077B6] opacity-0 group-hover:opacity-100 transition">
                    Book Now →
                  </div>

                </div>

              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

/**
 * Temporary helper
 */
function getServiceDescription(name) {
  const map = {
    Electrician: "Wiring, switches, fan installation",
    Painter: "Wall painting, waterproofing",
    "Maid Service": "Cleaning, dusting, maintenance",
  };

  return map[name] || "Professional service at your doorstep";
}