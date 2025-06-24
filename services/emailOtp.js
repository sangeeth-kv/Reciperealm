// jobs/sendOtp.js
const nodemailer = require('nodemailer');
const agenda = require('../config/agenda');

agenda.define('send-otp-email', async (job) => {

  const { email, otp, fullname } = job.attrs.data;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_EMAIL,
    to: email,
    subject: 'Your OTP Code',
     html: `
  <div style="font-family: Arial, sans-serif; background-color: #f7f7f7; padding: 30px;">
    <div style="max-width: 500px; margin: auto; background: white; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
      <h2 style="color: #4CAF50; text-align: center;">RecipiRealm OTP Verification</h2>
      <p style="font-size: 16px; color: #333;">Hello 👋,</p>
      <p style="font-size: 16px; color: #333;">
        Hey ${fullname}, here is your One-Time Password (OTP) to verify your account. It is valid for <strong>1 minute</strong> only:
      </p>
      <div style="text-align: center; margin: 20px 0;">
        <span style="font-size: 28px; font-weight: bold; color: #ffffff; background: #4CAF50; padding: 10px 20px; border-radius: 8px; letter-spacing: 3px;">
          ${otp}
        </span>
      </div>
      <p style="font-size: 14px; color: #777;">
        If you didn't request this, please ignore this email.
      </p>
      <p style="font-size: 14px; color: #777; text-align: center; margin-top: 30px;">
        — Team RecipiRealm
      </p>
    </div>
  </div>
`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`✅ OTP email sent to ${email}`);
});
