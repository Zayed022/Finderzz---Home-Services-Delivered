import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import rateLimit from "express-rate-limit";

const app = express()
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit:"16kb"}))
app.use(express.urlencoded({extended: true, limit: "16kb"}))
app.use(express.static("public"))
app.use(cookieParser())
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

export {app}