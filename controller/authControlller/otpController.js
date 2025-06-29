const STATUS=require("../../utils/statusCode")
const {generateOtp}=require("../../services/otpService")
const {signToken,verifyToken}=require("../../helpers/otpJwt")
const tempUserSchema=require("../../model/tempUserModel")
const {verifyOtp}=require("../../helpers/registerVerifyOtp")
const agenda=require("../../config/agenda")
const {saveUser}=require("../../helpers/saveUser")


const otpController={
    verifyOtpSignup:async (req,res) => {
        try {
            console.log("otp verify..")
            console.log("req body of verify token : ",req.body)
            const otp=req.body.otp
            const token=req.cookies.otpEmailToken;
            const validateOtp=await verifyOtp(token,otp)

            switch (validateOtp){
                case "token_expired":
                    return res.status(STATUS.BAD_REQUEST).json({ message: "Session expired. Please sign up again." });
                case "otp_expired":
                    return res.status(404).json({ message: "Otp expired. Request for new Otp." });
                case "invalid_otp":
                     return res.status(400).json({ message: "Invalid OTP. Please enter the right one" });
                case "success":
                    const { email } = verifyToken(token)
                    const saveResult = await saveUser(email);

                    if(!saveResult)return res.status(STATUS.BAD_REQUEST).json({message:"An error occured during sign up, please try again."})

                    res.clearCookie("otpEmailToken");

                    return res.status(STATUS.OK).json({
                        success: true,
                        message: `Hey ${saveResult.user} !Signup successfully completed, please login and continue`,
                        redirectUrl:"/login",
                        
                    });

                default:
                    return res.status(500).json({ message: "Unknown error during OTP verification." });
            }
        } catch (error) {
           console.error("verifyOtpSignup error:", error);
           return res
             .status(STATUS.SERVER_ERROR)
             .json({ message: "Internal Server Error" });
        }

    },
    resendOtp:async (req,res)=>{
        try {
            console.log("resend otp controller..")

            const token=req.cookies.otpEmailToken;

            if(!token)return res.status(STATUS.NOT_FOUND).json({message:"Session timeout, Need to Signup again"})
            
            const decoded=verifyToken(token)

            if(!decoded ||!decoded.email)return res.status(STATUS.UNAUTHORIZED).json({message:"Session expired, Please signup again."})

            console.log("Decoded token: ", decoded)

            const otp=generateOtp()

            console.log("otp in resend otp : ",otp)

            const otpExpiry = new Date(Date.now() + (parseInt(process.env.OTP_EXPIRY_MINUTES) || 1) * 60 * 1000);

            console.log("resend otp exp : ",otpExpiry)
            

            await Promise.all([
                 tempUserSchema.updateOne(
                { email: decoded.email },
                { otp, otpExpiry }
              ),

               agenda.now("send-otp-email", {
                email: decoded.email,
                otp,
                fullname: decoded.fullname || "User", // or pass real name from DB
              }),
            ]);
            

            const newToken=signToken({email:decoded.email,otpExpiry,fullname:decoded.fullname})

            res.cookie("otpEmailToken", newToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only sent in HTTPS in production
            });

            return res.status(STATUS.OK).json({success:true,message:`New OTP send to your ${decoded.email}.`,otpExpiry})
        } catch (error) {
            console.log(error)
            return res.status(STATUS.SERVER_ERROR).json({message:"Internal server error, Please try again."})
        } 
    },
    verifyForgotOtp:async (req,res) => {
        try{
            console.log("verify forgoto otp triggered..")
            console.log("req body of verify forgot otp : ",req.body)
            const otp=req.body.otp
            console.log("user otp is here : ",otp)
            const token=req.cookies.otpEmailToken;

            const validateOtp=await verifyOtp(token,otp)

            console.log("validation result : ",validateOtp)

             switch (validateOtp){
                case "token_expired":
                    return res.status(STATUS.BAD_REQUEST).json({ message: "Session expired. Please sign up again." });
                case "otp_expired":
                    return res.status(STATUS.BAD_REQUEST).json({ message: "Otp expired. Request for new Otp." });
                case "invalid_otp":
                     return res.status(STATUS.BAD_REQUEST).json({ message: "Invalid OTP. Please enter the right one" });
                case "success":

                const decoded = verifyToken(token);

                console.log("decode  :: :: ", decoded);

                const userEmailToken = signToken({ userEmail: decoded.email });

                res.cookie("forgotEmailToken", userEmailToken, {
                  httpOnly: true,
                  secure: process.env.NODE_ENV === "production",
                  maxAge: 10 * 60 * 1000, 
                });
                
                    res.clearCookie("otpEmailToken");

                    
                    return res.status(STATUS.OK).json({
                        success: true,
                        message: `OTP verification successfully completed.`,
                        redirectUrl:`/reset-password`,

                    });

                default:
                    return res.status(500).json({ message: "Unknown error during OTP verification." });
            }


        }catch(error){
            console.log(error)
            return res.status(STATUS.SERVER_ERROR).json({message:"Internal server error, Please try again."})
        }
    }
}

module.exports=otpController