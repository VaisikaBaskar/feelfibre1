const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/admin/revenue?days=8
router.get("/revenue", (req, res) => {
    const days = parseInt(req.query.days) || 8;

    const sql = `
        SELECT 
            DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+05:30'), '%Y-%m-%d') AS orderDate,
            IFNULL(SUM(total), 0) AS dailyRevenue
        FROM orders
        WHERE created_at >= CURDATE() - INTERVAL ? DAY
        AND status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded')
        GROUP BY DATE_FORMAT(CONVERT_TZ(created_at, '+00:00', '+05:30'), '%Y-%m-%d')
        ORDER BY orderDate ASC
    `;

    db.query(sql, [days], (err, results) => {
        if (err) {
            console.error("Revenue Analytics Error:", err);
            return res.json([]);
        }
        res.json(results);
    });
});

module.exports = router;
