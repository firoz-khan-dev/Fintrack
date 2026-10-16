const express = require("express");
const routes = express.Router();

const {getAllMonthlyExpenses,getTotalIncome,getTotalExpense,Balance,getCategories,getAllMonthlyIncome,} = require("../controllers/expenseController");

const { authMiddleware } = require("../middleware/authMiddleware");

routes.get("/monthlyExpenses", authMiddleware, getAllMonthlyExpenses);
routes.get("/totalIncome", authMiddleware, getTotalIncome);
routes.get("/totalExpense", authMiddleware, getTotalExpense);
routes.get("/balance", authMiddleware, Balance);
routes.get("/categories", authMiddleware, getCategories);
routes.get("/monthlyIncome", authMiddleware, getAllMonthlyIncome);

module.exports = routes;

