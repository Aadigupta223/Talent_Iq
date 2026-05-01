import logger from "./logger.js";

export const requestLogger = (req, res, next) => {
  // Skip favicon and prometheus metrics endpoint
  if (req.originalUrl === "/favicon.ico" || req.originalUrl === "/metrics") return next();

  const start = Date.now();
  res.on("finish", () => {
    if (req.originalUrl === "/metrics") return; // prevent log at finish too

    const duration = Date.now() - start;
    const status = res.statusCode;

    let level = "info";
    if (status >= 500) level = "error";
    else if (status >= 400) level = "warn";

    logger[level](
      `${req.method} ${req.originalUrl} | Status: ${status} | ${duration}ms | ${
        res.get("Content-Length") || 0
      }b | IP: ${req.ip}`
    );
  });

  next();
};

export const logError = (err, req) => {
  logger.error(
    `Error: ${err.message} | Path: ${req.originalUrl} | Method: ${req.method} | IP: ${req.ip}`
  );
};
