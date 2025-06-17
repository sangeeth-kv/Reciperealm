// services/jwtService.js

const jwt = require("jsonwebtoken");

// Create JWT Token
function signToken(payload, expiresIn = "10m") {
    return jwt.sign(payload, process.env.JWT_ACCESS_SECRET, { expiresIn });
}

// Verify JWT Token
function verifyToken(token) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET);
}

module.exports = {
    signToken,
    verifyToken,
};
