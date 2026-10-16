
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).send({
        success: false,
        message: "Access is required",
      });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).send({
        success: false,
        message: "Access token is required",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_ACCESS_SECRET
    );

    req.user = decoded;

    next();

  } catch (error) {

    // Token expired
    if (error.name === "TokenExpiredError") {
      return res.status(401).send({
        success: false,
        message: "Access token expired",
      });
    }

    // Invalid token
    if (error.name === "JsonWebTokenError") {
      return res.status(401).send({
        success: false,
        message: "Invalid access token",
      });
    }

    console.log("Auth error:", error);

    return res.status(401).send({
      success: false,
      message: "Authentication failed",
    });
  }
}

module.exports = { authMiddleware };
