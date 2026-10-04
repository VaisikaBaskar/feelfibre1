import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import defaultImage from "../assets/default-product.png";
import "./Products.css";
import API_URL from "../config/api";

function Products({ searchTerm = "" }) {
    const navigate = useNavigate();

    const [allProducts, setAllProducts] = useState([]);
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    useEffect(() => {
        fetch(API_URL + "/products")
            .then(res => res.json())
            .then(data => {
                setAllProducts(data);
            })
            .catch(err => console.log(err));
    }, []);

    // Simple filtering based only on header search term
    const filteredProducts = allProducts.filter(product => {
        return product.name.toLowerCase().includes(searchTerm.toLowerCase());
    });

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
        <div className="products-container">
            <div className="products-grid">
                {filteredProducts.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image-container">
                            <button
                                className={`wishlist-heart ${isInWishlist(product.id) ? "active" : ""}`}
                                onClick={() => toggleWishlist(product)}
                            >
                                {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                            </button>
                            <img
                                src={product.image ? (product.image.startsWith("http") || product.image.startsWith("data:") ? product.image : `${API_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`) : defaultImage}
                                alt={product.name}
                                className="product-image"
                                onError={(e) => {
                                    e.target.src = defaultImage;
                                }}
                            />
                        </div>
                        <div className="product-info">
                            <h3 className="product-name">{product.name}</h3>

                            <div className="price-container">
                                {product.oldPrice && (
                                    <span className="old-price">₹{product.oldPrice}</span>
                                )}
                                <span className="current-price">₹{product.price}</span>
                            </div>

                            <div className="card-actions">
                                <button className="add-btn" onClick={() => addToCart(product)}>
                                    Add to Cart
                                </button>
                                <button
                                    className="details-btn"
                                    onClick={() => navigate(`/product/${product.id}`)}
                                >
                                    View Details
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

                {filteredProducts.length === 0 && (
                    <div className="no-results">
                        <p>No products found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Products;
