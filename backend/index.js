const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
dotenv.config();
app.use(cors({origin: process.env.SITE_URL,credentials: true,}));
app.use(express.json());
const connectToDb = require("./config/db");
connectToDb();

const transactionsRoutes = require("./routes/transactionRoutes");
const expenseRoutes = require("./routes/expenseRoutes");
const charCsvRoutes = require("./routes/chartCsvRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const contactRoutes = require("./routes/contactRoutes")
const activityRoutes = require("./routes/activityRoutes")

app.use("/api/activity", activityRoutes)
// http://localhost:3000/api/activity/add
// http://localhost:3000/api/activity/getAll

app.use("/api/contact", contactRoutes)
// http://localhost:3000/api/contact/send
// http://localhost:3000/api/contact/getAll

app.use("/api/admin", adminRoutes);
// http://localhost:3000/api/admin/users
// http://localhost:3000/api/admin/users/id
// http://localhost:3000/api/admin/users/update/id
// http://localhost:3000/api/admin/users/delete/id
// http://localhost:3000/api/admin/overview

//   email: ferozkhan271206@gmail.com
//   password: 123456

app.use("/api/auth", authRoutes);
// http://localhost:3000/api/auth/send-otp
// http://localhost:3000/api/auth/verify-otp
// http://localhost:3000/api/auth/login
// http://localhost:3000/api/auth/refresh
// http://localhost:3000/api/auth/forgot-password
// http://localhost:3000/api/auth/verify-reset-otp
// http://localhost:3000/api/auth/reset-password

app.use("/api/transactions", transactionsRoutes);
// http://localhost:3000/api/transactions/add
// http://localhost:3000/api/transactions/getAll
// http://localhost:3000/api/transactions/delete/id
// http://localhost:3000/api/transactions/update/id

app.use("/api/expense", expenseRoutes);
// http://localhost:3000/api/expense/monthlyExpenses?month=9&year=2026
// http://localhost:3000/api/expense/Income?month=9&year=2026
// http://localhost:3000/api/expense/totalIncome
// http://localhost:3000/api/expense/totalExpense
// http://localhost:3000/api/expense/balance
// http://localhost:3000/api/expense/categories

app.use("/api/chartCsv", charCsvRoutes);
// http://localhost:3000/api/chartCsv/chartExpense

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`backend sever is running at ${PORT}`);
});
