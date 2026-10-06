import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";

dotenv.config();

import { setupSwagger } from "./swagger/swagger";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import { errorHandler } from "./middleware/error.middleware";
import { generalRateLimit } from "./middleware/rateLimit.middleware";

import "./models/index";

const app = express();

// Security headers
app.use(helmet());

app.use(
	cors({
		origin: process.env.FRONTEND_URL,
		credentials: true,
	})
);

app.use(express.json());

app.use(generalRateLimit);

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);

setupSwagger(app);

// Health check endpoint
app.get("/health", (_req, res) => {
	res.json({ success: true, message: "Server is running" });
});

// 404 handler for unmatched routes
app.use((_req, res) => {
	res.status(404).json({ success: false, message: "Page not found" });
});

app.use(errorHandler);

export default app;
