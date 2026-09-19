import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./AdminEditProducts.css";

function AdminEditProduct() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {

        const role = localStorage.getItem("role");

        if (role !== "admin") {
            navigate("/login");
            return;
        }

        const fetchProduct = async () => {

            try {

                const response = await fetch(
                    `http://localhost:5000/api/products/${id}`
                );

                const data = await response.json();

                if (response.ok) {

                    setProduct(data);
                    setPrice(data.price);
                    setStock(data.stock);

                } else {

                    alert("Product not found");
                    navigate("/admin/products");

                }

            } catch (error) {

                console.log("Product Error:", error);
                alert("Unable to load product");

                navigate("/admin/products");

            } finally {

                setLoading(false);

            }

        };

        fetchProduct();

    }, [id, navigate]);


    const handleSave = async (e) => {

        e.preventDefault();

        setSaving(true);

        try {

            const response = await fetch(
                `http://localhost:5000/api/products/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        price: Number(price),
                        stock: Number(stock)
                    })
                }
            );

            const data = await response.json();

            if (response.ok) {

                alert("Product updated successfully");

                navigate("/admin/products");

            } else {

                alert(
                    data.message ||
                    "Error updating product"
                );

            }

        } catch (error) {

            console.log("Update Error:", error);

            alert("Unable to update product");

        } finally {

            setSaving(false);

        }

    };


    if (loading) {

        return (
            <div className="admin-loading">
                Loading Product...
            </div>
        );

    }


    return (

        <div className="admin-edit-page">

            <div className="admin-edit-header">

                <div>

                    <p className="admin-brand">
                        ZYORA
                    </p>

                    <h1>
                        Edit Product
                    </h1>

                    <p>
                        Update the price and stock of this product.
                    </p>

                </div>

                <button
                    className="back-button"
                    onClick={() =>
                        navigate("/admin/products")
                    }
                >
                    Back to Products
                </button>

            </div>


            <div className="admin-edit-container">

                <form
                    className="edit-product-card"
                    onSubmit={handleSave}
                >

                    <div className="edit-product-image">

                        <img
                            src={`/productimage/${product.image}`}
                            alt={product.productName}
                        />

                    </div>


                    <div className="edit-product-details">

                        <p className="edit-category">
                            {product.category}
                        </p>

                        <h2>
                            {product.productName}
                        </h2>

                        <p className="edit-brand">
                            Brand: {product.brand}
                        </p>


                        <div className="edit-form">

                            <div className="form-group">

                                <label>
                                    Price
                                </label>

                                <input
                                    type="number"
                                    value={price}
                                    onChange={(e) =>
                                        setPrice(e.target.value)
                                    }
                                    min="0"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    value={stock}
                                    onChange={(e) =>
                                        setStock(e.target.value)
                                    }
                                    min="0"
                                    required
                                />

                            </div>

                        </div>


                        <div className="edit-buttons">

                            <button
                                type="button"
                                className="cancel-button"
                                onClick={() =>
                                    navigate("/admin/products")
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }
                            </button>

                        </div>

                    </div>

                </form>

            </div>

        </div>

    );

}

export default AdminEditProduct;