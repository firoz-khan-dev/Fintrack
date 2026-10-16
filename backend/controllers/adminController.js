const User = require("../models/user");

//  admin get all users
async function getAllUsers(req, res) {
  try {
    const users = await User.find().select("-password");

    return res.status(200).send({
      success: true,
      message: "All users fetched successfully",
      users,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Users not found",
    });
  }
}

// admin get single user
async function getSingleUser(req, res) {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select("-password");

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User fetched successfully",
      user,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

// admin can update
async function updateUser(req, res) {
  try {
    const { id } = req.params;

    const { name, email } = req.body;

    const updateDetails = await User.findByIdAndUpdate(
      id,
      {
        name,
        email,
      },
      {
        returnDocument: "after",
        runValidators: true,
      },
    ).select("-password");

    if (!updateDetails) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    return res.status(200).send({
      success: true,
      message: "User updated successfully",
      updateDetails,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "User not updated",
    });
  }
}

// admin can delete
async function deleteUser(req, res) {
  try {
    const { id } = req.params;

    const deleteDetails = await User.findByIdAndDelete(id);

    if (!deleteDetails) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // User ke saare transactions delete karo
    const Transaction = require("../models/transactionModel");

    await Transaction.deleteMany({
      userId: id,
    });

    return res.status(200).send({
      success: true,
      message: "User and transactions deleted successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "User not deleted",
    });
  }
}

// to overView
async function getAdminOverview(req, res) {
  try {
    const totalUsers = await User.countDocuments();

    const Transaction = require("../models/transactionModel");

    const incomeData = await Transaction.aggregate([
      {
        $match: {
          type: "income",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const expenseData = await Transaction.aggregate([
      {
        $match: {
          type: "expense",
        },
      },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" },
        },
      },
    ]);

    const totalIncome = incomeData[0]?.total || 0;
    const totalExpense = expenseData[0]?.total || 0;

    const recentTransactions = await Transaction.find()
      .populate("userId", "name email")
      .sort({ date: -1 })
      .limit(5);


    return res.status(200).send({
      success: true,
      message: "Admin overview fetched successfully",
      totalUsers,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      recentTransactions,
    });
  } catch (error) {
    console.log("Admin overview error:", error);

    return res.status(500).send({
      success: false,
      message: "Admin overview not found",
    });
  }
}

module.exports = {getAllUsers,getSingleUser,updateUser,deleteUser,getAdminOverview,};
