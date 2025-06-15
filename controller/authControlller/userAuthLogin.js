const { title } = require("process")
const STATUS=require("../../utils/statusCode")
const userSchema=require("../../model/userModel")


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
            console.log("load signup triggered")
            res.render("user/auth/signup",{layout:"layouts/userLayout",title:"SignUp"})
       } catch (error) {
        
       } 
    },
    verifySignUp:async (req,res) => {
        try {
            console.log("verify signup triggered")

            console.log("Req body : ",req.body)

            const {fullname,email,phone,password}=req.body

            const exisitingUser=userSchema.findOne({email})

            if(exisitingUser)return res.status(STATUS.CONFLICT).json({message:` You have already an account using ${email}, Please login !`})
            
            


            return res.status(STATUS.CREATED).json({success:true,message:"okeey"})
        } catch (error) {
            console.error(error)
        }
    },loadOtpPage:async (req,res) => {
        try {
            console.log("load otp page triggered ")
            res.render("user/auth/otpPage",{layout:"layouts/userLayout",title:"Otp Page",email:"hi"})
        } catch (error) {
            console.error(error)
        }
    }
}

module.exports=userAuth