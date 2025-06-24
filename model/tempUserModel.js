// models/tempUserModel.js

const mongoose = require("mongoose");
const { type } = require("os");

const tempUserSchema = new mongoose.Schema({
    fullname: { type: String,},
    email: { 
        type: String, 
        required: true, 
        lowercase: true, // Always store emails lowercase
        // Ensure no duplicate temp signup per email
    },
    phone:{type:Number},
    password: { type: String, }, // Hashed password
    otp: { type: String,  },
    otpExpiry: { type: Date, required: true }, // Field to store OTP expiry time
    createdAt: { type: Date, default: Date.now } // For TTL index (optional)
});

// TTL Index (optional) → Auto delete document after 10 minutes
tempUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 600 }); // 10 minutes

module.exports = mongoose.model("TempUser", tempUserSchema);
