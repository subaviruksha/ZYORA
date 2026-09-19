const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    phone: String,

    address: {
        address: String,
        city: String,
        state: String,
        pincode: String
    },

    password: String,

    role: {
        type: String,
        default: "user"
    }
});

module.exports = mongoose.model("User", userSchema);