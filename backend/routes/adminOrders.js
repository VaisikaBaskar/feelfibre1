const express = require("express");
const router = express.Router();
const db = require("../config/db");
const securityLogger = require("../utils/securityLogger");

// NEW: Mark an order as refunded
router.post("/refund/:id", (req, res) => {
    const orderId = req.params.id;

    // Verify order exists and refund_status is Pending
    const checkSql = "SELECT refund_status FROM orders WHERE id = ?";
    db.query(checkSql, [orderId], (err, results) => {
        if (err) {
            console.error("Check Refund Status Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        if (results[0].refund_status !== "Pending") {
            return res.status(400).json({
                error: "Invalid action",
                message: "Only orders with 'Pending' refund status can be marked as refunded."
            });
        }

        // Proceed to update refund_status to Refunded
        const updateSql = "UPDATE orders SET refund_status = 'Refunded' WHERE id = ?";
        db.query(updateSql, [orderId], (err, result) => {
            if (err) {
                console.error("Mark Refunded Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true, message: "Order marked as refunded successfully" });
            securityLogger.info(`Admin issued refund | Order ID: ${orderId}`);
        });
    });
});

module.exports = router;
