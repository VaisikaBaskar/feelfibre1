const db = require("./backend/config/db");

// Step 1: Create the table
const createTableSql = `
CREATE TABLE IF NOT EXISTS sales_target (
  id INT AUTO_INCREMENT PRIMARY KEY,
  month INT,
  year INT,
  target_amount INT
);
`;

db.query(createTableSql, (err) => {
    if (err) {
        console.error("Error creating sales_target table:", err);
        process.exit(1);
    }

    console.log("sales_target table ready.");

    // Step 2: Insert default value for current month if not exists
    const checkSql = `SELECT id FROM sales_target WHERE month = MONTH(CURDATE()) AND year = YEAR(CURDATE()) LIMIT 1`;
    db.query(checkSql, (err, results) => {
        if (err) {
            console.error("Error checking sales_target:", err);
            process.exit(1);
        }

        if (results.length === 0) {
            const insertSql = `INSERT INTO sales_target (month, year, target_amount) VALUES (MONTH(CURDATE()), YEAR(CURDATE()), 50000)`;
            db.query(insertSql, (err) => {
                if (err) {
                    console.error("Error inserting default target:", err);
                    process.exit(1);
                }
                console.log("Default sales target inserted for current month.");
                process.exit(0);
            });
        } else {
            console.log("Sales target already exists for this month.");
            process.exit(0);
        }
    });
});
