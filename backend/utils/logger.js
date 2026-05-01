import { createLogger, format, transports } from "winston";
const { combine, timestamp, printf, colorize, json } = format;

const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const colors = {
  error: "yellow",
  warn: "red",
  info: "cyan",
  http: "magenta",
  debug: "blue",
};

colorize().addColors(colors);

const consoleFormat = combine(
  colorize({ all: true }),
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  printf(({ timestamp, level, message }) => `[${timestamp}] ${level}: ${message}`)
);

const fileFormat = combine(timestamp(), json());

const logger = createLogger({
  level: process.env.NODE_ENV === "development" ? "debug" : "warn",
  levels,
  transports: [
    new transports.Console({ format: consoleFormat }),

    // Write ALL logs (debug, http, info, warn, error)
    new transports.File({
      filename: "app.log",
      level: "debug",
      format: fileFormat,
    }),

    // Write ONLY warn & error
    new transports.File({
      filename: "error.log",
      level: "warn",
      format: fileFormat,
    }),
  ],
});

export default logger;
