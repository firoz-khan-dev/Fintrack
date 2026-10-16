const express = require("express");
const routes = express.Router();

const {contactMessage,getAllContactMessage, deleteContactMessage,} = require("../controllers/contactController");
const { authMiddleware } = require("../middleware/authMiddleware");
const { adminMiddleware } = require("../middleware/adminMiddleware");

routes.post("/send", contactMessage);
routes.get("/getAll",authMiddleware,adminMiddleware,getAllContactMessage);
routes.delete("/delete/:id",authMiddleware,adminMiddleware,deleteContactMessage);

module.exports = routes;