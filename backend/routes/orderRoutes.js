
const express = require("express");
const mongoose = require("mongoose");
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
            paymentMethod,
            isBuyNow
        } = req.body;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Valid user ID is required"
            });
        }

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({
                message: "Order items are required"
            });
        }

        // Check product availability and calculate total
        let calculatedTotal = 0;

        for (const item of items) {
            if (
                !mongoose.isValidObjectId(item.productId) ||
                !Number.isInteger(Number(item.quantity)) ||
                Number(item.quantity) <= 0
            ) {
                return res.status(400).json({
                    message: "Invalid product or quantity"
                });
            }

            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: "Product not found"
                });
            }

            if (product.stock < Number(item.quantity)) {
                return res.status(400).json({
                    message: `${product.productName} has only ${product.stock} item(s) available`
                });
            }

            calculatedTotal += product.price * Number(item.quantity);
        }

        calculatedTotal = Math.round(calculatedTotal * 100) / 100;

        // Count previous non-cancelled orders
        const previousOrdersCount = await Order.countDocuments({
            userId,
            orderStatus: { $ne: "Cancelled" }
        });

        let discount = 0;

        // First order: 10% discount
        if (previousOrdersCount === 0) {
            discount = Math.round(calculatedTotal * 10) / 100;
        }
        // Third, fifth, seventh, ninth orders, etc.: 5% discount
        else if (
            previousOrdersCount >= 2 &&
            previousOrdersCount % 2 === 0
        ) {
            discount = Math.round(calculatedTotal * 5) / 100;
        }

        // Calculate final amount
        const finalAmount = Math.max(
            0,
            Math.round((calculatedTotal - discount) * 100) / 100
        );

        // Reduce product stock
        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (product.stock < Number(item.quantity)) {
                return res.status(400).json({
                    message: `${product.productName} no longer has enough stock`
                });
            }

            product.stock -= Number(item.quantity);
            await product.save();
        }

        // Save order with discount details
        const order = new Order({
            userId,
            deliveryAddress,
            items: items.map((item) => ({
                productId: item.productId,
                quantity: Number(item.quantity),
                price: item.price
            })),
            originalAmount: calculatedTotal,
            discount,
            totalAmount: finalAmount,
            paymentMethod: paymentMethod || "cod"
        });

        await order.save();

        // Clear cart except for Buy Now orders
        if (!isBuyNow) {
            const cart = await Cart.findOne({ userId });

            if (cart) {
                cart.items = [];
                await cart.save();
            }
        }

        res.json({
            message: "Order created successfully",
            order,
            originalAmount: calculatedTotal,
            discount,
            discountApplied: discount > 0
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

// Get Cancelled Orders for Admin
router.get("/admin/cancelled", async (req, res) => {
    try {
        const orders = await Order.find({
            orderStatus: "Cancelled"
        })
            .populate("userId", "name email phone")
            .populate("items.productId")
            .sort({ createdAt: -1 });

        res.json(orders);

    } catch (error) {
        console.log("Cancelled Orders Error:", error);

        res.status(500).json({
            message: "Error fetching cancelled orders",
            error: error.message
        });
    }
});

// Update Order Status by Admin
router.put("/admin/:orderId/status", async (req, res) => {
    try {
        const orderStatus = req.body.orderStatus;

        const allowedStatuses = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered"
        ];

        if (
            typeof orderStatus !== "string" ||
            !allowedStatuses.includes(orderStatus)
        ) {
            return res.status(400).json({
                message: `Invalid order status received: ${JSON.stringify(orderStatus)}`,
                allowedStatuses
            });
        }

        if (!mongoose.isValidObjectId(req.params.orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        const order = await Order.findById(req.params.orderId);

        if (!order) {
            return res.status(404).json({
                message: "Order not found"
            });
        }

        if (order.orderStatus === "Cancelled") {
            return res.status(400).json({
                message: "Cancelled orders cannot be updated"
            });
        }

        if (order.orderStatus === "Delivered") {
            return res.status(400).json({
                message: "Delivered orders cannot be updated"
            });
        }

        const statusOrder = [
            "Pending",
            "Processing",
            "Shipped",
            "Delivered"
        ];

        const currentStatus =
            order.orderStatus === "Confirmed"
                ? "Processing"
                : order.orderStatus;

        if (
            !statusOrder.includes(currentStatus) ||
            statusOrder.indexOf(orderStatus) <
            statusOrder.indexOf(currentStatus)
        ) {
            return res.status(400).json({
                message: "Order status cannot move backwards"
            });
        }

        order.orderStatus = orderStatus;
        await order.save();

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

// Cancel Order by Customer
router.put("/cancel/:orderId", async (req, res) => {
    const session = await mongoose.startSession();

    try {
        const { userId } = req.body;

        if (!userId || !mongoose.isValidObjectId(userId)) {
            return res.status(400).json({
                message: "Valid user ID is required"
            });
        }

        if (!mongoose.isValidObjectId(req.params.orderId)) {
            return res.status(400).json({
                message: "Invalid order ID"
            });
        }

        let cancelledOrder;

        await session.withTransaction(async () => {
            const order = await Order.findOne({
                _id: req.params.orderId,
                userId
            }).session(session);

            if (!order) {
                throw {
                    status: 404,
                    message: "Order not found"
                };
            }

            if (order.orderStatus === "Cancelled") {
                throw {
                    status: 400,
                    message: "Order is already cancelled"
                };
            }

            const cancellableStatuses = [
                "Pending",
                "Processing",
                "Confirmed"
            ];

            if (!cancellableStatuses.includes(order.orderStatus)) {
                throw {
                    status: 400,
                    message: "This order can no longer be cancelled"
                };
            }

            const updated = await Order.updateOne(
                {
                    _id: order._id,
                    userId,
                    orderStatus: order.orderStatus
                },
                {
                    $set: {
                        orderStatus: "Cancelled"
                    }
                },
                { session }
            );

            if (updated.modifiedCount !== 1) {
                throw {
                    status: 409,
                    message: "Order status changed. Please refresh."
                };
            }

            for (const item of order.items) {
                await Product.updateOne(
                    { _id: item.productId },
                    {
                        $inc: {
                            stock: item.quantity
                        }
                    },
                    { session }
                );
            }

            cancelledOrder = order;
            cancelledOrder.orderStatus = "Cancelled";
        });

        res.json({
            message: "Order cancelled successfully",
            order: cancelledOrder
        });

    } catch (error) {
        console.log("Cancel Order Error:", error);

        res.status(error.status || 500).json({
            message: error.status
                ? error.message
                : "Error cancelling order"
        });

    } finally {
        await session.endSession();
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
