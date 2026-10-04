const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const sql = `
        SELECT source, COUNT(*) as total
        FROM traffic_logs
        WHERE DATE(created_at) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
        GROUP BY source;
    `;
    db.query(sql, (err, data) => {
        if (err) {
            console.error("Traffic Sources Query Error:", err);
            return res.status(500).json(err);
        }
        res.json(data);
    });
});

module.exports = router;
