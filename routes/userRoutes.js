
const express=require("express")
const router=express.Router()
const otpController=require("../controller/authControlller/otpController")
const userAuth=require("../controller/authControlller/userAuthLogin")
const {signupValidation}=require("../validators/signUpVallidator")
const {validate}=require("../middlewares/validationMiddleware")
const protect = require("../middlewares/authMiddleware");
const otpResendLimiter=require("../middlewares/resendRateLimiter")


router.get("/login",userAuth.loadLogin)
router.get("/signup",userAuth.loadSignup)
router.post("/signup",signupValidation,validate,userAuth.verifySignUp)
router.get("/sign-up/otp",userAuth.loadOtpPage)

router.post("/verify-otp",otpController.verifyOtpSignup)
router.post("/resend-otp",otpResendLimiter,otpController.resendOtp)
module.exports=router