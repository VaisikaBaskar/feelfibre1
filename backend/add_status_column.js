const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "feelfibre"
});

db.connect();

const alterSql = "ALTER TABLE orders ADD COLUMN status VARCHAR(20) DEFAULT 'pending' AFTER total";

db.query(alterSql, (err, results) => {
    if (err) {
        if (err.code === 'ER_DUP_COLUMN_NAME') {
            console.log("Status column already exists.");
        } else {
            console.error("Error adding status column:", err.message);
        }
    } else {
        console.log("Status column added successfully.");
    }
    db.end();
});
