
const express=require("express")
const router=express.Router()
const userAuth=require("../controller/authControlller/userAuthLogin")
const {signupValidation}=require("../validators/signUpVallidator")
const {validate}=require("../middlewares/validationMiddleware")
const protect = require("../middlewares/authMiddleware");

router.get("/login",userAuth.loadLogin)
router.get("/signup",userAuth.loadSignup)
router.post("/signup",signupValidation,validate,userAuth.verifySignUp)
router.get("/sign-up/otp",userAuth.loadOtpPage)

module.exports=router