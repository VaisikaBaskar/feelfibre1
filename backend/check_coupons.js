const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "feelfibre"
});

db.connect();

db.query("DESCRIBE coupons", (err, results) => {
    if (err) {
        console.error("Error describing coupons:", err.message);
    } else {
        console.log("Coupons columns:");
        results.forEach(row => console.log(`- ${row.Field} (${row.Type})`));
    }
    db.end();
});
