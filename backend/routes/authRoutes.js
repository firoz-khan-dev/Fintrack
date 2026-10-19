    const express = require("express")
    const routes = express.Router()
    const {login, refreshAccessToken,sendOtp,verifyOtpAndRegister, forgotPassword,verifyResetOtp,resetPassword} = require("../controllers/authController")
    const { loginValidator } = require("../validators/authValidator")
    const createProgressiveRateLimit = require("../middleware/progressiveRateLimit");

   
    const loginRateLimit = createProgressiveRateLimit();
    const sendOtpRateLimit = createProgressiveRateLimit();
    const verifyOtpRateLimit = createProgressiveRateLimit();

    routes.post("/send-otp",sendOtpRateLimit, sendOtp)
    routes.post("/verify-otp",verifyOtpRateLimit, verifyOtpAndRegister);
    routes.post("/login", loginRateLimit, loginValidator , login)
    routes.post("/refresh", refreshAccessToken)
    routes.post("/forgot-password", forgotPassword);
    routes.post("/verify-reset-otp", verifyResetOtp);
    routes.post("/reset-password", resetPassword);

    module.exports = routes