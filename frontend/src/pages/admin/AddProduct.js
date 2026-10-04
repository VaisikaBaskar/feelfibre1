import React, { useState, useEffect } from "react";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";

function AddProduct() {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("HealthMix");
    const [stock, setStock] = useState("50");
    const [imageFile, setImageFile] = useState(null);
    const [additionalImages, setAdditionalImages] = useState("");

    return (
        <AdminLayout>
            <div className="admin-container" style={{ padding: "40px 20px" }}>
                <h2 style={{ fontSize: "28px", fontWeight: "bold", color: "#2e7d32", marginBottom: "20px", textAlign: "center" }}>
                    Add New Product
                </h2>

                <div className="product-form-card">
                    <div className="form-group">
                        <label>Product Name</label>
                        <input
                            type="text"
                            placeholder="e.g. Health Mix"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Price (₹)</label>
                        <input
                            type="number"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Category</label>
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="HealthMix">Health Mix</option>
                            <option value="BabyMix">Baby Mix</option>
                            <option value="Combo">Combo</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Stock Quantity</label>
                        <input
                            type="number"
                            name="stock"
                            placeholder="Enter stock quantity"
                            min="0"
                            value={stock}
                            onChange={(e) => setStock(e.target.value)}
                        />
                    </div>

                    <div className="form-group">
                        <label>Main Product Image (Upload)</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                    </div>

                    <div className="form-group">
                        <label>Additional Image URLs (Optional, comma-separated)</label>
                        <input
                            type="text"
                            placeholder="e.g. img1.jpg, img2.jpg"
                            value={additionalImages}
                            onChange={(e) => setAdditionalImages(e.target.value)}
                        />
                    </div>

                    <button
                        className="add-product-btn"
                        onClick={async () => {
                            if (name === "" || price === "") {
                                alert("Enter all fields");
                                return;
                            }
                            try {
                                const formData = new FormData();
                                formData.append("name", name);
                                formData.append("price", parseFloat(price));
                                formData.append("category", category);
                                formData.append("stock", parseInt(stock, 10) || 50);
                                if (imageFile) {
                                    formData.append("image", imageFile);
                                }

                                const imagesArray = additionalImages
                                    ? additionalImages.split(",").map(img => img.trim()).filter(img => img !== "")
                                    : [];
                                formData.append("images", JSON.stringify(imagesArray));

                                await axios.post(API_URL + "/add-product", formData);

                                alert("Product Added Successfully");
                                setName("");
                                setPrice("");
                                setStock("50");
                                setImageFile(null);
                                setAdditionalImages("");
                            } catch (error) {
                                console.error("Error adding product:", error);
                                const errorMsg = error.response?.data || "Failed to add product";
                                alert(errorMsg);
                            }
                        }}
                    >
                        Add Product
                    </button>
                </div>

                <style>{`
                    .product-form-card {
                        max-width: 500px;
                        margin: auto;
                        padding: 30px;
                        background: #ffffff;
                        border-radius: 10px;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.08);
                        box-sizing: border-box;
                    }

                    .product-form-card .form-group {
                        margin-bottom: 18px;
                    }

                    .product-form-card label {
                        font-weight: 500;
                        margin-bottom: 6px;
                        display: block;
                        color: #333;
                    }

                    .product-form-card input,
                    .product-form-card select {
                        width: 100%;
                        padding: 10px;
                        border-radius: 6px;
                        border: 1px solid #dcdcdc;
                        font-size: 14px;
                        box-sizing: border-box;
                        transition: border-color 0.3s;
                    }

                    .product-form-card input:focus,
                    .product-form-card select:focus {
                        border-color: #2e7d32;
                        outline: none;
                    }

                    .add-product-btn {
                        width: 100%;
                        padding: 12px;
                        background: #2e7d32;
                        color: white;
                        border: none;
                        border-radius: 6px;
                        font-size: 16px;
                        font-weight: 600;
                        cursor: pointer;
                        transition: background 0.3s;
                        margin-top: 10px;
                    }

                    .add-product-btn:hover {
                        background: #256628;
                    }

                    @media (max-width: 768px) {
                        .product-form-card {
                            padding: 20px;
                            width: 100%;
                        }
                    }
                `}</style>
            </div>
        </AdminLayout>
    );
}

export default AddProduct;
