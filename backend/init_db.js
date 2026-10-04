const db = require('./config/db');

const createCouponsTable = `
CREATE TABLE IF NOT EXISTS coupons (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(50),
    discount INT,
    expiry_date DATE,
    status VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
`;

db.query(createCouponsTable, (err, result) => {
    if (err) {
        console.error('Error creating coupons table:', err);
        process.exit(1);
    }
    console.log('Coupons table ensured.');
    // Optionally insert sample data if table is empty
    const checkSql = 'SELECT COUNT(*) as cnt FROM coupons';
    db.query(checkSql, (err, res) => {
        if (err) {
            console.error('Error checking coupons count:', err);
            process.exit(1);
        }
        if (res[0].cnt === 0) {
            const insertSql = `INSERT INTO coupons (code, discount, expiry_date, status) VALUES
                ('WELCOME10', 10, DATE_ADD(CURDATE(), INTERVAL 30 DAY), 'active'),
                ('SPRING20', 20, DATE_ADD(CURDATE(), INTERVAL 60 DAY), 'active');`;
            db.query(insertSql, (err) => {
                if (err) {
                    console.error('Error inserting sample coupons:', err);
                } else {
                    console.log('Sample coupons inserted.');
                }
                db.end();
            });
        } else {
            db.end();
        }
    });
});
