const express = require("express");

const routes = express.Router();

const {
  addActivity,
  getAllActivities,
  deleteActivity,
} = require("../controllers/activityController");

const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

routes.post("/add", authMiddleware, addActivity);

routes.get("/getAll", authMiddleware, adminMiddleware, getAllActivities);

routes.delete("/delete/:id", authMiddleware, adminMiddleware, deleteActivity);

module.exports = routes;
