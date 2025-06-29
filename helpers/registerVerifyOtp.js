const { verifyToken } = require("../helpers/otpJwt");
const tempUserSchema=require("../model/tempUserModel");

async function verifyOtp(token,userOtp) {

    try {

        const decoded = verifyToken(token);

        if (!decoded)return "token_expired";

        const user=await tempUserSchema.findOne({email:decoded.email})

        console.log("user in verify otp : ",user)
    
        if(!user)return "token_expired";

       

        const otpExpiry = user.otpExpiry ? new Date(user.otpExpiry).getTime() : 0;

         const now = Date.now();
        console.log("OTP Expiry:", new Date(user.otpExpiry));   // Human readable
        console.log("Current Time:", new Date(now));  
        console.log("Time Remaining (ms):", otpExpiry - now);

       if (Date.now() > otpExpiry) return "otp_expired";
        

        if(user.otp!==userOtp.trim())return "invalid_otp"
        
        user.otp=null

        await user.save()

        return "success"

    } catch (error) {
        console.error("verifyOtp error:", error);
        return 'expired';
    }

    
}

module.exports = { verifyOtp };
