const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
dotenv.config();

if (!process.env.SENDGRID_CREDENTIAL) {
  throw new Error("SENDGRID_API_KEY is missing");
}

if (!process.env.EMAIL_USER) {
  throw new Error("SMTP_SENDER_USER is missing");
}

sgMail.setApiKey(process.env.SENDGRID_CREDENTIAL);

const sendOTPEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: {
      email: process.env.EMAIL_USER,
      name: "FinTrack",
    },
    subject: "FinTrack OTP Verification",

    text: `Your FinTrack OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`.trim(),

    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>FinTrack</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
      </div>
    `.trim(),
  };

  try {
    const response = await sgMail.send(msg);

    console.log("OTP email sent successfully");
    console.log("Status Code:", response[0].statusCode);

    return response;
  } catch (error) {
    console.error("Error sending email:", {
      message: error.message,
      code: error.code,
      errors: error.response?.body?.errors,
    });

    throw error;
  }
};

module.exports = sendOTPEmail;