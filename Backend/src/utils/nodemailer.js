const nodemailer = require("nodemailer");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true, 
    auth: {
        type: 'OAuth2',
        user: 'meallion123@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
      },
});

const sendOTP = async (email, otp) => {
    console.log("CLIENT_ID:", CLIENT_ID);
    console.log("CLIENT_SECRET:", CLIENT_SECRET);
    console.log("REFRESH_TOKEN:", REFRESH_TOKEN);
    const MailOptions = {
            from: '"Meallion" <meallion123@gmail.com>',
            to: email,
            subject: "OTP",
            text: otp, // plain‑text body
            html: `
                    <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                    <h2 style="color: #333;">Hello 👋</h2>
                    <p>Here’s your <strong>One-Time Password (OTP)</strong> to continue:</p>
                    <div style="text-align: center; margin: 20px 0;">
                        <span style="display: inline-block; font-size: 28px; letter-spacing: 8px; background: #f3f3f3; padding: 10px 20px; border-radius: 8px; border: 1px solid #ccc;">
                        ${otp}
                        </span>
                    </div>
                    <p style="font-size: 14px; color: #555;">⚠️ This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
                    <p style="font-size: 12px; color: #888;">If you didn’t request this, please ignore this email.</p>
                    <hr style="margin: 20px 0;">
                    <p style="font-size: 12px; color: #aaa; text-align: center;">© 2025 Meallion. All rights reserved.</p>
                    </div>
                `, // HTML body
        }
    await transporter.sendMail(MailOptions);
}

module.exports = { transporter, sendOTP };