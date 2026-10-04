import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminLayout from "./AdminLayout";
import API_URL from "../../config/api";

function EditProduct() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("HealthMix");
    const [image, setImage] = useState(""); // This stores the current path (string)
    const [imageFile, setImageFile] = useState(null); // This stores the new file to upload
    const [additionalImages, setAdditionalImages] = useState("");
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        axios.get(`${API_URL}/products/${id}`)
            .then(res => {
                const product = res.data;
                setName(product.name);
                setPrice(product.price);
                setCategory(product.category);
                setImage(product.image || "");

                // images array contains main image at index 0, so we skip it for "additional"
                const extra = product.images ? product.images.filter(img => img !== product.image) : [];
                setAdditionalImages(extra.join(", "));

                setLoading(false);
            })
            .catch(err => {
                console.error("Error fetching product:", err);
                alert("Failed to fetch product details");
                setLoading(false);
            });
    }, [id]);

    const handleUpdate = async () => {
        if (name === "" || price === "") {
            alert("Enter all fields");
            return;
        }
        try {
            const formData = new FormData();
            formData.append("name", name);
            formData.append("price", parseFloat(price));
            formData.append("category", category);
            formData.append("image", image); // Existing image path (string)

            if (imageFile) {
                formData.append("image", imageFile); // New file to upload
            }

            const imagesArray = additionalImages
                ? additionalImages.split(",").map(img => img.trim()).filter(img => img !== "")
                : [];
            formData.append("images", JSON.stringify(imagesArray));

            await axios.put(`${API_URL}/products/${id}`, formData);

            alert("Product Updated Successfully");
            navigate("/admin/products");
        } catch (error) {
            console.error("Error updating product:", error);
            alert("Failed to update product");
        }
    };

    if (loading) return (
        <AdminLayout>
            <div style={{ textAlign: "center", padding: "50px" }}>Loading Product...</div>
        </AdminLayout>
    );

    return (
        <AdminLayout>
            <div className="admin-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
                <h2 style={{ color: "#2e7d32", marginBottom: "20px", textAlign: "center" }}>Edit Product</h2>
                <div className="admin-table-container">
                    <div className="admin-form-group">
                        <label>Product Name</label>
                        <input
                            className="admin-input"
                            type="text"
                            placeholder="e.g. Health Mix"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Price (₹)</label>
                        <input
                            className="admin-input"
                            type="number"
                            placeholder="0.00"
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                        />
                    </div>
                    <div className="admin-form-group">
                        <label>Category</label>
                        <select
                            className="admin-input"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <option value="HealthMix">Health Mix</option>
                            <option value="BabyMix">Baby Mix</option>
                            <option value="Combo">Combo</option>
                        </select>
                    </div>
                    <div className="admin-form-group">
                        <label>Product Image (Current: {image})</label>
                        <input
                            className="admin-input"
                            type="file"
                            accept="image/*"
                            onChange={(e) => setImageFile(e.target.files[0])}
                        />
                        <p style={{ fontSize: "12px", color: "#666", marginTop: "5px" }}>Leave blank to keep existing image</p>
                    </div>
                    <div className="admin-form-group">
                        <label>Additional Image URLs (comma-separated)</label>
                        <input
                            className="admin-input"
                            type="text"
                            placeholder="e.g. img1.jpg, img2.jpg"
                            value={additionalImages}
                            onChange={(e) => setAdditionalImages(e.target.value)}
                        />
                    </div>
                    <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
                        <button
                            className="admin-primary-btn"
                            style={{ flex: 1 }}
                            onClick={handleUpdate}
                        >
                            Update Product
                        </button>
                        <button
                            className="admin-primary-btn"
                            style={{ flex: 1, background: "#666" }}
                            onClick={() => navigate("/admin/products")}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default EditProduct;
