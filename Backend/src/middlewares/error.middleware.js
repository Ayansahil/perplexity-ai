const errorMiddleware = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log for development
  if (process.env.NODE_ENV !== "test") {
    console.error("Error Middleware Caught:", err);
  }

  // Mongoose Validation Error
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map((val) => val.message);
    error = { message, statusCode: 400 };
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value.`;
    error = { message, statusCode: 400 };
  }

  // Mongoose Cast Error (Invalid ID)
  if (err.name === "CastError") {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, statusCode: 400 };
  }

  // JWT Errors
  if (err.name === "JsonWebTokenError") {
    const message = "Invalid token. Please log in again.";
    error = { message, statusCode: 401 };
  }

  if (err.name === "TokenExpiredError") {
    const message = "Your token has expired. Please log in again.";
    error = { message, statusCode: 401 };
  }

  const statusCode = error.statusCode || err.statusCode || 500;
  const message = error.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};

/**
 * 404 Handler for undefined routes
 */
const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found - ${req.originalUrl}`,
  });
};

export { errorMiddleware, notFoundHandler };
