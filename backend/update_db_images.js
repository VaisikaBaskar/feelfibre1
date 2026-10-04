const mysql = require("mysql");
const db = require("./config/db");

const createTableSql = `
CREATE TABLE IF NOT EXISTS product_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    product_id INT NOT NULL,
    image_url TEXT NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);
`;

db.query(createTableSql, (err, result) => {
    if (err) {
        console.error("Error creating product_images table:", err);
        process.exit(1);
    }
    console.log("product_images table created or already exists.");
    process.exit(0);
});
