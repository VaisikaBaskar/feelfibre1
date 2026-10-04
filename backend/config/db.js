const mysql = require("mysql");

// Use a pool instead of a single connection.
// createConnection silently drops after MySQL's wait_timeout (~8h) with no
// auto-reconnect, causing all subsequent queries to return 500.
// createPool recycles connections automatically and handles concurrency.
const db = mysql.createPool({
    host:            process.env.DB_HOST     || "localhost",
    user:            process.env.DB_USER     || "root",
    password:        process.env.DB_PASSWORD || "",
    database:        process.env.DB_NAME     || "feelfibre",
    connectionLimit: 10,
    waitForConnections: true,
    acquireTimeout:  10000
});

// Validate pool at startup
db.getConnection((err, connection) => {
    if (err) {
        console.error("MySQL Pool connection error:", err.message);
    } else {
        console.log("MySQL Pool connected successfully.");
        connection.release();
    }
});

module.exports = db;
