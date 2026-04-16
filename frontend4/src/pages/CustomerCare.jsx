import { Phone, Mail, MessageCircle } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Helmet } from "react-helmet-async";

export default function CustomerCare() {
  return (
    <>
      <Helmet>
        <title>
          Customer Support for Home Services in Bhiwandi | Finderzz
        </title>

        <meta
          name="description"
          content="Contact Finderzz customer support for home services in Bhiwandi. Get help with bookings, cancellations, refunds, and service queries. Available 24/7."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://finderzz.com/customer-care"
        />

        {/* ✅ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: "Finderzz Customer Support",
            url: "https://finderzz.com/customer-care",
            description:
              "Customer support page for Finderzz home services in Bhiwandi.",
          })}
        </script>

        {/* ✅ Organization Schema */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: "Finderzz",
            url: "https://finderzz.com",
            contactPoint: {
              "@type": "ContactPoint",
              telephone: "+918262990986",
              contactType: "customer support",
              areaServed: "IN",
              availableLanguage: "English",
            },
          })}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">

        {/* ✅ HERO */}
        <div className="max-w-5xl mx-auto px-6 py-12 text-center">
          <h1 className="text-3xl font-bold text-gray-900">
            Customer Support for Finderzz Home Services in Bhiwandi
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl mx-auto">
            Need help with your home service booking? Contact Finderzz support
            for assistance with plumbing, maid services, painting, cleaning,
            cancellations, or refunds. Our team is available 24/7 to help you.
          </p>
        </div>

        {/* ✅ CONTACT OPTIONS */}
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-3 gap-6">

          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <Phone className="mx-auto text-blue-600 mb-3" />
            <h2 className="font-semibold">Call Customer Support</h2>
            <p className="text-sm text-gray-500 mt-1">
              +91 8262990986
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <Mail className="mx-auto text-green-600 mb-3" />
            <h2 className="font-semibold">Email Support</h2>
            <p className="text-sm text-gray-500 mt-1">
              support.finderzz@gmail.com
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border shadow text-center">
            <MessageCircle className="mx-auto text-purple-600 mb-3" />
            <h2 className="font-semibold">Live Chat Support</h2>
            <p className="text-sm text-gray-500 mt-1">
              Available 24/7
            </p>
          </div>

        </div>

        {/* ✅ FAQ SECTION (SEO BOOSTER) */}
        <div className="max-w-4xl mx-auto px-6 py-12">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Frequently Asked Questions about Finderzz Services
          </h2>

          <div className="space-y-4">

            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-medium">
                How can I cancel my home service booking?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                You can cancel your booking directly from your account dashboard
                or by contacting Finderzz customer support.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-medium">
                When will I receive my refund?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Refunds are processed within 3–5 business days depending on
                eligibility and payment method.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border">
              <h3 className="font-medium">
                What services does Finderzz support cover?
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Finderzz provides support for plumbing, maid services, painting,
                cleaning, and home inspection services in Bhiwandi.
              </p>
            </div>

          </div>
        </div>

        {/* ✅ INTERNAL LINKING BOOST */}
        <div className="text-center pb-10">
          <a
            href="/services"
            className="text-blue-600 font-medium hover:underline"
          >
            Explore All Home Services in Bhiwandi →
          </a>
        </div>

      </div>

      <Footer />
    </>
  );
}