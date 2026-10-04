const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Category Sales Realtime
router.get("/", (req, res) => {
    const query = `
        SELECT 
            p.category AS category,
            COALESCE(SUM(oi.price * oi.quantity), 0) AS sales
        FROM products p
        LEFT JOIN order_items oi ON oi.product_id = p.id
        LEFT JOIN orders o ON oi.order_id = o.id AND o.status NOT IN ('Cancelled') AND (o.refund_status IS NULL OR o.refund_status != 'Refunded')
        GROUP BY p.category
    `;
    db.query(query, (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (!result || result.length === 0) {
            return res.json([
                { category: "HealthMix", sales: 0 },
                { category: "BabyMix", sales: 0 },
                { category: "Combo", sales: 0 }
            ]);
        }
        res.json(result);
    });
});

module.exports = router;
