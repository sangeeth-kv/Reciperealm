const jwt = require("jsonwebtoken");
const generateTokens = require("../utils/generateToken");
const userSchema=require("../model/userModel")

exports.refreshToken = async (req, res) => {
  const token = req.cookies.refreshToken;
  if (!token) return res.status(401).send("No refresh token");

  try {
    const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
    const user = await userSchema.findById(decoded.userId);
    if (!user || user.refreshToken !== token) {
      return res.status(403).send("Invalid refresh token");
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(user);
    user.refreshToken = newRefreshToken;
    await user.save();

    res
      .cookie("accessToken", accessToken, { httpOnly: true, maxAge: 15 * 60 * 1000 })
      .cookie("refreshToken", newRefreshToken, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000 })
      .redirect("/dashboard");
  } catch (err) {
    res.status(403).send("Expired refresh token");
  }
};