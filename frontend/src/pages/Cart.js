import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import defaultImage from "../assets/default-product.png";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
        // Ensure every item has a quantity property
        const initializedCart = savedCart.map(item => ({
            ...item,
            quantity: item.quantity || 1
        }));
        setCart(initializedCart);
    }, []);

    const updateQuantity = (index, delta) => {
        const newCart = [...cart];
        const newQuantity = newCart[index].quantity + delta;
        if (newQuantity > 0) {
            newCart[index].quantity = newQuantity;
            setCart(newCart);
            localStorage.setItem("cart", JSON.stringify(newCart));
            localStorage.setItem("lastCartActivity", Date.now());
            window.dispatchEvent(new Event("cartUpdated"));
        }
    };

    const removeItem = (index) => {
        const newCart = [...cart];
        newCart.splice(index, 1);
        setCart(newCart);
        localStorage.setItem("cart", JSON.stringify(newCart));
        localStorage.setItem("lastCartActivity", Date.now());
        window.dispatchEvent(new Event("cartUpdated"));
    };

    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);

    const placeOrder = () => {
        navigate("/payment");
    };

    return (
        <div className="cart-page">
            <h1>Your Cart</h1>
            {cart.length === 0 ? (
                <h3>Cart is Empty</h3>
            ) : (
                <div className="cart-content">
                    {/* LEFT SIDE: Cart Items */}
                    <div className="cart-items">
                        {cart.map((item, index) => (
                            <div key={index} className="cart-item">
                                {/* Left Section (Image) */}
                                <div className="cart-item-image">
                                    <img
                                        src={item.image ? (item.image.startsWith("http") || item.image.startsWith("data:") ? item.image : `${API_URL}${item.image.startsWith("/") ? "" : "/"}${item.image}`) : defaultImage}
                                        alt={item.name}
                                        onError={(e) => { e.target.src = defaultImage; }}
                                    />
                                </div>

                                {/* Middle Section (Details) */}
                                <div className="cart-item-details">
                                    <h3 className="cart-item-name">{item.name}</h3>
                                    <p className="cart-item-price">₹{item.price}</p>
                                    <div className="qty-controls">
                                        <button onClick={() => updateQuantity(index, -1)} className="qty-btn">-</button>
                                        <span className="qty-value">{item.quantity}</span>
                                        <button onClick={() => updateQuantity(index, 1)} className="qty-btn">+</button>
                                    </div>
                                </div>

                                {/* Right Section (Actions) */}
                                <div className="cart-item-actions">
                                    <button onClick={() => removeItem(index)} className="remove-btn">Remove</button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* RIGHT SIDE: Order Summary */}
                    <div className="cart-summary">
                        <h2>Order Summary</h2>
                        <h3 className="cart-total">Total Price: ₹{totalPrice}</h3>
                        <button onClick={placeOrder} className="place-order-btn">
                            PLACE ORDER
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Cart;
