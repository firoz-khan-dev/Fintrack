const transaction = require("../models/transactionModel");

// add to transactions
async function addTransaction(req, res) {
  try {
    const { title, amount, type, category, date } = req.body;

    const details = await transaction.create({
      userId: req.user.id,
      title,
      amount,
      type,
      category,
      date,
    });
    res.status(201).send({
      success: true,
      message: "Transaction added successfully",
      details,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "Transaction not added" });
  }
}

// get all transactions with date filter
async function getAllTransactions(req, res) {
  try {
    const { date, category } = req.query;

    let filter = {
      userId: req.user.id,
    };

    if (date) {
      const startDate = new Date(date);
      const endDate = new Date(date);

      endDate.setDate(endDate.getDate() + 1);

      filter.date = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    if (category) {
      filter.category = category;
    }

    const allDetails = await transaction.find(filter).sort({ date: -1 });

    res.status(200).send({
      success: true,
      message: "all data here",
      allDetails,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "all transaction not show some thing went wrong",
    });

    console.log(error);
  }
}

// delete to transaction
async function deleteTransaction(req, res) {
  try {
    const { id } = req.params;
    const deleteDetails = await transaction.findByIdAndDelete({
      _id: id,
      userId: req.user.id,
    });
    if (!deleteDetails) {
      res
        .status(404)
        .send({ success: false, message: "Transaction not found" });
    }
    res.status(200).send({
      success: true,
      message: "Transaction Delete successfully",
      deleteDetails,
    });
  } catch (error) {
    res.status(500).send({ success: false, message: "transaction not delete" });
    console.log(error);
  }
}

// update to transaction
async function updateTransaction(req, res) {
  try {
    const { id } = req.params;
    const { title, amount, type, category, date } = req.body;
    const updateDetails = await transaction.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { title, amount, type, category, date },
      { new: true },
    );
    if (!updateDetails) {
      return res
        .status(404)
        .send({ success: false, message: "Transaction not found" });
    }
    res.status(200).send({
      success: true,
      message: "Transaction update successfully",
      updateDetails,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "some thing went wrong in update transaction",
    });
    console.log(error);
  }
}

module.exports = {addTransaction,getAllTransactions,deleteTransaction,updateTransaction,};
