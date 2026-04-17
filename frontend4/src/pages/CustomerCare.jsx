import {
  Phone,
  Mail,
  MessageCircle,
  Clock3,
  ShieldCheck,
  Headphones,
  CheckCircle2,
} from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function CustomerCare() {
  const faqs = [
    {
      q: "How can I cancel my home service booking?",
      a: "You can cancel your booking from your account dashboard or contact Finderzz customer support for quick assistance.",
    },
    {
      q: "When will I receive my refund?",
      a: "Eligible refunds are usually processed within 3 to 5 business days depending on your payment provider.",
    },
    {
      q: "What services does Finderzz customer support handle?",
      a: "We help with plumbing, maid services, painting, cleaning, booking rescheduling, payments, refunds and general service assistance.",
    },
    {
      q: "Is Finderzz support available every day?",
      a: "Yes, Finderzz customer care is available 24/7.",
    },
    {
      q: "How do I contact Finderzz support quickly?",
      a: "You can call us directly, email us or use live chat support for instant help.",
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
    logo: "https://finderzz.com/logo.png",
    sameAs: ["https://finderzz.com"],
    contactPoint: [
      {
        "@type": "ContactPoint",
        telephone: "+918262990986",
        contactType: "customer support",
        areaServed: "IN",
        availableLanguage: ["English", "Hindi"],
      },
    ],
  };

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Finderzz Customer Care",
    url: "https://finderzz.com/customer-care",
    description:
      "Finderzz customer care for bookings, cancellations, refunds and home services in Bhiwandi.",
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
      <Helmet prioritizeSeoTags>
        {/* PRIMARY SEO */}
        <title>
          Finderzz Customer Care in Bhiwandi | 24/7 Booking Help & Support
        </title>

        <meta
          name="description"
          content="Contact Finderzz customer care in Bhiwandi for booking help, cancellations, refunds, plumbing, maid, painting and cleaning services. 24/7 support available."
        />

        <meta
          name="keywords"
          content="Finderzz customer care, Finderzz support, customer care Bhiwandi, booking help Finderzz, refund support Finderzz, plumbing support Bhiwandi"
        />

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <meta name="author" content="Finderzz" />

        <link
          rel="canonical"
          href="https://finderzz.com/customer-care"
        />

        {/* OPEN GRAPH */}
        <meta
          property="og:type"
          content="website"
        />
        <meta
          property="og:site_name"
          content="Finderzz"
        />
        <meta
          property="og:title"
          content="Finderzz Customer Care in Bhiwandi"
        />
        <meta
          property="og:description"
          content="24/7 customer support for bookings, cancellations, refunds and home services."
        />
        <meta
          property="og:url"
          content="https://finderzz.com/customer-care"
        />
        <meta
          property="og:image"
          content="https://finderzz.com/og-image.jpg"
        />

        {/* TWITTER */}
        <meta
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          name="twitter:title"
          content="Finderzz Customer Care in Bhiwandi"
        />
        <meta
          name="twitter:description"
          content="Need help with Finderzz services? Reach our support team 24/7."
        />
        <meta
          name="twitter:image"
          content="https://finderzz.com/og-image.jpg"
        />

        {/* MOBILE */}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />

        {/* STRUCTURED DATA */}
        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(contactPageSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(faqSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Navbar />

      <main className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        {/* HERO */}
        <section className="max-w-5xl mx-auto px-6 py-14 text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
            Finderzz Customer Care & Support in Bhiwandi
          </h1>

          <p className="text-gray-600 mt-5 max-w-3xl mx-auto leading-relaxed text-lg">
            Need help with bookings, refunds, cancellations, technician delays,
            rescheduling or payment issues? Finderzz customer support is
            available 24/7 for fast assistance.
          </p>

          <div className="mt-6 flex justify-center gap-3 flex-wrap">
            <span className="bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              24/7 Support
            </span>

            <span className="bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm font-medium">
              Fast Resolution
            </span>

            <span className="bg-purple-50 text-purple-700 px-4 py-2 rounded-full text-sm font-medium">
              Trusted Service
            </span>
          </div>
        </section>

        {/* CONTACT OPTIONS */}
        <section className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">
          <div className="bg-white border rounded-2xl shadow p-6 text-center">
            <Phone className="mx-auto text-blue-600 mb-3" />
            <h2 className="font-semibold text-lg">Call Support</h2>

            <a
              href="tel:+918262990986"
              className="text-gray-500 mt-2 block hover:text-blue-600"
            >
              +91 8262990986
            </a>
          </div>

          <div className="bg-white border rounded-2xl shadow p-6 text-center">
            <Mail className="mx-auto text-green-600 mb-3" />
            <h2 className="font-semibold text-lg">Email Support</h2>

            <a
              href="mailto:support.finderzz@gmail.com"
              className="text-gray-500 mt-2 block hover:text-green-600"
            >
              support.finderzz@gmail.com
            </a>
          </div>

          <div className="bg-white border rounded-2xl shadow p-6 text-center">
            <MessageCircle className="mx-auto text-purple-600 mb-3" />
            <h2 className="font-semibold text-lg">Live Chat</h2>

            <p className="text-gray-500 mt-2">
              Instant Help Available
            </p>
          </div>
        </section>

        {/* TRUST */}
        <section className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-4 gap-4">
          <div className="bg-white border rounded-xl p-5 text-center">
            <Clock3 className="mx-auto mb-2 text-blue-600" />
            <p className="font-medium text-sm">Quick Response</p>
          </div>

          <div className="bg-white border rounded-xl p-5 text-center">
            <ShieldCheck className="mx-auto mb-2 text-green-600" />
            <p className="font-medium text-sm">Secure Assistance</p>
          </div>

          <div className="bg-white border rounded-xl p-5 text-center">
            <Headphones className="mx-auto mb-2 text-purple-600" />
            <p className="font-medium text-sm">Expert Support</p>
          </div>

          <div className="bg-white border rounded-xl p-5 text-center">
            <CheckCircle2 className="mx-auto mb-2 text-orange-600" />
            <p className="font-medium text-sm">Trusted by Customers</p>
          </div>
        </section>

        {/* CONTENT BLOCK FOR SEO */}
        <section className="max-w-4xl mx-auto px-6 py-4">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Why Contact Finderzz Customer Care?
          </h2>

          <p className="text-gray-600 leading-relaxed">
            Finderzz helps customers across Bhiwandi with professional home
            services including plumbing, maid services, painting, home cleaning,
            repairs and inspections. Our customer support team helps manage
            appointments, pricing concerns, refunds, service delays and all
            booking related requests.
          </p>
        </section>

        {/* FAQ */}
        <section className="max-w-4xl mx-auto px-6 py-12">
          <h2 className="text-2xl font-semibold mb-6">
            Frequently Asked Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((item, index) => (
              <div
                key={index}
                className="bg-white border rounded-xl p-5"
              >
                <h3 className="font-semibold text-gray-900">
                  {item.q}
                </h3>

                <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                  {item.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* INTERNAL LINKS */}
        <section className="text-center pb-14 px-6">
          <a
            href="/services"
            className="text-blue-600 font-semibold hover:underline"
          >
            Explore All Home Services →
          </a>
        </section>
      </main>

      <Footer />
    </>
  );
}