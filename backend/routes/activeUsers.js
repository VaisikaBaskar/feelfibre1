const express = require("express");
const router = express.Router();
const db = require("../config/db");

router.get("/", (req, res) => {
    const totalQuery = `
        SELECT COUNT(*) as totalUsers
        FROM users
    `;

    db.query(totalQuery, (err, total) => {
        if (err) return res.status(500).json(err);

        res.json({
            totalUsers: total[0].totalUsers,
            countries: []
        });
    });
});

module.exports = router;
