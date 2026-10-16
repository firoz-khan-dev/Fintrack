import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { FaHandPointRight, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import useCountUp from "../hooks/useCountUp";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

// Static class names so Tailwind can detect them
const styles = {
  expense: {
    wrap: "border-red-500",
    badge: "border-red-500/30 bg-red-500/10",
    badgeText: "text-red-400",
    total: "text-red-500",
    iconBox: "border-red-500/20 bg-red-500/10",
    hover: "group-hover:text-red-400",
    pill: "bg-red-500/10 text-red-400",
    amount: "text-red-400",
    sign: "−",
  },

  income: {
    wrap: "border-green-500",
    badge: "border-green-500/30 bg-green-500/10",
    badgeText: "text-green-400",
    total: "text-green-500",
    iconBox: "border-green-500/20 bg-green-500/10",
    hover: "group-hover:text-green-400",
    pill: "bg-green-500/10 text-green-400",
    amount: "text-green-400",
    sign: "+",
  },
};

// TRANSACTION PANEL

function TransactionPanel({
  kind,
  title,
  subtitle,
  total,
  items,
  emptyText,
  onEdit,
  onDelete,
}) {
  const s = styles[kind];

  return (
    <div
      className={`overflow-hidden rounded-2xl border-y ${s.wrap} bg-white/[0.03] shadow-2xl mb-5`}
    >
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 px-4 py-4 sm:px-6 sm:py-5">
        <div className="min-w-0">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            {title}
          </h2>

          <p className="mt-1 text-sm text-gray-300">{subtitle}</p>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <h2 className={`text-xl sm:text-2xl font-bold ${s.total}`}>
            ₹{total.toLocaleString("en-IN")}
          </h2>

          <div className={`rounded-full border px-3 py-1 ${s.badge}`}>
            <span
              className={`text-sm font-medium whitespace-nowrap ${s.badgeText}`}
            >
              {items.length} Transactions
            </span>
          </div>
        </div>
      </div>

      {/* List */}
      <div className="divide-y divide-white/5">
        {items.length === 0 ? (
          <p className="px-6 py-8 text-center text-gray-300">{emptyText}</p>
        ) : (
          items.map((item) => (
            <div
              key={item._id}
              className="group px-4 py-4 sm:px-6 sm:py-5 transition hover:bg-white/[0.04]"
            >
              <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
                {/* Icon */}
                <div
                  className={`flex size-11 shrink-0 items-center justify-center rounded-xl border ${s.iconBox}`}
                >
                  <span className={`text-lg ${s.amount}`}>
                    {kind === "expense" ? "🛒" : "₹"}
                  </span>
                </div>

                {/* Details */}
                <div className="min-w-0 flex-1 basis-40">
                  <h3
                    className={`font-medium text-white break-words ${s.hover}`}
                  >
                    {item.title}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-white/10 px-2.5 py-1 text-gray-300">
                      {item.category}
                    </span>

                    <span className={`rounded-full px-2.5 py-1 ${s.pill}`}>
                      {item.type}
                    </span>

                    <span className="text-gray-400">
                      {new Date(item.date).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Amount + Buttons */}
                <div className="ml-auto flex items-center gap-3 sm:gap-4">
                  <p
                    className={`text-base sm:text-lg font-semibold whitespace-nowrap ${s.amount}`}
                  >
                    {s.sign} ₹ {item.amount}
                  </p>

                  <div className="flex gap-2">
                    {/* Edit */}
                    <button
                      onClick={() => onEdit(item)}
                      className="rounded-lg border border-blue-500/30 bg-blue-500/10 p-2 text-blue-400 hover:bg-blue-500/20 cursor-pointer"
                      aria-label="Edit"
                    >
                      <FaEdit />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => onDelete(item._id)}
                      className="rounded-lg border border-red-500/30 bg-red-500/10 p-2 text-red-400 hover:bg-red-500/20 cursor-pointer"
                      aria-label="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// DASHBOARD
function DashBoard() {
  const navigate = useNavigate();

  // small screen check for chart labels
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // Filters
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  // Totals
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalExpense, setTotalExpense] = useState(0);

  // Transactions
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);

  // Monthly data
  const [monthlyExpense, setMonthlyExpense] = useState([]);
  const [monthlyIncome, setMonthlyIncome] = useState([]);

  // Chart
  const [chartData, setChartData] = useState([]);

  // INITIAL LOAD

  useEffect(() => {
    getTotalIncome();
    getTotalExpense();
    getTransactions();
    getMonthlyExpense();
    getMonthlyIncome();
    getExpenseChart();
  }, []);

  // MONTHLY TOTALS
  const monthlyExpenseTotal = Array.isArray(monthlyExpense)
    ? monthlyExpense.reduce((total, item) => total + Number(item.amount), 0)
    : 0;

  const monthlyIncomeTotal = Array.isArray(monthlyIncome)
    ? monthlyIncome.reduce((total, item) => total + Number(item.amount), 0)
    : 0;

  // GET TRANSACTIONS
  async function getTransactions(date = "", category = "") {
    try {
      const response = await api.get("/transactions/getAll", {
        params: {
          date,
          category,
        },
      });

      const transactions = response.data.allDetails || [];

      setExpenses(transactions.filter((item) => item.type === "expense"));

      setIncome(transactions.filter((item) => item.type === "income"));
    } catch (error) {
      console.log("Transaction filter error:", error);
    }
  }

  // CATEGORY FILTER
  function handleCategoryChange(category) {
    setSelectedCategory(category);

    getTransactions(selectedDate, category);
  }

  // DATE FILTER
  function handleDateChange(e) {
    const date = e.target.value;

    setSelectedDate(date);

    // Date + selected category
    getTransactions(date, selectedCategory);

    // Selected month
    getMonthlyExpense(date);
    getMonthlyIncome(date);
  }

  // TOTAL INCOME
  async function getTotalIncome() {
    try {
      const response = await api.get("/expense/totalIncome");

      setTotalIncome(response.data.totalIncome || 0);
    } catch (error) {
      console.log("Income error:", error);
    }
  }

  // TOTAL EXPENSE
  async function getTotalExpense() {
    try {
      const response = await api.get("/expense/totalExpense");

      setTotalExpense(response.data.totalExpense || 0);
    } catch (error) {
      console.log("Total expense error:", error);
    }
  }

  // BALANCE
  const Balance = totalIncome - totalExpense;

  // income + category + saving chart
  const financialChartData = chartData.map((item) => ({
    category: item.category,
    income: monthlyIncomeTotal,
    expense: item.amount,
    saving: monthlyIncomeTotal - item.amount,
  }));

  // ANIMATED NUMBERS
  const animatedIncome = useCountUp(totalIncome, 1000);
  const animatedExpense = useCountUp(totalExpense, 1000);
  const animatedBalance = useCountUp(Balance, 1000);

  // MONTHLY EXPENSE
  async function getMonthlyExpense(date = "") {
    try {
      const selected = date ? new Date(date) : new Date();

      const response = await api.get("/expense/monthlyExpenses", {
        params: {
          month: selected.getMonth() + 1,
          year: selected.getFullYear(),
        },
      });

      setMonthlyExpense(response.data.MonthlyExpanse || []);
    } catch (error) {
      console.log("Monthly expense error:", error);

      setMonthlyExpense([]);
    }
  }

  // MONTHLY INCOME
  async function getMonthlyIncome(date = "") {
    try {
      const selected = date ? new Date(date) : new Date();

      const response = await api.get("/expense/monthlyIncome", {
        params: {
          month: selected.getMonth() + 1,
          year: selected.getFullYear(),
        },
      });

      setMonthlyIncome(response.data.MonthlyIncome || []);
    } catch (error) {
      console.log("Monthly income error:", error);

      setMonthlyIncome([]);
    }
  }

  // EXPENSE CHART

  async function getExpenseChart() {
    try {
      const response = await api.get("/chartCsv/chartExpense");

      const data = response.data.chartData || {};

      const formattedData = Object.entries(data).map(([category, amount]) => ({
        category,
        amount: Number(amount),
      }));

      setChartData(formattedData);
    } catch (error) {
      console.log("Expense chart error:", error);
      setChartData([]);
    }
  }

  // DELETE TRANSACTION
  async function handleDelete(id) {
    try {
      await api.delete(`/transactions/delete/${id}`);

      // Remove from UI
      setExpenses((prev) => prev.filter((item) => item._id !== id));

      setIncome((prev) => prev.filter((item) => item._id !== id));

      // Refresh totals
      getTotalIncome();
      getTotalExpense();

      // Refresh monthly totals
      getMonthlyExpense(selectedDate);
      getMonthlyIncome(selectedDate);

      // Refresh chart
      getExpenseChart();
    } catch (error) {
      console.log("Error in delete:", error);
    }
  }

  // EDIT TRANSACTION
  function handleEdit(item) {
    navigate("/add-transaction", {
      state: {
        transaction: item,
      },
    });
  }

  // MONTH LABEL
  const monthLabel = selectedDate
    ? new Date(selectedDate).toLocaleString("en-IN", {
        month: "long",
        year: "numeric",
      })
    : "";

  // CATEGORIES
  const categories = [
    "Food",
    "Grocery",
    "Salary",
    "Freelance",
    "Shopping",
    "Travel",
    "EMI",
    "Other",
  ];
  const fieldset =
    "flex gap-3 rounded-xl border-y-2 border-white px-4 pb-3 w-full md:flex-1 xl:flex-none xl:w-110 xl:ml-40 shadow-2xs shadow-green-400 hover:-translate-y-1 transition-all duration-500";

  // RETURN
  return (
    <div className="min-h-screen bg-[linear-gradient(160deg,#000000_0%,#1F1F23_100%)] pt-24 px-4">
      {/* HEADING  */}

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Dashboard</h1>

        <div className="flex items-center gap-4">
          <FaHandPointRight className="animate-point-nudge hidden sm:block size-8 mr-5 text-white" />

          <button
            onClick={() => navigate("/add-transaction")}
            className="flex w-full sm:w-auto items-center justify-center animate-pop-loop cursor-pointer rounded-2xl border-y-2 border-red-500 bg-black/90 px-5 py-2.5 text-[15px] font-semibold text-white transition"
          >
            <RiMoneyRupeeCircleLine className="size-5 mr-2" />
            <span className="text-green-500 mr-1">Add</span>
            Transaction
          </button>
        </div>
      </div>

      {/* FILTERS */}

      <div className="flex flex-col gap-4 md:flex-row md:gap-6 xl:gap-0 md:-mt-5 mb-7  justify-evenly ">
        {/* Date Filter */}

        <fieldset className={fieldset}>
          <legend className="px-1 text-[16px] font-medium text-white">
            Search By Date
          </legend>

          <FaSearch className="mt-1.5 shrink-0 text-white/80" />

          <input
            type="date"
            name="date"
            value={selectedDate}
            onChange={handleDateChange}
            className="w-full min-w-0 bg-transparent text-white/80 outline-none [color-scheme:dark]"
          />
        </fieldset>

        {/* Category Filter */}

        <fieldset className={fieldset}>
          <legend className="px-2 text-[16px] font-medium text-white">
            Search By Category
          </legend>

          <FaSearch className="mt-1.5 shrink-0 text-white/80" />

          <select
            name="category"
            value={selectedCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full min-w-0 bg-transparent text-white/80 outline-none"
          >
            <option value="" className="bg-black/90">
              All Categories
            </option>

            {categories.map((category) => (
              <option key={category} value={category} className="bg-black/90">
                {category}
              </option>
            ))}
          </select>
        </fieldset>
      </div>

      {/*  SUMMARY CARDS  */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-5">
        {/* Income */}

        <div className="rounded-3xl border-green-600 border-y-2 bg-white/4 p-5 sm:p-6 shadow-2xl shadow-white/10">
          <p className="text-gray-300 text-sm">Total Income</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-green-500 mt-2 break-words">
            ₹ {animatedIncome.toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Expense */}

        <div className="rounded-3xl border-y-2 border-red-600 bg-white/4 p-5 sm:p-6 shadow-2xl shadow-white/10">
          <p className="text-gray-300 text-sm">Total Expense</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-red-500 mt-2 break-words">
            ₹ {animatedExpense.toLocaleString("en-IN")}
          </h2>
        </div>

        {/* Balance */}

        <div className="rounded-3xl border-y-2 border-blue-500 bg-white/4 p-5 sm:p-6 shadow-2xl shadow-white/10">
          <p className="text-gray-300 text-sm">Balance</p>

          <h2 className="text-2xl sm:text-3xl font-bold text-blue-400 mt-2 break-words">
            ₹ {animatedBalance.toLocaleString("en-IN")}
          </h2>
        </div>
      </div>

      {/* INCOME + EXPENSE + SAVING CHART */}
      <div className="mt-8 mb-8 rounded-2xl border-y border-purple-500 bg-white/[0.03] p-3 sm:p-6 shadow-2xl">
        <div className="mb-4 sm:mb-5">
          <h2 className="text-lg sm:text-xl font-semibold text-white">
            Income, Expense & Saving by Category
          </h2>

          <p className="mt-1 text-sm text-gray-300">
            Compare the same monthly income with each category's expense and
            remaining amount.
          </p>
        </div>

        {financialChartData.length === 0 ? (
          <p className="py-10 text-center text-gray-300">
            No category expense data available
          </p>
        ) : (
          <div className="h-72 sm:h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={financialChartData}
                margin={{
                  top: 10,
                  right: isMobile ? 0 : 10,
                  left: 0,
                  bottom: isMobile ? 10 : 5,
                }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.1)"
                />
                <XAxis
                  dataKey="category"
                  stroke="#ffffff"
                  interval={0}
                  angle={isMobile ? -45 : 0}
                  textAnchor={isMobile ? "end" : "middle"}
                  height={isMobile ? 60 : 30}
                  tick={{ fontSize: isMobile ? 11 : 14 }}
                />
                <YAxis
                  stroke="#ffffff"
                  width={isMobile ? 40 : 60}
                  tick={{ fontSize: isMobile ? 11 : 14 }}
                  tickFormatter={(value) =>
                    new Intl.NumberFormat("en-IN", {
                      notation: "compact",
                    }).format(value)
                  }
                />
                <Tooltip
                  formatter={(value, name) => [
                    `₹ ${Number(value).toLocaleString("en-IN")}`,
                    name,
                  ]}
                  contentStyle={{
                    backgroundColor: "#111113",
                    border: "1px solid #9333ea",
                    borderRadius: "10px",
                    color: "#fff",
                    fontSize: isMobile ? 12 : 14,
                  }}
                />
                <Bar
                  dataKey="income"
                  name="Income"
                  fill="#22c55e"
                  radius={[5, 5, 0, 0]}
                  activeBar={{
                    fill: "#15803d",
                    stroke: "#166534",
                    strokeWidth: 2,
                    radius: [8, 8, 0, 0],
                  }}
                  maxBarSize={35}
                />
                <Bar
                  dataKey="expense"
                  name="Expense"
                  fill="#ef4444"
                  radius={[5, 5, 0, 0]}
                  activeBar={{
                    fill: "#b91c1c",
                    stroke: "#991b1b",
                    strokeWidth: 2,
                    radius: [8, 8, 0, 0],
                  }}
                  maxBarSize={35}
                />
                <Bar
                  dataKey="saving"
                  name="Balance"
                  fill="#3b82f6"
                  radius={[5, 5, 0, 0]}
                  activeBar={{
                    fill: "#1d4ed8",
                    stroke: "#1e40af",
                    strokeWidth: 2,
                    radius: [8, 8, 0, 0],
                  }}
                  maxBarSize={35}
                />

                <Legend
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{
                    paddingTop: "15px",
                    color: "#ffffff",
                    fontSize: isMobile ? "12px" : "14px",
                  }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/*  EXPENSE + INCOME  */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* EXPENSE */}

        <TransactionPanel
          kind="expense"
          title="Monthly Expense"
          subtitle={
            selectedDate
              ? `Expenses for ${monthLabel}`
              : "Expenses for current month"
          }
          total={monthlyExpenseTotal}
          items={expenses}
          emptyText="No expense transactions found"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        {/* INCOME */}

        <TransactionPanel
          kind="income"
          title="Monthly Income"
          subtitle={
            selectedDate
              ? `Income for ${monthLabel}`
              : "Income for current month"
          }
          total={monthlyIncomeTotal}
          items={income}
          emptyText="No income transactions found"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}

export default DashBoard;
