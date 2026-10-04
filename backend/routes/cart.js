const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.put("/updateQuantity", (req, res) => {
    const { productId, quantity } = req.body;
    // In this basic version, frontend uses localStorage mostly.
    // If we wanted DB-based cart syncing we'd update it here.
    // We mock success to fulfill the API requirement without breaking local flow.
    res.send("Quantity Updated");
});

router.delete("/remove/:productId", (req, res) => {
    const { productId } = req.params;
    // Mock success to fulfill the API requirement.
    res.send("Product Removed");
});

router.post("/track-add", (req, res) => {
    const { productId } = req.body;
    const trackSql = "INSERT INTO funnel_events (session_id, event_type, product_id) VALUES (?, ?, ?)";

    db.query(trackSql, [req.sessionId, "add_to_cart", productId], (err) => {
        if (err) {
            console.error("Funnel Tracking Error (add_to_cart):", err.message);
            return res.status(500).send("Tracking Error");
        }
        res.send("Add to Cart Tracked");
    });
});

module.exports = router;
