import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import CategoryCards from "../components/CategoryCards";
import HeroBanner from "../components/HeroBanner";
import healthmixBanner from "../assets/hero/healthmix.png";
import defaultProductImg from "../assets/default-product.png";
import "./Home.css";
import API_URL from "../config/api";

function Home({ searchTerm = "" }) {
    const navigate = useNavigate();
    const [homeProducts, setHomeProducts] = useState([]);
    const [activeFilter, setActiveFilter] = useState("Shop All");
    const [wishlist, setWishlist] = useState([]);

    useEffect(() => {
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    const defaultHealthMixProducts = [
        { id: 1, name: "feelfibre Health Mix 500g", price: 250, image: defaultProductImg, category: "HealthMix" },
        { id: 2, name: "feelfibre Health Mix 1kg", price: 450, image: defaultProductImg, category: "HealthMix" },
        { id: 3, name: "Ragi Health Mix", price: 300, image: defaultProductImg, category: "HealthMix" },
        { id: 4, name: "Kids Special Health Mix", price: 350, image: defaultProductImg, category: "BabyMix" }
    ];

    useEffect(() => {
        fetch(API_URL + "/products")
            .then(res => res.json())
            .then(data => {
                if (data && data.length > 0) {
                    setHomeProducts(data);
                } else {
                    setHomeProducts(defaultHealthMixProducts);
                }
            })
            .catch(err => {
                console.log("Fetch failed, using default products:", err);
                setHomeProducts(defaultHealthMixProducts);
            });
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

    // Safe filtering logic for Best Sellers (Filter + Search)
    const displayList = homeProducts.length > 0 ? homeProducts : defaultHealthMixProducts;
    const filteredBestSellers = displayList.filter(product => {
        // 1. Category Filter logic
        let matchesCategory = true;
        if (activeFilter === "Baby Mix") matchesCategory = product.category === "BabyMix";
        else if (activeFilter === "Health Mix") matchesCategory = product.category === "HealthMix";

        // 2. Search Filter logic
        let matchesSearch = true;
        if (searchTerm) {
            matchesSearch = product.name && product.name.toLowerCase().includes(searchTerm.toLowerCase());
        }

        return matchesCategory && matchesSearch;
    }).slice(0, 3);

    const featuredProducts = [
        {
            id: 'featured-1',
            name: "Health Mix 500g",
            price: 250,
            image: "/default.png"
        },
        {
            id: 'featured-2',
            name: "Ragi Health Mix",
            price: 300,
            image: "/default.png"
        },
        {
            id: 'featured-3',
            name: "Kids Health Mix",
            price: 350,
            image: "/default.png"
        }
    ];

    const filteredProducts = featuredProducts.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (

        <div style={{ padding: "0", width: "100%" }}>

            {/* ── NEW PROFESSIONAL SECTIONS BELOW ── */}
            <div className="home-professional-wrap">

                {/* STEP 3: Hero Section */}
                <section className="hero">
                    <div className="hero-content">
                        <h1>feelfibre</h1>
                        <p>Natural Health Mix for Healthy Life</p>
                        <button className="hero-button" onClick={() => navigate("/products")}>
                            Shop Now
                        </button>
                    </div>
                </section>

                {/* ── UPGRADED: BEST SELLER SECTION ── */}
                <section className="best-seller-section">

                    <h2 className="best-title">Best Sellers</h2>

                    <div className="best-filters">
                        <button
                            className={`best-filter-btn ${activeFilter === "Shop All" ? "active" : ""}`}
                            onClick={() => setActiveFilter("Shop All")}
                        >
                            Shop All
                        </button>
                        <button
                            className={`best-filter-btn ${activeFilter === "Baby Mix" ? "active" : ""}`}
                            onClick={() => setActiveFilter("Baby Mix")}
                        >
                            Baby Mix
                        </button>
                        <button
                            className={`best-filter-btn ${activeFilter === "Health Mix" ? "active" : ""}`}
                            onClick={() => setActiveFilter("Health Mix")}
                        >
                            Health Mix
                        </button>
                    </div>

                    <Link to="/products" className="view-all">View All Products →</Link>

                    <div className="best-grid-wrapper">
                        <div className="best-grid">
                            {filteredBestSellers.map((product) => (
                                <div key={product.id} className="best-card">
                                    <div className="best-label">BEST SELLER</div>
                                    <button
                                        className={`wishlist-heart ${isInWishlist(product.id) ? "active" : ""}`}
                                        onClick={() => toggleWishlist(product)}
                                    >
                                        {isInWishlist(product.id) ? <FaHeart /> : <FaRegHeart />}
                                    </button>
                                    <img
                                        src={product.image ? (product.image.startsWith("http") || product.image.startsWith("data:") ? product.image : `${API_URL}${product.image.startsWith("/") ? "" : "/"}${product.image}`) : defaultProductImg}
                                        alt={product.name}
                                        className="best-image"
                                        onError={(e) => { e.target.src = defaultProductImg; }}
                                    />
                                    <div className="best-info">
                                        <h3 className="best-name">{product.name}</h3>
                                        <p className="best-price">₹{product.price}</p>
                                        <button className="best-button" onClick={() => addToCart(product)}>Add to Cart</button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    </div>
                </section>

                {/* MERGED: WHY CHOOSE & TRUST SECTION */}
                <section className="trust-section">
                    <div className="trust-section-container">
                        <h2 className="section-title">Why FeelFibre is the Right Choice</h2>
                        <div className="benefits-row">
                            <div className="benefit-box"><span>🌿</span><h3>100% Natural Ingredients</h3></div>
                            <div className="benefit-box"><span>🛡️</span><h3>No Preservatives</h3></div>
                            <div className="benefit-box"><span>🌾</span><h3>High Fiber Nutrition</h3></div>
                            <div className="benefit-box"><span>🏠</span><h3>Homemade Quality</h3></div>
                        </div>

                        <div className="stats-row">
                            <div className="trust-box"><h3>100+</h3><p>Happy Customers</p></div>
                            <div className="trust-box"><h3>Premium</h3><p>Quality Health Mix</p></div>
                            <div className="trust-box"><h3>Fast</h3><p>Delivery</p></div>
                        </div>
                    </div>
                </section>

                {/* UPGRADED FULL-WIDTH: REVIEWS SECTION */}
                <section className="reviews-section">
                    <div className="reviews-container">
                        <h2 className="section-title">What Our Customers Say</h2>
                        <div className="testimonials-grid">
                            {[
                                {
                                    text: "Very healthy and tasty product. I use feelfibre health mix every morning and it keeps me energetic throughout the day.",
                                    name: "Ravi Kumar",
                                    img: "https://i.pravatar.cc/80?img=1"
                                },
                                {
                                    text: "Good quality health mix with natural ingredients. Easy to prepare and my whole family enjoys it daily.",
                                    name: "Priya S",
                                    img: "https://i.pravatar.cc/80?img=2"
                                },
                                {
                                    text: "Excellent taste and good nutrition. I highly recommend feelfibre for a healthy lifestyle.",
                                    name: "Arun K",
                                    img: "https://i.pravatar.cc/80?img=3"
                                }
                            ].map((review, idx) => (
                                <div key={idx} className="review-card">
                                    <div className="review-stars" style={{ color: "#fbc02d", fontSize: "1.2rem", marginBottom: "15px" }}>★★★★★</div>
                                    <p className="review-text">"{review.text}"</p>
                                    <img src={review.img} alt={review.name} className="review-image" />
                                    <div className="review-name">{review.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

            </div>

        </div>

    );
}

export default Home;
