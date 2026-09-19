const XLSX = require("xlsx");
const Product = require("../models/product.js");

const workbook = XLSX.readFile("./products.xlsx");
const sheet = workbook.Sheets[workbook.SheetNames[0]];

const products = XLSX.utils.sheet_to_json(sheet);

async function importProducts() {
    try {

        await Product.deleteMany({});

        const formattedProducts = products.map((product) => ({
            productName: product["Product Name"],
            category: product["Category"],
            brand: product["Brand"],
            price: product["Price"],
            oldPrice: product["Old Price"],
            discount: Number(product["Discount"]) <= 1
    ? Math.round(Number(product["Discount"]) * 100)
    : Math.round(Number(product["Discount"])),
            image: product["Image"],
            shortDescription: product["Short Description"],
            fullDescription: product["Full Description"],
            rating: product["Rating"],
            stock: product["Stock"],
            color: product["Color"],
            storage: product["Storage"],
            ram: product["RAM"],
            productHighlights: product["Product Highlights"],
            specifications: product["Specifications"],
            availability: product["Availability"]
        }));

        await Product.insertMany(formattedProducts);

        console.log(
            formattedProducts.length + " products imported successfully"
        );

    } catch (error) {
        console.log("Import error:", error);
    }
}

module.exports = importProducts;