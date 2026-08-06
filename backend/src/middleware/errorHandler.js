import ApiError from "../utils/ApiError.js";

/**
 * Global error handling middleware.
 * Catches all errors thrown in the application and sends a consistent response.
 */
// eslint-disable-next-line no-unused-vars
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, wrap it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || 500;
    const message = error.message || "Internal Server Error";
    error = new ApiError(statusCode, message, error.errors || []);
  }

  const response = {
    success: false,
    statusCode: error.statusCode,
    message: error.message,
    ...(process.env.NODE_ENV === "development" && {
      errors: error.errors,
      stack: error.stack,
    }),
  };

  console.error(`❌ [${error.statusCode}] ${error.message}`);

  return res.status(error.statusCode).json(response);
};

export default errorHandler;
