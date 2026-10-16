import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import api from "../services/api.js";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ClickSound from "../assets/click.mp3";
import RegisterSide from "../components/registerside";
import { login } from "../redux/authSlice";

function Register() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Input Change
  function handleChange(e) {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

 
  // Resend OTP Timer
useEffect(() => {
  if (resendTimer <= 0) return;

  const timer = setInterval(() => {
    setResendTimer((prev) => prev - 1);
  }, 1000);

  return () => clearInterval(timer);
}, [resendTimer]);

  // Send OTP
  async function handleSendOtp(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check all fields
    if (
      !formData.name.trim() ||
      !formData.email.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setError("All fields are required");
      return;
    }

    // Check password
    if (formData.password !== formData.confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/send-otp", {
        email: formData.email.trim(),
      });

      setOtpSent(true);

      // Start 60 second resend timer
      setResendTimer(60);

      setSuccess(response.data.message || "OTP sent successfully");
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const response = await api.post("/auth/send-otp", {
        email: formData.email.trim(),
      });

      // Clear old OTP
      setOtp("");

      // Restart timer
      setResendTimer(60);

      setSuccess(response.data.message || "OTP resent successfully");
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setLoading(false);
    }
  }

  // Verify OTP + Register
  async function handleVerifyOtp(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    // Check OTP
    if (!otp) {
      setError("Please enter OTP");
      return;
    }

    if (otp.length !== 6) {
      setError("OTP must be 6 digits");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-otp", {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        otp: otp,
      });

      // Get response data
      const { accessToken, refreshToken, role, name } = response.data;

      // Check tokens
      if (!accessToken || !refreshToken) {
        setError("Registration successful but token was not received");
        return;
      }

      // Save in localStorage
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);
      localStorage.setItem("role", role);
      localStorage.setItem("name", name);

      // Update Redux
      dispatch(
        login({
          accessToken: accessToken,
          refreshToken: refreshToken,
          role: role,
          name: name,
        }),
      );

      // Stop resend timer
      setResendTimer(0);

      // Success
      setSuccess("Registration successful!");

      // Go to Dashboard
      navigate("/dashboard", {
        replace: true,
      });
    } catch (error) {
      console.log(error);

      setError(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  }

  // Button Click Sound
  function handleClick() {
    const audio = new Audio(ClickSound);

    audio.play().catch(() => {});
  }

  // Tailwind Classes
  const fieldset = "border border-green-500 rounded-lg px-4 pt-1 pb-2";

  const legend = "px-2 text-sm font-medium text-white/80";

  const input = "w-full min-w-0 outline-none text-white bg-transparent";

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden grid grid-cols-1 lg:grid-cols-2 bg-black/90 select-none">
      {/*FORM SIDE*/}
      <div className="flex items-center justify-center px-4 py-10 sm:px-6 lg:py-0 lg:pt-13">
        <div className="w-full max-w-md p-5 sm:p-8 flex flex-col justify-center border-red-500 border-y rounded-2xl shadow-2xl shadow-black dark:shadow-white/10">
          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl font-semibold text-center text-green-400">
            Create Account
          </h1>

          <p className="text-[14px] text-gray-300 font-sans text-center mt-2">
            Hey enter your details to create your account
          </p>

          {/* Error */}
          {error && (
            <p className="text-red-500 text-sm text-center mt-3">{error}</p>
          )}

          {/* Success */}
          {success && (
            <p className="text-green-400 text-sm text-center mt-3">{success}</p>
          )}

          {/* Form */}
          <form
            onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}
            className="space-y-4 mt-5"
          >
            {/* Name */}
            <fieldset className={fieldset}>
              <legend className={legend}>Name</legend>

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={otpSent}
                className={`${input} disabled:opacity-50`}
              />
            </fieldset>

            {/* Email*/}
            <fieldset className={fieldset}>
              <legend className={legend}>Email</legend>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                disabled={otpSent}
                className={`${input} disabled:opacity-50`}
              />
            </fieldset>

            {/* Password */}
            <fieldset className={`relative ${fieldset}`}>
              <legend className={legend}>Password</legend>

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={otpSent}
                className={`${input} pr-8 disabled:opacity-50`}
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                disabled={otpSent}
                className="absolute right-3 bottom-4 cursor-pointer text-white disabled:opacity-50"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </fieldset>

            {/* Confirm Password*/}
            <fieldset className={fieldset}>
              <legend className={legend}>Confirm Password</legend>

              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={otpSent}
                className={`${input} disabled:opacity-50`}
              />
            </fieldset>

            {/* OTP*/}
            {otpSent && (
              <>
                <fieldset className={fieldset}>
                  <legend className={legend}>OTP</legend>

                  <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    placeholder="Enter 6 digit OTP"
                    className={input}
                  />
                </fieldset>

                {/* Resend OTP */}
                <div className="flex justify-end -mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendTimer > 0 || loading}
                    className="text-sm text-green-500 hover:text-blue-400 disabled:text-gray-300 disabled:cursor-not-allowed cursor-pointer transition"
                  >
                    {resendTimer > 0
                      ? `Resend OTP in ${resendTimer}s`
                      : "Resend OTP"}
                  </button>
                </div>
              </>
            )}

            {/* Submit Button*/}
            <button
              type="submit"
              disabled={loading}
              onClick={handleClick}
              className="w-full text-white py-2 hover:bg-red-700 disabled:bg-gray-400 cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700"
            >
              {loading
                ? otpSent
                  ? "Verifying..."
                  : "Sending OTP..."
                : otpSent
                  ? "Verify & Register"
                  : "Send OTP"}
            </button>
          </form>

          {/* Login*/}
          <p className="text-center mt-5 text-[16px] text-gray-300">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="text-green-600 font-medium cursor-pointer animate-[bounce_2s_infinite]"
            >
              Login
            </button>
          </p>
        </div>
      </div>
      <RegisterSide />
    </div>
  );
}

export default Register;
