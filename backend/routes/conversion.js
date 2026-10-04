const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    // 1. Get primary funnel counts from analytics_events
    const mainSql = `
        SELECT
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'product_view') AS views,
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'add_to_cart') AS cart,
            (SELECT COUNT(*) FROM orders WHERE status IN ('pending', 'shipped')) AS checkout,
            (SELECT COUNT(*) FROM orders WHERE status = 'delivered') AS purchased
    `;

    db.query(mainSql, (err, results) => {
        if (err) {
            console.error("Conversion API Error:", err);
            return res.status(500).json({ views: 0, cart: 0, checkout: 0, purchased: 0, abandoned: 0 });
        }

        const data = results[0];

        // 2. Get abandoned sessions (cart_add without purchase_complete, >30m inactive)
        const abSql = `
            SELECT id
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
                cart: data.cart || 0,
                checkout: data.checkout || 0,
                purchased: data.purchased || 0,
                abandoned: abandoned
            });
        });
    });
});

module.exports = router;
