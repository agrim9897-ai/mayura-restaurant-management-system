import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Trust reverse proxies (Render, Cloudflare, Vercel)
app.set("trust proxy", 1);

// ──────────────────────────────────────────────
//  Core Middleware
// ──────────────────────────────────────────────

// Dynamic CORS configuration allowing local dev and production Vercel origins
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
  "https://mayura-restaurant-management-system.vercel.app",
];

if (config.corsOrigin && !allowedOrigins.includes(config.corsOrigin)) {
  allowedOrigins.push(config.corsOrigin);
}

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (
        allowedOrigins.includes(origin) ||
        origin.endsWith(".vercel.app") ||
        process.env.NODE_ENV !== "production"
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

// Parse incoming JSON payloads
app.use(express.json({ limit: "10mb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Parse cookies from incoming requests
app.use(cookieParser());

// Serve uploaded images statically at /uploads
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// ──────────────────────────────────────────────
//  Root & API Routes
// ──────────────────────────────────────────────

// Root welcoming endpoint for Render health checks and root GET/HEAD requests
app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Mayura Fine Cuisine Backend API",
    status: "Healthy",
    endpoints: "/api",
  });
});
app.head("/", (_req, res) => {
  res.status(200).end();
});

app.use("/api", routes);

// ──────────────────────────────────────────────
//  Error Handling (must be registered last)
// ──────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

export default app;
