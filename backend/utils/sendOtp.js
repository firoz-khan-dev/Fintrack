const sgMail = require("@sendgrid/mail");
const dotenv = require("dotenv");
const path = require("path");

// Load .env from the backend folder
dotenv.config({
  path: path.resolve(__dirname, "../.env"),
  override: true,
});

// Read environment variables
const apiKey = process.env.SENDGRID_API_KEY?.trim();
const senderEmail = process.env.EMAIL_USER?.trim();



// Validate configuration
if (!apiKey) {
  throw new Error(
    "SENDGRID_API_KEY is missing. Check backend/.env"
  );
}

if (!apiKey.startsWith("SG.")) {
  throw new Error(
    "SENDGRID_API_KEY format is incorrect. Check your SendGrid API key."
  );
}

if (!senderEmail) {
  throw new Error(
    "EMAIL_USER is missing. Check backend/.env"
  );
}

// Configure SendGrid
sgMail.setApiKey(apiKey);

// Send OTP email
const sendOTPEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: {
      email: senderEmail,
      name: "FinTrack",
    },
    subject: "FinTrack OTP Verification",
    text: `Your FinTrack OTP is ${otp}. It is valid for 5 minutes. Do not share it with anyone.`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto;">
        <h2 style="color: #16a34a;">FinTrack</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="letter-spacing: 5px;">${otp}</h1>
        <p>This OTP is valid for 5 minutes.</p>
        <p>Please do not share this OTP with anyone.</p>
      </div>
    `,
  };

  try {
    const [response] = await sgMail.send(msg);

    console.log("OTP email sent successfully");
    console.log("Status Code:", response.statusCode);

    return response;
  } catch (error) {
    console.error("SendGrid email error:", {
      statusCode: error.code,
      message: error.message,
      details: error.response?.body?.errors,
    });

    throw error;
  }
};

module.exports = sendOTPEmail;
