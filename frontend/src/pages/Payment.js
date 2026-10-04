import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import SwiggyLocationPicker from "../components/SwiggyLocationPicker";

const Payment = () => {
    const navigate = useNavigate();
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    const userEmail = localStorage.getItem("userEmail");

    const total = cart.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
    const [method, setMethod] = useState("COD");

    // Coupon states
    const [couponCode, setCouponCode] = useState("");
    const [appliedCoupon, setAppliedCoupon] = useState(null); // { code, discount, applicable_products }
    const [discountAmount, setDiscountAmount] = useState(0);
    const [couponError, setCouponError] = useState("");
    const [availableCoupons, setAvailableCoupons] = useState([]);

    // Delivery address state
    const [address, setAddress] = useState({
        full_name: "",
        phone: "",
        address_line: "",
        city: "",
        state: "",
        pincode: ""
    });
    const [addressErrors, setAddressErrors] = useState({});

    // Saved Addresses state
    const [savedAddresses, setSavedAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState("manual");
    const [loadingAddresses, setLoadingAddresses] = useState(true);
    const [deliveryLocation, setDeliveryLocation] = useState(null);

    const userStr = localStorage.getItem("user");
    const user = userStr ? JSON.parse(userStr) : {};

    // Fetch Available Coupons
    useEffect(() => {
        axios.get(`${API_URL}/api/coupons`)
            .then(res => {
                const now = new Date();
                const valid = res.data.filter(c =>
                    c.status === "active" &&
                    new Date(c.expiry_date) >= now
                );
                setAvailableCoupons(valid);
            })
            .catch(err => console.error("Error fetching available coupons:", err));
    }, []);

    // Apply Coupon Logic
    const handleApplyCoupon = async (codeToApply = null) => {
        setCouponError("");
        const code = (codeToApply || couponCode).trim();
        if (!code) return;

        try {
            const response = await axios.get(`${API_URL}/api/coupons`);
            const coupons = response.data;
            const coupon = coupons.find(c => c.code.toUpperCase() === code.toUpperCase());

            if (!coupon) {
                setCouponError("Coupon does not exist");
                setAppliedCoupon(null);
                setDiscountAmount(0);
                return;
            }

            if (coupon.status !== "active") {
                setCouponError("This coupon is disabled");
                setAppliedCoupon(null);
                setDiscountAmount(0);
                return;
            }

            const now = new Date();
            const expiry = new Date(coupon.expiry_date);
            if (expiry < now) {
                setCouponError("This coupon has expired");
                setAppliedCoupon(null);
                setDiscountAmount(0);
                return;
            }

            // Product Eligibility Logic
            let eligibleTotal = 0;
            const applicableIds = coupon.applicable_products
                ? coupon.applicable_products.split(",").map(id => id.trim())
                : [];

            if (applicableIds.length === 0) {
                // Global coupon
                eligibleTotal = total;
            } else {
                // Product-specific coupon
                const eligibleItems = cart.filter(item => {
                    const pid = String(item.id || item.productId);
                    return applicableIds.includes(pid);
                });

                if (eligibleItems.length === 0) {
                    setCouponError("This coupon is not valid for the items in your cart");
                    setAppliedCoupon(null);
                    setDiscountAmount(0);
                    return;
                }

                eligibleTotal = eligibleItems.reduce((sum, item) => sum + (parseFloat(item.price) * (item.quantity || 1)), 0);
            }

            const discount = (eligibleTotal * (coupon.discount / 100));
            setDiscountAmount(discount);
            setAppliedCoupon(coupon);
            if (codeToApply) setCouponCode(codeToApply.toUpperCase()); // Update input if used "Apply" button from list
            alert(`Coupon "${coupon.code}" applied! You saved ₹${discount.toFixed(2)}`);
        } catch (error) {
            console.error("Error applying coupon:", error);
            setCouponError("Failed to validate coupon");
        }
    };

    const finalTotal = total - discountAmount;

    // Fetch saved addresses
    useEffect(() => {
        if (user.id) {
            axios.get(`${API_URL}/api/user-addresses/user/${user.id}`)
                .then(res => {
                    setSavedAddresses(res.data);
                    // Pre-select default address if available
                    if (res.data.length > 0) {
                        const defaultAddr = res.data.find(a => a.is_default === 1) || res.data[0];
                        selectSavedAddress(defaultAddr);
                    }
                    setLoadingAddresses(false);
                })
                .catch(err => {
                    console.error("Error fetching saved addresses:", err);
                    setLoadingAddresses(false);
                });
        } else {
            setLoadingAddresses(false);
        }
    }, [user.id]);

    const selectSavedAddress = (addr) => {
        setSelectedAddressId(addr.id);
        setAddress({
            full_name: addr.full_name,
            phone: addr.phone,
            address_line: addr.address_line,
            city: addr.city,
            state: addr.state,
            pincode: addr.pincode
        });
        setAddressErrors({}); // clear errors
    };

    const selectManualAddress = () => {
        setSelectedAddressId("manual");
        setAddress({ full_name: "", phone: "", address_line: "", city: "", state: "", pincode: "" });
        setAddressErrors({});
    };

    // Analytics: track checkout stage when payment page loads
    useEffect(() => {
        const sessionId = localStorage.getItem("sessionId");

        // Simple Analytics
        fetch("http://localhost:5000/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "checkout" })
        }).catch(err => console.error("Analytics error:", err));

        // Session Tracking
        if (sessionId) {
            fetch("http://localhost:5000/api/analytics/track-cart", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ sessionId, event_type: "checkout_start" })
            }).catch(err => console.error("Tracking error:", err));
        }
    }, []);

    const handleAddressChange = (e) => {
        const { name, value } = e.target;
        setAddress(prev => ({ ...prev, [name]: value }));
        // Clear error on change
        setAddressErrors(prev => ({ ...prev, [name]: "" }));
    };

    const validateAddress = () => {
        const errors = {};
        if (!address.full_name.trim()) errors.full_name = "Full name is required";
        if (!address.phone.trim()) {
            errors.phone = "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(address.phone.trim())) {
            errors.phone = "Enter a valid 10-digit Indian phone number";
        }
        if (!address.address_line.trim()) errors.address_line = "Address is required";
        if (!address.city.trim()) errors.city = "City is required";
        if (!address.state.trim()) errors.state = "State is required";
        if (!address.pincode.trim()) {
            errors.pincode = "Pincode is required";
        } else if (!/^\d{6}$/.test(address.pincode.trim())) {
            errors.pincode = "Enter a valid 6-digit pincode";
        }
        return errors;
    };

    const handlePayment = async () => {
        if (!userEmail) {
            alert("Please login to proceed");
            navigate("/login");
            return;
        }

        if (cart.length === 0) {
            alert("Your cart is empty");
            navigate("/cart");
            return;
        }

        // Validate delivery address
        const errors = validateAddress();
        if (Object.keys(errors).length > 0) {
            setAddressErrors(errors);
            alert("Please fill in all delivery address fields correctly.");
            return;
        }

        const user = JSON.parse(localStorage.getItem("user")) || {};

        const executeCheckout = async () => {
            try {
                const orderResponse = await axios.post(API_URL + "/checkout", {
                    user_id: user.id || null,
                    userEmail,
                    cartItems: cart,
                    total: finalTotal, // Use discounted total
                    paymentMethod: method,
                    // Coupon info
                    couponCode: appliedCoupon ? appliedCoupon.code : null,
                    couponDiscount: discountAmount,
                    // Delivery address — saved in delivery_addresses table by the backend
                    full_name: address.full_name,
                    phone: address.phone,
                    address_line: address.address_line,
                    city: address.city,
                    state: address.state,
                    pincode: address.pincode
                });

                // Analytics: track successful purchase
                fetch("http://localhost:5000/api/analytics/event", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ event: "purchase" })
                }).catch(err => console.error("Analytics error:", err));

                // Session Tracking: purchase_complete
                const sessionId = localStorage.getItem("sessionId");
                if (sessionId) {
                    fetch("http://localhost:5000/api/analytics/track-cart", {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ sessionId, event_type: "purchase_complete" })
                    }).catch(err => console.error("Tracking error:", err));
                    localStorage.removeItem("sessionId");
                    localStorage.removeItem("lastCartActivity");
                }

                localStorage.removeItem("cart");
                alert("Order Placed Successfully");
                navigate("/orders");
            } catch (error) {
                console.error("Payment Failed", error);
                alert("Failed to process payment. Please try again.");
            }
        };

        if (method === "COD") {
            await executeCheckout();
        } else {
            try {
                // Initialize Razorpay Order
                const { data: order } = await axios.post(API_URL + "/payment/create-order", {
                    amount: finalTotal
                });

                const options = {
                    key: order.key_id || process.env.REACT_APP_RAZORPAY_KEY_ID, // Key from backend
                    amount: order.amount,
                    currency: "INR",
                    name: "FeelFibre",
                    description: "Order Payment",
                    order_id: order.id,
                    handler: async function (response) {
                        try {
                            const verifyRes = await axios.post(API_URL + "/payment/verify", {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyRes.data.success) {
                                await executeCheckout();
                            } else {
                                alert("Payment verification failed.");
                            }
                        } catch (err) {
                            console.error(err);
                            alert("Error verifying payment.");
                        }
                    },
                    prefill: {
                        name: address.full_name || user.name || "",
                        email: userEmail || "",
                        contact: address.phone || "",
                    },
                    theme: {
                        color: "#2e7d32"
                    }
                };

                const rzp1 = new window.Razorpay(options);
                rzp1.on('payment.failed', function (response) {
                    alert(`Payment Failed: ${response.error.description}`);
                });
                rzp1.open();
            } catch (error) {
                console.error("Error initializing Razorpay:", error);
                alert("Could not initialize payment gateway. Please try again.");
            }
        }
    };

    const inputStyle = {
        width: "100%",
        padding: "10px 12px",
        border: "1px solid #ddd",
        borderRadius: "8px",
        fontSize: "14px",
        boxSizing: "border-box",
        marginTop: "6px",
        outline: "none"
    };

    const errorStyle = {
        color: "#e53935",
        fontSize: "12px",
        marginTop: "4px"
    };

    const labelStyle = {
        fontWeight: "600",
        fontSize: "14px",
        color: "#333",
        display: "block"
    };

    const fieldStyle = {
        marginBottom: "16px"
    };

    const cardStyle = (isSelected) => ({
        border: isSelected ? "2px solid #2e7d32" : "1px solid #ddd",
        background: isSelected ? "#e8f5e9" : "#fff",
        padding: "15px",
        borderRadius: "8px",
        cursor: "pointer",
        marginBottom: "15px",
        position: "relative"
    });

    return (
        <div className="checkout-container">
            <style>{`
                .checkout-container {
                    max-width: 1100px;
                    margin: 0 auto;
                    padding: 20px;
                    font-family: 'Inter', sans-serif;
                }
                @media (min-width: 1200px) {
                    .checkout-container {
                        max-width: 1200px;
                    }
                }
                .checkout-grid {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 30px;
                }
                @media (min-width: 900px) {
                    .checkout-grid {
                        grid-template-columns: 2fr 1fr;
                        align-items: start;
                    }
                }
            `}</style>
            <h1 style={{ color: "#2e7d32", marginBottom: "30px", textAlign: "center" }}>Checkout</h1>

            <div className="checkout-grid">
                <div className="checkout-left">
                    {/* Delivery Address Section */}
                    <div style={{ background: "#fff", padding: "25px", borderRadius: "12px", marginBottom: "24px", boxShadow: "0 2px 10px rgba(0,0,0,0.06)", border: "1px solid #eee" }}>
                        <h3 style={{ color: "#2e7d32", marginBottom: "20px", fontSize: "18px", borderBottom: "2px solid #f0f0f0", paddingBottom: "10px" }}>
                            📦 Delivery Address
                        </h3>

                        {!loadingAddresses && savedAddresses.length > 0 && (
                            <div style={{ marginBottom: "25px" }}>
                                <h4 style={{ marginBottom: "10px", color: "#555" }}>Select a Saved Address</h4>
                                {savedAddresses.map((addr) => (
                                    <div
                                        key={addr.id}
                                        style={cardStyle(selectedAddressId === addr.id)}
                                        onClick={() => selectSavedAddress(addr)}
                                    >
                                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                                            <div>
                                                <strong>{addr.full_name}</strong>
                                                <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>Phone: {addr.phone}</p>
                                                <p style={{ margin: "4px 0", fontSize: "14px", color: "#555" }}>
                                                    {addr.address_line}, {addr.city}, {addr.state} - {addr.pincode}
                                                </p>
                                            </div>
                                            <div style={{
                                                width: "20px", height: "20px", borderRadius: "50%",
                                                border: selectedAddressId === addr.id ? "6px solid #2e7d32" : "2px solid #ccc"
                                            }}></div>
                                        </div>
                                    </div>
                                ))}

                                <div
                                    style={cardStyle(selectedAddressId === "manual")}
                                    onClick={selectManualAddress}
                                >
                                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                        <strong style={{ color: "#333" }}>+ Add New / Enter Manually</strong>
                                        <div style={{
                                            width: "20px", height: "20px", borderRadius: "50%",
                                            border: selectedAddressId === "manual" ? "6px solid #2e7d32" : "2px solid #ccc"
                                        }}></div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Always show form fields for the selected address or manual entry */}
                        <div style={{
                            marginTop: "20px",
                            paddingTop: savedAddresses.length > 0 ? "20px" : "0",
                            borderTop: savedAddresses.length > 0 ? "1px dashed #ddd" : "none",
                            opacity: selectedAddressId !== "manual" ? 0.8 : 1
                        }}>
                            {selectedAddressId !== "manual" && (
                                <p style={{ fontSize: "13px", color: "#666", marginBottom: "15px", fontStyle: "italic" }}>
                                    You are using a saved address. You can update the details below for this specific order if needed.
                                </p>
                            )}

                            {/* Integrated Location Search */}
                            <div style={{ marginBottom: "20px" }}>
                                <p style={{ fontSize: "14px", fontWeight: "600", color: "#333", marginBottom: "8px" }}>Search delivery location</p>
                                <SwiggyLocationPicker onLocationSelect={(loc) => {
                                    setDeliveryLocation(loc);
                                    if (loc.address) setAddress(prev => ({ ...prev, address_line: loc.address }));
                                    if (loc.city) setAddress(prev => ({ ...prev, city: loc.city }));
                                    if (loc.state) setAddress(prev => ({ ...prev, state: loc.state }));
                                    if (loc.pincode) setAddress(prev => ({ ...prev, pincode: loc.pincode }));

                                    // Clear errors for auto-filled fields
                                    setAddressErrors(prev => ({
                                        ...prev,
                                        address_line: loc.address ? "" : prev.address_line,
                                        city: loc.city ? "" : prev.city,
                                        state: loc.state ? "" : prev.state,
                                        pincode: loc.pincode ? "" : prev.pincode
                                    }));
                                }} />
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 20px" }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Full Name *</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={address.full_name}
                                        onChange={handleAddressChange}
                                        placeholder="Enter your full name"
                                        style={{ ...inputStyle, borderColor: addressErrors.full_name ? "#e53935" : "#ddd" }}
                                    />
                                    {addressErrors.full_name && <p style={errorStyle}>{addressErrors.full_name}</p>}
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Phone Number *</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={address.phone}
                                        onChange={handleAddressChange}
                                        placeholder="10-digit mobile number"
                                        maxLength={10}
                                        style={{ ...inputStyle, borderColor: addressErrors.phone ? "#e53935" : "#ddd" }}
                                    />
                                    {addressErrors.phone && <p style={errorStyle}>{addressErrors.phone}</p>}
                                </div>
                            </div>

                            <div style={fieldStyle}>
                                <label style={labelStyle}>Address Line *</label>
                                <input
                                    type="text"
                                    name="address_line"
                                    value={address.address_line}
                                    onChange={handleAddressChange}
                                    placeholder="House No., Street, Locality"
                                    style={{ ...inputStyle, borderColor: addressErrors.address_line ? "#e53935" : "#ddd" }}
                                />
                                {addressErrors.address_line && <p style={errorStyle}>{addressErrors.address_line}</p>}
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "0 20px" }}>
                                <div style={fieldStyle}>
                                    <label style={labelStyle}>City *</label>
                                    <input
                                        type="text"
                                        name="city"
                                        value={address.city}
                                        onChange={handleAddressChange}
                                        placeholder="City"
                                        style={{ ...inputStyle, borderColor: addressErrors.city ? "#e53935" : "#ddd" }}
                                    />
                                    {addressErrors.city && <p style={errorStyle}>{addressErrors.city}</p>}
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>State *</label>
                                    <input
                                        type="text"
                                        name="state"
                                        value={address.state}
                                        onChange={handleAddressChange}
                                        placeholder="State"
                                        style={{ ...inputStyle, borderColor: addressErrors.state ? "#e53935" : "#ddd" }}
                                    />
                                    {addressErrors.state && <p style={errorStyle}>{addressErrors.state}</p>}
                                </div>

                                <div style={fieldStyle}>
                                    <label style={labelStyle}>Pincode *</label>
                                    <input
                                        type="text"
                                        name="pincode"
                                        value={address.pincode}
                                        onChange={handleAddressChange}
                                        placeholder="6-digit pincode"
                                        maxLength={6}
                                        style={{ ...inputStyle, borderColor: addressErrors.pincode ? "#e53935" : "#ddd" }}
                                    />
                                    {addressErrors.pincode && <p style={errorStyle}>{addressErrors.pincode}</p>}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Payment Method */}
                    <div style={{ textAlign: "left", background: "white", padding: "20px", borderRadius: "10px", border: "1px solid #ddd", marginBottom: "24px" }}>
                        <h3 style={{ marginBottom: "15px" }}>Select Payment Method:</h3>
                        <div style={{ margin: "15px 0" }}>
                            <label style={{ cursor: "pointer", display: "block", marginBottom: "10px" }}>
                                <input type="radio" name="payment" value="COD" checked={method === "COD"} onChange={(e) => setMethod(e.target.value)} /> Cash On Delivery
                            </label>
                            <label style={{ cursor: "pointer", display: "block", marginBottom: "10px" }}>
                                <input type="radio" name="payment" value="UPI" checked={method === "UPI"} onChange={(e) => setMethod(e.target.value)} /> UPI (Google Pay / PhonePe)
                            </label>
                            <label style={{ cursor: "pointer", display: "block", marginBottom: "10px" }}>
                                <input type="radio" name="payment" value="Card" checked={method === "Card"} onChange={(e) => setMethod(e.target.value)} /> Credit / Debit Card
                            </label>
                        </div>
                    </div>

                    <button
                        onClick={handlePayment}
                        style={{
                            padding: "15px 40px",
                            background: "#2e7d32",
                            color: "white",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "18px",
                            fontWeight: "bold",
                            cursor: "pointer",
                            width: "100%",
                            transition: "opacity 0.2s",
                            marginBottom: "24px"
                        }}
                        onMouseOver={(e) => e.target.style.opacity = "0.9"}
                        onMouseOut={(e) => e.target.style.opacity = "1"}
                    >
                        {method === "COD" ? "Place Order" : "Pay Now"}
                    </button>

                </div>
                <div className="checkout-right">
                    {/* Coupon Section */}
                    <div style={{ background: "#fff", padding: "20px", borderRadius: "12px", marginBottom: "24px", border: "1px solid #eee", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                        <h3 style={{ color: "#2e7d32", marginBottom: "15px", fontSize: "16px" }}>🎁 Apply Coupon</h3>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <input
                                type="text"
                                placeholder="Enter Coupon Code"
                                value={couponCode}
                                onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                                style={{ ...inputStyle, marginTop: 0, flex: 1 }}
                            />
                            <button
                                onClick={() => handleApplyCoupon()}
                                style={{
                                    padding: "10px 20px",
                                    background: "#2e7d32",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "bold"
                                }}
                            >
                                Apply
                            </button>
                        </div>
                        {couponError && <p style={{ ...errorStyle, marginTop: "8px" }}>{couponError}</p>}
                        {appliedCoupon && (
                            <p style={{ color: "#2e7d32", fontSize: "14px", marginTop: "10px", fontWeight: "600" }}>
                                ✅ Coupon "{appliedCoupon.code}" applied! ({appliedCoupon.discount}% OFF)
                            </p>
                        )}

                        {/* Available Coupons List */}
                        {availableCoupons.length > 0 && (
                            <div style={{ marginTop: "20px", paddingTop: "15px", borderTop: "1px dashed #eee" }}>
                                <p style={{ fontSize: "13px", fontWeight: "600", color: "#666", marginBottom: "10px" }}>Available Coupons:</p>
                                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                    {availableCoupons.map((c) => (
                                        <div key={c.id} style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            padding: "8px 12px",
                                            background: "#f8fdf8",
                                            border: "1px solid #e0f2e0",
                                            borderRadius: "6px"
                                        }}>
                                            <div style={{ display: "flex", flexDirection: "column" }}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                                    <span style={{ fontWeight: "700", color: "#2e7d32", fontSize: "14px" }}>{c.code}</span>
                                                    <span style={{ fontSize: "12px", background: "#e8f5e9", color: "#2e7d32", padding: "2px 6px", borderRadius: "4px" }}>
                                                        {c.discount}% OFF
                                                    </span>
                                                </div>
                                                {c.applicable_products && (
                                                    <span style={{ fontSize: "11px", color: "#777", marginTop: "2px" }}>
                                                        (Product Specific)
                                                    </span>
                                                )}
                                            </div>
                                            <button
                                                onClick={() => handleApplyCoupon(c.code)}
                                                style={{
                                                    padding: "4px 12px",
                                                    background: "white",
                                                    color: "#2e7d32",
                                                    border: "1px solid #2e7d32",
                                                    borderRadius: "4px",
                                                    fontSize: "12px",
                                                    fontWeight: "bold",
                                                    cursor: "pointer"
                                                }}
                                                onMouseOver={(e) => { e.target.style.background = "#2e7d32"; e.target.style.color = "white"; }}
                                                onMouseOut={(e) => { e.target.style.background = "white"; e.target.style.color = "#2e7d32"; }}
                                            >
                                                Apply
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Order Summary */}
                    <div style={{ background: "#f9f9f9", padding: "20px", borderRadius: "10px", marginBottom: "24px", border: "1px solid #eee" }}>
                        <h3 style={{ marginBottom: "15px", borderBottom: "1px solid #ddd", paddingBottom: "10px" }}>Order Summary</h3>
                        <div style={{ marginBottom: "15px" }}>
                            {cart.map((item, index) => (
                                <div key={index} style={{ display: "flex", justifyContent: "space-between", margin: "8px 0", fontSize: "14px" }}>
                                    <span>{item.name} x {item.quantity || 1}</span>
                                    <span>₹{item.price * (item.quantity || 1)}</span>
                                </div>
                            ))}
                        </div>

                        <div style={{ borderTop: "1px solid #eee", paddingTop: "10px" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                                <span>Subtotal</span>
                                <span>₹{total}</span>
                            </div>
                            {discountAmount > 0 && (
                                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px", color: "#d32f2f", fontWeight: "600" }}>
                                    <span>Discount ({appliedCoupon?.code})</span>
                                    <span>-₹{discountAmount.toFixed(2)}</span>
                                </div>
                            )}
                            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px", borderTop: "2px solid #ddd", paddingTop: "10px" }}>
                                <strong style={{ fontSize: "18px" }}>Total</strong>
                                <strong style={{ fontSize: "18px", color: "#2e7d32" }}>₹{finalTotal.toFixed(2)}</strong>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Payment;
