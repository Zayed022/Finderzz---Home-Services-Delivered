import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Terms() {
  const TERMS = [
    "Finderzz is a technology marketplace platform connecting customers with independent service professionals.",
    "Finderzz does not directly provide services and all services are executed by verified third-party professionals.",
    "Inspection fees are strictly non-refundable once the inspection service has been completed.",
    "Final service pricing may vary based on on-site inspection, complexity, and material requirements.",
    "Finderzz is not liable for any damages, delays, or issues caused due to incorrect or incomplete information provided by the customer.",
    "All service-related complaints must be reported within 24 hours of service completion via Finderzz support.",
    "Finderzz reserves the right to cancel, delay, or reschedule services due to operational or unforeseen circumstances.",
    "Payments made through Finderzz confirm acceptance of all platform policies and service agreements.",
    "A minimum of 50% advance payment is required before service begins.",
    "Remaining payment must be completed as per Finderzz instructions before completion.",
    "Failure to complete payments may result in penalties or legal action.",
    "Booking a service constitutes a legally binding agreement.",
    "Refunds are subject to eligibility and Finderzz approval.",
    "Cancellation charges apply based on timing and service stage.",
    "No refunds once the service has started.",
    "All disputes are governed under Indian law.",
  ];

  return (
    <>
      <Helmet>
        <title>
          Terms and Conditions for Home Services in Bhiwandi | Finderzz
        </title>

        <meta
          name="description"
          content="Read Finderzz terms and conditions for booking home services in Bhiwandi including payments, cancellations, refunds, and service policies."
        />

        <link
          rel="canonical"
          href="https://finderzz.com/terms"
        />

        <meta name="robots" content="index, follow" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Finderzz Terms and Conditions",
            description:
              "Terms and conditions for using Finderzz home services platform in Bhiwandi.",
            url: "https://finderzz.com/terms",
          })}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">

          {/* ✅ SEO HEADING */}
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Terms and Conditions for Finderzz Home Services
          </h1>

          {/* ✅ INTRO CONTENT (IMPORTANT FOR SEO) */}
          <p className="text-gray-600 mb-6 leading-relaxed">
            These Terms and Conditions govern your use of Finderzz, a platform
            providing home services in Bhiwandi including plumbing, maid,
            painting, and inspection services. By booking a service, you agree
            to comply with the policies, payment terms, and service conditions
            outlined below.
          </p>

          {/* ✅ TERMS LIST */}
          <div className="space-y-4">
            {TERMS.map((term, index) => (
              <div
                key={index}
                className="flex gap-3 bg-white p-4 rounded-xl border shadow-sm"
              >
                <span className="font-semibold text-gray-800">
                  {index + 1}.
                </span>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {term}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ EXTRA CONTENT (BOOST INDEXING) */}
          <div className="mt-10 text-gray-600 text-sm leading-relaxed">
            <h2 className="font-semibold text-lg mb-2">
              Service Policy Overview
            </h2>
            <p>
              Finderzz acts as a facilitator between customers and service
              professionals. All services are delivered by third-party providers
              and may vary based on inspection, scope, and location within
              Bhiwandi.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}