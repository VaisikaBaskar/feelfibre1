const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/admin/monthly-target
router.get("/monthly-target", (req, res) => {

    // 1. Calculate current month revenue in IST
    const revenueSql = `
        SELECT IFNULL(SUM(total), 0) AS achievedRevenue
        FROM orders
        WHERE MONTH(CONVERT_TZ(created_at, '+00:00', '+05:30')) = MONTH(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
        AND YEAR(CONVERT_TZ(created_at, '+00:00', '+05:30')) = YEAR(CONVERT_TZ(NOW(), '+00:00', '+05:30'))
        AND status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded');
    `;

    // 2. Fetch target from settings
    const targetSql = `SELECT monthly_target FROM settings LIMIT 1;`;

    db.query(revenueSql, (err, revenueResults) => {
        if (err) {
            console.error("Revenue Query Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        const achievedRevenue = parseFloat(revenueResults[0].achievedRevenue) || 0;

        db.query(targetSql, (err, targetResults) => {
            if (err) {
                console.error("Target Query Error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            const targetAmount = targetResults.length > 0 ? parseFloat(targetResults[0].monthly_target) : 100000;
            const remainingAmount = Math.max(0, targetAmount - achievedRevenue);
            const achievementPercentage = targetAmount > 0
                ? Math.min(100, Math.round((achievedRevenue / targetAmount) * 100))
                : 0;

            res.json({
                targetAmount,
                achievedRevenue,
                remainingAmount,
                achievementPercentage
            });
        });
    });
});

module.exports = router;
