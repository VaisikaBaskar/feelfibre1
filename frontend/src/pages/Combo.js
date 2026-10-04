import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-product.png";
import "./Combo.css";
import API_URL from "../config/api";

function Combo() {
    const navigate = useNavigate();
    const [combos, setCombos] = useState([]);

    useEffect(() => {
        fetch(API_URL + "/products")
            .then(res => res.json())
            .then(data => {
                setCombos(data.filter(p => p.category === "Combo"));
            })
            .catch(err => console.log(err));
    }, []);

    const addToCart = (product) => {
        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        cart.push(product);
        localStorage.setItem("cart", JSON.stringify(cart));
        window.dispatchEvent(new Event("cartUpdated"));
        alert("Combo Added to Cart");
    };

    return (
        <div className="combo-container">
            <div className="combo-grid">
                {combos.map((product) => (
                    <div key={product.id} className="combo-card">
                        <div className="combo-image-box">
                            <img
                                src={product.image || defaultImage}
                                alt={product.name}
                                onError={(e) => { e.target.src = defaultImage; }}
                            />
                        </div>
                        <div className="combo-info">
                            <h3 className="combo-name">{product.name}</h3>
                            <p className="combo-price">₹{product.price}</p>

                            <div className="combo-actions">
                                <button className="combo-add-btn" onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>
                                <button
                                    className="combo-details-btn"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Combo;
