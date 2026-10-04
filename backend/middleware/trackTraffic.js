const db = require("../config/db");

const trackTraffic = (req, res, next) => {
    // 1. Identify if it's a page visit (not an API call or static asset)
    if (req.method === "GET" && !req.path.startsWith("/api") && !req.path.includes(".")) {
        const referer = req.headers["referer"] || req.headers["referrer"] || "";
        const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress || "unknown";
        const userAgent = req.headers["user-agent"] || "";

        let source = "Direct";
        if (referer.includes("google")) {
            source = "Google";
        } else if (referer.includes("facebook")) {
            source = "Facebook";
        } else if (referer.includes("instagram")) {
            source = "Instagram";
        } else if (referer) {
            source = "Other";
        }

        const sql = "INSERT INTO traffic_logs (source, ip_address, user_agent) VALUES (?, ?, ?)";

        // Non-blocking DB insert
        db.query(sql, [source, ip, userAgent], (err) => {
            if (err) {
                console.error("Traffic Tracking Error:", err.message);
            }
        });
    }

    next();
};

module.exports = trackTraffic;
