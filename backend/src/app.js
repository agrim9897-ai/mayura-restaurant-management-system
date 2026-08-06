import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import config from "./config/index.js";
import routes from "./routes/index.js";
import errorHandler from "./middleware/errorHandler.js";
import notFound from "./middleware/notFound.js";

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

// Parse incoming JSON payloads (limit to 16kb to prevent abuse)
app.use(express.json({ limit: "16kb" }));

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Parse cookies from incoming requests
app.use(cookieParser());

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
