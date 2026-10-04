const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Auto-create cart_sessions table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS cart_sessions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        session_id VARCHAR(100),
        event_type ENUM('cart_add', 'checkout_start', 'purchase_complete'),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error("cart_sessions table creation error:", err);
});

// POST /api/analytics/track-cart
// Records session events for abandoned cart tracking
router.post("/track-cart", (req, res) => {
    const { sessionId, event_type } = req.body;

    if (!sessionId || !event_type) {
        return res.status(400).json({ success: false, message: "sessionId and event_type are required" });
    }

    const sql = "INSERT INTO cart_sessions (session_id, event_type) VALUES (?, ?)";

    db.query(sql, [sessionId, event_type], (err) => {
        if (err) {
            console.error("Cart tracking error:", err);
            return res.status(500).json({ success: false });
        }

        res.json({ success: true });
    });
});

module.exports = router;
