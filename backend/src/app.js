import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit";

const app = express()
app.use(cors({
    origin: ["http://localhost:5174",
      "http://localhost:5173",
      "https://finderzz-home-services-delivered.vercel.app",
      "https://finderzz-home-services-delivered-mn.vercel.app"
    ],
    credentials: true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
app.use("/uploads", express.static("uploads"));
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
  });
  
app.use(limiter);

import userRoutes from "./routes/user.routes.js"
app.use("/api/v1/users", userRoutes);

import categoryRoutes from "./routes/category.routes.js"
app.use("/api/v1/category", categoryRoutes);

import serviceRoutes from "./routes/service.routes.js"
app.use("/api/v1/service", serviceRoutes);

import subServiceRoutes from "./routes/subService.routes.js"
app.use("/api/v1/subService", subServiceRoutes);

import areaRoutes from "./routes/area.routes.js"
app.use("/api/v1/area", areaRoutes);

import bannerRoutes from "./routes/banner.routes.js"
app.use("/api/v1/banner", bannerRoutes);

import bookingRoutes from "./routes/booking.routes.js"
app.use("/api/v1/booking", bookingRoutes);

import searchRoutes from "./routes/search.routes.js"
app.use("/api/v1/search", searchRoutes);

import verticalRoutes from "./routes/vertical.routes.js"
app.use("/api/v1/vertical", verticalRoutes);

import workerRoutes from "./routes/worker.routes.js"
app.use("/api/v1/worker", workerRoutes);

import invoiceRoutes from "./routes/invoice.routes.js"
app.use("/api/v1/invoice", invoiceRoutes);

import settlementRoutes from "./routes/settlement.routes.js"
app.use("/api/v1/settlement", settlementRoutes);

// ================= PRIVACY POLICY =================

app.get("/api/v1/privacy-policy", (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Finderzz Privacy Policy</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            font-family: Arial, sans-serif;
            max-width: 800px;
            margin: 40px auto;
            padding: 20px;
            line-height: 1.6;
            background:#F8FAFC;
          }
          h1 { color:#0F172A; }
          h2 { color:#1E293B; margin-top:25px; }
          p, li { color:#334155; }
        </style>
      </head>

      <body>

        <h1>Privacy Policy</h1>
        <p><strong>Last Updated:</strong> March 2026</p>

        <h2>1. Information We Collect</h2>
        <p>
          Finderzz collects personal information including name, phone number,
          and address to enable booking of home services and communication with
          customers regarding their service requests.
        </p>

        <h2>2. How We Use Your Data</h2>
        <p>
          Your information is used to process service bookings, coordinate with
          service professionals, improve user experience, and ensure platform security.
        </p>

        <h2>3. Data Protection</h2>
        <p>
          We use industry-standard security practices to protect personal data
          from unauthorized access, misuse, or disclosure.
        </p>

        <h2>4. Third-Party Sharing</h2>
        <p>
          Customer data may be shared with verified service professionals
          strictly for the purpose of completing booked services.
        </p>

        <h2>5. User Rights</h2>
        <p>
          Users may request correction or deletion of their personal data
          by contacting our support team.
        </p>

        <h2>6. Contact</h2>
        <p>
          If you have questions about this Privacy Policy, please contact us at:
          support@finderzz.com
        </p>

      </body>
    </html>
  `);
});

app.get("/api/v1/delete-account", (req,res)=>{

  res.send(`
  <!DOCTYPE html>
  <html>
  <head>
  <title>Delete Finderzz Worker Account</title>
  <style>
  body{
  font-family:Arial;
  max-width:800px;
  margin:auto;
  padding:40px;
  line-height:1.6;
  }
  h1{color:#222}
  h2{margin-top:30px}
  </style>
  </head>
  
  <body>
  
  <h1>Delete Your Finderzz Worker Account</h1>
  
  <p>
  This page explains how Finderzz workers can request deletion of their account and associated data.
  </p>
  
  <h2>How to Request Account Deletion</h2>
  
  <ol>
  <li>Open the <strong>Finderzz Worker App</strong>.</li>
  <li>Go to <strong>Profile</strong>.</li>
  <li>Tap <strong>Delete Account</strong>.</li>
  <li>Submit your deletion request.</li>
  <li>Our admin team will review and process your request.</li>
  </ol>
  
  <p>
  You may also contact support directly to request deletion.
  </p>
  
  <p>
  Email: <strong>support@finderzz.com</strong>
  </p>
  
  <h2>Data That Will Be Deleted</h2>
  
  <ul>
  <li>Worker profile information</li>
  <li>Phone number</li>
  <li>Address and service details</li>
  <li>Account authentication data</li>
  </ul>
  
  <h2>Data That May Be Retained</h2>
  
  <p>
  Certain information may be retained for legal, financial, or fraud prevention purposes.
  </p>
  
  <ul>
  <li>Transaction history</li>
  <li>Settlement records</li>
  <li>Invoices</li>
  </ul>
  
  <h2>Retention Period</h2>
  
  <p>
  Financial and transaction records may be retained for up to <strong>90 days</strong> for compliance and dispute resolution.
  </p>
  
  <h2>Developer Information</h2>
  
  <p>
  App Name: Finderzz Worker App<br/>
  Developer: Finderzz Technologies
  </p>
  
  </body>
  </html>
  `);
  
  });

export {app}