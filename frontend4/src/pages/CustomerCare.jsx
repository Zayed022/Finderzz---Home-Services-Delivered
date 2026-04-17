import { Phone, Mail, MessageCircle, Clock3, ShieldCheck } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function CustomerCare() {
  const faqs = [
    {
      q: "How can I cancel my home service booking?",
      a: "You can cancel your booking from your account dashboard or contact Finderzz customer support for assistance.",
    },
    {
      q: "When will I receive my refund?",
      a: "Eligible refunds are generally processed within 3–5 business days depending on your payment method.",
    },
    {
      q: "What services does Finderzz support cover?",
      a: "We assist with plumbing, maid services, painting, cleaning, inspection bookings, rescheduling, and payment queries.",
    },
    {
      q: "Is customer support available every day?",
      a: "Yes, Finderzz support is available 24/7 for customer assistance.",
    },
  ];

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finderzz",
    url: "https://finderzz.com",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+918262990986",
      contactType: "customer support",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Finderzz Customer Care",
    url: "https://finderzz.com/customer-care",
    description:
      "Finderzz customer care for bookings, cancellations, refunds, and home service support in Bhiwandi.",
  };

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
        name: "Customer Care",
        item: "https://finderzz.com/customer-care",
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>
          Finderzz Customer Care in Bhiwandi | Booking Help, Refunds & Support
        </title>

        <meta
          name="description"
          content="Contact Finderzz customer care in Bhiwandi for bookings, cancellations, refunds, plumbing, maid, painting and cleaning service support. Available 24/7."
        />

        <meta
          name="keywords"
          content="finderzz customer care, customer support bhiwandi, home service support bhiwandi, booking help finderzz, refund support finderzz"
        />

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <link
          rel="canonical"
          href="https://finderzz.com/customer-care"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Finderzz Customer Care in Bhiwandi"
        />
        <meta
          property="og:description"
          content="24/7 support for bookings, cancellations, refunds and home services."
        />
        <meta
          property="og:url"
          content="https://finderzz.com/customer-care"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Finderzz Customer Care in Bhiwandi"
        />
        <meta
          name="twitter:description"
          content="Need help with Finderzz services? Contact our support team 24/7."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(contactPageSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Finderzz Customer Care & Support in Bhiwandi
          </h1>

          <p className="text-gray-500 mt-4 max-w-3xl mx-auto leading-relaxed">
            Need help with bookings, cancellations, refunds, technician arrival,
            rescheduling, or service pricing? Finderzz customer support is
            available 24/7 to assist customers across Bhiwandi for all home
            service needs.
          </p>

          {/* SEO text block */}
          <div className="max-w-3xl mx-auto mt-6 text-sm text-gray-600 leading-relaxed">
            Finderzz support helps customers with plumbing, maid services,
            painting, cleaning, home inspection bookings, payment assistance,
            refunds, and general service queries in Bhiwandi.
          </div>
        </section>

        {/* CONTACT CARDS */}
        <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <Phone className="mx-auto text-blue-600 mb-3" />
            <h2 className="font-semibold text-gray-900">
              Call Customer Support
            </h2>

            <a
              href="tel:+918262990986"
              className="text-sm text-gray-500 mt-2 block hover:text-blue-600"
            >
              +91 8262990986
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <Mail className="mx-auto text-green-600 mb-3" />
            <h2 className="font-semibold text-gray-900">Email Support</h2>

            <a
              href="mailto:support.finderzz@gmail.com"
              className="text-sm text-gray-500 mt-2 block hover:text-green-600"
            >
              support.finderzz@gmail.com
            </a>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <MessageCircle className="mx-auto text-purple-600 mb-3" />
            <h2 className="font-semibold text-gray-900">Live Chat Support</h2>

            <p className="text-sm text-gray-500 mt-2">
              Available 24/7
            </p>
          </div>
        </section>

        {/* TRUST STRIP */}
        <section className="max-w-5xl mx-auto px-6 py-8 grid sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border p-4 text-center">
            <Clock3 className="mx-auto mb-2 text-blue-600" />
            <p className="text-sm font-medium">Fast Response Time</p>
          </div>

          <div className="bg-white rounded-xl border p-4 text-center">
            <ShieldCheck className="mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">Secure Booking Support</p>
          </div>

          <div className="bg-white rounded-xl border p-4 text-center">
            <MessageCircle className="mx-auto mb-2 text-purple-600" />
            <p className="text-sm font-medium">24/7 Assistance</p>
          </div>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="bg-white p-5 rounded-xl border"
              >
                <h3 className="font-medium text-gray-900">
                  {item.q}
                </h3>

                <p className="text-sm text-gray-500 mt-2 leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKING */}
        <section className="text-center pb-12 px-6">
          <a
            href="/services"
            className="text-blue-600 font-semibold hover:underline"
          >
            Explore All Home Services in Bhiwandi →
          </a>
        </section>
      </div>

      <Footer />
    </>
  );
}