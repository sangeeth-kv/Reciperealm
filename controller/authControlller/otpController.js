const STATUS=require("../../utils/statusCode")
const {generateOtp}=require("../../services/otpService")
const {signToken,verifyToken}=require("../../helpers/otpJwt")
const tempUserSchema=require("../../model/tempUserModel")
const {registerVerifyOtp}=require("../../helpers/registerVerifyOtp")
const agenda=require("../../config/agenda")
const { decode } = require("jsonwebtoken")


const otpController={
    verifyOtp:async (req,res) => {
        try {
            console.log("otp verify..")
            const token=req.cookies.otpEmailToken;
            const decoded=verifyToken(token)
            console.log("this is decoded token in verify otp",token) 
        } catch (error) {
           console.log(error) 
        }

    },
    resendOtp:async (req,res)=>{
        try {
            console.log("resend otp controller..")
            console.log("otp verify..")
            const token=req.cookies.otpEmailToken;

            if(!token)return res.status(STATUS.NOT_FOUND).json({message:"Session timeout, Need to Signup again"})
            
            const decoded=verifyToken(token)

            if(!decoded ||!decoded.email)return res.status(STATUS.UNAUTHORIZED).json({message:"Session expired, Please signup again."})

            console.log("Decoded token: ", decoded)

            const otp=generateOtp()
            const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 1) * 60 * 1000);

            await tempUserSchema.updateOne({email:decoded.email},{otp,otpExpiry})


            await agenda.now("send-otp-email", {
                email:decoded.email,
                otp,
                fullname:decoded.fullname || "User", // or pass real name from DB
            });

            const newToken=signToken({email:decoded.email,otpExpiry,fullname:decoded.fullname})

            res.cookie("otpEmailToken", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only sent in HTTPS in production
            });

            console.log("all done")

            return res.status(STATUS.OK).json({success:true,message:`New OTP send to your ${decoded.email}.`,otpExpiry})
        } catch (error) {
            console.log(error)
            return res.status(STATUS.SERVER_ERROR).json({message:"Internal server error, Please try again."})
        }
       

        
    }
}

module.exports=otpController