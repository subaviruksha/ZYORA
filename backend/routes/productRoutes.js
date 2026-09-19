const express = require("express");
const Product = require("../models/product.js");
const multer = require("multer");
const path = require("path");

const router = express.Router();


const storage = multer.diskStorage({

    destination: (req, file, cb) => {

        cb(null, "productimage/");

    },


    filename: (req, file, cb) => {

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

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
                    ? req.file.filename
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