const { verifyToken } = require("../helpers/otpJwt");
const STATUS=require("../utils/statusCode")
const tempUserSchema=require("../model/tempUserModel")

async function registerVerifyOtp(token) {
    console.log("here reaches..")
    const decoded = verifyToken(token);
    if (!decoded) {
        console.log("Invalid or expired token");
        return res.status(STATUS.BAD_REQUEST).json({message:"OTP has expired or Session timeout..!"})
    }

    const user=await tempUserSchema.findOne({email:decoded.email})
    console.log(user)


    console.log("Decoded payload from OTP token:", decoded);
    return decoded;
}

module.exports = { registerVerifyOtp };
