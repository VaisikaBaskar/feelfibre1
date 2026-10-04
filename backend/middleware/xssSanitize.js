/**
 * xssSanitize.js
 * Custom XSS sanitization middleware using the 'xss' package.
 * Compatible with Node.js v24+ (avoids read-only property issues in xss-clean).
 *
 * Recursively sanitizes all string values in req.body, req.query, and req.params.
 */

const xss = require("xss");

function sanitizeObject(obj) {
    if (typeof obj === "string") {
        return xss(obj);
    }
    if (Array.isArray(obj)) {
        return obj.map(sanitizeObject);
    }
    if (obj !== null && typeof obj === "object") {
        const sanitized = {};
        for (const key of Object.keys(obj)) {
            sanitized[key] = sanitizeObject(obj[key]);
        }
        return sanitized;
    }
    return obj;
}

function xssSanitize(req, res, next) {
    if (req.body) req.body = sanitizeObject(req.body);
    if (req.query) req.query = sanitizeObject(req.query);
    if (req.params) req.params = sanitizeObject(req.params);
    next();
}

module.exports = xssSanitize;
