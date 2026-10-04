const express = require("express");
const router = express.Router();
const db = require("../config/db");

// GET /api/recommend/:category?exclude=:excludeId
router.get("/:category", (req, res) => {
    try {
        const { category } = req.params;
        const excludeId = parseInt(req.query.exclude, 10);

        let sql = "SELECT * FROM products WHERE category = ?";
        let queryParams = [category];

        if (!isNaN(excludeId)) {
            sql += " AND id != ?";
            queryParams.push(excludeId);
        }

        // Limit results to 4-6 products (using 4 as the base limit here)
        sql += " ORDER BY RAND() LIMIT 4";

        db.query(sql, queryParams, (err, results) => {
            if (err) {
                console.error("Database error in recommendations API:", err);
                return res.status(500).json({ success: false, message: "Database Error" });
            }
            res.status(200).json({ success: true, products: results });
        });
    } catch (error) {
        console.error("Error in recommendations API:", error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
});

module.exports = router;
