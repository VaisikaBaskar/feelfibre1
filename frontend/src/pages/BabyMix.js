import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import defaultImage from "../assets/default-product.png";
import "./Products.css"; // Reuse existing product grid styles
import API_URL from "../config/api";

function BabyMix() {
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
                setProducts(data.filter(p => p.category === "BabyMix"));
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
        <div style={{ maxWidth: "1000px", margin: "50px auto", padding: "0 20px", fontFamily: "sans-serif" }}>

            {/* Product Grid Section */}
            <div className="products-grid" style={{ marginBottom: "60px" }}>
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container" style={{ height: "200px" }}>
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
                                {product.oldPrice && <span className="old-price">₹{product.oldPrice}</span>}
                                <span className="current-price">₹{product.price}</span>
                            </div>
                            <div className="card-actions">
                                <button className="add-btn" onClick={() => addToCart(product)}>Add to Cart</button>
                                <button className="details-btn" onClick={() => navigate(`/product/${product.id}`)}>View Details</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <hr style={{ border: "0", height: "1px", background: "#eee", margin: "40px 0" }} />

            {/* SECTION 1: Intro */}
            <section style={{ textAlign: "center", marginBottom: "50px" }}>
                <h1 style={{ color: "#2e7d32", fontSize: "2.2rem", marginBottom: "20px" }}>feelfibre BabyMix – Natural Nutrition for Babies</h1>
                <p style={{ color: "#555", fontSize: "1.1rem", lineHeight: "1.6" }}>
                    feelfibre BabyMix products are made from natural grains, nuts and seeds to support healthy growth for babies and toddlers.
                </p>
            </section>

            {/* SECTION 2: Ingredients & Benefits Table */}
            <section style={{ marginBottom: "50px" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}>
                    <thead>
                        <tr style={{ background: "#2e7d32", color: "#fff" }}>
                            <th style={{ padding: "15px", textAlign: "left" }}>Ingredient</th>
                            <th style={{ padding: "15px", textAlign: "left" }}>Benefits</th>
                        </tr>
                    </thead>
                    <tbody>
                        {[
                            { item: "Millets", benefit: "Supports growth and digestion" },
                            { item: "Nuts", benefit: "Helps brain development" },
                            { item: "Seeds", benefit: "Improves immunity" },
                            { item: "Grains", benefit: "Provides energy" }
                        ].map((row, idx) => (
                            <tr key={idx} style={{ borderBottom: "1px solid #eee" }}>
                                <td style={{ padding: "15px", fontWeight: "600" }}>{row.item}</td>
                                <td style={{ padding: "15px", color: "#555" }}>{row.benefit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            {/* SECTION 3: Preparation */}
            <section style={{ marginBottom: "50px", padding: "30px", background: "#f9fbf9", borderRadius: "10px" }}>
                <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>How to Prepare BabyMix</h2>
                <ul style={{ paddingLeft: "20px", lineHeight: "2" }}>
                    <li>• Add 2 tablespoons of BabyMix powder</li>
                    <li>• Mix with warm water or milk</li>
                    <li>• Cook for 2–3 minutes</li>
                    <li>• Serve warm</li>
                </ul>
            </section>

            {/* SECTION 4: Why Choose Us */}
            <section style={{ marginBottom: "50px" }}>
                <h2 style={{ color: "#2e7d32", marginBottom: "20px" }}>Why Choose feelfibre BabyMix</h2>
                <ul style={{ paddingLeft: "0", listStyle: "none", lineHeight: "2" }}>
                    <li>✔ 100% Natural Ingredients</li>
                    <li>✔ No Preservatives</li>
                    <li>✔ Easy Digestion</li>
                    <li>✔ Strong Bones Development</li>
                    <li>✔ Immunity Support</li>
                </ul>
            </section>

        </div>
    );
}

export default BabyMix;
