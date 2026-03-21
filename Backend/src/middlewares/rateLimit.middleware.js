import rateLimit from "express-rate-limit";

// General API rate limiter (e.g., 100 requests per 15 minutes)
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many requests from this IP, please try again later.",
  },
});

// Stricter rate limiter for AI endpoints (e.g., 10 requests per minute)
export const aiModelLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many AI interactions from this IP, please wait a moment.",
  },
});

// Auth rate limiter for login/register (e.g., 20 requests per 15 minutes)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 20, 
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: 429,
    message: "Too many authentication attempts, please try again later.",
  },
});