const jwt = require("jsonwebtoken");

const secretKey = process.env.JWT_SECRET || "your-secret-key";

exports.generateToken = (payload, expiresIn = "1d") => {
  return jwt.sign(payload, secretKey, { expiresIn });
};

exports.verifyToken = (token) => {
  return jwt.verify(token, secretKey);
};
