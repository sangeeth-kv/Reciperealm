
const express=require("express")
const app=express()
const dotenv=require("dotenv")
const expressLayouts = require('express-ejs-layouts');
dotenv.config()
const agenda=require("./config/agenda");
require("./services/emailOtp");
(async function () {
  await agenda.start();
})();
const path=require("path")
const cookieParser = require('cookie-parser'); 
const adminRoutes=require("./routes/adminRoutes")
const userAuthRoutes=require("./routes/userAuthRoutes")
const authRoutes=require("./routes/otherAuthRoutes")
const connectDB=require("./config/connectDB")



app.set('view engine','ejs')
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname,'public')))
app.use(expressLayouts);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser())


app.use("/accounts",userAuthRoutes)
app.use("/admin",adminRoutes)
// app.use("/",userRoutes)
app.use("/auth",authRoutes,()=>console.log("triddered"))


connectDB()
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));