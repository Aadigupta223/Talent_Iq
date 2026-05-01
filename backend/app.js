import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import logger from "./utils/logger.js";
import { requestLogger } from "./utils/loggerHelpers.js";
import { fileURLToPath } from "url";
import client from "prom-client";
import responseTime from "response-time";

//* importing inngest
import { serve } from "inngest/express";
import { inngest, functions } from "./events/inngest.js";

//* importing clerk middleware
import { clerkMiddleware } from "@clerk/express";

dotenv.config({
  quiet: true,
});
const app = express();

// Proper __dirname support for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Global rate limiter on API
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10000, // Increased for development to prevent accidental rate limiting
  message: "Too many requests from this IP, please try again later.",
});
app.set("trust proxy", 1);

// Enable CORS before any other middleware so that all responses (even errors) get CORS headers
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    credentials: true,
  })
);

//  -------- promethesus monitoring setup -------------------
// Enable collection of default metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
// collect default metrics like CPU, memory, etc.
collectDefaultMetrics({ register: client.register });
// making custom metric
const reqResTime = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "How much time it takes to process requests",
  labelNames: ["method", "route", "status_code"],
  buckets: [1, 50, 100, 200, 400, 500, 800, 1000, 2000],
});
const totalRequestsCounter = new client.Counter({
  name: "total_req",
  help: "Total number of requests",
});

//---------------------csp and helmet setup -----------------------
// what this function does is it takes a comma-separated string from environment variables
// and converts it into an array of trimmed strings.
// we use this to make helemet csp more dynamic
const envList = (key) => process.env[key]?.split(",").map((x) => x.trim()) || [];

// -------------------- Security Middlewares --------------------
// helmet({
//   contentSecurityPolicy: {
//     useDefaults: true,
//     directives: {
//       defaultSrc: ["'self'"],

//       imgSrc: ["'self'", "data:", "blob:", "https://img.clerk.com", "https://res.cloudinary.com"],

//       connectSrc: [
//         "'self'",
//         "data:",
//         "blob:",

//         // Stream
//         "https://api.stream-io-video.com",
//         "https://video.stream-io-api.com",
//         "wss://video.stream-io-api.com",
//         "https://hint.stream-io-video.com",
//         "https://chat.stream-io-video.com",
//         "https://*.stream-io-video.com",

//         // Monaco
//         "https://cdn.jsdelivr.net",

//         // Clerk
//         "https://api.clerk.com",
//         "https://*.clerk.accounts.dev",

//         process.env.CLIENT_URL,
//       ],

//       scriptSrc: [
//         "'self'",
//         "'unsafe-inline'",
//         "'unsafe-eval'",
//         "https://js.stream-io-video.com",
//         "https://cdn.jsdelivr.net",
//         "https://*.clerk.accounts.dev",
//       ],

//       scriptSrcElem: [
//         "'self'",
//         "'unsafe-inline'",
//         "https://js.stream-io-video.com",
//         "https://cdn.jsdelivr.net",
//         "https://*.clerk.accounts.dev",
//       ],

//       styleSrc: ["'self'", "'unsafe-inline'"],
//       styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

//       fontSrc: ["'self'", "data:"],

//       frameSrc: ["'self'", "https://*.stream-io-video.com", "https://*.clerk.accounts.dev"],

