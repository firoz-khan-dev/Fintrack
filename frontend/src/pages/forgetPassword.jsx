import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import api from "../services/api";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const [resendTimer, setResendTimer] = useState(0);
  const [resending, setResending] = useState(false);

  // OTP timer
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

    if (!email.trim()) {
      setError("Please enter your email");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(response.data.message || "OTP sent successfully");

      setStep(2);
      setResendTimer(60);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  }

  // Resend OTP
  async function handleResendOtp() {
    if (resendTimer > 0 || resending) {
      return;
    }

    setError("");
    setSuccess("");

    try {
      setResending(true);

      const response = await api.post("/auth/forgot-password", {
        email: email.trim(),
      });

      setSuccess(response.data.message || "OTP resent successfully");

      setOtp("");
      setResendTimer(60);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  }

  // Verify OTP
  async function handleVerifyOtp(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (otp.length !== 6) {
      setError("Please enter a valid 6 digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/verify-reset-otp", {
        email: email.trim(),
        otp: otp.trim(),
      });

      setSuccess(response.data.message || "OTP verified successfully");

      setStep(3);
    } catch (error) {
      setError(error.response?.data?.message || "Invalid OTP");
    } finally {
      setLoading(false);
    }
  }

  // Reset Password
  async function handleResetPassword(e) {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (!newPassword || !confirmPassword) {
      setError("All fields are required");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await api.post("/auth/reset-password", {
        email: email.trim(),
        otp: otp.trim(),
        newPassword,
        confirmPassword,
      });

      setSuccess(response.data.message || "Password reset successfully");

      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black/90 flex items-center justify-center px-4 py-8 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="bg-gray-700/ border-y border-white rounded-2xl shadow-2xl shadow-black p-5 sm:p-8">
          {/* Heading */}
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-green-500">
              Forgot Password
            </h1>

            <p className="text-sm text-gray-300 mt-2">
              {step === 1 && "Enter your registered email"}

              {step === 2 && "Enter the OTP sent to your email"}

              {step === 3 && "Create your new password"}
            </p>
          </div>

          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1
                  ? "border-green-500 border-y-2 text-white font-bold"
                  : "bg-gray-700 !text-white"
              }`}
            >
              1
            </div>

            <div
              className={`w-10 h-[2px] ${
                step >= 2 ? "bg-green-500" : "bg-gray-700"
              }`}
            />

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2
                  ? "border-green-500 border-y-2 text-white font-bold"
                  : "bg-gray-700 !text-white"
              }`}
            >
              2
            </div>

            <div
              className={`w-10 h-[2px] ${
                step >= 3 ? "bg-green-500" : "bg-gray-700"
              }`}
            />

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 3
                  ? "border-green-500 border-y-2 text-white font-bold"
                  : "bg-gray-700 !text-white"
              }`}
            >
              3
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/50 text-red-400 text-sm text-center">
              {error}
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="mb-4 px-4 py-3 rounded-xl bg-green-500/10 border border-green-500/50 text-green-400 text-sm text-center">
              {success}
            </div>
          )}

          {/* STEP 1 */}
          {step === 1 && (
            <form onSubmit={handleSendOtp}>
              <fieldset className="relative border border-green-500 rounded-lg px-4 pt-1 pb-2 ">
                <legend className="px-2 text-sm font-medium text-white/80">
                  Email
                </legend>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full min-w-0 outline-none text-white bg-transparent placeholder:text-gray-500"
                />
              </fieldset>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 text-white py-2 hover:bg-red-700 disabled:bg-gray-500 cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700 transition"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            </form>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtp}>
              <label className="block text-sm text-gray-300 text-center mb-3">
                Enter 6 digit OTP
              </label>

              {/* Better OTP Input */}
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                value={otp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                  setOtp(value);
                }}
                maxLength={6}
                placeholder="••••••"
                className="w-full text-center tracking-[0.7em] text-2xl sm:text-3xl font-bold py-4 rounded-xl bg-[#202023] text-white outline-none border border-gray-700 focus:border-green-500 placeholder:text-gray-600 placeholder:tracking-[0.5em]"
              />

              {/* Resend */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4 mb-5 text-center sm:text-left">
                <span className="text-sm text-gray-300">
                  Didn't receive OTP?
                </span>

                {resendTimer > 0 ? (
                  <span className="text-sm text-gray-500">
                    Resend in{" "}
                    <span className="text-green-500 font-medium">
                      {resendTimer}s
                    </span>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resending}
                    className="text-sm text-green-500 hover:text-green-400 cursor-pointer disabled:text-gray-500"
                  >
                    {resending ? "Sending..." : "Resend OTP"}
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full text-white py-2 hover:bg-red-700 disabled:bg-gray-500 cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700 transition"
              >
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep(1);
                  setOtp("");
                  setError("");
                  setSuccess("");
                  setResendTimer(0);
                }}
                className="w-full mt-3 py-2 text-gray-300 hover:text-green-500 text-sm cursor-pointer"
              >
                Change Email
              </button>
            </form>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <form onSubmit={handleResetPassword}>
              {/* New Password */}
              <fieldset className="relative border border-green-500 rounded-lg px-4 pt-1 pb-3">
                <legend className="px-2 text-sm font-medium text-white/80">
                  New Password
                </legend>

                <input
                  type={showPassword ? "text" : "password"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  className="w-full min-w-0 outline-none text-white bg-transparent pr-8 placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 bottom-3 cursor-pointer text-white"
                  aria-label="Toggle password visibility"
                >
                  {/* {showPassword ? <FaEyeSlash className="mb-1" /> : <FaEye className="mb-1"/>} */}
                </button>
              </fieldset>

              {/* Confirm Password */}
              <fieldset className="relative border border-green-500 rounded-lg px-4 pt-1 pb-3 mt-4">
                <legend className="px-2 text-sm font-medium text-white/80">
                  Confirm Password
                </legend>

                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  className="w-full min-w-0 outline-none text-white bg-transparent pr-8 placeholder:text-gray-500"
                />

                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 bottom-3 cursor-pointer text-white"
                  aria-label="Toggle confirm password visibility"
                >
                  {showPassword ? (
                    <FaEyeSlash className="mb-1" />
                  ) : (
                    <FaEye className="mb-1" />
                  )}
                </button>
              </fieldset>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-5 text-white py-2 hover:bg-red-700 disabled:bg-gray-500 cursor-pointer border-y border-red-600 font-medium rounded-xl active:bg-red-700 transition"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>
          )}

          {/* Back to Login */}
          <button
            type="button"
            onClick={() => navigate("/login")}
            className="w-full mt-5 text-gray-300 hover:text-green-500 text-sm cursor-pointer transition"
          >
            ← Back to Login
          </button>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
