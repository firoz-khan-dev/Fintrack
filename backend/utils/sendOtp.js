const nodemailer = require("nodemailer")

const transporter =  nodemailer.createTransport({
    service : "gmail",
    auth:{
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
})

const sendOtpEmail = async (email, otp)=>{
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "FinTrack OTP verification",

        html: `
          <div style="font-family: Arial, sans-serif;">
        <h2>FinTrack</h2>

        <p>Your OTP for registration is:</p>

        <h1>${otp}</h1>

        <p>This OTP is valid for 5 minutes.</p>

        <p>Please do not share this OTP with anyone.</p>
      </div>
    `,
    })
}

module.exports = sendOtpEmail
