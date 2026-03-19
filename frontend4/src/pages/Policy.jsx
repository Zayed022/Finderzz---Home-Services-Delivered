import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

export default function Privacy() {
    const sections = [
      {
        title: "1. Information We Collect",
        content:
          "We collect personal information including name, phone number, email, and address to provide booking and service facilitation.",
      },
      {
        title: "2. How We Use Your Data",
        content:
          "Your information is used to process bookings, improve user experience, enable communication, and enhance platform security.",
      },
      {
        title: "3. Data Protection",
        content:
          "We implement industry-standard security practices to safeguard personal data against unauthorized access or disclosure.",
      },
      {
        title: "4. Third-Party Sharing",
        content:
          "We share data only with verified professionals and essential service providers for order fulfillment purposes.",
      },
      {
        title: "5. Your Rights",
        content:
          "You may request access, correction, or deletion of your personal data at any time by contacting support.",
      },
    ];
  
    return (
        <>
        <Navbar/>
      <div className="bg-gradient-to-b from-slate-50 to-white min-h-screen">
        <div className="max-w-5xl mx-auto px-6 py-12">
  
          <h1 className="text-3xl font-bold text-gray-900">
            Privacy Policy
          </h1>
  
          <p className="text-sm text-gray-400 mt-2 mb-8">
            Last Updated: March 2026
          </p>
  
          <div className="space-y-6">
            {sections.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-2xl shadow border"
              >
                <h2 className="font-semibold text-lg text-gray-900 mb-2">
                  {item.title}
                </h2>
  
                <p className="text-sm text-gray-600 leading-relaxed">
                  {item.content}
                </p>
              </div>
            ))}
          </div>
  
        </div>
      </div>
      <Footer/>
      </>
    );
  }