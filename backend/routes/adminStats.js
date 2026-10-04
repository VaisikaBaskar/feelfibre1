const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Dashboard realtime stats
router.get("/stats", (req, res) => {
    const sql = `
            (SELECT IFNULL(SUM(total), 0) FROM orders WHERE status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded')) AS totalSales,
            (SELECT COUNT(*) FROM orders) AS totalOrders,
            (SELECT COUNT(*) FROM users) AS totalCustomers,
            (SELECT COUNT(*) FROM visitors) AS totalVisitors
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Dashboard Stats Error:", err);
            return res.json({
                totalSales: 0,
                totalOrders: 0,
                totalCustomers: 0,
                totalVisitors: 0
            });
        }

        const data = results[0];
        res.json({
            totalSales: data.totalSales || 0,
            totalOrders: data.totalOrders || 0,
            totalCustomers: data.totalCustomers || 0,
            totalVisitors: data.totalVisitors || 0
        });
    });
});

router.get("/funnel-stats", (req, res) => {
    const mainSql = `
        SELECT
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'product_view') AS views,
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'add_to_cart') AS addToCart,
            (SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'shipped')) AS checkout,
            (SELECT COUNT(*) FROM orders WHERE status = 'delivered') AS purchased
    `;

    db.query(mainSql, (err, results) => {
        if (err) {
            console.error("Funnel Stats Query Error:", err);
            return res.json({ views: 0, addToCart: 0, checkout: 0, purchased: 0, abandoned: 0 });
        }

        const data = results[0];

        const abSql = `
            SELECT COUNT(DISTINCT session_id) as abandoned_count
            FROM cart_sessions
            GROUP BY session_id
            HAVING 
                MAX(CASE WHEN event_type = 'cart_add' THEN 1 ELSE 0 END) = 1
                AND MAX(CASE WHEN event_type = 'purchase_complete' THEN 1 ELSE 0 END) = 0
                AND MAX(created_at) < NOW() - INTERVAL 30 MINUTE
        `;

        db.query(abSql, (err2, abResults) => {
            const abandoned = (!err2 && abResults) ? abResults.length : 0;

            res.json({
                views: data.views || 0,
                addToCart: data.addToCart || 0,
                checkout: data.checkout || 0,
                purchased: data.purchased || 0,
                abandoned: abandoned
            });
        });
    });
});

router.get("/customer-growth", (req, res) => {
    const sql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+05:30'), '%Y-%m-%d') AS day,
            COUNT(*) AS customers
        FROM users
        WHERE created_at >= CURDATE() - INTERVAL 10 DAY
        GROUP BY day
        ORDER BY day ASC;
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error("Customer Growth Error:", err);
            return res.status(500).json([]);
        }
        res.json(results);
    });
});

// GET: All locked accounts
router.get("/locked-users", (req, res) => {
    const sql = "SELECT id, email, failedLoginAttempts, lockedAt FROM users WHERE accountLocked = 1";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fetch Locked Users Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// POST: Unlock a specific user account (Handles both /unlock-user and /unlock-user/:userId)
router.post(["/unlock-user", "/unlock-user/:userId"], (req, res) => {
    const rawId = req.params.userId || req.body.userId;
    const userId = parseInt(rawId, 10);

    if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
    }

    const sql = "UPDATE users SET failedLoginAttempts = 0, accountLocked = 0, lockedAt = NULL WHERE id = ?";
    db.query(sql, [userId], (err, result) => {
        if (err) {
            console.error("Unlock User Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "User account unlocked successfully" });
    });
});

module.exports = router;
