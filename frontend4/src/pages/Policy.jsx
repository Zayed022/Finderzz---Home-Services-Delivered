import { Helmet } from "react-helmet-async";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Privacy() {
  const sections = [
    {
      title: "Information We Collect",
      content:
        "Finderzz collects personal information such as your name, phone number, email address, and location to facilitate home service bookings in Bhiwandi.",
    },
    {
      title: "How We Use Your Data",
      content:
        "Your data is used to process bookings, connect you with service professionals, improve user experience, and ensure platform security.",
    },
    {
      title: "Data Protection",
      content:
        "We follow industry-standard security practices to protect your personal information from unauthorized access or misuse.",
    },
    {
      title: "Sharing of Information",
      content:
        "Your data is shared only with verified service professionals and essential partners required to fulfill your service request.",
    },
    {
      title: "Your Rights",
      content:
        "You can request access, correction, or deletion of your personal data by contacting Finderzz support.",
    },
  ];

  return (
    <>
      <Helmet>
        <title>
          Privacy Policy for Home Services in Bhiwandi | Finderzz
        </title>

        <meta
          name="description"
          content="Read the Finderzz privacy policy to understand how we collect, use, and protect your data when booking home services in Bhiwandi."
        />

        <meta name="robots" content="index, follow" />

        <link
          rel="canonical"
          href="https://finderzz.com/privacy"
        />

        {/* ✅ Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Finderzz Privacy Policy",
            url: "https://finderzz.com/privacy",
            description:
              "Privacy policy explaining how Finderzz handles user data for home services in Bhiwandi.",
          })}
        </script>
      </Helmet>

      <Navbar />

      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12">

          {/* ✅ H1 */}
          <h1 className="text-3xl font-bold text-gray-900">
            Privacy Policy for Finderzz Home Services
          </h1>

          {/* ✅ INTRO (VERY IMPORTANT FOR SEO) */}
          <p className="text-gray-600 mt-4 mb-8 leading-relaxed">
            This Privacy Policy explains how Finderzz collects, uses, and
            protects your personal information when you use our platform to
            book home services in Bhiwandi, including plumbing, maid,
            painting, and cleaning services.
          </p>

          <p className="text-sm text-gray-400 mb-6">
            Last Updated: April 2026
          </p>

          {/* ✅ SECTIONS */}
          <div className="space-y-6">
            {sections.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow border"
              >
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  {index + 1}. {item.title}
                </h2>

                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>

          {/* ✅ EXTRA CONTENT (BOOST INDEXING) */}
          <div className="mt-10 text-gray-600 text-sm leading-relaxed">
            <h2 className="font-semibold text-lg mb-2">
              Commitment to User Privacy
            </h2>
            <p>
              Finderzz is committed to maintaining transparency and protecting
              user data while delivering reliable home services across
              Bhiwandi. We ensure your information is handled securely and
              responsibly at all times.
            </p>
          </div>

        </div>
      </div>

      <Footer />
    </>
  );
}