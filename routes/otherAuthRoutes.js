const express=require("express");
const passport=require("passport");
const router=express.Router();
const otherAuth=require("../controller/authControlller/otherAuthController")
require("../services/passport")

router.get("/facebook",otherAuth.faceBookAuthStart,passport.authenticate("facebook",{scope:["email"],session:false}))
router.get("/facebook/callback",passport.authenticate("facebook",{failureRedirect:"/login?error=user_not_found",session:false}),otherAuth.faceBookAuthCallback)

router.get("/google",otherAuth.googleAuthStart,passport.authenticate("google",{scope:["profile","email"],session:false}))
router.get("/google/callback",passport.authenticate('google', { failureRedirect: '/login?error=user_not_found',session:false }),otherAuth.googleAuthCallback,)
module.exports=router