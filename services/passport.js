const jwt = require('jsonwebtoken');
const FacebookStrategy = require('passport-facebook').Strategy;
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const userSchema = require('../model/userModel'); // your user schema
const passport=require("passport")
const generateTokens=require("../utils/generateToken")


// Facebook Strategy
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: process.env.FACEBOOK_CALLBACK_URL,
    profileFields: ['id', 'emails', 'name']
  },
  async (fbAccessToken, fbRefreshToken, profile, done) => {
    try {
        console.log("profile of auth user : ",profile)
      const email = profile.emails[0].value;
      let user = await userSchema.findOne({ email });
        console.log("here is the profile of facebook login : ",profile)
      if (!user) {
          
          user = await userSchema.create({
          facebookId:profile.id,
          fullname: `${profile.name.givenName} ${profile.name.familyName}`,
          email: email,
        //   profileImage:profileImage, // You can update this as needed
          createdAt: new Date()
        })
      }

      const {accessToken,refreshToken}=generateTokens(user)
      user.refreshToken=refreshToken
      await user.save()

     
      done(null, { user,accessToken,refreshToken });
    } catch (err) {
      done(err, null);
    }
  }
));

// Google Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
  },
  async (googleAccessToken, googleRefreshToken, profile, done) => {
    try {
      const email = profile.emails[0].value;
      let user = await userSchema.findOne({ email });
      console.log("here is the profile for google login : ",profile);
      

      if (!user) {
        user = await userSchema.create({
          googleId:profile.id,
          fullname: profile.displayName,
          email: email,
          createdAt: new Date(),
          phone:null
        });
      }


      // Generate JWT after authentication
      const {accessToken,refreshToken} = generateTokens(user);

      user.refreshToken=refreshToken
      await user.save()
      
      done(null, { user, accessToken,refreshToken });
    } catch (err) {
      done(err, null);
    }
  }
));
