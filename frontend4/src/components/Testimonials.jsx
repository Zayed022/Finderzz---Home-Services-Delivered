import { Star } from "lucide-react";

export default function Testimonials() {
  const reviews = [
    {
      text: "Finders made it so easy to get my AC serviced. The technician was on time and very professional. Highly recommended!",
      name: "Priya Sharma",
      role: "Homeowner",
    },
    {
      text: "We use Finders for all our office maintenance needs. Their plumbing and electrical services are top-notch.",
      name: "Rajesh Patel",
      role: "Business Owner",
    },
    {
      text: "The deep cleaning service was amazing. My house looks brand new. Fair pricing and great quality.",
      name: "Anita Deshmukh",
      role: "Homeowner",
    },
  ];

  return (
    <section className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-6 text-center">

        <h2 className="text-3xl md:text-4xl font-bold mb-12">
          What Our Customers Say
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition"
            >
              {/* Stars */}
              <div className="flex gap-1 mb-4 text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={16} fill="currentColor" />
                ))}
              </div>

              <p className="text-gray-700 mb-6 text-sm leading-relaxed">
                "{review.text}"
              </p>

              <div>
                <p className="font-semibold">{review.name}</p>
                <p className="text-gray-500 text-sm">{review.role}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}