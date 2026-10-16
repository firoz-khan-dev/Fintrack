function adminMiddleware(req, res, next) {
  try {
    if (req.user.role !== "admin") {
      return res.status(403).send({
        success: false,
        message: "Admin access required",
      });
    }

    next();
  } catch (error) {
    console.log(error);

    return res.status(403).send({
      success: false,
      message: "Admin access required",
    });
  }
}

module.exports = { adminMiddleware };