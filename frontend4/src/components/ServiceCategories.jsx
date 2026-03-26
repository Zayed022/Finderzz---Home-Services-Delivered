import { motion } from "framer-motion";
import { useCategories } from "../hooks/useCategories";
import { useNavigate } from "react-router-dom";

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.04, duration: 0.35 },
  }),
};

export default function ServiceCategories() {
  const { data, isLoading } = useCategories();
  const navigate = useNavigate();

  return (
    <section className="bg-[#FAFBFC] py-16 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-gray-900 tracking-tight">
            Explore Home Services in Bhiwandi
          </h2>

          <p className="text-gray-500 mt-3 text-sm sm:text-base leading-relaxed">
            Choose from a wide range of professional services including cleaning,
            repair, and inspection.
          </p>
        </div>

        {/* Categories */}
        <div className="space-y-12">

          {isLoading
            ? Array.from({ length: 3 }).map((_, i) => (
                <SkeletonCategory key={i} />
              ))
            : data?.map((category) => (
                <div key={category._id}>

                  {/* Category Title */}
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-5">
                    {category.name}
                  </h3>

                  {/* Grid per category */}
                  <div className="
                    grid 
                    grid-cols-2 
                    sm:grid-cols-3 
                    md:grid-cols-4 
                    lg:grid-cols-5 
                    gap-4 sm:gap-5 md:gap-6
                  ">
                    {category.services.map((service, i) => {
                      const isPopular = service.isPopular;

                      return (
                        <motion.div
                          key={service._id}
                          custom={i}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          variants={fadeUp}
                        >
                          <div
                            onClick={() => navigate(`/service/${service._id}`)}
                            className="
                              group relative cursor-pointer
                              bg-white rounded-2xl
                              p-5 sm:p-6
                              border border-gray-200/80
                              shadow-sm
                              hover:shadow-lg
                              hover:-translate-y-[3px]
                              active:scale-[0.98]
                              transition-all duration-200
                              h-full flex flex-col justify-between
                            "
                          >

                            {/* Badge */}
                            {isPopular && (
                              <div className="absolute top-3 left-3 text-[10px] font-medium bg-blue-50 text-blue-600 px-2 py-[3px] rounded-full">
                                ⭐ Most Booked
                              </div>
                            )}

                            {/* Content */}
                            <div>
                              {/* Icon */}
                              <div className="
                                w-14 h-14 sm:w-16 sm:h-16 mb-4
                                flex items-center justify-center
                                rounded-xl
                                bg-gray-50
                                border border-gray-100
                                group-hover:bg-white
                                transition
                              ">
                                <img
                                  src={service.icon}
                                  alt={service.name}
                                  className="w-11 h-11 sm:w-8 sm:h-8 object-contain"
                                />
                              </div>

                              {/* Title */}
                              <h3 className="text-gray-900 text-sm sm:text-base font-medium leading-tight">
                                {service.name}
                              </h3>

                              {/* Description */}
                              <p className="text-gray-500 text-xs sm:text-sm mt-1 leading-snug line-clamp-2">
                                {getServiceDescription(service.name)}
                              </p>
                            </div>

                            {/* CTA */}
                            <div className="
                              mt-4 text-xs sm:text-sm font-medium
                              text-gray-400
                              group-hover:text-blue-600
                              transition
                            ">
                              View details →
                            </div>

                          </div>
                        </motion.div>
                      );
                    })}
                  </div>

                </div>
              ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Skeleton Loader ---------------- */

function SkeletonCategory() {
  return (
    <div>
      <div className="h-5 w-40 bg-gray-200 rounded mb-5 animate-pulse" />

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="bg-white rounded-2xl p-5 border border-gray-200 animate-pulse"
          >
            <div className="w-14 h-14 bg-gray-200 rounded-xl mb-4" />
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
            <div className="h-3 bg-gray-100 rounded w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Helper ---------------- */

function getServiceDescription(name) {
  const map = {
    Electrician: "Wiring, switches, fan installation",
    Painter: "Wall painting, waterproofing",
    "Maid Service": "Cleaning, dusting, maintenance",
  };

  return map[name] || "Professional service at your doorstep";
}