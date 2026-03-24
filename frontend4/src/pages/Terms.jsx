import { Helmet } from "react-helmet-async";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

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
      "This invoice acts as a digital confirmation of the service request and agreement.",
      "A minimum of 50% of the total service cost must be paid in advance before the service begins.",
      "The remaining 50% payment must be completed within 24 hours prior to service completion or as instructed by Finderzz officials.",
      "Failure to complete payments on time may result in service cancellation, penalties, and legal action.",
      "Booking a service constitutes a legally binding agreement to pay the full service amount.",
      "By confirming a booking, the customer agrees to listed charges and any revised quotation after inspection.",
      "Customers are not allowed to withhold payments, make partial payments, or negotiate outside the Finderzz platform.",
      "Refunds are subject to service eligibility, Finderzz approval, and applicable deductions.",
      "All payments made via Finderzz serve as proof of transaction and acceptance of policies.",
      "This booking and invoice act as a legally binding digital agreement between the customer and Finderzz.",
      "Finderzz reserves the right to take legal action in case of payment defaults, fraudulent bookings, or misuse.",
      "Cancellation requested more than 24 hours before service may be eligible for partial refund after deductions.",
      "Cancellation within 24 hours of service may attract charges up to 50% of the booking value.",
      "If cancellation occurs after professional dispatch, full inspection and visit charges will be deducted.",
      "If the customer is unavailable, unresponsive, or refuses service, it will be treated as a no-show with applicable penalties.",
      "No cancellation or refund is allowed once the service has started and full payment remains payable.",
      "Rescheduling is allowed only once if requested at least 12 hours prior to service time.",
      "Rescheduling within 12 hours may be rejected or may incur additional charges.",
      "All disputes shall be governed under applicable Indian laws.",
      "Finderzz acts only as a facilitator and is not responsible for direct service execution.",
    ];
  
    return (
        <>
        <Helmet>
  <title>Terms & Conditions | Finderzz</title>
  <meta name="robots" content="noindex, follow" />
</Helmet>
        <Navbar/>
      <div className="bg-slate-50 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-12">
  
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
  Terms & Conditions – Finderzz Services
</h1>
  
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
  
        </div>
      </div>
      <Footer/>
      </>
    );
  }