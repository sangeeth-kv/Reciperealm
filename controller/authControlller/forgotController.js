const STATUS=require("../../utils/statusCode")
const userSchema=require("../../model/userModel")
const tempUserSchema=require("../../model/tempUserModel")
const {signToken,verifyToken}=require("../../helpers/otpJwt")
const {generateOtp}=require("../../services/otpService")
const argon2=require("argon2")
const tempSave=require("../../helpers/tempUserSave")
const getEmailOrPhone=require("../../helpers/getEmailOrPhone")
const {registerVerifyOtp}=require("../../helpers/registerVerifyOtp")
const agenda=require("../../config/agenda")


const forgotController={
    setupForgot:async (req,res) => {
        try {
            console.log("trigger setup forgot controller.")
            console.log("request body of forgot pass : ",req.body)
            const {emailorphone}=req.body
            const isEmail=getEmailOrPhone(emailorphone)

            const user=await userSchema.findOne(
                isEmail ? {email:emailorphone} : {phone:emailorphone}
            ).lean()

            if(!user){
            
                const errors = [
                  {
                    field: "emailorphone",
                    message: `You don't have an account using this ${
                      isEmail ? "email" : "phone number"}...!`,
                  },
                ];
                return res.status(STATUS.NOT_FOUND).json({success:false,errors})
            }   

            await tempUserSchema.deleteOne(isEmail ? {email:emailorphone} : {phone:emailorphone})

            const otp=generateOtp()
            console.log("otp in forget password :",otp)
            const otpExpiry =  new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 1) * 60 * 1000);
            const token=signToken({email:user.email,otpExpiry,fullname:user.fullname})

            await Promise.all([
              tempSave({                    // user saving done..
                email: user.email,
                hashedPassword: user.password,
                fullname: user.fullname,
                phone: user.phone,
                otpExpiry:otpExpiry,
                otp:otp,
              }),
              agenda.now("send-otp-email", {  //email sending done..
                email: user.email,
                otp,
                fullname: user.fullname,
              })
            ]);

            res.cookie('otpEmailToken', token, {
                httpOnly: true,  // Cookie is not accessible via JavaScript (protection against XSS)
                secure: process.env.NODE_ENV === 'production', // Only sent in HTTPS in production
            });

            return res.status(STATUS.CREATED).json({
                success: true,
                message: `We have sent an otp to ${user.email}, Please verify !`,
                redirectUrl:"/forgot/otp"
            });

        } catch (error) {
            console.log(error)
            res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                success: false, 
                message: "Server error. Please try again.",
            });
        }
    },
    loadResetPassword:async (req,res) => {
        try {
            console.log("Req cookies : ",req.cookies)
            if(!req.cookies.forgotEmailToken)return res.redirect("/login")
            res.render("user/auth/resetPassword",{layout:"layouts/userLayout",title:"Reset Password"})
        } catch (error) {
            console.log(error)
        }
    },
    verifyResetPassword:async (req,res) => {
        try {
            console.log("verify reset triggered")
            console.log("req body of verify rest paswrd : ",req.body)
            const token=req.cookies.forgotEmailToken
            if(!token)return res.status(STATUS.BAD_REQUEST).json({message:"Session timeout, again need to verify OTP",redirectUrl:"/login"})
            
            let decoded;
            try {
                decoded = verifyToken(token);
            } catch (error) {
                if(error.name==="TokenExpiredError")return res.status(STATUS.BAD_REQUEST).json({ message: "Session expired. Please re-verify OTP", redirectUrl: "/login" });
                return res.status(STATUS.UNAUTHORIZED).json({ message: "Invalid token." });
            }
            const user=await userSchema.findOne({email:decoded.userEmail})
            console.log("user founds in  : ",user)
            if(!user)return res.status(STATUS.NOT_FOUND).json({message:"User not found.!",redirectUrl:"/login"})
            const {password}=req.body
            const hashedPassword = await argon2.hash(password)
            user.password = hashedPassword;
            await user.save();
            res.clearCookie("forgotEmailToken");
            return res.status(STATUS.OK).json({success:true,message:"Password changed Successfully",redirectUrl:"/login"})
        } catch (error) {
          console.log(error);
          return res.status(STATUS.SERVER_ERROR).json({
            message: "Server error. Please try again later.",
          });

        }
    }
}
module.exports=forgotController