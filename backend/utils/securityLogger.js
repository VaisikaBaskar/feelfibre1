/**
 * securityLogger.js
 * Centralized security event logger using Winston.
 * Writes to backend/logs/security.log (auto-created if missing).
 * All logging is asynchronous and non-blocking.
 */

const { createLogger, format, transports } = require("winston");
const path = require("path");
const fs = require("fs");

// Ensure logs/ directory exists
const logsDir = path.join(__dirname, "../logs");
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
}

const securityLogger = createLogger({
    level: "info",
    format: format.combine(
        format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
        format.printf(({ timestamp, level, message }) =>
            `[${timestamp}] ${level.toUpperCase()} | ${message}`
        )
    ),
    transports: [
        new transports.File({
            filename: path.join(logsDir, "security.log"),
            maxsize: 5 * 1024 * 1024, // 5MB per file
            maxFiles: 5,              // keep last 5 rotations
            tailable: true
        })
    ],
    // Never crash the app if logging fails
    exitOnError: false
});

module.exports = securityLogger;
