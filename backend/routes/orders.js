const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = "SELECT id, user_id, total, payment_method, user_email, created_at, status, refund_status FROM orders ORDER BY id DESC";

    db.query(sql, (err, result) => {
        if (err) {
            console.error("Fetch Orders Error:", err);
            res.json([]);
        } else {
            res.json(result);
        }
    });
});

// NEW: Update order status
router.put("/:id/status", (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    const { status } = req.body;

    const sql = "UPDATE orders SET status = ? WHERE id = ?";
    db.query(sql, [status, orderId], (err, result) => {
        if (err) {
            console.error("Update Status Error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json({ success: true, message: "Status updated" });
    });
});

// NEW: Filtered orders for specific user
router.get("/user/:email", (req, res) => {
    const email = req.params.email;
    const sql = "SELECT id, user_id, total, payment_method, user_email, created_at, status, refund_status FROM orders WHERE user_email = ? ORDER BY id DESC";

    db.query(sql, [email], (err, result) => {
        if (err) {
            console.error("Fetch User Orders Error:", err);
            res.json([]);
        } else {
            res.json(result);
        }
    });
});

// NEW: Fetch complete order details (specific route to avoid any conflict)
router.get("/details/:id", (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    // First Query: Get Order Information + Delivery Address (LEFT JOIN so old orders still load)
    const orderSql = `
        SELECT
            o.id,
            o.user_id,
            o.user_email,
            o.total AS total_amount,
            o.payment_method,
            o.created_at,
            o.status,
            o.refund_status,
            d.full_name,
            d.phone,
            d.address_line,
            d.city,
            d.state,
            d.pincode
        FROM orders o
        LEFT JOIN delivery_addresses d ON o.id = d.order_id
        WHERE o.id = ?`;


    db.query(orderSql, [orderId], (err, orderResults) => {
        if (err) {
            console.error("Fetch Order Details SQL Error:", err.message);
            return res.status(500).json({ error: "Database error", message: err.message });
        }

        if (orderResults.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const order = orderResults[0];

        // Second Query: Get Order Items
        const itemsSql = `
            SELECT 
                p.name AS product_name, 
                oi.quantity, 
                oi.price, 
                (oi.quantity * oi.price) AS subtotal 
            FROM order_items oi 
            JOIN products p ON oi.product_id = p.id 
            WHERE oi.order_id = ?`;

        db.query(itemsSql, [orderId], (err, itemResults) => {
            if (err) {
                console.error("Fetch Order Items Error:", err);
                return res.status(500).json({ error: "Database error" });
            }

            res.json({
                order: order,
                items: itemResults
            });
        });
    });
});

// NEW: Cancel an order
router.post("/cancel/:id", (req, res) => {
    const orderId = parseInt(req.params.id, 10);
    if (isNaN(orderId)) return res.status(400).json({ message: "Invalid order ID" });

    console.log("CANCELLATION REQUEST RECEIVED FOR ORDER ID:", orderId);

    // First check the current status
    const checkSql = "SELECT status, payment_method FROM orders WHERE id = ?";
    db.query(checkSql, [orderId], (err, results) => {
        if (err) {
            console.error("Check Status Error:", err);
            return res.status(500).json({ error: "Database error" });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: "Order not found" });
        }

        const currentStatus = (results[0].status || "Placed").toLowerCase();
        const paymentMethod = results[0].payment_method;

        // Only allow cancellation if status is Placed, Processing, or Pending
        // Explicitly block if status is Shipped, Delivered or already Cancelled
        if (["shipped", "delivered", "cancelled"].includes(currentStatus)) {
            let message = "Order cannot be cancelled in its current state.";
            if (currentStatus === "cancelled") message = "Order is already cancelled.";
            else if (["shipped", "delivered"].includes(currentStatus)) message = "Order cannot be cancelled after it has been shipped or delivered.";

            return res.status(400).json({
                error: "Invalid action",
                message: message
            });
        }

        // Determine refund status
        // If not COD, then refund is Pending
        const refundStatus = (paymentMethod && paymentMethod.toUpperCase() !== 'COD') ? 'Pending' : 'None';

        // Proceed to update status and refund_status
        const updateSql = "UPDATE orders SET status = 'Cancelled', refund_status = ? WHERE id = ?";
        db.query(updateSql, [refundStatus, orderId], (err, result) => {
            if (err) {
                console.error("Cancel Order Error:", err);
                return res.status(500).json({ error: "Database error" });
            }
            res.json({ success: true, message: "Order cancelled successfully", refund_status: refundStatus });
        });
    });
});

module.exports = router;
