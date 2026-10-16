import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FaWallet, FaChartPie, FaShieldHalved } from "react-icons/fa6";
import { MdAddChart } from "react-icons/md";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen overflow-x-hidden bg-black text-white select-none">
      {/*  HERO  */}
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,_#000000,_#1f1f23,_#000000)] pt-16 pb-24 sm:pt-20 lg:min-h-[650px] lg:pt-0 lg:pb-0">
        <div className="relative z-10 mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:min-h-[650px] lg:grid-cols-2 lg:gap-8 lg:px-10">
          {/* LEFT CONTENT */}
          <div className="text-center lg:text-left">
            <p className="mb-4 text-5xl mt-3 font-bold text-white sm:text-6xl lg:mt-30 lg:text-6xl xl:text-[80px]">
              Welcome to Fin<span className="text-green-500">Track</span>
            </p>

            <h1 className="text-3xl font-bold leading-tight sm:text-5xl lg:text-4xl xl:text-[45px]">
              Manage Your Money
              <br />
              <span className="text-green-500">Smarter</span> &{" "}
              <span className="text-green-500">Better</span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-base leading-7 text-gray-300 sm:text-lg lg:mx-0">
              Take control of your finances with FinTrack. Track your income,
              manage your expenses, organize your transactions and understand
              your spending in one simple platform.
            </p>

            {/* BUTTONS */}
            <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center sm:gap-5 lg:justify-start">
              <button
                onClick={() => navigate("/register")}
                className="flex cursor-pointer items-center justify-center gap-3 rounded-xl border-y-2 border-red-500 px-7 py-3 font-semibold text-white shadow-2xl shadow-black/90 transition hover:bg-red-500 hover:text-black active:bg-red-500"
              >
                Get Started
                <FaArrowRight />
              </button>

              <button
                onClick={() => navigate("/dashboard")}
                className="cursor-pointer rounded-2xl border-y-2 border-red-500 px-7 py-3 font-semibold text-gray-900 shadow-xl shadow-black/10 transition hover:bg-red-500 hover:text-white active:bg-red-500 active:text-white dark:border-white dark:text-white dark:shadow-black/90 dark:hover:bg-white dark:hover:text-black dark:active:bg-white dark:active:text-black">
                View Dashboard
              </button>
            </div>
          </div>

          {/* RIGHT DASHBOARD PREVIEW */}
          <div className="flex justify-center px-2 sm:px-0 xl:ml-20">
            <div className="pendulum flex w-full max-w-[550px] flex-col items-center">
              {/* Rope */}
              <div className="relative h-16 w-full sm:h-24 lg:h-32">
                <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 rounded-full bg-gradient-to-b from-gray-400 to-gray-600" />
              </div>

              {/* Knot */}
              <div className="-mt-1 size-3 rounded-full bg-gray-400 ring-2 ring-gray-600" />

              {/* Card */}
              <div className="w-full cursor-pointer rounded-3xl border-y-2 border-red-500 bg-[#161619] p-4 shadow-2xl shadow-green-500/10 sm:p-6 lg:min-h-100">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-lg text-gray-300 sm:text-[20px] light-keep-white ">
                      Total Balance
                    </p>
                    <h2 className="mt-2 text-3xl font-bold sm:text-4xl light-keep-white">
                      ₹52,450
                    </h2>
                  </div>

                  <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-green-500/10 sm:size-14">
                    <FaWallet className="size-6 text-green-500 sm:size-7" />
                  </div>
                </div>

                {/* Income / Expenses */}
                <div className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-4">
                  <div className="rounded-xl border border-white/10 bg-black/60 p-3 sm:p-4">
                    <p className="text-sm text-gray-300 light-keep-white">Income</p>
                    <p className="mt-2 text-lg font-semibold text-green-500 sm:text-2xl">
                      ₹75,000
                    </p>
                  </div>

                  <div className="rounded-xl border border-white/10 bg-black/60 p-3 sm:p-4">
                    <p className="text-sm text-gray-300 light-keep-white">Expenses</p>
                    <p className="mt-2 text-lg font-semibold text-red-400 sm:text-2xl">
                      ₹22,550
                    </p>
                  </div>
                </div>

                {/* Chart */}
                <div className="mt-6 flex h-20 w-full items-end justify-between gap-1.5 border-b-2 border-white/70 sm:gap-3 lg:mt-9">
                  <div className="h-10 w-full max-w-8 rounded-t bg-green-500/30"></div>
                  <div className="h-14 w-full max-w-8 rounded-t bg-green-500/40"></div>
                  <div className="h-8 w-full max-w-8 rounded-t bg-green-500/50"></div>
                  <div className="h-18 w-full max-w-8 rounded-t bg-green-500/60"></div>
                  <div className="h-12 w-full max-w-8 rounded-t bg-green-500/70"></div>
                  <div className="h-20 w-full max-w-8 rounded-t bg-green-500/80"></div>
                  <div className="h-12 w-full max-w-8 rounded-t bg-green-500/90"></div>
                  <div className="h-16 w-full max-w-8 rounded-t bg-green-500"></div>
                  <div className="h-8 w-full max-w-8 rounded-t bg-green-500"></div>
                  <div className="h-19 w-full max-w-8 rounded-t bg-green-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Wave */}
        <svg
          className="absolute bottom-0 left-0 h-12 w-full sm:h-auto"
          viewBox="0 0 1440 120"
          preserveAspectRatio="none"
        >
          <path
            fill="#000000"
            d="M0,70 C180,120 360,120 540,70 C720,20 900,20 1080,70 C1260,120 1350,110 1440,70 L1440,120 L0,120 Z"
          />
        </svg>
      </section>

      {/*  WHY FINTRACK  */}
      <section className="bg-black py-16 md:py-24">
        <div className="px-4 text-center">
          <p className="text-3xl font-bold sm:text-5xl lg:text-6xl">
            WHY <span className="text-green-500">FinTrack</span>
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-4xl">
            Everything You Need
            <span className="text-green-500"> In One Place</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300 sm:text-[17px]">
            FinTrack makes personal finance management simple, organized and
            easy to understand.
          </p>
        </div>

        {/* FEATURE CARDS */}
        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-2 sm:px-8 md:mt-14 lg:grid-cols-3 lg:gap-8">
          <div className="rounded-2xl border-y-2 border-green-500/80 bg-[#161619] p-6 transition duration-300 hover:-translate-y-2 md:p-7">
            <div className="flex size-14 items-center justify-center rounded-xl bg-green-500/10">
              <MdAddChart className="size-10 text-green-500" />
            </div>
            <h3 className="mt-3 text-xl font-semibold sm:text-[22px] light-keep-white">
              Easy Tracking
            </h3>
            <p className="mt-3 leading-6 text-gray-300 light-keep-fade">
              Add your income and expenses quickly and keep your financial
              records organized.
            </p>
          </div>

          <div className="rounded-2xl border-y-2 border-green-500/80 bg-[#161619] p-6 transition duration-300 hover:-translate-y-2 md:p-7">
            <div className="flex size-14 items-center justify-center rounded-xl bg-green-500/10">
              <FaChartPie className="size-10 text-green-500" />
            </div>
            <h3 className="mt-3 text-xl font-semibold sm:text-[22px] light-keep-white">
              Understand Your Spending
            </h3>
            <p className="mt-3 leading-6 text-gray-300 light-keep-fade">
              View your financial activity and understand where your money is
              being spent.
            </p>
          </div>

          <div className="rounded-2xl border-y-2 border-green-500/80 bg-[#161619] p-6 transition duration-300 hover:-translate-y-2 sm:col-span-2 md:p-7 lg:col-span-1">
            <div className="flex size-14 items-center justify-center rounded-xl bg-green-500/10">
              <FaShieldHalved className="size-10 text-green-500" />
            </div>
            <h3 className="mt-3 text-xl font-semibold sm:text-[22px] light-keep-white">
              Simple & Secure
            </h3>
            <p className="mt-3 leading-6 text-gray-300 light-keep-fade">
              Keep your financial information organized with a simple and secure
              experience.
            </p>
          </div>
        </div>
      </section>

      {/*  HOW IT WORKS  */}
      <section className="bg-[#111113] py-16 md:py-24">
        <div className="px-4 text-center">
          <p className="text-3xl font-bold sm:text-5xl light-keep-white">
            HOW IT <span className="text-green-500">WORKS</span>
          </p>

          <h2 className="mt-3 text-2xl font-bold sm:text-4xl light-keep-white">
            Manage Your Expenses
            <span className="text-green-500"> In 3 Steps</span>
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-10 px-4 sm:px-8 md:mt-14 md:grid-cols-3 light-keep-white">
          {[
            [
              "1",
              "Add Transactions",
              "Add your income and expenses with amount, category and date.",
            ],
            [
              "2",
              "Organize",
              "Organize your transactions using categories and filters.",
            ],
            [
              "3",
              "Understand",
              "Check your income, expenses and financial activity from your dashboard.",
            ],
          ].map(([num, title, text]) => (
            <div key={num} className="text-center">
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-y-3 border-green-500 text-2xl font-bold text-white light-keep-white">
                {num}
              </div>
              <h3 className="mt-5 text-xl font-semibold ">{title}</h3>
              <p className="mx-auto mt-3 max-w-xs leading-6 text-gray-300 md:max-w-none light-keep-fade">
                {text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/*  CTA  */}
      <section className="bg-black px-4 py-16 sm:px-6 md:py-24">
        <div className="mx-auto max-w-5xl rounded-3xl border-y-2 border-green-500/80 bg-[linear-gradient(135deg,_#101012,_#1f1f23)] px-5 py-10 text-center shadow-lg shadow-gray-900/15 dark:shadow-2xl dark:shadow-green-500/5">
          <h2 className="text-2xl font-bold sm:text-4xl">
            Ready to Take Control of
            <span className="text-green-500"> Your Money?</span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base text-gray-300">
            Start managing your finances today with FinTrack. Keep track of your
            spending and stay organized.
          </p>

          <button
            onClick={() => navigate("/register")}
            className="mt-8 w-full sm:w-72 cursor-pointer rounded-2xl border-y-2 border-red-500 px-8 py-3 font-semibold text-white transition hover:bg-red-500 hover:text-black active:bg-red-500"
          >
            Start Using FinTrack
          </button>
        </div>
      </section>

      {/*  FOOTER  */}
      <footer className="border-t border-white/10 bg-[#0a0a0a] py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center sm:flex-row sm:justify-between sm:px-8 sm:text-left">
          <div>
            <h2 className="text-2xl font-bold light-keep-fade">
              <span className="text-green-500">Fin</span>Track
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Manage your money. Simplify your life.
            </p>
          </div>

          <p className="text-sm text-gray-500">
            © 2026 FinTrack. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Home;
