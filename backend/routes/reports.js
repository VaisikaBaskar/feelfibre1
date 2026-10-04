const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/summary", (req, res) => {
    // 1. Monthly Sales (Current Month)
    const monthlySalesSql = `
        SELECT COALESCE(SUM(total), 0) AS monthly_sales
        FROM orders
        WHERE MONTH(created_at) = MONTH(CURRENT_DATE())
        AND YEAR(created_at) = YEAR(CURRENT_DATE())
        AND status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded')
    `;

    // 2. Total Revenue
    const totalRevenueSql = `
        SELECT COALESCE(SUM(total), 0) AS total_revenue
        FROM orders
        WHERE status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded')
    `;

    // 3. Monthly Performance (Grouped by Month)
    const performanceSql = `
        SELECT 
            DATE_FORMAT(MAX(created_at), '%b') AS month,
            SUM(total) AS revenue
        FROM orders
        WHERE status NOT IN ('Cancelled') AND (refund_status IS NULL OR refund_status != 'Refunded')
        GROUP BY YEAR(created_at), MONTH(created_at)
        ORDER BY YEAR(created_at) ASC, MONTH(created_at) ASC
    `;

    db.query(monthlySalesSql, (err, monthlyResults) => {
        if (err) {
            console.error("Monthly Sales Error:", err);
            return res.status(500).json(err);
        }

        db.query(totalRevenueSql, (err, totalResults) => {
            if (err) {
                console.error("Total Revenue Error:", err);
                return res.status(500).json(err);
            }

            db.query(performanceSql, (err, performanceResults) => {
                if (err) {
                    console.error("Performance Error:", err);
                    return res.status(500).json(err);
                }

                res.json({
                    monthlySales: monthlyResults[0].monthly_sales,
                    totalRevenue: totalResults[0].total_revenue,
                    monthlyPerformance: performanceResults
                });
            });
        });
    });
});

module.exports = router;
