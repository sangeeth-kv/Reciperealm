// middlewares/rateLimiter.js
const rateLimit = require('express-rate-limit');

const otpResendLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute window
  max: 1,              // limit each IP/email to 1 request per windowMs
  message: {
    success: false,
    message: 'You can only request OTP once per minute. Please wait.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = otpResendLimiter;
