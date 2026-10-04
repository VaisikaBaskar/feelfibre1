const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = `
        SELECT u.id, u.firstName, u.lastName, u.email, u.created_at,
               COALESCE(o.order_count, 0) AS orders
        FROM users u
        LEFT JOIN (
            SELECT user_id, COUNT(*) AS order_count
            FROM orders
            GROUP BY user_id
        ) o ON u.id = o.user_id;
    `;
    db.query(sql, (err, result) => {
        if (err) {
            console.error("Fetch Customers Error:", err);
            return res.status(500).json(err);
        }

        const customers = result.map(user => ({
            id: user.id,
            name: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
            email: user.email,
            created_at: user.created_at,
            orders: user.orders || 0
        }));

        res.json(customers);
    });
});

module.exports = router;
