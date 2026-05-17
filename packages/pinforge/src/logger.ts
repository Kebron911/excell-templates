import pino from "pino";

export const logger = pino({
  name: "pinforge",
  level: process.env.LOG_LEVEL ?? "info",
  base: { service: "pinforge" },
  timestamp: pino.stdTimeFunctions.isoTime,
  formatters: {
    level: (label) => ({ level: label })
  }
});

export type PinforgeLogger = typeof logger;
