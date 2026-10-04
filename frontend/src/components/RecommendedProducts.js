import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
import defaultImage from "../assets/default-product.png";
import "./RecommendedProducts.css";

const RecommendedProducts = ({ category, currentProductId }) => {
    const [recommended, setRecommended] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (!category) return;

        const fetchRecommendations = async () => {
            try {
                setLoading(true);
                let url = `${API_URL}/api/recommend/${encodeURIComponent(category)}`;
                if (currentProductId) {
                    url += `?exclude=${currentProductId}`;
                }

                const response = await fetch(url);
                if (!response.ok) throw new Error("Failed to fetch recommendations");

                const data = await response.json();
                if (data.success) {
                    setRecommended(data.products || []);
                } else {
                    throw new Error(data.message || "Unknown Error");
                }
            } catch (err) {
                console.error("Error fetching recommended products:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchRecommendations();
    }, [category, currentProductId]);

    if (loading) return null; // Or return a loader if preferred
    if (error || recommended.length === 0) return null;

    return (
        <div className="recommended-products-section">
            <h2>You May Also Like</h2>
            <div className="recommended-grid">
                {recommended.map(rp => (
                    <div key={rp.id} className="recommended-card" onClick={() => navigate(`/product/${rp.id}`)}>
                        <img 
                            src={rp.image && (rp.image.startsWith("http") || rp.image.startsWith("data:")) ? rp.image : `${API_URL}${rp.image && rp.image.startsWith("/") ? "" : "/"}${rp.image || "not-found"}`} 
                            alt={rp.name} 
                            onError={(e) => { e.target.src = defaultImage; }} 
                        />
                        <h4>{rp.name}</h4>
                        <p>₹{rp.price}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendedProducts;
