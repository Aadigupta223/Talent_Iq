// NOTE: why we use 2 different limiters?
// Global limiter is for all routes to prevent abuse
// Login limiter is specifically for login route to prevent brute-force attacks

import rateLimit from "express-rate-limit";

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // only 10 login attempts per 15 minutes per IP
  message: {
    success: false,
    message: "Too many login attempts. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit headers
});

// Signup rate limiter - prevents spam registrations and email bombing
const signupLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // only 10 signup attempts per hour per IP
  message: {
    success: false,
    message: "Too many signup attempts. Please try again in an hour.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const GlobalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10000, // only 10 requests per 15 minutes per IP
  message: {
    success: false,
    message: "Too many requests. Please try again later.",
  },
  standardHeaders: true, // Return rate limit info in headers
  legacyHeaders: false, // Disable the X-RateLimit headers
});
export { loginLimiter, signupLimiter, GlobalLimiter };
