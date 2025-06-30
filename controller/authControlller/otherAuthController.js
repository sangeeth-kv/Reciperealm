const { refreshToken } = require("../../services/refreshTokenService");
const generateTokens=require("../../utils/generateToken")
const otherAuth={
    faceBookAuthStart:async (req,res,next) => {
        try {
            console.log("facebook auth hited started")
            next();
        } catch (error) {
         console.log(error)   
        }
    },
    faceBookAuthCallback:async (req,res) => {
        try {
            console.log("🟢 Facebook authentication successful, sending response...");
            const { user,accessToken,refreshToken } = req.user;
            console.log("user in controller of facebook auth:",user)
            console.log("access token in facebook auth callback : ",accessToken)
            console.log("refresh token in facebook auth callback : ",refreshToken)

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

            res.redirect("/");
        } catch (error) {
            console.log(error)
        }
    },
    googleAuthStart:async (req,res,next) => {
        try {
            console.log("googel auth started")
            next()
        } catch (error) {
            console.log(error)
        }
    },
    googleAuthCallback:async (req,res) => {
        try {
            console.log("🟢 Facebook authentication successful, sending response...");
            const {user,accessToken,refreshToken}=req.user
            console.log("user in google autht : ",user)
            console.log("access token in google auth : ",accessToken)
            console.log("refresh token in google auth : ",refreshToken)

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

            res.redirect("/");
        } catch (error) {
            console.log(error)
        }
    }
}

module.exports=otherAuth