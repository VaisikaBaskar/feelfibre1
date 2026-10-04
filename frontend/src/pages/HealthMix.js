import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import defaultImage from "../assets/default-product.png";
import "./Products.css";
import API_URL from "../config/api";

function HealthMix() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    useEffect(() => {
        fetch(API_URL + "/products")
            .then(res => res.json())
            .then(data => {
                setProducts(data.filter(p => p.category === "HealthMix"));
            })
            .catch(err => console.log(err));
    }, []);

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Product Added to Cart");
    };

    const toggleWishlist = (product) => {
        let currentWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        const isExist = currentWishlist.find(item => item.id === product.id);

        if (isExist) {
            currentWishlist = currentWishlist.filter(item => item.id !== product.id);
        } else {
            currentWishlist.push(product);
        }

        setWishlist(currentWishlist);
        localStorage.setItem("wishlist", JSON.stringify(currentWishlist));
        window.dispatchEvent(new Event("wishlistUpdated"));
    };

    const isInWishlist = (productId) => wishlist.some(item => item.id === productId);

    return (
        <div style={{ maxWidth: "1200px", margin: "50px auto", padding: "0 20px" }}>
            <h1 style={{ textAlign: "center", color: "#2e7d32", marginBottom: "40px" }}>Health Mix Products</h1>

            <div className="products-grid">
                {products.length === 0 ? (
                    <p style={{ textAlign: "center", width: "100%" }}>Loading products...</p>
                ) : (
                    products.map((product) => (
                        <div key={product.id} className="product-card">
                            <div className="product-image-container">
                                <button
                                    className={`wishlist-heart ${isInWishlist(product.id) ? "active" : ""}`}
                                    onClick={() => toggleWishlist(product)}
                                >
                                    {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                                </button>
                                <img
                                    src={product.image || defaultImage}
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
                                    <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                                    <button className="details-btn" onClick={() => navigate(`/product/${product.id}`)}>View Details</button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default HealthMix;
