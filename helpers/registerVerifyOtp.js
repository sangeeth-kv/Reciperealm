const { verifyToken } = require("../helpers/otpJwt");
const STATUS=require("../utils/statusCode")
const tempUserSchema=require("../model/tempUserModel")

async function verifyOtp(token,userOtp) {

    try {

        const decoded = verifyToken(token);

        if (!decoded)return "token_expired";

        const user=await tempUserSchema.findOne({email:decoded.email})
    
        if(!user)return "token_expired";

        if (!user.otpExpiry || Date.now() > new Date(user.otpExpiry).getTime())return "otp_expired";

        console.log(user)

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
