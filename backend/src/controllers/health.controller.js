import ApiResponse from "../utils/ApiResponse.js";
import asyncHandler from "../utils/asyncHandler.js";
import { isDatabaseHealthy } from "../config/database.js";

/**
 * GET /api/health
 * Returns server health status and database connectivity.
 */
export const healthCheck = asyncHandler(async (req, res) => {
  const dbHealthy = await isDatabaseHealthy();

  const response = new ApiResponse(200, {
    status: "OK",
    message: "Mayura Backend Running",
    environment: process.env.NODE_ENV,
    database: dbHealthy ? "connected" : "disconnected",
    uptime: `${Math.floor(process.uptime())}s`,
    timestamp: new Date().toISOString(),
  });

  res.status(200).json(response);
});
