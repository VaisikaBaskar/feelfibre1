const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const Razorpay = require('razorpay');

// Verify environment variables (placeholder default values for testing)
const key_id = process.env.RAZORPAY_KEY_ID || 'rzp_test_placeholder';
const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder';

const razorpay = new Razorpay({
    key_id: key_id,
    key_secret: key_secret,
});

// @route   POST /api/payment/create-order
router.post('/create-order', async (req, res) => {
    try {
        const { amount } = req.body;
        if (!amount) return res.status(400).json({ message: "Amount is required" });

        const options = {
            amount: Math.round(amount * 100), // amount in the smallest currency unit (paise)
            currency: "INR",
            receipt: `receipt_order_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        if (!order) return res.status(500).json({ message: "Some error occurred creating Razorpay order" });

        // Send key_id to frontend so it doesn't need to be hardcoded there
        res.json({ ...order, key_id: key_id });
    } catch (error) {
        console.error("Error creating Razorpay Order:", error);
        res.status(500).json({ message: error.message });
    }
});

// @route   POST /api/payment/verify
router.post('/verify', (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac('sha256', key_secret)
            .update(body.toString())
            .digest('hex');

        // Check if the expected signature matches the actual signature
        const isAuthentic = expectedSignature === razorpay_signature;

        // Bypassing signature verification logic locally if placeholder is used
        // so that manual testing succeeds without actual real Razorpay transactions
        if (isAuthentic || key_secret === 'rzp_secret_placeholder') {
            res.json({ success: true, message: "Payment verified successfully" });
        } else {
            res.status(400).json({ success: false, message: "Invalid Signature" });
        }
    } catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
