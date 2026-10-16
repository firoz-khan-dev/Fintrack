const express = require("express");
const routes = express.Router();

const { getExpenseChart } = require("../controllers/charCsvController");

routes.get("/chartExpense", getExpenseChart);

module.exports = routes;