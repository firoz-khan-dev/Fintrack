import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import ClickSound from "../assets/click.mp3";
import LoginSide from "../components/loginside";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [countdown, setCountdown] = useState(0);
  const [lockStage, setLockStage] = useState(0);

  // Countdown: har second 1 decrease hoga
  useEffect(() => {
    if (countdown <= 0) return;

    const timer = setTimeout(() => {
      setCountdown((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown]);

  // Timer complete hone par error aur attempts reset karo
  useEffect(() => {
    if (countdown === 0) {
      setError("");
      setAttempts(0);
    }
  }, [countdown]);

  // Input fields handle karo
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  // Login submit
  async function handleSubmit(e) {
    e.preventDefault();

    // Loading ya lock ke dauran dobara submit nahi hoga
    if (loading || countdown > 0) return;

    setError("");

    if (!formData.email.trim() || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", {
        email: formData.email.trim(),
        password: formData.password,
      });

      // Login successful
      localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("refreshToken", response.data.refreshToken);
      localStorage.setItem("role", response.data.role);
      localStorage.setItem("name", response.data.name);

      dispatch(
        login({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
          role: response.data.role,
          name: response.data.name,
        }),
      );

      setAttempts(0);
      setError("");

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      const status = err.response?.status;
      const data = err.response?.data;

      if (status === 429) {
        // Backend ne lock kiya hai; uska timer follow karo
        const seconds = Number(data?.retryAfter) || 30;

        setAttempts(5);
        setCountdown(seconds);
        setError("");
        setLockStage(seconds >= 120 ? 2 : 1);
      } else if (status === 401) {
        // Invalid email/password
        const nextAttempts = attempts + 1;

        if (nextAttempts >= 5) {
          // Pehle 5 failures: 30 sec
          // Agle 5 failures: 120 sec
          const seconds = lockStage === 0 ? 30 : 120;
          const nextStage = lockStage === 0 ? 1 : 2;

          setAttempts(5);
          setCountdown(seconds);
          setLockStage(nextStage);
          setError("");
        } else {
          setAttempts(nextAttempts);
          setError(data?.message || `Login failed. Attempt ${nextAttempts}/5.`);
        }
      } else {
        // Network ya server error
        setError(data?.message || "Unable to log in. Please try again.");
      }
    } finally {
      // Error ya success dono cases mein button reset hoga
      setLoading(false);
    }
  }

  // Button click sound
  function handleClick() {
    const audio = new Audio(ClickSound);
    audio.play().catch(() => {});
  }

  const fieldset = "relative border border-green-500 rounded-lg px-4 pt-1 pb-2";

  const legend = "px-2 text-sm font-medium text-white/80";

  const input = "w-full min-w-0 outline-none text-white bg-transparent";

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-black/90 select-none">
      {/* FORM SIDE */}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:py-0 lg:pt-13">
        <div className="w-full max-w-md p-5 sm:p-8 flex flex-col justify-center border-red-500 border-y rounded-2xl shadow-2xl shadow-black dark:shadow-white/10">
          <h1 className="text-3xl font-bold text-center text-green-500">
            Login
          </h1>

          <p className="text-[14px] text-gray-300 font-sans text-center mt-2 mb-5">
            Please Enter Your Details
          </p>

          {/* Error message */}
          {error && countdown <= 0 && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}

          {/* Failed attempts */}
          {attempts > 0 && countdown <= 0 && (
            <p className="text-yellow-400 text-sm text-center mb-2">
              Failed attempts: {Math.min(attempts, 5)}/5
            </p>
          )}

          {/* Countdown message */}
          {countdown > 0 && (
            <p className="text-red-600 text-sm text-center mb-4">
              Too many attempts. Please wait{" "}
              <span className="font-bold text-red-600">
                {countdown} seconds
              </span>
            </p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <fieldset className={fieldset}>
              <legend className={legend}>Email</legend>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={input}
                autoComplete="username"
                required
              />
            </fieldset>

            {/* Password */}
            <fieldset className={fieldset}>
              <legend className={legend}>Password</legend>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${input} pr-8`}
                autoComplete="current-password"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 bottom-4 cursor-pointer text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </fieldset>

            <div>
              {/* Login button */}
              <button
                type="submit"
                disabled={loading || countdown > 0}
                onClick={handleClick}
                className="w-full text-white py-2 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700"
              >
                {loading
                  ? "Logging in..."  : "Login"}
              </button>

              {/* Forgot password */}
              <button
                type="button"
                onClick={() => navigate("/forgotPassword")}
                className="inline-block mt-2 text-green-500 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          {/* Register */}
          <p className="text-center mt-5 text-[16px] text-gray-300">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/register")}
              className="font-medium cursor-pointer text-green-500 animate-[bounce_2s_infinite]"
            >
              Register
            </button>
          </p>
        </div>
      </div>

      <LoginSide />
    </div>
  );
}

export default Login;
