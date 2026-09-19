const express = require("express");
const Product = require("../models/product.js");
const Order = require("../models/order.js");
const User = require("../models/user.js");

const router = express.Router();

router.get("/dashboard", async (req, res) => {

    try {

        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalUsers = await User.countDocuments({
            role: "user"
        });

        const pendingOrders = await Order.countDocuments({
            status: "Pending"
        });

        res.json({
            totalProducts,
            totalOrders,
            totalUsers,
            pendingOrders
        });

    } catch (error) {

        console.log("Admin Dashboard Error:", error);

        res.status(500).json({
            message: "Error loading admin dashboard"
        });

    }

});

// Get All Users
router.get("/users", async (req, res) => {
    try {
        const users = await User.find({ role: "user" })
            .select("-password")
            .sort({ _id: -1 });

        res.json(users);

    } catch (error) {
        console.log("Admin Users Error:", error);

        res.status(500).json({
            message: "Error fetching users",
            error: error.message
        });
    }
});

module.exports = router;