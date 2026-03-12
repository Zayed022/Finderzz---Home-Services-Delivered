import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    translation: {
      jobs: "Jobs",
      customer: "Customer",
      address: "Address",
      services: "Services",
      inspection: "Inspection",
      service: "Service",
      total: "Total",
      extraCharge: "Area Charge",
      scheduled: "Scheduled",
      status: "Status",
      noJobs: "No Jobs Assigned",
      refresh: "Pull to refresh",
    },
  },
  hi: {
    translation: {
      jobs: "जॉब्स",
      customer: "ग्राहक",
      address: "पता",
      services: "सेवाएं",
      inspection: "निरीक्षण",
      service: "सेवा",
      total: "कुल राशि",
      extraCharge: "एरिया शुल्क",
      scheduled: "निर्धारित समय",
      status: "स्थिति",
      noJobs: "कोई जॉब नहीं मिला",
      refresh: "रिफ्रेश करने के लिए खींचें",
    },
  },
};

i18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources,
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;