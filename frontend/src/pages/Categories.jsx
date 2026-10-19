
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Categories.css";
import Footer from "../components/Footer";

const backendUrl = "https://zyora-backend-rhv6.onrender.com";

function Categories() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch(`${backendUrl}/api/products`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        setProducts(Array.isArray(data) ? data : []);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, []);

  const getCategoryImage = (category) => {
    const product = products.find(
      (item) =>
        item.category?.trim().toLowerCase() ===
          category.trim().toLowerCase() &&
        item.image
    );

    if (!product) return "";

    const image = product.image.trim();

    if (
      image.startsWith("http://") ||
      image.startsWith("https://") ||
      image.startsWith("data:")
    ) {
      return image;
    }

    if (image.startsWith("/productimage/")) {
      return `${backendUrl}${image}`;
    }

    return `${backendUrl}/productimage/${image}`;
  };

  const categories = [
    {
      name: "Mobiles",
      description: "Smartphones and accessories"
    },
    {
      name: "Laptops",
      description: "Laptops and computers"
    },
    {
      name: "Electronics",
      description: "Gadgets and electronic products"
    },
    {
      name: "Men's Fashion",
      description: "Clothing and accessories"
    },
    {
      name: "Women's Fashion",
      description: "Clothing and accessories"
    },
    {
      name: "Toys",
      description: "Fun and educational toys"
    },
    {
      name: "Home & Kitchen",
      description: "Home and kitchen essentials"
    },
    {
      name: "Stationery",
      description: "School and office essentials"
    },
    {
      name: "Sports & Fitness",
      description: "Fitness and workout essentials"
    },
    {
      name: "Beauty",
      description: "Beauty and personal care"
    }
  ];

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="categories-page">
      <div className="categories-header">
        <p>EXPLORE ZYORA</p>

        <h1>Shop by Category</h1>

        <span>
          Find everything you need in one place.
        </span>

        <div className="category-search">
          <input
            type="text"
            id="categorySearch"
            name="categorySearch"
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span>🔍</span>
        </div>
      </div>

      <div className="category-grid">
        {filteredCategories.map((category) => {
          const imageUrl = getCategoryImage(category.name);

          return (
            <Link
              key={category.name}
              to={`/category/${encodeURIComponent(category.name)}`}
              className="categories-card"
            >
              {imageUrl ? (
                <img
                  src={imageUrl}
                  alt={category.name}
                  onError={(e) => {
                    console.log("Image failed:", imageUrl);
                    e.currentTarget.style.display = "none";
                  }}
                />
              ) : (
                <div className="categoryplaceholder">
                  No Image Available
                </div>
              )}

              <h3>
                {category.name === "Sports & Fitness"
                  ? "Gym & Fitness"
                  : category.name}
              </h3>

              <p>{category.description}</p>
            </Link>
          );
        })}
      </div>

      {filteredCategories.length === 0 && (
        <p className="no-category">
          No categories found.
        </p>
      )}

      <Footer />
    </div>
  );
}

export default Categories;
