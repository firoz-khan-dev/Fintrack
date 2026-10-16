    const express = require("express")
    const routes = express.Router()
    const {login, refreshAccessToken,sendOtp,verifyOtpAndRegister, forgotPassword,verifyResetOtp,resetPassword} = require("../controllers/authController")
    const { loginValidator } = require("../validators/authValidator")

    

    routes.post("/send-otp", sendOtp)
    routes.post("/verify-otp", verifyOtpAndRegister);
    routes.post("/login", loginValidator , login)
    routes.post("/refresh", refreshAccessToken)
    routes.post("/forgot-password", forgotPassword);
    routes.post("/verify-reset-otp", verifyResetOtp);
    routes.post("/reset-password", resetPassword);

    module.exports = routes