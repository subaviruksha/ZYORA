const express = require("express");
const User = require("../models/user.js");
const Admin = require("../models/admin/admin.js");

const router = express.Router();

router.post("/register", async (req, res) => {

    try {

        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(400).json({
                message: "Email already registered"
            });
        }

        const newUser = new User({
            name,
            email,
            password,
            role: "user"
        });

        await newUser.save();

        res.status(201).json({
            message: "Account created successfully"
        });

    } catch (error) {

        console.log("Register Error:", error);

        res.status(500).json({
            message: "Error creating account"
        });

    }

});
router.post("/login", async (req, res) => {

    try {

        const {
            email,
            password,
            role
        } = req.body;

        let account;

        if (role === "admin") {

            account = await Admin.findOne({
                email,
                password
            });

        } else {

            account = await User.findOne({
                email,
                password,
                role: "user"
            });

        }

        if (!account) {

            return res.status(401).json({
                message: "Invalid email, password or login type"
            });

        }

        res.json({
            message: "Login successful",
            userId: account._id,
            role: role,
            name: account.name,
            email: account.email
        });

    } catch (error) {

        console.log("Login Error:", error);

        res.status(500).json({
            message: "Error during login"
        });

    }

});
router.get("/profile/:userId", async (req, res) => {

    try {

        const user = await User.findById(req.params.userId)
            .select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json(user);

    } catch (error) {

        console.log("Profile Error:", error);

        res.status(500).json({
            message: "Error fetching profile",
            error: error.message
        });

    }

});

router.put("/profile/:userId", async (req, res) => {

    try {

        const { name, email } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            {
                name,
                email
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            message: "Profile updated successfully",
            user
        });

    } catch (error) {

        console.log("Update Profile Error:", error);

        res.status(500).json({
            message: "Error updating profile",
            error: error.message
        });

    }

});

router.put("/address/:userId", async (req, res) => {

    try {

        const {
            phone,
            address,
            city,
            state,
            pincode
        } = req.body;

        const user = await User.findByIdAndUpdate(
            req.params.userId,
            {
                phone,
                address: {
                    address,
                    city,
                    state,
                    pincode
                }
            },
            {
                new: true
            }
        ).select("-password");

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        res.json({
            message: "Address saved successfully",
            user
        });

    } catch (error) {

        console.log("Address Error:", error);

        res.status(500).json({
            message: "Error saving address",
            error: error.message
        });

    }

});

router.put("/change-password/:userId", async (req, res) => {
    try {
        const {
            currentPassword,
            newPassword
        } = req.body;

        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (user.password !== currentPassword) {
            return res.status(400).json({
                message: "Current password is incorrect"
            });
        }

        if (user.password === newPassword) {
            return res.status(400).json({
                message: "New password must be different from current password"
            });
        }

        if (!newPassword || newPassword.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        user.password = newPassword;

        await user.save();

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.log("Change Password Error:", error);

        res.status(500).json({
            message: "Error changing password",
            error: error.message
        });
    }
});

module.exports = router;