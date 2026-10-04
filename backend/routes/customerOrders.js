const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/:id", (req, res) => {
    const userId = req.params.id;

    console.log("Customer ID:", userId);

    const query = `
        SELECT 
            o.id as order_id,
            o.created_at as order_date,
            'Pending' as status,
            p.name as product_name,
            oi.quantity,
            oi.price,
            (oi.quantity * oi.price) as total
        FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN products p ON oi.product_id = p.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
    `;

    db.query(query, [userId], (err, result) => {
        if (err) {
            console.error("Fetch Customer Orders Error:", err);
            return res.status(500).json(err);
        }
        console.log("Orders Found:", result.length);
        res.json(result);
    });
});

module.exports = router;
