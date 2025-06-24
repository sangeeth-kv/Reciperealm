const jwt = require("jsonwebtoken");

const protect = (req, res, next) => {
  const token = req.cookies.accessToken;
  if (!token) return res.redirect("/login");

  try {
    const decoded = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.redirect("/refresh");
  }
};

module.exports = protect;
