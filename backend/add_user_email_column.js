const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "feelfibre"
});

db.connect((err) => {
    if (err) {
        console.error("Database Error:", err);
        process.exit(1);
    }
    const sql = "ALTER TABLE orders ADD COLUMN user_email VARCHAR(100)";
    db.query(sql, (err, result) => {
        if (err) {
            if (err.code === 'ER_DUP_COLUMN_NAME') {
                console.log("Column user_email already exists. Skipping.");
            } else {
                console.error("ALTER TABLE Error:", err);
            }
        } else {
            console.log("Column user_email added successfully.");
        }
        db.end();
    });
});
