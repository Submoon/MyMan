import fs = require("fs");
import * as Winston from "winston";
const env = process.env.NODE_ENV || "development";
const logDir = "../logs";
// Create the log directory if it does not exist
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
const tsFormat = () => (new Date()).toLocaleTimeString();
const logger = new (Winston.Logger)({
  transports: [
    // colorize the output to the console
    new (Winston.transports.Console)({
      colorize: true,
      level: "debug",
      timestamp: tsFormat,
    }),
    new (require("winston-daily-rotate-file"))({
      datePattern: "yyyy-MM-dd",
      filename: `${logDir}/-results.log`,
      level: env === "development" ? "debug" : "info",
      prepend: true,
      timestamp: tsFormat,
    }),
  ],
});

export default logger;
