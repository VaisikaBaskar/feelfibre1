const db = require("./config/db");

// Set refund_status to 'Pending' for all existing Cancelled orders that are NOT COD
const sql = `
    UPDATE orders 
    SET refund_status = 'Pending' 
    WHERE status = 'Cancelled' 
    AND (payment_method IS NULL OR UPPER(payment_method) != 'COD')
    AND (refund_status = 'None' OR refund_status IS NULL)
`;

db.query(sql, (err, result) => {
    if (err) {
        console.error("Migration Error:", err);
        process.exit(1);
    } else {
        console.log(`Migration successful: Updated ${result.affectedRows} legacy orders to Pending refund status.`);
    }
    process.exit(0);
});
