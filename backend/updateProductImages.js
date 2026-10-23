
require("dotenv").config();

const mongoose = require("mongoose");
const { v2: cloudinary } = require("cloudinary");
const Product = require("./models/product.js");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Keep this false until every match is checked.
const APPLY_CHANGES = true;

const normalize = (filename) =>
    String(filename || "")
        .replace(/\\/g, "/")
        .split("/")
        .pop()
        .replace(/\.[^.]+$/, "")
        .toLowerCase()
        .replace(/[\s_-]+/g, "");

async function getCloudinaryImages() {
    const images = new Map();
    let nextCursor;

    do {
        const result = await cloudinary.api.resources({
            type: "upload",
            max_results: 500,
            ...(nextCursor ? { next_cursor: nextCursor } : {})
        });

        for (const image of result.resources) {
            // Ignore Cloudinary's built-in sample images.
            if (
                image.public_id.startsWith("samples/") ||
                image.public_id.startsWith("cld-sample") ||
                image.public_id === "sample"
            ) {
                continue;
            }

            const key = normalize(image.public_id);

            // Keep exact filename matches only.
            if (!images.has(key)) {
                images.set(key, image.secure_url);
            }
        }

        nextCursor = result.next_cursor;
    } while (nextCursor);

    return images;
}

async function updateProductImages() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("MongoDB connected");

        const cloudinaryImages = await getCloudinaryImages();
        console.log("Cloudinary product-like images:", cloudinaryImages.size);

        const products = await Product.find();
        let matched = 0;
        let unmatched = 0;
        let alreadyUrl = 0;

        const changes = [];

        for (const product of products) {
            const currentImage = String(product.image || "");

            if (/^https?:\/\//i.test(currentImage)) {
                alreadyUrl++;
                console.log("ALREADY URL:", product.name, currentImage);
                continue;
            }

            const key = normalize(currentImage);
            const cloudinaryUrl = cloudinaryImages.get(key);

            if (!cloudinaryUrl) {
                unmatched++;
                console.log(
                    "NO MATCH:",
                    product.name,
                    "—",
                    currentImage
                );
                continue;
            }

            matched++;
            changes.push({ product, cloudinaryUrl });

            console.log("MATCH:", product.name, "→", cloudinaryUrl);
        }

        console.log("\n--- SUMMARY ---");
        console.log("Products checked:", products.length);
        console.log("Matched:", matched);
        console.log("Unmatched:", unmatched);
        console.log("Already using URL:", alreadyUrl);
        console.log("Changes applied:", APPLY_CHANGES);

        if (APPLY_CHANGES) {
            for (const { product, cloudinaryUrl } of changes) {
                product.image = cloudinaryUrl;
                await product.save();
            }

            console.log("MongoDB image updates completed.");
        } else {
            console.log("PREVIEW ONLY: MongoDB was not changed.");
        }
    } catch (error) {
        console.error("Migration error:", error.message);
    } finally {
        await mongoose.disconnect();
    }
}

updateProductImages();
