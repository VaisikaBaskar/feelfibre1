const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Ensure delivery_addresses table exists
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
    if (err) console.error("delivery_addresses table init error:", err.message);
    else console.log("delivery_addresses table ready.");
});

// Safe column migrations — ensure orders table has all required columns.
// Uses information_schema for MySQL 5.7 compatibility (ADD COLUMN IF NOT EXISTS
// is only available in MySQL 8.0+).
const ensureOrderColumns = [
    { column: "coupon_code",     ddl: "ALTER TABLE orders ADD COLUMN coupon_code VARCHAR(50) NULL" },
    { column: "coupon_discount", ddl: "ALTER TABLE orders ADD COLUMN coupon_discount DECIMAL(10,2) DEFAULT 0" },
    { column: "refund_status",   ddl: "ALTER TABLE orders ADD COLUMN refund_status VARCHAR(50) DEFAULT 'None'" }
];

ensureOrderColumns.forEach(({ column, ddl }) => {
    db.query(
        `SELECT COUNT(*) AS cnt FROM information_schema.COLUMNS
         WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'orders' AND COLUMN_NAME = ?`,
        [column],
        (err, results) => {
            if (err) return console.error(`Column check error for orders.${column}:`, err.message);
            if (results[0].cnt === 0) {
                db.query(ddl, (alterErr) => {
                    if (alterErr) console.error(`Failed to add orders.${column}:`, alterErr.message);
                    else console.log(`✅ Added missing column: orders.${column}`);
                });
            }
        }
    );
});


router.post("/", (req, res) => {
    // Destructure new and old fields for safety
    const { userId, items, userEmail, cartItems, total, paymentMethod,
        full_name, phone, address_line, city, state, pincode,
        couponCode, couponDiscount } = req.body;

    // Support both new and old request formats
    const finalItems = cartItems || items;
    const finalUserEmail = userEmail || "Guest";
    const finalTotal = total || 0;
    const finalPaymentMethod = paymentMethod || "COD";
    const finalCouponCode = couponCode || null;
    const finalCouponDiscount = couponDiscount || 0;

    if (!finalItems || finalItems.length === 0) {
        return res.status(400).send("Cart is empty");
    }

    // Calculate total if not provided
    let calculatedTotal = 0;
    finalItems.forEach(item => {
        const price = parseFloat(item.price) || 0;
        const qty = parseInt(item.quantity) || 1;
        calculatedTotal += (price * qty);
    });

    const orderTotal = finalTotal || calculatedTotal;

    // Strictly validate user_id — must be a whole positive integer.
    // parseInt('69df6b9519b09cbf8960387c', 10) would silently return 69 (parses leading digits).
    // Number() is strict: Number('69df...') = NaN, so stale MongoDB-style IDs correctly become NULL.
    const rawUserId = userId || req.body.user_id;
    const numericUserId = Number(rawUserId);
    const finalUserId = (Number.isInteger(numericUserId) && numericUserId > 0) ? numericUserId : null;

    // INSERT into orders using the structure provided in the approved plan
    const orderSql = "INSERT INTO orders (user_id, user_email, total, payment_method, coupon_code, coupon_discount) VALUES (?, ?, ?, ?, ?, ?)";
    db.query(orderSql, [finalUserId, finalUserEmail, orderTotal, finalPaymentMethod, finalCouponCode, finalCouponDiscount], (err, orderResult) => {
        if (err) {
            console.error("Order Insert Error:", err);
            return res.status(500).send("Database Error Creating Order");
        }

        const orderId = orderResult.insertId;

        // Track "purchase" event
        const trackSql = "INSERT INTO funnel_events (session_id, event_type) VALUES (?, ?)";
        db.query(trackSql, [req.sessionId, "purchase"], (err) => {
            if (err) console.error("Funnel Tracking Error (purchase):", err.message);
        });

        // Build order item values — validate product IDs to prevent FK constraint errors
        const rawValues = finalItems.map(item => {
            const pId = parseInt(item.id || item.productId);
            const qty = parseInt(item.quantity) || 1;
            const price = parseFloat(item.price) || 0;
            return { pId, qty, price };
        });

        const invalidItems = rawValues.filter(v => isNaN(v.pId) || v.pId <= 0);
        const validValues = rawValues
            .filter(v => !isNaN(v.pId) && v.pId > 0)
            .map(v => [orderId, v.pId, v.qty, v.price]);

        if (invalidItems.length > 0) {
            console.warn(`Checkout warning: ${invalidItems.length} item(s) had invalid product_id and were skipped.`);
        }

        if (validValues.length === 0) {
            // All items were invalid — roll back the order row and abort
            console.error("Checkout Error: No valid product IDs in cart. Rolling back order", orderId);
            db.query("DELETE FROM orders WHERE id = ?", [orderId]);
            return res.status(400).json({ message: "Cart contains no valid products. Please re-add items and try again." });
        }

        const orderItemsSql = "INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ?";
        db.query(orderItemsSql, [validValues], (err, itemsResult) => {
            if (err) {
                console.error("Order Items Insert Error:", err.code, "-", err.message);
                // Clean up orphaned order row
                db.query("DELETE FROM orders WHERE id = ?", [orderId], () => {});
                return res.status(500).json({ message: "Database Error Creating Order Items", detail: err.message });
            }

            // Save delivery address linked to this order (non-fatal if it fails)
            if (full_name || phone || address_line) {
                const addrSql = `
                    INSERT INTO delivery_addresses (order_id, user_id, full_name, phone, address_line, city, state, pincode)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                `;
                db.query(addrSql,
                    [orderId, finalUserId, full_name || null, phone || null, address_line || null, city || null, state || null, pincode || null],
                    (err) => {
                        if (err) console.error("Delivery address save error (non-fatal):", err.message);
                    }
                );
            }

            res.json({ success: true, message: "Order Placed Successfully", order_id: orderId });
        });
    });
});

router.get("/track-load", (req, res) => {
    const trackSql = "INSERT INTO funnel_events (session_id, event_type) VALUES (?, ?)";
    db.query(trackSql, [req.sessionId, "checkout"], (err) => {
        if (err) {
            console.error("Funnel Tracking Error (checkout):", err.message);
            return res.status(500).send("Tracking Error");
        }
        res.send("Checkout Tracked");
    });
});

module.exports = router;
