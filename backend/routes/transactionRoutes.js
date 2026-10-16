const express = require("express");
const routes = express.Router();
const { addTransaction,getAllTransactions, deleteTransaction, updateTransaction} = require("../controllers/transactionController");
const {authMiddleware} = require("../middleware/authMiddleware")

routes.post("/add", authMiddleware, addTransaction);
routes.get("/getAll",authMiddleware, getAllTransactions);
routes.delete("/delete/:id",authMiddleware, deleteTransaction);
routes.put("/update/:id",authMiddleware, updateTransaction)

module.exports = routes;
