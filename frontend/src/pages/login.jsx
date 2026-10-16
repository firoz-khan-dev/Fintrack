import React, { useState } from "react";
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
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!formData.email || !formData.password) {
      setError("Email and password are required");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/login", formData);

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

      if (response.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  function handleClick() {
    const audio = new Audio(ClickSound);
    audio.play();
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

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <fieldset className={fieldset}>
              <legend className={legend}>Email</legend>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={input}
              />
            </fieldset>

            <fieldset className={fieldset}>
              <legend className={legend}>Password</legend>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`${input} pr-8`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 bottom-4 cursor-pointer text-white"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </fieldset>

            <div>
              <button
                type="submit"
                disabled={loading}
                onClick={handleClick}
                className="w-full text-white py-2 hover:bg-red-700 disabled:bg-gray-400 cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700"
              >
                {loading ? "Logging in..." : "Login"}
              </button>

              <button
                type="button"
                onClick={() => navigate("/forgotPassword")}
                className="inline-block mt-2 text-green-500 cursor-pointer"
              >
                Forgot Password?
              </button>
            </div>
          </form>

          <p className="text-center mt-5 text-[16px] text-gray-300">
            Don't have an account?{" "}
            <button
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
