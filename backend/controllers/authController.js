const OTP = require("../models/otpModel");
const sendOtpEmail = require("../utils/sendOtp");
const User = require("../models/user");

const Activity = require("../models/activityModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");

// reset opt
async function resetPassword(req, res) {
  try {
    const {email,otp,newPassword,confirmPassword,} = req.body;

    if ( !email ||!otp ||!newPassword ||!confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).send({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // Find OTP
    const otpData = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp,
    });

    if (!otpData) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (otpData.expireAt < new Date()) {
      await OTP.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).send({
        success: false,
        message: "OTP has expired",
      });
    }

    // Find user
    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      newPassword,
      10
    );

    // Update password
    user.password = hashedPassword;

    await user.save();

    // Delete used OTP
    await OTP.deleteOne({
      _id: otpData._id,
    });

    return res.status(200).send({
      success: true,
      message: "Password reset successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Failed to reset password",
      error: error.message,
    });
  }
}

//verify otp reset
async function verifyResetOtp(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({
        success: false,
        message: "Email and OTP are required",
      });
    }

    const otpData = await OTP.findOne({
      email: email.toLowerCase(),
      otp: otp,
    });

    if (!otpData) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (otpData.expireAt < new Date()) {
      await OTP.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).send({
        success: false,
        message: "OTP has expired",
      });
    }

    return res.status(200).send({
      success: true,
      message: "OTP verified successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Failed to verify OTP",
      error: error.message,
    });
  }
}

// forget password
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase(),
    });

    if (!user) {
      return res.status(404).send({
        success: false,
        message: "User not found",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expireAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    await OTP.deleteMany({
      email: email.toLowerCase(),
    });

    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expireAt,
    });

    await sendOtpEmail(
      email.toLowerCase(),
      otp
    );

    return res.status(200).send({
      success: true,
      message: "Password reset OTP sent successfully",
    });
  } catch (error) {
    console.log(error);

    return res.status(500).send({
      success: false,
      message: "Failed to send password reset OTP",
      error: error.message,
    });
  }
}

// send opt
const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({
        success: false,
        message: "Email is required",
      });
    }

    // Check email already exists
    const existingUser = await User.findOne({
      email: email.toLowerCase(),
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }

    // Generate 6 digit OTP
    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // OTP valid for 5 minutes
    const expireAt = new Date(
      Date.now() + 5 * 60 * 1000
    );

    // Delete old OTP
    await OTP.deleteMany({
      email: email.toLowerCase(),
    });

    // Save new OTP
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      expireAt,
    });

    // Send OTP to email
    await sendOtpEmail(email, otp);

    return res.status(200).send({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    console.log("OTP error:", error);

    return res.status(500).send({
      success: false,
      message: "Failed to send OTP",
    });
  }
};


// Verify OTP and Register
async function verifyOtpAndRegister(req, res) {
  try {
    const { name, email, password, confirmPassword, otp } = req.body;

    // Check required fields
    if (!name || !email || !password || !confirmPassword || !otp) {
      return res.status(400).send({
        success: false,
        message: "All fields are required",
      });
    }

    // Check password
    if (password !== confirmPassword) {
      return res.status(400).send({
        success: false,
        message: "Password and confirm password do not match",
      });
    }

    const lowerEmail = email.toLowerCase();

    // Check user already exists
    const existingUser = await User.findOne({
      email: lowerEmail,
    });

    if (existingUser) {
      return res.status(400).send({
        success: false,
        message: "Email already registered",
      });
    }

    // Find OTP
    const otpData = await OTP.findOne({
      email: lowerEmail,
      otp: otp,
    });

    if (!otpData) {
      return res.status(400).send({
        success: false,
        message: "Invalid OTP",
      });
    }

    // Check OTP expiry
    if (otpData.expireAt < new Date()) {
      await OTP.deleteOne({
        _id: otpData._id,
      });

      return res.status(400).send({
        success: false,
        message: "OTP has expired",
      });
    }

    // Hash password
    const hashPassword = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await User.create({
      name,
      email: lowerEmail,
      password: hashPassword,
    });

    // Delete OTP after successful registration
    await OTP.deleteOne({
      _id: otpData._id,
    });

    // Access token
    const accessToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      }
    );

    // Refresh token
    const refreshToken = jwt.sign(
      {
        id: newUser._id,
        role: newUser.role,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      }
    );

    return res.status(201).send({
      success: true,
      message: "User registered successfully",
      accessToken,
      refreshToken,
      role: newUser.role,
      name: newUser.name,
    });

  } catch (error) {
    console.log("Verify OTP Register error:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong",
    });
  }
}

// Login
async function login(req, res) {
  try {
    // Validator error
    const error = validationResult(req);

    if (!error.isEmpty()) {
      return res.status(400).send({
        success: false,
        error: error.array(),
      });
    }

    const { email, password } = req.body;

    // Find user
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.status(401).send({
        success: false,
        message: "Email or password Invalid",
      });
    }

    // Compare password
    const isPasswordMatch = await bcrypt.compare(password, userData.password);

    if (!isPasswordMatch) {
      return res.status(401).send({
        success: false,
        message: "Email or password Invalid",
      });
    }

    // Access token
    const accessToken = jwt.sign(
      {
        id: userData._id,
        role: userData.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    // Refresh token
    const refreshToken = jwt.sign(
      {
        id: userData._id,
        role: userData.role,
      },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: "7d",
      },
    );

    // CREATE LOGIN ACTIVITY
    const activity = await Activity.create({
      userId: userData._id,
      type: "login",
    });

    console.log("Activity created:", activity);

    // Response
    return res.status(200).send({
      success: true,
      message: "Login successfully",
      accessToken,
      refreshToken,
      role: userData.role,
      name: userData.name,
    });
  } catch (error) {
    console.log("Login error:", error);

    return res.status(500).send({
      success: false,
      message: "Something went wrong in login",
    });
  }
}

// Refresh Access Token
async function refreshAccessToken(req, res) {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).send({
        success: false,
        message: "Refresh token is required",
      });
    }

    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

    const accessToken = jwt.sign(
      {
        id: decoded.id,
        role: decoded.role,
      },
      process.env.JWT_ACCESS_SECRET,
      {
        expiresIn: "15m",
      },
    );

    return res.status(200).send({
      success: true,
      message: "Access token refreshed successfully",
      accessToken,
    });
  } catch (error) {
    console.log("Refresh token error:", error);

    return res.status(401).send({
      success: false,
      message: "Invalid or expired refresh token",
    });
  }
}

module.exports = {
  login,
  refreshAccessToken,
  sendOtp,
  verifyOtpAndRegister,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
};
