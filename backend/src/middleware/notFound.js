import ApiError from "../utils/ApiError.js";

/**
 * Middleware for handling 404 — route not found.
 * Must be registered after all valid routes.
 */
const notFound = (req, res, next) => {
  next(new ApiError(404, `Route not found: ${req.method} ${req.originalUrl}`));
};

export default notFound;
