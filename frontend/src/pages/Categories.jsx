import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Categories.css";
import Footer from "../components/Footer";

function Categories() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/products")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.log("Error fetching products:", error);
      });
  }, []);

  const getCategoryImage = (category) => {
    const product = products.find((item) => item.category === category);

    return product ? `/productimage/${product.image}` : "";
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
            placeholder="Search categories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <span>🔍</span>
        </div>

      </div>


      <div className="category-grid">

        {filteredCategories.map((category) => (

          <Link
            key={category.name}
            to={`/category/${category.name}`}
            className="categories-card"
          >

            <img
              src={getCategoryImage(category.name)}
              alt={category.name}
            />

            <h3>
              {category.name === "Sports & Fitness"
                ? "Gym & Fitness"
                : category.name}
            </h3>

            <p>
              {category.description}
            </p>

          </Link>

        ))}

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