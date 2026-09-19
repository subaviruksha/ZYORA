const express = require("express");
const Cart = require("../models/cart.js");

const router = express.Router();


router.post("/", async (req, res) => {

    try {

        const { userId, productId } = req.body;

        let cart = await Cart.findOne({ userId });

        if (!cart) {

            cart = new Cart({
                userId,
                items: [
                    {
                        productId,
                        quantity: 1
                    }
                ]
            });

        } else {

            const existingProduct = cart.items.find(
                (item) => item.productId.toString() === productId
            );

            if (existingProduct) {

                existingProduct.quantity += 1;

            } else {

                cart.items.push({
                    productId,
                    quantity: 1
                });

            }

        }

        await cart.save();

        res.json({
            message: "Product added to cart",
            cart
        });

    } catch (error) {

        console.log("Cart Error:", error);

        res.status(500).json({
            message: "Error adding product to cart",
            error: error.message
        });

    }

});


router.get("/:userId", async (req, res) => {

    try {

        const cart = await Cart.findOne({
            userId: req.params.userId
        }).populate("items.productId");

        if (!cart) {

            return res.json({
                items: []
            });

        }

        res.json(cart);

    } catch (error) {

        console.log("Cart Fetch Error:", error);

        res.status(500).json({
            message: "Error fetching cart",
            error: error.message
        });

    }

});


router.put("/:userId/increase", async (req, res) => {

    try {

        const { productId } = req.body;

        const cart = await Cart.findOne({
            userId: req.params.userId
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!item) {

            return res.status(404).json({
                message: "Product not found in cart"
            });

        }

        item.quantity += 1;

        await cart.save();

        const updatedCart = await Cart.findOne({
            userId: req.params.userId
        }).populate("items.productId");

        res.json(updatedCart);

    } catch (error) {

        console.log("Increase Quantity Error:", error);

        res.status(500).json({
            message: "Error increasing quantity",
            error: error.message
        });

    }

});


router.put("/:userId/decrease", async (req, res) => {

    try {

        const { productId } = req.body;

        const cart = await Cart.findOne({
            userId: req.params.userId
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        const item = cart.items.find(
            (item) => item.productId.toString() === productId
        );

        if (!item) {

            return res.status(404).json({
                message: "Product not found in cart"
            });

        }

        if (item.quantity > 1) {

            item.quantity -= 1;

        } else {

            cart.items = cart.items.filter(
                (item) => item.productId.toString() !== productId
            );

        }

        await cart.save();

        const updatedCart = await Cart.findOne({
            userId: req.params.userId
        }).populate("items.productId");

        res.json(updatedCart);

    } catch (error) {

        console.log("Decrease Quantity Error:", error);

        res.status(500).json({
            message: "Error decreasing quantity",
            error: error.message
        });

    }

});


router.delete("/:userId/remove", async (req, res) => {

    try {

        const { productId } = req.body;

        const cart = await Cart.findOne({
            userId: req.params.userId
        });

        if (!cart) {

            return res.status(404).json({
                message: "Cart not found"
            });

        }

        cart.items = cart.items.filter(
            (item) => item.productId.toString() !== productId
        );

        await cart.save();

        const updatedCart = await Cart.findOne({
            userId: req.params.userId
        }).populate("items.productId");

        res.json(updatedCart);

    } catch (error) {

        console.log("Remove Product Error:", error);

        res.status(500).json({
            message: "Error removing product",
            error: error.message
        });

    }

});


module.exports = router;