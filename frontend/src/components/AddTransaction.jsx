import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../services/api";
import Card from "../assets/card.png";

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

function AddTransaction() {
  const navigate = useNavigate();
  const location = useLocation();

  // get details for update
  const editTransaction = location.state?.transaction;
  const isEditMode = !!editTransaction;

  const [formData, setFormData] = useState({
    title: editTransaction?.title || "",
    amount: editTransaction?.amount || "",
    type: editTransaction?.type || "expense",
    category: editTransaction?.category || "",
    date: editTransaction?.date
      ? new Date(editTransaction.date).toISOString().split("T")[0]
      : "",
  });

  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setLoading(true);

      if (isEditMode) {
        await api.put(`/transactions/update/${editTransaction._id}`, formData);
      } else {
        await api.post("/transactions/add", formData);
      }

      navigate("/dashboard");
    } catch (error) {
      console.log("Transaction error:", error);
    } finally {
      setLoading(false);
    }
  }

  const fieldset = "mb-5 rounded-xl border border-green-400 px-4 pb-3 pt-1";
  const legend = "px-1 text-[14px] font-medium text-white";

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 bg-[linear-gradient(160deg,#000000_0%,#1F1F23_100%)] select-none">
      {/* FORM SIDE */}
      <div className="px-4 py-10 sm:px-6 lg:px-10 lg:pt-20 lg:pb-5">
        <div className="mx-auto w-full max-w-xl">
          {/* Heading */}
          <div className="mb-8">
            <h1 className="flex flex-wrap justify-center gap-x-2 text-3xl sm:text-4xl font-bold text-white">
              <span className="text-green-500">
                {isEditMode ? "Update" : "Add"}
              </span>
              Transaction
            </h1>

            <p className="mt-1 text-center text-gray-200">
              {isEditMode
                ? "Update your transaction details"
                : "Add your income or expense"}
            </p>
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="rounded-2xl border-y border-white/90 bg-white/[0.010] p-4 sm:p-6 shadow-2xl shadow-black"
          >
            <fieldset className={fieldset}>
              <legend className={legend}>Title</legend>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g. Grocery, Salary"
                required
                className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-gray-300"
              />
            </fieldset>

            <fieldset className={fieldset}>
              <legend className={legend}>Amount</legend>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="1"
                required
                className="w-full min-w-0 bg-transparent text-white outline-none placeholder:text-gray-300 [color-scheme:dark]"
              />
            </fieldset>

            <fieldset className={fieldset}>
              <legend className={legend}>Transaction Type</legend>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full min-w-0 bg-transparent text-white/80 outline-none"
              >
                <option value="expense" className="bg-black/90">
                  Expense
                </option>
                <option value="income" className="bg-black/90">
                  Income
                </option>
              </select>
            </fieldset>

            <fieldset className={fieldset}>
              <legend className={legend}>Category</legend>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="w-full min-w-0 bg-transparent text-white/80 outline-none"
              >
                <option value="" className="bg-black/90">
                  Select Category
                </option>
                {categories.map((c) => (
                  <option key={c} value={c} className="bg-black/90">
                    {c}
                  </option>
                ))}
              </select>
            </fieldset>

            <fieldset className={fieldset}>
              <legend className={legend}>Date</legend>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="w-full min-w-0 bg-transparent text-white/80 outline-none [color-scheme:dark]"
              />
            </fieldset>

            {/* Buttons */}
            <div className="flex flex-col gap-3 sm:flex-row">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 rounded-xl px-5 py-3 font-semibold text-white hover:text-black transition hover:scale-[1.01] hover:bg-blue-500 cursor-pointer border-blue-500 border-y "
              >
                {loading
                  ? isEditMode
                    ? "Updating..."
                    : "Adding..."
                  : isEditMode
                    ? "Update Transaction"
                    : "Add Transaction"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="rounded-xl border-y-2 border-red-500 px-6 py-3 font-semibold text-white hover:text-black cursor-pointer hover:bg-red-500 "
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* SIDE PANEL: above the form on small screens, right side on lg+ */}
      <div className="order-first lg:order-none flex flex-col items-center gap-4 bg-linear-to-b from-green-200 via-green-300 to-green-400 select-none overflow-hidden px-6 pt-24 pb-10 text-center lg:min-h-screen lg:justify-center lg:pt-20 lg:pb-0 lg:px-10">
        <p className="text-black text-2xl sm:text-4xl animate-pop-loop">
          <span className="text-3xl sm:text-5xl font-bold text-green-950">
            Save
          </span>{" "}
          More{" "}
          <span className="text-3xl sm:text-5xl font-bold text-green-950">
            Grow
          </span>{" "}
          More
        </p>

        <p className="max-w-xl text-base sm:text-xl text-gray-800 dark:text-gray-800">
          <span className="text-3xl sm:text-4xl font-semibold text-black dark:text-black/80">
            Log
          </span>{" "}
          an expense or income entry below — it updates your balance right away
          and stays saved on this device. Pick a category so your spending is
          easy to review later. Switch between Expense and Income before filling
          in the amount.
        </p>
        <img
          src={Card}
          alt=""
          className="w-full max-w-[16rem] sm:max-w-sm xl:max-w-md h-auto object-contain"
        />
      </div>
    </div>
  );
}

export default AddTransaction;
