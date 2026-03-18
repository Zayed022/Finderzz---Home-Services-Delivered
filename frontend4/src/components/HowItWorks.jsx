import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

export default function HowItWorks() {
  const steps = [
    {
      step: "1",
      title: "Choose a Service",
      desc: "Browse our categories and select the service you need.",
    },
    {
      step: "2",
      title: "Book a Time Slot",
      desc: "Pick a convenient date and time for the professional visit.",
    },
    {
      step: "3",
      title: "Sit Back & Relax",
      desc: "Our verified pro arrives on time and gets the job done.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">

        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-14">
          How It Works
        </h2>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((item, i) => (
            <motion.div
              key={item.step}
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
              className="flex flex-col items-center"
            >

              {/* Circle */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-r from-[#0077B6] to-[#00B4D8] text-white flex items-center justify-center text-xl font-semibold mb-5 shadow-md">
                {item.step}
              </div>

              {/* Title */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                {item.desc}
              </p>

            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}