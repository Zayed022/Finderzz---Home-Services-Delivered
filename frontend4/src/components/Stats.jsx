import { Users, Award, CheckCircle } from "lucide-react";

export default function Stats() {
  const stats = [
    {
      icon: <Users className="text-primary" size={28} />,
      value: "10,000+",
      label: "Happy Customers",
    },
    {
      icon: <Award className="text-primary" size={28} />,
      value: "500+",
      label: "Expert Professionals",
    },
    {
      icon: <CheckCircle className="text-primary" size={28} />,
      value: "50,000+",
      label: "Services Completed",
    },
  ];

  return (
    <section className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-3 gap-8 text-center">
        {stats.map((stat, i) => (
          <div key={i} className="flex flex-col items-center gap-3">
            {stat.icon}
            <h2 className="text-3xl font-bold text-gray-900">
              {stat.value}
            </h2>
            <p className="text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}