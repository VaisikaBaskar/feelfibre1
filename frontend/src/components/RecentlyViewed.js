import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import defaultImage from "../assets/default-product.png";
import "./RecentlyViewed.css";

const RecentlyViewed = ({ userId, currentProductId }) => {
    const [viewedProducts, setViewedProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                setLoading(true);

                if (userId) {
                    console.log(`[RecentlyViewed] Fetching DB history for user: ${userId}`);
                    const response = await fetch(`${API_URL}/api/history/${userId}`);
                    if (!response.ok) throw new Error("Failed to fetch history");

                    const data = await response.json();
                    if (data.success && data.products) {
                        // Filter out current product to prevent duplicate rendering of the page's item
                        const filtered = data.products.filter(p => p.id !== currentProductId);
                        setViewedProducts(filtered);
                    } else {
                        setViewedProducts([]);
                    }
                } else {
                    // Fallback to localStorage for guest users
                    console.log("[RecentlyViewed] Fetching local history for guest user");
                    const storedLocal = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
                    const filteredLocal = storedLocal.filter(p => p.id !== currentProductId).slice(0, 5);
                    setViewedProducts(filteredLocal);
                }
            } catch (err) {
                console.error("[RecentlyViewed] Error:", err);
                setError(err.message);

                // On DB fetch error, gracefully fallback to local storage
                const storedLocal = JSON.parse(localStorage.getItem("recentlyViewed")) || [];
                setViewedProducts(storedLocal.filter(p => p.id !== currentProductId).slice(0, 5));
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [userId, currentProductId]);

    // Do not crash, gracefully hide if nothing
    if (loading) return null;
    if (viewedProducts?.length === 0) return null;

    return (
        <div className="recently-viewed-section">
            <h2>Recently Viewed <span className="fire-icon">🔥</span></h2>
            <div className="recently-viewed-grid">
                {viewedProducts.map((p) => (
                    <div
                        key={p.id}
                        className="recently-viewed-card"
                        onClick={() => navigate(`/product/${p.id}`)}
                    >
                        <img
                            src={p.image && (p.image.startsWith("http") || p.image.startsWith("data:")) ? p.image : `${API_URL}${p.image && p.image.startsWith("/") ? "" : "/"}${p.image || "not-found"}`}
                            alt={p.name}
                            onError={(e) => { e.target.src = defaultImage; }}
                        />
                        <h4>{p?.name}</h4>
                        <p>₹{p?.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecentlyViewed;
