const jwt = require("jsonwebtoken");
require("dotenv").config();

const authentication = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    return res.status(401).send({ message: "Please login first" });
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (decoded) {
      const userId = decoded.userId;
      req.userId = userId;
      next();
    } else {
      return res.status(401).send({ message: "Invalid or expired token" });
    }
  });
};

module.exports = { authentication };
