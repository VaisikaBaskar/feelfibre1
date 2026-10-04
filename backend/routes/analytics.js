const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Auto-create analytics_events table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS analytics_events (
        id INT AUTO_INCREMENT PRIMARY KEY,
        event_type VARCHAR(50),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error("analytics_events table creation error:", err);
});

// POST /api/analytics/event
// Records a lightweight funnel event (product_view, add_to_cart, checkout, purchase, abandoned_cart)
router.post("/event", (req, res) => {
    const { event } = req.body;

    if (!event) {
        return res.status(400).json({ success: false, message: "event is required" });
    }

    const sql = "INSERT INTO analytics_events (event_type) VALUES (?)";

    db.query(sql, [event], (err) => {
        if (err) {
            console.error("Analytics event error:", err);
            return res.status(500).json({ success: false });
        }

        res.json({ success: true });
    });
});

// GET /api/analytics/funnel
// Returns funnel counts from analytics_events table
router.get("/funnel", (req, res) => {
    const mainSql = `
        SELECT
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'product_view') AS views,
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'add_to_cart') AS addToCart,
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'checkout') AS checkout,
            (SELECT COUNT(*) FROM analytics_events WHERE event_type = 'purchase') AS purchased
    `;

    db.query(mainSql, (err, results) => {
        if (err) {
            console.error("Analytics funnel query error:", err);
            return res.status(500).json({ success: false });
        }

        const data = results[0];

        // Abandoned cart: Calculated using purely session tracking events
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
                addToCart: data.addToCart || 0,
                checkout: data.checkout || 0,
                purchased: data.purchased || 0,
                abandoned: abandoned
            });
        });
    });
});

module.exports = router;
