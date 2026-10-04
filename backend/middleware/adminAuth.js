/**
 * adminAuth.js
 * Middleware to protect all /api/admin/* routes.
 * Only requests with the header x-admin-token: "admin-token" are allowed.
 */

const securityLogger = require("../utils/securityLogger");

function adminAuth(req, res, next) {
    const token = req.headers["x-admin-token"];

    if (token === "admin-token") {
        return next();
    }

    const ip = req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown";
    securityLogger.warn(`Unauthorized admin route access attempt | IP: ${ip} | Path: ${req.originalUrl}`);

    return res.status(403).json({ message: "Access denied. Admins only." });
}

module.exports = adminAuth;
