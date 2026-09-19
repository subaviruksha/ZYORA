const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    productName: String,
    category: String,
    brand: String,
    price: Number,
    oldPrice: Number,
    discount: Number,
    image: String,
    shortDescription: String,
    fullDescription: String,
    rating: Number,
    stock: Number,
    color: String,
    storage: String,
    ram: String,
    productHighlights: String,
    specifications: String,
    availability: String
});

module.exports = mongoose.model("Product", productSchema);