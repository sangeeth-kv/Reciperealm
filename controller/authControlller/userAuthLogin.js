const argon2=require("argon2")
const userSchema=require("../../model/userModel")
const getEmailOrPhone=require("../../helpers/getEmailOrPhone")
const STATUS=require("../../utils/statusCode")
const generateTokens=require("../../utils/generateToken")


const userAuthLogin={
    loadLogin:async (req,res) => {
        try {
            console.log("load login triggered")

            res.render("user/auth/login",{layout:"layouts/userLayout",title:"Login"})

        } catch (error) {
            console.log(error)
        }
    },
    verifyLogin:async (req,res) => {
        try {
            console.log("verify login triggered")
            console.log("req body of verifyLogin : ",req.body)
            const {emailorphone,password}=req.body

            const isEmail=getEmailOrPhone(emailorphone)

            const user=await userSchema.findOne(
                isEmail ? {email:emailorphone}:{phone:emailorphone}
            )
            
            if(!user)return res.status(STATUS.NOT_FOUND).json({message:`You dont have any account using this ${emailorphone}`})

            const isPassWord=await argon2.verify(user.password,password)

            if(!isPassWord)return res.status(STATUS.UNAUTHORIZED).json({message:"You have entered wrong password.!"})

            const {accessToken,refreshToken}=generateTokens(user)

            user.refreshToken=refreshToken

            await user.save()

            res.cookie('accessToken',accessToken,{
                httpOnly:true,
                secure:true,
                sameSite:"Strict",
                 maxAge: 15 * 60 * 1000
            })

            res.cookie('refreshToken',refreshToken,{
                httpOnly:true,
                secure:true,
                sameSite:"Strict",
                 maxAge:  7 * 24 * 60 * 60 * 1000,
            })

            return res.status(STATUS.OK).json({redirectUrl:"/",success:true})

            
        } catch (error) {
            console.log(error)
            res.status(STATUS.INTERNAL_SERVER_ERROR).json({
                success: false, 
                message: "Server error. Please try again.",
            });
        }
    }

}

module.exports=userAuthLogin