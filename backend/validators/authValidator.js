const {body}  = require("express-validator")


const registerValidator = [

    body("name").trim().notEmpty().withMessage("Name is required").isLength({max : 50}).withMessage("Name must not exceed 50 characters"),

    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please enter a valid email"),

    body("password").notEmpty().withMessage("Password is required").isLength({min : 6}).withMessage("Password must be at least 6 characters"),

    body("confirmPassword").notEmpty().withMessage("Confirm password is required"),
]

const loginValidator = [
    body("email").trim().notEmpty().withMessage("Email is required").isEmail().withMessage("Please Enter a valid email"),

    body("password").notEmpty().withMessage("password is required")
] 
module.exports = {registerValidator,loginValidator}