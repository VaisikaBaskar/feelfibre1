import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import defaultImage from "../assets/default-product.png";
import "./ProductDetails.css";
import API_URL from "../config/api";
import RecommendedProducts from "../components/RecommendedProducts";

function ProductDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [mainImage, setMainImage] = useState(defaultImage);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);

    useEffect(() => {
        const fetchProduct = async () => {
            const defaultProducts = [
                // ... (default products omitted for brevity)
            ];

            const storedProducts = JSON.parse(localStorage.getItem("products")) || [];

            try {
                // Use specific product API to track "view"
                const response = await fetch(`${API_URL}/products/${id}`);
                if (!response.ok) throw new Error("Product not found");
                const found = await response.json();

                setProduct(found);
                if (found && found.image) setMainImage(found.image);

                // Set gallery images (main image + additional images)
                if (found && found.images) {
                    setGalleryImages(found.images);
                } else if (found && found.image) {
                    setGalleryImages([found.image]);
                } else {
                    setGalleryImages([defaultImage]);
                }

                // For related, we still need the full list (or another API)
                const allRes = await fetch(API_URL + "/products");
                const allDbData = await allRes.json();
                const all = [...storedProducts, ...allDbData];

                // Related Products (Find 3 other products)
                const others = all.filter(p => p.id !== parseInt(id)).slice(0, 3);
                setRelatedProducts(others);

            } catch (error) {
                console.error("Error fetching product details:", error);
                const all = [...storedProducts];
                const found = all.find(p => p.id === parseInt(id));
                setProduct(found);
                if (found && found.image) {
                    setMainImage(found.image);
                    setGalleryImages([found.image]);
                }

                const others = all.filter(p => p.id !== parseInt(id)).slice(0, 3);
                setRelatedProducts(others);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
        window.scrollTo(0, 0); // Reset scroll on page load

        // Analytics: track product view
        fetch("http://localhost:5000/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "product_view" })
        }).catch(err => console.error("Analytics error:", err));

    }, [id]);

    const addToCart = (product) => {
        let sessionId = localStorage.getItem("sessionId");
        if (!sessionId) {
            sessionId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
            localStorage.setItem("sessionId", sessionId);
        }

        let cart = JSON.parse(localStorage.getItem("cart")) || [];
        for (let i = 0; i < quantity; i++) {
            cart.push(product);
        }
        localStorage.setItem("cart", JSON.stringify(cart));
        localStorage.setItem("lastCartActivity", Date.now());
        window.dispatchEvent(new Event("cartUpdated"));

        // Abandoned Cart tracking: session add_to_cart
        fetch("http://localhost:5000/api/analytics/track-cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sessionId, event_type: "cart_add" })
        }).catch(err => console.error("Tracking error:", err));

        // Analytics: legacy track add_to_cart event
        fetch("http://localhost:5000/api/analytics/event", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ event: "add_to_cart" })
        }).catch(err => console.error("Analytics error:", err));

        setTimeout(() => {
            alert(`${quantity} Item(s) Added to Cart`);
        }, 50);
    };

    const handleBuyNow = () => {
        const userEmail = localStorage.getItem("userEmail");
        if (!userEmail) {
            navigate("/login");
            return;
        }
        addToCart(product);
        navigate("/cart");
    };

    if (loading) return <div className="details-loader">Fetching Natural Goodness...</div>;
    if (!product) return <div className="details-error">Product not found. <button onClick={() => navigate("/products")}>Back to Products</button></div>;

    return (
        <div className="product-details-container">
            {/* SECTION 1: Top Product Section */}
            <div className="details-top-section">
                {/* SECTION 2: Image Gallery */}
                <div className="details-image-gallery">
                    <div className="main-image-box">
                        <img
                            src={mainImage.startsWith("http") || mainImage.startsWith("data:") ? mainImage : `${API_URL}${mainImage.startsWith("/") ? "" : "/"}${mainImage}`}
                            alt={product.name}
                            onError={(e) => { e.target.src = defaultImage; }}
                        />
                    </div>
                    <div className="thumbnail-grid">
                        {galleryImages.map((img, idx) => {
                            // OPTIONAL: If you want to HIDE the thumbnail that is currently the main image
                            // In this case, we hide the first one if it matches product.image (to avoid confusion)
                            if (idx === 0 && img === product.image && galleryImages.length > 1) return null;

                            return (
                                <div
                                    key={idx}
                                    className={`thumb-box ${mainImage === img ? 'active' : ''}`}
                                    onClick={() => setMainImage(img)}
                                >
                                    <img
                                        src={img.startsWith("http") || img.startsWith("data:") ? img : `${API_URL}${img.startsWith("/") ? "" : "/"}${img}`}
                                        alt={`Gallery ${idx}`}
                                        onError={(e) => { e.target.src = defaultImage; }}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div className="details-content-box">
                    <p className="category-breadcrumb">Home / {product.category || "Products"} / {product.name}</p>
                    <h1 className="details-name">{product.name}</h1>

                    <div className="details-price-box">
                        {product.oldPrice && <span className="details-old-price">₹{product.oldPrice}</span>}
                        <span className="details-current-price">₹{product.price}</span>
                        <span className="gst-label">(Incl. of all taxes)</span>
                    </div>

                    <div className="product-buttons">
                        <div className="quantity-box">
                            <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                            <span>{quantity}</span>
                            <button onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <button className="add-cart-btn" onClick={() => addToCart(product)}>
                            Add to Cart
                        </button>
                        <button className="buy-now-btn" onClick={handleBuyNow}>
                            Buy Now
                        </button>
                    </div>

                    {/* SECTION 3: Benefits Section */}
                    <div className="benefits-summary">
                        <h3>Key Benefits</h3>
                        <ul className="benefits-grid">
                            <li>✔ Natural Ingredients</li>
                            <li>✔ High Fiber</li>
                            <li>✔ Energy Boost</li>
                            <li>✔ Healthy</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Information Sections */}
            <div className="details-info-tabs">
                {/* SECTION 4: Description */}
                <div className="info-tab">
                    <h2>Description</h2>
                    <p>{product.description || "Traditional feelfibre health mix made from the finest sprouted grains and millets. Packed with natural nutrients for a healthy lifestyle."}</p>
                </div>

                {/* SECTION 5: Ingredients */}
                <div className="info-tab">
                    <h2>Ingredients</h2>
                    <p>{product.ingredients || "Sprouted Ragi, Pearl Millet, Sorghum, Green Gram, Soya, Almonds, Cashews, Cardamom."}</p>
                </div>

                {/* SECTION 6: How To Use */}
                <div className="info-tab">
                    <h2>How to Use</h2>
                    <ol className="use-steps">
                        <li>Mix 2 tablespoons of powder with water/milk (approx 200ml).</li>
                        <li>Stir well to remove lumps.</li>
                        <li>Cook on a medium flame for 5-8 minutes while stirring continuously.</li>
                        <li>Add salt or honey/jaggery according to your preference and serve warm.</li>
                    </ol>
                </div>
            </div>

            {/* SECTION 7: Related Products */}
            <div className="related-products-section">
                <h2>Related Products</h2>
                <div className="related-grid">
                    {relatedProducts.map(rp => (
                        <div key={rp.id} className="related-card" onClick={() => navigate(`/product/${rp.id}`)}>
                            <img src={rp.image || defaultImage} alt={rp.name} onError={(e) => { e.target.src = defaultImage; }} />
                            <h4>{rp.name}</h4>
                            <p>₹{rp.price}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* SECTION 8: Recommended Products (You May Also Like) via new Backend API */}
            <RecommendedProducts category={product.category} currentProductId={product.id} />

            <style>{`
                .product-buttons {
                    display: flex;
                    align-items: center;
                    gap: 15px;
                    margin-top: 20px;
                    flex-wrap: wrap;
                }
                .quantity-box {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    height: 50px;
                    padding: 0 20px;
                    border: 1px solid #ddd;
                    border-radius: 25px;
                    background: white;
                    width: 130px;
                    box-shadow: none;
                }
                .quantity-box button {
                    border: none;
                    background: transparent;
                    font-size: 20px;
                    cursor: pointer;
                    font-weight: bold;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 5px 10px;
                }
                .quantity-box span {
                    font-weight: 600;
                    font-size: 16px;
                }
                .add-cart-btn {
                    height: 50px;
                    padding: 0 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    background: #2e7d32;
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .add-cart-btn:hover {
                    background: #1b5e20;
                }
                .buy-now-btn {
                    height: 50px;
                    padding: 0 30px;
                    border-radius: 25px;
                    font-weight: 600;
                    background: #66bb6a;
                    color: white;
                    border: none;
                    cursor: pointer;
                    transition: 0.3s;
                }
                .buy-now-btn:hover {
                    background: #4caf50;
                }
                @media (max-width: 600px) {
                    .product-buttons {
                        flex-direction: column;
                        align-items: stretch;
                    }
                    .quantity-box, .add-cart-btn, .buy-now-btn {
                        width: 100%;
                        justify-content: center;
                    }
                }
            `}</style>
        </div>
    );
}

export default ProductDetails;
