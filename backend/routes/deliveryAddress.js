const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Auto-create delivery_addresses table if not exists
db.query(`
    CREATE TABLE IF NOT EXISTS delivery_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        order_id INT,
        user_id INT,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        address_line VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
`, (err) => {
    if (err) console.error("delivery_addresses table error:", err.message);
});

// POST /api/delivery-address — save address linked to an order
router.post("/", (req, res) => {
    const { order_id, user_id, full_name, phone, address_line, city, state, pincode } = req.body;

    const sql = `
        INSERT INTO delivery_addresses (order_id, user_id, full_name, phone, address_line, city, state, pincode)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(sql, [order_id || null, user_id || null, full_name, phone, address_line, city, state, pincode], (err, result) => {
        if (err) {
            console.error("Save delivery address error:", err);
            return res.status(500).json({ success: false, message: "Failed to save address" });
        }
        res.json({ success: true, address_id: result.insertId });
    });
});

// GET /api/delivery-address/order/:orderId — get address for a specific order
router.get("/order/:orderId", (req, res) => {
    const { orderId } = req.params;

    const sql = "SELECT * FROM delivery_addresses WHERE order_id = ? ORDER BY id DESC LIMIT 1";

    db.query(sql, [orderId], (err, results) => {
        if (err) {
            console.error("Fetch delivery address error:", err);
            return res.status(500).json({ success: false });
        }
        res.json(results[0] || null);
    });
});

module.exports = router;
