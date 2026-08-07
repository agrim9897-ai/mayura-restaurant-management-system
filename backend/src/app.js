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

// ──────────────────────────────────────────────
//  Core Middleware
// ──────────────────────────────────────────────

// CORS — allow requests from the frontend origin
app.use(
  cors({
    origin: config.corsOrigin,
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
//  API Routes
// ──────────────────────────────────────────────

app.use("/api", routes);

// ──────────────────────────────────────────────
//  Error Handling (must be registered last)
// ──────────────────────────────────────────────

app.use(notFound);
app.use(errorHandler);

export default app;
