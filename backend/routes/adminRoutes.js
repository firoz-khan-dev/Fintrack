const express = require("express");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");
const routes = express.Router();
const {getAllUsers,getSingleUser,updateUser,deleteUser,getAdminOverview,} = require("../controllers/adminController")


routes.get("/users",authMiddleware,adminMiddleware,getAllUsers);
routes.get("/users/:id",authMiddleware,adminMiddleware,getSingleUser);
routes.put("/users/update/:id",authMiddleware,adminMiddleware,updateUser);
routes.delete("/users/delete/:id",authMiddleware,adminMiddleware,deleteUser);
routes.get("/overview",authMiddleware,adminMiddleware,getAdminOverview);

module.exports = routes;