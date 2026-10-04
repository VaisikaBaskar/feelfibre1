import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../../config/api";

function ManageProducts() {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const admin = localStorage.getItem("admin");
        if (!admin) {
            window.location.href = "/login";
            return;
        }

        fetch(API_URL + "/products")
            .then(res => res.json())
            .then(data => setProducts(data))
            .catch(err => console.log(err));

    }, []);

    const deleteProduct = (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            fetch(API_URL + "/products/" + id, {
                method: "DELETE"
            })
                .then(res => res.json())
                .then(data => {
                    if (data.success) {
                        setProducts(products.filter(p => p.id !== id));
                        alert("Product Deleted");
                    }
                })
                .catch(err => console.log(err));
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("admin");
        localStorage.removeItem("adminEmail");
        window.location.href = "/login";
    };

    return (
        <div>
            <style>
                {`
                .admin-back-btn {
                    background: #1b5e20;
                    color: white;
                    border: none;
                    padding: 8px 16px;
                    border-radius: 6px;
                    cursor: pointer;
                    margin-bottom: 15px;
                    font-weight: 600;
                }
                .admin-back-btn:hover {
                    background: #2e7d32;
                }
                `}
            </style>

            {/* Admin Header */}
            <div style={{
                padding: "15px 30px",
                background: "#1b5e20",
                color: "white",
                fontSize: "20px",
                fontWeight: "bold",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
            }}>
                FeelFibre Admin Panel
                <button
                    onClick={handleLogout}
                    style={{
                        background: "#e53935",
                        color: "white",
                        border: "none",
                        padding: "8px 15px",
                        borderRadius: "5px",
                        cursor: "pointer"
                    }}
                >
                    Logout
                </button>
            </div>

            <div style={{ padding: "20px" }}>
                <button
                    className="admin-back-btn"
                    onClick={() => navigate("/admin")}
                >
                    ← Back to Dashboard
                </button>

                <h1>Manage Products</h1>

                {products.length === 0 ? (
                    <h3>No Added Products</h3>
                ) : (
                    products.map((product) => (
                        <div key={product.id}
                            style={{
                                border: "1px solid #ddd",
                                margin: "10px",
                                padding: "10px",
                                borderRadius: "10px",
                                background: "white"
                            }}>
                            <h3>{product.name}</h3>
                            <p>₹{product.price}</p>
                            <p><strong>Category:</strong> {product.category}</p>
                            <button
                                onClick={() => deleteProduct(product.id)}
                                style={{
                                    padding: "8px 15px",
                                    background: "#e53935",
                                    color: "white",
                                    border: "none",
                                    borderRadius: "5px",
                                    cursor: "pointer"
                                }}
                            >
                                Delete Product
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default ManageProducts;
