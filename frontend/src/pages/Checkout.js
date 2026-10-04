import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import SwiggyLocationPicker from "../components/SwiggyLocationPicker";

function Checkout() {

    const navigate = useNavigate();

    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [pincode, setPincode] = useState("");
    const [phone, setPhone] = useState("");
    const [location, setLocation] = useState(null);
    const [deliveryLocation, setDeliveryLocation] = useState(null);

    useEffect(() => {
        // Analytics: track checkout event
        fetch("http://localhost:5000/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "checkout" })
        }).catch(err => console.error("Analytics error:", err));
    }, []);

    const placeOrder = () => {

        const cart = JSON.parse(localStorage.getItem("cart")) || [];

        if (cart.length === 0) {
            alert("Cart is Empty");
            return;
        }

        const orders = JSON.parse(localStorage.getItem("orders")) || [];

        orders.push({
            items: cart,
            address: address, // This will be Street Address / Area
            city: city,
            state: state,
            pincode: pincode,
            phone: phone,
            deliveryLocation: deliveryLocation
        });

        localStorage.setItem("orders", JSON.stringify(orders));
        localStorage.removeItem("cart");
        alert("Order Placed Successfully");
        navigate("/orders");

    };

    return (

        <div style={{ padding: "20px" }}>

            <h1>Checkout</h1>

            <input
                placeholder="Street Address / Area"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                    display: "block",
                    margin: "10px",
                    padding: "10px",
                    width: "300px"
                }}
            />

            <input
                placeholder="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                style={{
                    display: "block",
                    margin: "10px",
                    padding: "10px",
                    width: "300px"
                }}
            />

            <input
                placeholder="State"
                value={state}
                onChange={(e) => setState(e.target.value)}
                style={{
                    display: "block",
                    margin: "10px",
                    padding: "10px",
                    width: "300px"
                }}
            />

            <input
                placeholder="Pincode"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                style={{
                    display: "block",
                    margin: "10px",
                    padding: "10px",
                    width: "300px"
                }}
            />

            <input
                placeholder="Enter Phone Number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                style={{
                    display: "block",
                    margin: "10px",
                    padding: "10px"
                }}
            />

            <h3 style={{ margin: "20px 10px 10px" }}>Search Delivery Location</h3>
            <div style={{ margin: "0 10px 20px" }}>
                <SwiggyLocationPicker onLocationSelect={(loc) => {
                    setDeliveryLocation(loc);
                    if (loc.address) setAddress(loc.address);
                    if (loc.city) setCity(loc.city);
                    if (loc.state) setState(loc.state);
                    if (loc.pincode) setPincode(loc.pincode);
                }} />
            </div>

            <button
                onClick={placeOrder}
                style={{
                    padding: "10px",
                    background: "green",
                    color: "white",
                    border: "none"
                }}
            >
                Place Order
            </button>

        </div>

    );

}

export default Checkout;
