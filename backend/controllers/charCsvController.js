const transaction = require("../models/transactionModel");

// expense chart
async function getExpenseChart(req, res) {
  try {
    const expense = await transaction.find({
      type: "expense",
    });

    const chartData = {};

    expense.forEach((item) => {
      if (chartData[item.category]) {
        chartData[item.category] = chartData[item.category] + item.amount;
      } else {
        chartData[item.category] = item.amount;
      }
    });

    res.status(200).send({
      success: true,
      message: "Expense chart data get successfully",
      chartData,
    });
  } catch (error) {
    console.log("Expense chart error:", error);

    res.status(500).send({
      success: false,
      message: "Expense chart data not get",
      error: error.message,
    });
  }
}

module.exports = { getExpenseChart };
