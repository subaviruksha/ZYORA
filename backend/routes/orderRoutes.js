const express = require("express");
const Order = require("../models/order.js");
const Product = require("../models/product.js");
const Cart = require("../models/cart.js");

const router = express.Router();


// Create Order
router.post("/", async (req, res) => {

    try {

        const {
            userId,
            deliveryAddress,
            items,
            totalAmount,
            paymentMethod,
            isBuyNow
        } = req.body;


        for (const item of items) {

            const product = await Product.findById(item.productId);

            if (!product) {

                return res.status(404).json({
                    message: "Product not found"
                });

            }


            if (product.stock < item.quantity) {

                return res.status(400).json({
                    message: `${product.productName} has only ${product.stock} item(s) available`
                });

            }

        }


        for (const item of items) {

            const product = await Product.findById(item.productId);

            product.stock -= item.quantity;

            await product.save();

        }


        const order = new Order({

            userId,

            deliveryAddress,

            items,

            totalAmount,

            paymentMethod

        });


        await order.save();


        if (!isBuyNow) {

            const cart = await Cart.findOne({ userId });

            if (cart) {

                cart.items = [];

                await cart.save();

            }

        }


        res.json({

            message: "Order created successfully",

            order

        });


    } catch (error) {

        console.log("Order Error:", error);

        res.status(500).json({

            message: "Error creating order",

            error: error.message

        });

    }

});


// Get All Orders for Admin
router.get("/admin/all", async (req, res) => {

    try {

        const orders = await Order.find()
            .populate("userId", "name email phone")
            .populate("items.productId")
            .sort({ createdAt: -1 });


        res.json(orders);


    } catch (error) {

        console.log("Admin Orders Error:", error);

        res.status(500).json({

            message: "Error fetching all orders",

            error: error.message

        });

    }

});


// Update Order Status by Admin
router.put("/admin/:orderId/status", async (req, res) => {

    try {

        const { orderStatus } = req.body;


        const order = await Order.findByIdAndUpdate(

            req.params.orderId,

            {
                orderStatus
            },

            {
                new: true
            }

        );


        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }


        res.json({

            message: "Order status updated successfully",

            order

        });


    } catch (error) {

        console.log("Update Order Status Error:", error);

        res.status(500).json({

            message: "Error updating order status",

            error: error.message

        });

    }

});


// Get Single Order
router.get("/single/:orderId", async (req, res) => {

    try {

        const order = await Order.findById(
            req.params.orderId
        ).populate("items.productId");


        if (!order) {

            return res.status(404).json({

                message: "Order not found"

            });

        }


        res.json(order);


    } catch (error) {

        console.log("Get Order Details Error:", error);

        res.status(500).json({

            message: "Error fetching order details",

            error: error.message

        });

    }

});


// Get User Orders
router.get("/:userId", async (req, res) => {

    try {

        const orders = await Order.find({

            userId: req.params.userId

        })
            .populate("items.productId")
            .sort({ createdAt: -1 });


        res.json(orders);


    } catch (error) {

        console.log("Get Orders Error:", error);

        res.status(500).json({

            message: "Error fetching orders",

            error: error.message

        });

    }

});


module.exports = router;