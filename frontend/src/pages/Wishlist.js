import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-product.png";
import API_URL from "../config/api";

function Wishlist() {
    const navigate = useNavigate();
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    const removeFromWishlist = (productId) => {
        const updatedWishlist = wishlist.filter(item => item.id !== productId);
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
    };

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Product Added to Cart");
    };

    return (
        <div className="products-container" style={{ minHeight: "60vh", padding: "40px 20px" }}>
            <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "40px" }}>My Wishlist ❤️</h1>

            {wishlist.length === 0 ? (
                <div style={{ textAlign: "center", marginTop: "50px" }}>
                    <p style={{ fontSize: "1.2rem", color: "#666" }}>Your wishlist is empty.</p>
                    <button
                        onClick={() => navigate("/products")}
                        style={{
                            marginTop: "20px",
                            padding: "10px 25px",
                            backgroundColor: "#2e7d32",
                            color: "white",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "bold"
                        }}
                    >
                        Explore Products
                    </button>
                </div>
            ) : (
                <div className="products-grid">
                    {wishlist.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <img
                                    src={product.image ? (product.image.startsWith("http") || product.image.startsWith("data:") ? product.image : `${API_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`) : defaultImage}
                                    alt={product.name}
                                    className="product-image"
                                    onError={(e) => { e.target.src = defaultImage; }}
                                />
                            </div>
                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <div className="price-container">
                                    <span className="current-price">₹{product.price}</span>
                                </div>
                                <div className="card-actions">
                                    <button className="add-btn" onClick={() => addToCart(product)}>
                                        Add to Cart
                                    </button>
                                    <button
                                        className="details-btn"
                                        style={{ backgroundColor: "#d32f2f" }}
                                        onClick={() => removeFromWishlist(product.id)}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Wishlist;
