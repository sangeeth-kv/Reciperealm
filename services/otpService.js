// services/otpService.js

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000); // generates a 6-digit OTP
}

module.exports = { generateOtp };
