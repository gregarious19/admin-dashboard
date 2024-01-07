const jwt = require("jsonwebtoken");
const verifyToken = (req, res, next) => {
  const token = req.headers.authorization;
  // console.log(token);
  // return next();

  if (!token) {
    return res.status(401).json({ error: "Unauthorized - Token not provided" });
  }

  jwt.verify(token, "plk4bds7dthd3i7y3e893hed38hd983", (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized - Invalid token" });
    }

    req.userId = decoded.userId;
    // console.log(req.userId);
    next();
  });
};

module.exports = verifyToken;
