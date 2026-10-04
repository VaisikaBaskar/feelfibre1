const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = "SELECT id, code, discount, expiry_date, status, applicable_products FROM coupons";
    db.query(sql, (err, results) => {
        if (err) {
            console.error("Fetch Coupons Error:", err);
            return res.status(500).json(err);
        }
        res.json(results);
    });
});

router.post("/", (req, res) => {
    const { code, discount, expiry_date, applicable_products } = req.body;
    const status = "active"; // Default status

    const sql = "INSERT INTO coupons (code, discount, expiry_date, status, applicable_products) VALUES (?, ?, ?, ?, ?)";
    db.query(sql, [code, discount, expiry_date, status, applicable_products || null], (err, result) => {
        if (err) {
            console.error("Create Coupon Error:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "Coupon created", id: result.insertId });
    });
});

router.put("/:id/status", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid coupon ID" });

    const { status } = req.body;

    const sql = "UPDATE coupons SET status = ? WHERE id = ?";
    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error("Update Coupon Status Error:", err);
            return res.status(500).json(err);
        }
        res.json({ success: true, message: "Coupon status updated" });
    });
});

module.exports = router;
