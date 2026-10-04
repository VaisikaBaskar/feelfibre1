const mysql = require("mysql");
const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "feelfibre"
});

db.connect();

const tables = ["orders", "order_items"];

function checkNextTable() {
    if (tables.length === 0) {
        db.end();
        return;
    }
    const table = tables.shift();
    db.query(`SHOW COLUMNS FROM ${table}`, (err, results) => {
        if (err) {
            console.error(`Error showing columns for ${table}:`, err.message);
        } else {
            console.log(`COLUMNS_START_${table}`);
            results.forEach(row => console.log(JSON.stringify(row)));
            console.log(`COLUMNS_END_${table}`);
        }
        checkNextTable();
    });
}

checkNextTable();
