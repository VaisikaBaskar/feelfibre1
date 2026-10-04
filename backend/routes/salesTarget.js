const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const query = `
        SELECT target_amount
        FROM sales_target
        WHERE month = MONTH(CURDATE())
        AND year = YEAR(CURDATE())
        LIMIT 1
    `;

    db.query(query, (err, result) => {
        if (err) {
            console.error("Sales Target API Error:", err);
            return res.status(500).json(err);
        }
        res.json(result[0] || { target_amount: 0 });
    });
});

module.exports = router;
