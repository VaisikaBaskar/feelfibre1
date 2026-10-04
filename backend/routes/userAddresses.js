const express = require("express");
const router = express.Router();
const db = require("../config/db");

// Auto-create user_addresses table
db.query(`
    CREATE TABLE IF NOT EXISTS user_addresses (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id INT NOT NULL,
        full_name VARCHAR(100),
        phone VARCHAR(20),
        address_line VARCHAR(255),
        city VARCHAR(100),
        state VARCHAR(100),
        pincode VARCHAR(10),
        is_default BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
`, (err) => {
    if (err) console.error("user_addresses table error:", err.message);
    else console.log("user_addresses table ready.");
});

// GET /api/user-addresses/user/:userId - Get all saved addresses for a user
router.get("/user/:userId", (req, res) => {
    const userId = parseInt(req.params.userId, 10);
    if (isNaN(userId)) return res.status(400).json({ message: "Invalid user ID" });

    const sql = "SELECT * FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC";

    db.query(sql, [userId], (err, results) => {
        if (err) {
            console.error("Fetch user addresses error:", err);
            return res.status(500).json({ error: "Database error" });
        }
        res.json(results);
    });
});

// POST /api/user-addresses - Add a new saved address
router.post("/", (req, res) => {
    const { user_id, full_name, phone, address_line, city, state, pincode, is_default } = req.body;

    if (!user_id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // If this is set as default, we need to unset any existing default first
    const insertNewAddress = () => {
        const sql = `
            INSERT INTO user_addresses (user_id, full_name, phone, address_line, city, state, pincode, is_default)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(sql, [user_id, full_name, phone, address_line, city, state, pincode, is_default === true ? 1 : 0], (err, result) => {
            if (err) {
                console.error("Add user address error:", err);
                return res.status(500).json({ success: false, message: "Failed to add address" });
            }
            res.json({ success: true, message: "Address added successfully", address_id: result.insertId });
        });
    };

    if (is_default) {
        db.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [user_id], (err) => {
            if (err) console.error("Error unsetting default addresses:", err);
            insertNewAddress();
        });
    } else {
        insertNewAddress();
    }
});

// PUT /api/user-addresses/:id - Update an address
router.put("/:id", (req, res) => {
    const addressId = parseInt(req.params.id, 10);
    if (isNaN(addressId)) return res.status(400).json({ message: "Invalid address ID" });

    const { user_id, full_name, phone, address_line, city, state, pincode } = req.body;

    const sql = `
        UPDATE user_addresses 
        SET full_name = ?, phone = ?, address_line = ?, city = ?, state = ?, pincode = ?
        WHERE id = ? AND user_id = ?
    `;

    db.query(sql, [full_name, phone, address_line, city, state, pincode, addressId, user_id], (err, result) => {
        if (err) {
            console.error("Update user address error:", err);
            return res.status(500).json({ success: false, message: "Failed to update address" });
        }
        res.json({ success: true, message: "Address updated successfully" });
    });
});

// DELETE /api/user-addresses/:id - Delete an address
router.delete("/:id", (req, res) => {
    const addressId = parseInt(req.params.id, 10);
    if (isNaN(addressId)) return res.status(400).json({ message: "Invalid address ID" });
    const sql = "DELETE FROM user_addresses WHERE id = ?";
    db.query(sql, [addressId], (err, result) => {
        if (err) {
            console.error("Delete user address error:", err);
            return res.status(500).json({ success: false, message: "Failed to delete address" });
        }
        res.json({ success: true, message: "Address deleted successfully" });
    });
});

// PATCH /api/user-addresses/:id/default - Set as default
router.patch("/:id/default", (req, res) => {
    const addressId = parseInt(req.params.id, 10);
    if (isNaN(addressId)) return res.status(400).json({ message: "Invalid address ID" });

    const { user_id } = req.body; // Need user_id to unset other defaults

    if (!user_id) {
        return res.status(400).json({ success: false, message: "User ID is required" });
    }

    // Step 1: Unset default for all user's addresses
    db.query("UPDATE user_addresses SET is_default = FALSE WHERE user_id = ?", [user_id], (err) => {
        if (err) {
            console.error("Error unsetting defaults:", err);
            return res.status(500).json({ success: false, message: "Database error" });
        }

        // Step 2: Set target address as default
        db.query("UPDATE user_addresses SET is_default = TRUE WHERE id = ? AND user_id = ?", [addressId, user_id], (err2, result) => {
            if (err2) {
                console.error("Error setting default:", err2);
                return res.status(500).json({ success: false, message: "Failed to set default address" });
            }
            res.json({ success: true, message: "Default address updated" });
        });
    });
});

module.exports = router;
