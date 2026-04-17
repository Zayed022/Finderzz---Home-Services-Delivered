import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "Finderzz may collect your name, mobile number, email address, service address, booking preferences, and communication details to process home service bookings in Bhiwandi.",
    },
    {
      title: "How We Use Your Data",
      content:
        "We use your information to confirm bookings, assign professionals, provide customer support, process payments, improve service quality, and maintain platform security.",
    },
    {
      title: "Data Protection & Security",
      content:
        "Finderzz follows commercially reasonable technical and organizational safeguards to protect personal information from unauthorized access, misuse, alteration, or disclosure.",
    },
    {
      title: "Sharing of Information",
      content:
        "Your information may be shared only with verified professionals, payment partners, and essential vendors required to complete your requested service.",
    },
    {
      title: "Cookies & Analytics",
      content:
        "We may use cookies, analytics tools, and session technologies to improve performance, measure usage trends, and enhance user experience.",
    },
    {
      title: "Your Rights",
      content:
        "You may request correction, deletion, or access to your personal information by contacting Finderzz customer support.",
    },
    {
      title: "Policy Updates",
      content:
        "Finderzz may revise this Privacy Policy periodically. Updated versions will be published on this page with the latest revision date.",
    },
  ];

  const privacySchema = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Finderzz Privacy Policy",
    url: "https://finderzz.com/privacy",
    description:
      "Privacy policy explaining how Finderzz collects, uses, stores and protects customer data for home services in Bhiwandi.",
  };

  const orgSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finderzz",
    url: "https://finderzz.com",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      telephone: "+918262990986",
      email: "support.finderzz@gmail.com",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
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
        name: "Privacy Policy",
        item: "https://finderzz.com/privacy",
      },
    ],
  };

  return (
    <>
      <Helmet>
        <title>
          Finderzz Privacy Policy in Bhiwandi | Data Protection & User Privacy
        </title>

        <meta
          name="description"
          content="Read Finderzz Privacy Policy for home services in Bhiwandi. Learn how we collect, use, store and protect your personal data while processing bookings."
        />

        <meta
          name="keywords"
          content="finderzz privacy policy, privacy policy bhiwandi, home service privacy policy, customer data protection finderzz"
        />

        <meta
          name="robots"
          content="index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1"
        />

        <link
          rel="canonical"
          href="https://finderzz.com/privacy"
        />

        {/* Open Graph */}
        <meta
          property="og:title"
          content="Finderzz Privacy Policy"
        />
        <meta
          property="og:description"
          content="Learn how Finderzz handles and protects customer information."
        />
        <meta
          property="og:url"
          content="https://finderzz.com/privacy"
        />
        <meta property="og:type" content="website" />

        {/* Twitter */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="Finderzz Privacy Policy"
        />
        <meta
          name="twitter:description"
          content="Understand how Finderzz protects your personal information."
        />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(privacySchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(orgSchema)}
        </script>

        <script type="application/ld+json">
          {JSON.stringify(breadcrumbSchema)}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* HERO */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
            Privacy Policy for Finderzz Home Services
          </h1>

          <p className="text-gray-600 mt-4 max-w-3xl leading-relaxed">
            This Privacy Policy explains how Finderzz collects, uses, stores,
            and protects personal information when customers book plumbing,
            maid, painting, cleaning, and inspection services in Bhiwandi.
            We are committed to responsible data handling and customer trust.
          </p>

          <p className="text-sm text-gray-400 mt-4 mb-8">
            Last Updated: April 2026
          </p>

          {/* EXTRA SEO CONTENT */}
          <div className="bg-white border rounded-2xl p-5 mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">
              Our Commitment to Privacy
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              Finderzz values transparency and security. Personal data submitted
              during service bookings is used only for legitimate operational,
              support, and service delivery purposes.
            </p>
          </div>

          {/* POLICY SECTIONS */}
          <div className="space-y-6">
            {sections.map((item, index) => (
              <section
                key={index}
                className="bg-white p-6 rounded-2xl shadow-sm border"
              >
                <h2 className="text-lg font-semibold text-gray-900 mb-2">
                  {index + 1}. {item.title}
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </section>
            ))}
          </div>

          {/* CONTACT BLOCK */}
          <div className="mt-10 bg-white border rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-3">
              Contact for Privacy Requests
            </h2>

            <p className="text-sm text-gray-600 leading-relaxed">
              If you would like to access, update, or delete your information,
              please contact Finderzz support.
            </p>

            <div className="mt-4 space-y-2 text-sm">
              <a
                href="tel:+918262990986"
                className="block text-blue-600 hover:underline"
              >
                +91 8262990986
              </a>

              <a
                href="mailto:support.finderzz@gmail.com"
                className="block text-blue-600 hover:underline"
              >
                support.finderzz@gmail.com
              </a>
            </div>
          </div>

          {/* INTERNAL LINKING */}
          <div className="mt-10 text-center">
            <a
              href="/terms"
              className="text-blue-600 font-semibold hover:underline"
            >
              Read Terms & Conditions →
            </a>
          </div>

          <div className="mt-4 text-center">
            <a
              href="/services"
              className="text-blue-600 font-semibold hover:underline"
            >
              Explore Home Services in Bhiwandi →
            </a>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}