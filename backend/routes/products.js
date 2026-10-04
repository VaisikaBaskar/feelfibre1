const express = require("express");
const router = express.Router();
const db = require("../config/db");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/products/");
    },
    filename: function (req, file, cb) {
        const uniqueName = Date.now() + "-" + file.originalname;
        cb(null, uniqueName);
    }
});

// Allowed image MIME types
const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const fileFilter = (req, file, cb) => {
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Only JPG, PNG, WEBP images are allowed"), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 } // 2 MB max
});


router.get("/products", async (req, res) => {
    try {
        const sql = "SELECT * FROM products";
        db.query(sql, (err, result) => {
            if (err) {
                console.error("Database Error:", err);
                res.status(500).json({ message: "Database Error" });
            } else {
                console.log("Products:", result);
                res.json(result);
            }
        });
    } catch (error) {
        console.error("Server Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
});


router.post("/add-product", upload.single("image"), (req, res) => {
    const { name, price, category, stock, images } = req.body;
    const finalCategory = category || "HealthMix";
    const finalStock = stock !== undefined ? parseInt(stock, 10) : 50;

    // Handle Uploaded Image
    let imagePath = req.file
        ? "/uploads/products/" + req.file.filename
        : req.body.image || "";

    // fallback to category defaults if still empty (as per previous feature)
    if (!imagePath || imagePath.trim() === "") {
        const categoryImages = {
            HealthMix: ["/images/products/health1.jpg", "/images/products/health2.jpg"],
            BabyMix: ["/images/products/baby1.jpg", "/images/products/baby2.jpg"],
            Combo: ["/images/products/combo1.jpg", "/images/products/combo2.jpg"]
        };
        const defaults = categoryImages[finalCategory] || ["/images/products/default.jpg"];
        imagePath = defaults[Math.floor(Math.random() * defaults.length)];
    }

    const sql = "INSERT INTO products (name, price, category, stock, image) VALUES (?, ?, ?, ?, ?)";

    console.log("Adding Product - Body:", req.body);
    console.log("Adding Product - File:", req.file);

    db.query(sql, [name, price, finalCategory, finalStock, imagePath], (err, result) => {
        if (err) {
            console.error("Add Product Database Error:", err);
            res.status(500).send("Database Error: " + err.message);
        } else {
            const productId = result.insertId;
            // Handle additional images (these remain as URLs for now as per instructions)
            let additionalImages = images;
            if (typeof images === 'string') {
                try {
                    additionalImages = JSON.parse(images);
                } catch (e) {
                    additionalImages = images.split(",").map(i => i.trim());
                }
            }

            if (additionalImages && Array.isArray(additionalImages) && additionalImages.length > 0) {
                const imgValues = additionalImages.map(img => [productId, img]);
                const imgSql = "INSERT INTO product_images (product_id, image_url) VALUES ?";
                db.query(imgSql, [imgValues], (imgErr) => {
                    if (imgErr) {
                        console.error("Error adding product images:", imgErr);
                    }
                    res.send("Product Added");
                });
            } else {
                res.send("Product Added");
            }
        }
    });
});


router.delete("/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

    const sql = "DELETE FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Delete Product Error:", err);
            res.status(500).send("Database Error");
        } else {
            res.json({ success: true, message: "Product Deleted" });
        }
    });
});

router.get("/products/:id", (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

    const sql = "SELECT * FROM products WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error("Fetch Product Error:", err);
            return res.status(500).send("Database Error");
        }

        if (result.length > 0) {
            const product = result[0];

            // Fetch additional images
            const imgSql = "SELECT image_url FROM product_images WHERE product_id = ?";
            db.query(imgSql, [id], (imgErr, imgResults) => {
                if (imgErr) {
                    console.error("Fetch Images Error:", imgErr);
                    return res.json(product);
                }

                // Main image first, then additional images
                const images = [];
                if (product.image) images.push(product.image);
                imgResults.forEach(row => {
                    if (row.image_url !== product.image) {
                        images.push(row.image_url);
                    }
                });

                product.images = images;

                // Track "view" event
                const trackSql = "INSERT INTO funnel_events (session_id, event_type, product_id) VALUES (?, ?, ?)";
                db.query(trackSql, [req.sessionId, "view", id], (err) => {
                    if (err) console.error("Funnel Tracking Error (view):", err.message);
                });

                res.json(product);
            });
        } else {
            res.status(404).send("Product not found");
        }
    });
});

router.put("/products/:id", upload.single("image"), (req, res) => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });

    const { name, price, category, image, images } = req.body;

    let imagePath = image;
    if (req.file) {
        imagePath = "/uploads/products/" + req.file.filename;
    }

    const sql = "UPDATE products SET name = ?, price = ?, category = ?, image = ? WHERE id = ?";

    db.query(sql, [name, price, category, imagePath, id], (err, result) => {
        if (err) {
            console.error("Update Product Error:", err);
            res.status(500).send("Database Error");
        } else {
            // Update additional images
            let additionalImages = images;
            if (typeof images === 'string') {
                try {
                    additionalImages = JSON.parse(images);
                } catch (e) {
                    additionalImages = images.split(",").map(i => i.trim());
                }
            }

            // 1. Delete existing
            db.query("DELETE FROM product_images WHERE product_id = ?", [id], (delErr) => {
                if (delErr) console.error("Error deleting product images:", delErr);

                // 2. Insert new
                if (additionalImages && Array.isArray(additionalImages) && additionalImages.length > 0) {
                    const imgValues = additionalImages.map(img => [id, img]);
                    const imgSql = "INSERT INTO product_images (product_id, image_url) VALUES ?";
                    db.query(imgSql, [imgValues], (imgErr) => {
                        if (imgErr) console.error("Error adding product images:", imgErr);
                        res.json({ success: true, message: "Product Updated" });
                    });
                } else {
                    res.json({ success: true, message: "Product Updated" });
                }
            });
        }
    });
});

router.put("/update-stock/:id", (req, res) => {
    const productId = parseInt(req.params.id, 10);
    if (isNaN(productId)) return res.status(400).json({ message: "Invalid product ID" });

    const { stock } = req.body;

    const sql = "UPDATE products SET stock = ? WHERE id = ?";
    db.query(sql, [stock, productId], (err, result) => {
        if (err) {
            console.error("Update Stock Error:", err);
            res.status(500).send("Database Error");
        } else {
            res.json({ success: true, message: "Stock Updated" });
        }
    });
});

module.exports = router;
