const express = require("express");
const Product = require("../models/product.js");
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const { v2: cloudinary } = require("cloudinary");

const router = express.Router();


cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});


const storage = new CloudinaryStorage({

    cloudinary: cloudinary,

    params: {
        folder: "zyora-products",
        allowed_formats: ["jpg", "jpeg", "png", "webp"]
    }

});


const upload = multer({ storage });


router.get("/", async (_req, res) => {

    try {

        const products = await Product.find();

        res.json(products);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching products"
        });

    }

});


router.get("/:id", async (req, res) => {

    try {

        const product = await Product.findById(req.params.id);

        res.json(product);

    } catch (error) {

        res.status(500).json({
            message: "Error fetching product"
        });

    }

});


router.put("/:id", async (req, res) => {

    try {

        const { price, stock } = req.body;

        const product = await Product.findByIdAndUpdate(

            req.params.id,

            {
                price,
                stock
            },

            { new: true }

        );


        if (!product) {

            return res.status(404).json({
                message: "Product not found"
            });

        }


        res.json({

            message: "Product updated successfully",

            product

        });


    } catch (error) {

        console.log(
            "Update Product Error:",
            error
        );


        res.status(500).json({
            message: "Error updating product"
        });

    }

});


router.post(
    "/",
    upload.single("image"),
    async (req, res) => {

        try {

            const product = new Product({

                ...req.body,

                image: req.file
                    ? req.file.path
                    : ""

            });


            await product.save();


            res.status(201).json({

                message: "Product added successfully",

                product

            });


        } catch (error) {

            console.log(
                "Add Product Error:",
                error
            );


            res.status(500).json({

                message: "Error adding product",

                error: error.message

            });

        }

    }
);


module.exports = router;