const { title } = require("process")
const STATUS=require("../../utils/statusCode")
const userSchema=require("../../model/userModel")
const tempUserSchema=require("../../model/tempUserModel")
const {signToken,verifyToken}=require("../../helpers/otpJwt")
const argon2=require("argon2")
const {generateOtp}=require("../../services/otpService")
const tempSave=require("../../helpers/tempUserSave")
const {registerVerifyOtp}=require("../../helpers/registerVerifyOtp")
const agenda=require("../../config/agenda")


const userAuth={
    loadLogin:async (req,res) => {
        try {
            console.log("load login triggered")

            res.render("user/auth/login",{layout:"layouts/userLayout",title:"Login"})

        } catch (error) {
            console.log(error)
        }
    },
    loadSignup:async (req,res) => {
       try {
            res.render("user/auth/signup",{layout:"layouts/userLayout",title:"SignUp"})
       } catch (error) {
            console.log(error)
       } 
    },
    verifySignUp:async (req,res) => {
        try {
            console.log("verify signup triggered")

            const {fullname,email,phone,password}=req.body

            const exisitingUser=await userSchema.findOne({email})

            if(exisitingUser)return res.status(STATUS.CONFLICT).json({message:` You have already an account using ${email}, Please login !`})
            
            await tempUserSchema.deleteOne({email})


            const hashedPassword=await argon2.hash(password)   
            
            const otp=generateOtp()

            console.log("Otp generated from registration : ",otp)

            const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 1) * 60 * 1000);

            const token=signToken({email,otpExpiry,fullname})

            await tempSave({
              email,
              hashedPassword,
              fullname,
              phone,
              otpExpiry,
              otp,
            });

            console.log("temp user saves")

            await agenda.now("send-otp-email", {
              email,
              otp,
              fullname,
            });


            res.cookie('otpEmailToken', token, {
                httpOnly: true,  // Cookie is not accessible via JavaScript (protection against XSS)
                secure: process.env.NODE_ENV === 'production', // Only sent in HTTPS in production
            });

            res.status(STATUS.CREATED).json({
                success: true,
                message: `We have sent an otp to ${email}, Please verify !`,
            });

        } catch (error) {
            console.error(error)
            res.status(STATUS.INTERNAL_SERVER_ERROR).json({
              success: false, 
              message: "Server error. Please try again.",
            });
        }
    },loadOtpPage:async (req,res) => {
        try {
            console.log("load otp page triggered ")

            let token=req.cookies.otpEmailToken

            let otpVerify=verifyToken(token)

            console.log("Token verify :",otpVerify)

            if (!otpVerify) return res.redirect("/signup");

            res.render("user/auth/otpPage",{layout:"layouts/userLayout",title:"Otp Page",email:otpVerify.email,otpExpiry:otpVerify.otpExpiry})
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports=userAuth