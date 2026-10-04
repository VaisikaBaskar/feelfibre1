const mysql = require("mysql");

const db = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "feelfibre"
});

const defaultProducts = [
    { id: 1, name: "feelfibre Health Mix 500g", price: 250 },
    { id: 2, name: "feelfibre Health Mix 1kg", price: 450 },
    { id: 3, name: "Ragi Health Mix", price: 300 },
    { id: 4, name: "Kids Special Health Mix", price: 350 },
    { id: 5, name: "Diabetic Health Mix", price: 400 },
    { id: 6, name: "Protein Health Mix", price: 500 }
];

db.connect((err) => {
    if (err) {
        console.error("Database Error:", err);
        process.exit(1);
    }

    db.query("SELECT COUNT(*) AS count FROM products", (err, results) => {
        if (err) {
            console.error("Count Error:", err);
            db.end();
            return;
        }

        if (results[0].count === 0) {
            console.log("Products table is empty. Seeding default products...");
            const sql = "INSERT INTO products (id, name, price) VALUES ?";
            const values = defaultProducts.map(p => [p.id, p.name, p.price]);

            db.query(sql, [values], (err, result) => {
                if (err) {
                    console.error("Seeding Error:", err);
                } else {
                    console.log("Products seeded successfully:", result.affectedRows);
                }
                db.end();
            });
        } else {
            console.log("Products table already has data. Skipping seed.");
            db.end();
        }
    });
});
