
const transaction = require("../models/transactionModel");

// get Monthly expenses
async function getAllMonthlyExpenses(req, res) {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const MonthlyExpanse = await transaction.find({
      userId: req.user.id,
      type: "expense",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).send({
      success: true,
      message: "Monthly expense get successfully",
      MonthlyExpanse,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Monthly expense not get",
    });

    console.log(error);
  }
}

// get Monthly Income
async function getAllMonthlyIncome(req, res) {
  try {
    const { month, year } = req.query;

    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 1);

    const MonthlyIncome = await transaction.find({
      userId: req.user.id,
      type: "income",
      date: {
        $gte: startDate,
        $lt: endDate,
      },
    });

    res.status(200).send({
      success: true,
      message: "Monthly income get successfully",
      MonthlyIncome,
    });
  } catch (error) {
    console.log(error);

    res.status(500).send({
      success: false,
      message: "Monthly income not get",
    });
  }
}

// get total income
async function getTotalIncome(req, res) {
  try {
    const income = await transaction.find({
      userId: req.user.id,
      type: "income",
    });

    let totalIncome = 0;

    income.forEach((item) => {
      totalIncome = totalIncome + item.amount;
    });

    res.status(200).send({
      success: true,
      message: "total income get successfully",
      totalIncome,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "total income not get",
      error,
    });
  }
}

// get total expenses
async function getTotalExpense(req, res) {
  try {
    const expense = await transaction.find({
      userId: req.user.id,
      type: "expense",
    });

    let totalExpense = 0;

    expense.forEach((item) => {
      totalExpense = totalExpense + item.amount;
    });

    res.status(200).send({
      success: true,
      message: "total expenses get successfully",
      totalExpense,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "total expenses not get",
      error,
    });
  }
}

// get total balance
async function Balance(req, res) {
  try {
    const income = await transaction.find({
      userId: req.user.id,
      type: "income",
    });

    const expense = await transaction.find({
      userId: req.user.id,
      type: "expense",
    });

    let totalIncome = 0;
    let totalExpense = 0;

    income.forEach((item) => {
      totalIncome = totalIncome + item.amount;
    });

    expense.forEach((item) => {
      totalExpense = totalExpense + item.amount;
    });

    const balance = totalIncome - totalExpense;

    res.status(200).send({
      success: true,
      message: "balance get successfully",
      balance,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "balance not get",
      error,
    });
  }
}

// get categories
async function getCategories(req, res) {
  try {
    const expense = await transaction.find({
      userId: req.user.id,
      type: "expense",
    });

    const category = {};

    expense.forEach((item) => {
      if (category[item.category]) {
        category[item.category] =
          category[item.category] + item.amount;
      } else {
        category[item.category] = item.amount;
      }
    });

    res.status(200).send({
      success: true,
      message: "category get successfully",
      category,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "category are not found",
      error,
    });
  }
}

module.exports = {getAllMonthlyExpenses,getAllMonthlyIncome,getTotalIncome,getTotalExpense,Balance,getCategories,};