//       workerSrc: ["'self'", "blob:"],
//     },
//   },
// });
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        defaultSrc: ["'self'"],

        /* ---------------- IMAGES ---------------- */
        imgSrc: [
          "'self'",
          "data:",
          "blob:",
          "https://img.clerk.com",
          "https://images.clerk.dev",
          "https://res.cloudinary.com",
        ],

        /* ---------------- API / WEBSOCKETS ---------------- */
        connectSrc: [
          "'self'",
          "data:",
          "blob:",

          // Stream Video + Chat (HTTPS)
          "https://api.stream-io-video.com",
          "https://video.stream-io-api.com",
          "https://hint.stream-io-video.com",
          "https://chat.stream-io-video.com",
          "https://chat.stream-io.com",
          "https://chat.stream-io-api.com",
          "https://*.stream-io-video.com",

          // 🔥 REQUIRED FOR STREAM CALLS (WebSocket)
          "wss://video.stream-io-api.com",
          "wss://*.stream-io-video.com",
          "wss://chat.stream-io.com",
          "wss://chat.stream-io-api.com",
          "wss://*.stream-io-api.com",

          // Monaco loader
          "https://cdn.jsdelivr.net",

          // Clerk
          "https://api.clerk.com",
          "https://*.clerk.accounts.dev",

          // Your frontend origin
          process.env.CLIENT_URL,
        ],

        /* ---------------- SCRIPTS ---------------- */
        scriptSrc: [
          "'self'",
          "'unsafe-inline'", // required by Clerk + Vite runtime
          "'unsafe-eval'", // required by Monaco
          "https://js.stream-io-video.com",
          "https://cdn.jsdelivr.net",
          "https://*.clerk.accounts.dev",
        ],

        scriptSrcElem: [
          "'self'",
          "'unsafe-inline'",
          "https://js.stream-io-video.com",
          "https://cdn.jsdelivr.net",
          "https://*.clerk.accounts.dev",
        ],

        /* ---------------- STYLES ---------------- */
        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://cdn.jsdelivr.net", // Monaco editor
        ],

        styleSrcElem: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],

        /* ---------------- FONTS ---------------- */
        fontSrc: ["'self'", "data:"],

        /* ---------------- IFRAMES ---------------- */
        frameSrc: ["'self'", "https://*.stream-io-video.com", "https://*.clerk.accounts.dev"],

        /* ---------------- WORKERS ---------------- */
        workerSrc: ["'self'", "blob:"],
      },
    },
  })
);

app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use("/api", limiter);

// -------------------- Logging --------------------
app.use(requestLogger);
logger.info(`Server starting in ${process.env.NODE_ENV} mode`);

// -------------------- Core Middlewares --------------------
app.use(express.json({ limit: "5mb" }));
app.use(express.urlencoded({ extended: true, limit: "5mb" }));
app.use(express.static("backend/public"));
app.use(cookieParser());

// -------------------- Prometheus Metrics Endpoint --------------------
app.get("/metrics", async (req, res) => {
  try {
    res.setHeader("Content-Type", client.register.contentType);
    const metrics = await client.register.metrics();
    res.end(metrics); // Send the metrics to the client
  } catch (ex) {
    // ex is exception object name holder you can name it anything
    res.status(500).end(ex);
  }
});

// -------------------- Custom Prometheus Middleware --------------------
app.use(
  responseTime((req, res, time) => {
    totalRequestsCounter.inc();
    reqResTime
      .labels({ method: req.method, route: req.url, status_code: res.statusCode })
      .observe(time);
  })
);

//* Using clerk middleware
app.use(clerkMiddleware());

//* Inngest webhook endpoint
app.use("/api/inngest", serve({ client: inngest, functions }));

// --------------------Importing Routes --------------------

import healthcheck from "./routes/healthCheck.route.js";
import chatRoutes from "./routes/chat.route.js";
import sessionRoutes from "./routes/sessions.route.js";
import userRoutes from "./routes/users.route.js";
import assignmentRoutes from "./routes/assignments.route.js";
import notificationRoutes from "./routes/notifications.route.js";

// -------------------- Routes --------------------
app.use("/api", healthcheck);
app.use("/api/chat", chatRoutes);
app.use("/api/sessions", sessionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/assignments", assignmentRoutes);
app.use("/api/notifications", notificationRoutes);

// -------------------- Serve Frontend in Production --------------------
if (process.env.NODE_ENV === "production") {
  const frontendPath = path.join(__dirname, "../frontend/dist");
  app.use(express.static(frontendPath));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(frontendPath, "index.html"));
  });
}
// if (process.env.NODE_ENV === "production") {
//   const frontendPath = path.join(__dirname, "../frontend/dist");

//   app.use(express.static(frontendPath));

//   app.get("*", (req, res) => {
//     res.sendFile(path.join(frontendPath, "index.html"));
//   });
// }

// -------------------- 404 Handler --------------------
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

// -------------------- Global Error Handler --------------------
app.use((err, req, res, next) => {
  logger.error(`Global Error Handler: ${err.message}`);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
