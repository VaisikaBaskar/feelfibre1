const express = require("express");
const router = express.Router();
const db = require("../config/db");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");
const { body, validationResult } = require("express-validator");
const securityLogger = require("../utils/securityLogger");

// In-memory OTP store
const otpStore = {};

function validatePassword(password) {
    return /^(?=.*[A-Za-z])(?=.*\d).{8,}$/.test(password);
}

// Configure Nodemailer - Gmail SMTP
const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

router.post(
    "/register",
    [
        body("email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage("Invalid email format: must include a domain (e.g. .com)"),
        body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters")
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid input",
                errors: errors.array()
            });
        }

        const { firstName, lastName, email, password } = req.body;

        // 1. Check if email exists
        const checkSql = "SELECT * FROM users WHERE email = ?";
        db.query(checkSql, [email], async (err, results) => {
            if (err) return res.status(500).send("Database Error");
            if (results.length > 0) return res.status(400).json({ message: "User already exists" });

            // 1.5 Validate Password (Logic check)
            if (!validatePassword(password)) {
                return res.status(400).json({
                    message: "Password must be at least 8 characters long and contain letters and numbers"
                });
            }

            try {
                // 2. Hash Password
                const hashedPassword = await bcrypt.hash(password, 10);

                // 3. Insert User
                const insertSql = "INSERT INTO users (firstName, lastName, email, password) VALUES (?, ?, ?, ?)";
                db.query(insertSql, [firstName, lastName, email, hashedPassword], (err, result) => {
                    if (err) return res.status(500).send("Error registering user");
                    res.json({
                        success: true,
                        message: "Registration Successful"
                    });
                });
            } catch (err) {
                res.status(500).send("Server Error");
            }
        });
    }
);

router.post(
    "/login",
    [
        body("email").matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/).withMessage("Invalid email format: must include a domain (e.g. .com)"),
        body("password").notEmpty().withMessage("Password is required")
    ],
    (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: "Invalid input",
                errors: errors.array()
            });
        }

        const { email, password } = req.body;

        // --- Admin Login Safety ---
        if (email === "admin@gmail.com") {
            if (password === "admin123") {
                securityLogger.info(`Admin login successful | Email: ${email}`);
                return res.json({ success: true, user: "Admin", token: "admin-token" });
            } else {
                securityLogger.warn(`Failed admin login attempt | Email: ${email}`);
                return res.status(400).send("Invalid Email or Password");
            }
        }

        // 1. Check user exists
        const sql = "SELECT * FROM users WHERE email = ?";
        db.query(sql, [email], async (err, results) => {
            if (err) return res.status(500).send("Database Error");
            if (results.length === 0) return res.status(404).send("User not found. Please create an account first.");

            const user = results[0];

            // --- NEW: Check if account is locked ---
            if (user.accountLocked) {
                securityLogger.warn(`Login attempt on locked account | Email: ${email}`);
                return res.status(403).json({
                    message: "Your account is temporarily locked. Please contact support."
                });
            }

            // 2. Compare password
            try {
                let isMatch = false;

                if (user.password.startsWith("$2b$")) {
                    // bcrypt hashed password
                    isMatch = await bcrypt.compare(password, user.password);
                } else {
                    // legacy plain text password
                    if (password === user.password) {
                        // upgrade password automatically
                        const newHash = await bcrypt.hash(password, 10);
                        db.query("UPDATE users SET password = ? WHERE id = ?", [newHash, user.id], (updErr) => {
                            if (updErr) console.error("Auto-upgrade password failed:", updErr);
                            else console.log(`Password auto-upgraded for user ID: ${user.id}`);
                        });
                        isMatch = true;
                    }
                }

                if (isMatch) {
                    // --- NEW: Reset counter after successful login ---
                    db.query(
                        "UPDATE users SET failedLoginAttempts = 0, accountLocked = 0, lockedAt = NULL WHERE id = ?",
                        [user.id]
                    );

                    // 3. Success
                    const responseData = {
                        success: true,
                        token: "dummy-token",
                        id: user.id,
                        email: user.email,
                        first_name: user.firstName || user.name || "",
                        last_name: user.lastName || ""
                    };
                    securityLogger.info(`User login successful | Email: ${email}`);
                    res.json(responseData);
                } else {
                    // --- NEW: Handle Failed Login ---
                    const newAttempts = (user.failedLoginAttempts || 0) + 1;
                    let updateSql = "UPDATE users SET failedLoginAttempts = ? WHERE id = ?";
                    let params = [newAttempts, user.id];

                    if (newAttempts >= 5) {
                        updateSql = "UPDATE users SET failedLoginAttempts = ?, accountLocked = 1, lockedAt = NOW() WHERE id = ?";
                        securityLogger.warn(`Account locked after repeated failures | Email: ${email} | Attempts: ${newAttempts}`);
                    } else {
                        securityLogger.warn(`Failed login attempt | Email: ${email} | Attempt: ${newAttempts}/5`);
                    }

                    db.query(updateSql, params, (updErr) => {
                        if (updErr) console.error("Failed to update login attempts:", updErr);
                    });

                    res.status(401).json({ message: "Incorrect password. Please try again." });
                }
            } catch (err) {
                console.error("Login Error:", err);
                res.status(500).json({ message: "Server Error" });
            }
        });
    });

// --- NEW OTP LOGIN ENDPOINTS ---

router.post("/send-otp", (req, res) => {
    const { email } = req.body;

    // 1. Check if user exists
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], async (err, results) => {
        if (err) return res.status(500).send("Database Error");
        if (results.length === 0) return res.status(400).send("Email not registered");

        // 2. Generate 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        // 3. Store OTP with 5-minute expiry
        otpStore[email] = {
            otp,
            expires: Date.now() + 5 * 60 * 1000
        };

        console.log(`[DEV MODE] OTP for ${email}: ${otp}`);

        // 4. Try to send email, but don't block login flow if it fails
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "FeelFibre Login OTP",
            text: `Your login OTP is: ${otp}\nThis OTP will expire in 5 minutes.`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Email Error:", error.message);
                // Still return success so user knows OTP was generated
                // In production, OTP is logged above for testing
                return res.json({ success: true, message: "OTP generated. Check server console if email fails.", devOtp: process.env.NODE_ENV !== "production" ? otp : undefined });
            }
            res.json({ success: true, message: "OTP sent to your email" });
        });
    });
});

router.post("/verify-otp", (req, res) => {
    const { email, otp } = req.body;

    if (!otpStore[email]) {
        return res.status(400).send("No OTP requested for this email");
    }

    const storedData = otpStore[email];

    if (Date.now() > storedData.expires) {
        delete otpStore[email];
        return res.status(400).send("OTP expired. Please request a new one.");
    }

    if (storedData.otp !== otp) {
        securityLogger.warn(`OTP verification failure | Email: ${email}`);
        return res.status(400).send("Invalid OTP");
    }

    // 4. Fetch User Data to return same format as login
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], (err, results) => {
        if (err) return res.status(500).send("Database Error");

        const user = results[0];
        const responseData = {
            success: true,
            token: "otp-token",
            id: user.id,
            email: user.email,
            first_name: user.firstName || user.name || "",
            last_name: user.lastName || ""
        };

        delete otpStore[email];
        res.json(responseData);
    });
});

module.exports = router;
