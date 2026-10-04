import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";
import "../../styles/admin.css";

const AdminProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [newStock, setNewStock] = useState("");
    const navigate = useNavigate();

    const fetchProducts = () => {
        setLoading(true);
        axios.get(API_URL + "/products")
            .then(res => {
                console.log("Fetched products:", res.data);
                setProducts(res.data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure?")) {
            fetch(API_URL + "/products/" + id, { method: "DELETE" })
                .then(() => setProducts(products.filter(p => p.id !== id)));
        }
    };

    const openStockModal = (product) => {
        setSelectedProduct(product);
        setNewStock(product.stock !== undefined && product.stock !== null ? product.stock : 50);
    };

    const handleUpdateStock = () => {
        if (!selectedProduct) return;

        fetch(`${API_URL}/update-stock/${selectedProduct.id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                stock: newStock
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    fetchProducts();
                    setSelectedProduct(null);
                }
            })
            .catch(err => console.error("Error updating stock:", err));
    };

    return (
        <AdminLayout>
            <div className="admin-products">
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                    <h1 style={{ color: "#2e7d32" }}>Product Management</h1>
                    <button className="admin-primary-btn" onClick={() => navigate("/admin/add-product")}>
                        Add New Product
                    </button>
                </div>

                <div className="admin-table-container">
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Category</th>
                                <th>Stock</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr><td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>Loading products...</td></tr>
                            ) : products.map((p) => (
                                <tr key={p.id}>
                                    <td>#{p.id}</td>
                                    <td>{p.name}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.category}</td>
                                    <td>
                                        {(() => {
                                            const stockCount = p.stock !== undefined && p.stock !== null ? p.stock : 50;
                                            let stockLabel = <span style={{ color: "red", fontWeight: "bold" }}>Out of Stock</span>;
                                            if (stockCount > 20) {
                                                stockLabel = <span style={{ color: "green", fontWeight: "bold" }}>In Stock ({stockCount})</span>;
                                            } else if (stockCount > 0) {
                                                stockLabel = <span style={{ color: "orange", fontWeight: "bold" }}>Low Stock ({stockCount})</span>;
                                            }
                                            return (
                                                <div style={{ display: "flex", alignItems: "center" }}>
                                                    {stockLabel}
                                                    <button className="update-stock-btn" onClick={() => openStockModal(p)}>Update</button>
                                                </div>
                                            );
                                        })()}
                                    </td>
                                    <td>
                                        <button
                                            style={{ marginRight: "10px", color: "blue", background: "none", border: "none", cursor: "pointer" }}
                                            onClick={() => navigate(`/admin/edit-product/${p.id}`)}
                                        >
                                            Edit
                                        </button>
                                        <button style={{ color: "red", background: "none", border: "none", cursor: "pointer" }} onClick={() => handleDelete(p.id)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {!loading && products.length === 0 && <p style={{ textAlign: "center", padding: "20px" }}>No products found.</p>}
                </div>

                {selectedProduct && (
                    <div className="stock-modal-overlay">
                        <div className="stock-modal">
                            <h3>Update Stock</h3>
                            <p><strong>Product:</strong> {selectedProduct.name}</p>
                            <p><strong>Current Stock:</strong> {selectedProduct.stock !== undefined && selectedProduct.stock !== null ? selectedProduct.stock : 50}</p>
                            <label>New Stock:</label>
                            <input
                                type="number"
                                value={newStock}
                                onChange={(e) => setNewStock(e.target.value)}
                            />
                            <div className="stock-modal-actions">
                                <button className="stock-modal-cancel" onClick={() => setSelectedProduct(null)}>Cancel</button>
                                <button className="stock-modal-update" onClick={handleUpdateStock}>Update Stock</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

export default AdminProducts;
