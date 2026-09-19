
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminAddProduct.css";

function AdminAddProduct() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productName: "",
        category: "",
        brand: "",
        price: "",
        oldPrice: "",
        discount: "",
        image: "",
        shortDescription: "",
        fullDescription: "",
        rating: "",
        stock: "",
        color: "",
        storage: "",
        ram: "",
        productHighlights: "",
        specifications: "",
        availability: ""
    });

    const [imageFile, setImageFile] = useState(null);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {

            const data = new FormData();

            data.append("productName", formData.productName);
            data.append("category", formData.category);
            data.append("brand", formData.brand);
            data.append("price", formData.price);
            data.append("oldPrice", formData.oldPrice);
            data.append("discount", formData.discount);
            data.append("shortDescription", formData.shortDescription);
            data.append("fullDescription", formData.fullDescription);
            data.append("rating", formData.rating);
            data.append("stock", formData.stock);
            data.append("color", formData.color);
            data.append("storage", formData.storage);
            data.append("ram", formData.ram);
            data.append("productHighlights", formData.productHighlights);
            data.append("specifications", formData.specifications);
            data.append("availability", formData.availability);

            if (imageFile) {
                data.append("image", imageFile);
            }

            const response = await fetch(
                "http://localhost:5000/api/products",
                {
                    method: "POST",
                    body: data
                }
            );

            const result = await response.json();

            if (response.ok) {

                alert("Product added successfully");

                navigate("/admin/products");

            } else {

                alert(
                    result.message ||
                    "Error adding product"
                );

            }

        } catch (error) {

            console.log("Add Product Error:", error);

            alert("Unable to connect to the server");

        }
    };


    return (

        <div className="admin-add-product-page">

            <div className="admin-add-product-header">

                <div>
                    <p className="admin-brand">
                        ZYORA
                    </p>

                    <h1>
                        Add Product
                    </h1>

                    <p>
                        Add a new product to your store.
                    </p>
                </div>

                <button
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    Back to Products
                </button>

            </div>


            <div className="admin-add-product-container">

                <form
                    className="admin-add-product-form"
                    onSubmit={handleSubmit}
                >

                    <div className="form-section">

                        <h2>
                            Basic Information
                        </h2>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Product Name</label>

                                <input
                                    type="text"
                                    name="productName"
                                    value={formData.productName}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Category</label>

                                <input
                                    type="text"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Brand</label>

                                <input
                                    type="text"
                                    name="brand"
                                    value={formData.brand}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Product Image</label>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) =>
                                        setImageFile(e.target.files[0])
                                    }
                                    required
                                />
                            </div>

                        </div>

                    </div>


                    <div className="form-section">

                        <h2>
                            Price & Stock
                        </h2>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Price</label>

                                <input
                                    type="number"
                                    name="price"
                                    value={formData.price}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Old Price</label>

                                <input
                                    type="number"
                                    name="oldPrice"
                                    value={formData.oldPrice}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Discount (%)</label>

                                <input
                                    type="number"
                                    name="discount"
                                    value={formData.discount}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Rating</label>

                                <input
                                    type="number"
                                    name="rating"
                                    value={formData.rating}
                                    onChange={handleChange}
                                    step="0.1"
                                    min="0"
                                    max="5"
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Stock</label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    required
                                />
                            </div>


                            <div className="form-group">
                                <label>Availability</label>

                                <input
                                    type="text"
                                    name="availability"
                                    value={formData.availability}
                                    onChange={handleChange}
                                    placeholder="In Stock"
                                    required
                                />
                            </div>

                        </div>

                    </div>


                    <div className="form-section">

                        <h2>
                            Product Details
                        </h2>

                        <div className="form-grid">

                            <div className="form-group">
                                <label>Color</label>

                                <input
                                    type="text"
                                    name="color"
                                    value={formData.color}
                                    onChange={handleChange}
                                />
                            </div>


                            <div className="form-group">
                                <label>Storage</label>

                                <input
                                    type="text"
                                    name="storage"
                                    value={formData.storage}
                                    onChange={handleChange}
                                    placeholder="128GB"
                                />
                            </div>


                            <div className="form-group">
                                <label>RAM</label>

                                <input
                                    type="text"
                                    name="ram"
                                    value={formData.ram}
                                    onChange={handleChange}
                                    placeholder="8GB"
                                />
                            </div>

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Short Description
                            </label>

                            <textarea
                                name="shortDescription"
                                value={formData.shortDescription}
                                onChange={handleChange}
                                rows="3"
                                required
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Full Description
                            </label>

                            <textarea
                                name="fullDescription"
                                value={formData.fullDescription}
                                onChange={handleChange}
                                rows="5"
                                required
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Product Highlights
                            </label>

                            <textarea
                                name="productHighlights"
                                value={formData.productHighlights}
                                onChange={handleChange}
                                rows="4"
                            />

                        </div>


                        <div className="form-group full-width">

                            <label>
                                Specifications
                            </label>

                            <textarea
                                name="specifications"
                                value={formData.specifications}
                                onChange={handleChange}
                                rows="4"
                            />

                        </div>

                    </div>


                    <div className="form-actions">

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/admin/products")
                            }
                        >
                            Cancel
                        </button>

                        <button type="submit">
                            Add Product
                        </button>

                    </div>

                </form>

            </div>

        </div>

    );
}

export default AdminAddProduct;
