const { Resend } = require("resend");
const resend = new Resend(process.env.RESEND_API_KEY);

const sendOTP = async (email, otp) => {
  try {
    console.log(`[Resend] Mencoba mengirim OTP ke ${email}...`);
    
    const { data, error } = await resend.emails.send({
      from: "Meallion <otp@meallion.xyz>",
      to: email,
      subject: "Your Meallion OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #333;">Hello 👋</h2>
          <p>Here's your <strong>One-Time Password (OTP)</strong> to continue:</p>
          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; font-size: 28px; letter-spacing: 8px; background: #f3f3f3; padding: 10px 20px; border-radius: 8px; border: 1px solid #ccc;">
              ${otp}
            </span>
          </div>
          <p style="font-size: 14px; color: #555;">⚠️ This code will expire in <strong>5 minutes</strong>. Do not share it with anyone.</p>
          <p style="font-size: 12px; color: #888;">If you didn't request this, please ignore this email.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 12px; color: #aaa; text-align: center;">© 2025 Meallion. All rights reserved.</p>
        </div>
      `,
    });

    if (error) {
      console.error("[Resend] API Error:", error.message);
      throw new Error(`Resend API Error: ${error.message}`);
    }

    console.log(`[Resend] OTP Sukses Dikirim! ID: ${data.id}`);
    return data;

  } catch (error) {
    console.error("[Resend] Gagal mengeksekusi fungsi sendMail:", error.message);
    throw new Error(`Mailer error: ${error.message}`);
  }
};

module.exports = { sendOTP };