
const express=require("express")
const router=express.Router()
const otpController=require("../controller/authControlller/otpController")
const userAuthRegister=require("../controller/authControlller/userAuthRegister")
const {signupValidation}=require("../validators/signUpValidator")
const {validate}=require("../middlewares/validationMiddleware")
const protect = require("../middlewares/authMiddleware");
const otpResendLimiter=require("../middlewares/resendRateLimiter")
const userAuthLogin=require("../controller/authControlller/userAuthLogin")
const {loginValidation}=require("../validators/loginValidator")
const {forgotValidation}=require("../validators/forgotValidation")
const forgotController=require("../controller/authControlller/forgotController")
const {resetPasswordValidation}=require("../validators/resetPasswordValidation")

//for login

router.get("/login",userAuthLogin.loadLogin)
router.post("/login",loginValidation,validate,userAuthLogin.verifyLogin)

//for signup
router.get("/signup",userAuthRegister.loadSignup)
router.post("/signup",signupValidation,validate,userAuthRegister.verifySignUp)

//for otp
router.get("/sign-up/otp",userAuthRegister.loadOtpPage)
router.post("/verify-signup-otp",otpController.verifyOtpSignup)
router.post("/resend-otp",otpResendLimiter,otpController.resendOtp)
router.get("/forgot/otp",userAuthRegister.loadOtpPage)
router.post("/verify-forgot-otp",otpController.verifyForgotOtp)

//for forget password
router.post("/forget-password",forgotValidation,validate,otpResendLimiter,forgotController.setupForgot)
router.get("/reset-password",forgotController.loadResetPassword)
router.post("/reset-password",resetPasswordValidation,validate, forgotController.verifyResetPassword)



module.exports=router