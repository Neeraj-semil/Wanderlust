if(process.env.NODE_ENV!="production"){

    require('dotenv').config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError=require("./Utils/ExpressError.js");
const session=require("express-session");
const MongoStore=require("connect-mongo");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const User=require("./models/user.js");
const listings=require("./routes/listing.js");
const reviews=require("./routes/review.js");
const user=require("./routes/user.js");

//mongodb connection
// let MONGO_URL = "mongodb+srv://neerajsemil7:CDaIzIAvYPvU0u39@cluster0.udrnxjt.mongodb.net/wanderlust?retryWrites=true&w=majority&appName=Cluster0";
const dbUrl=process.env.ATLAS_CONNECTION;
main().then(() => {
    console.log("db connected");
}).catch((err) => {
    console.log(err);
})
async function main() {
    await mongoose.connect(dbUrl);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname, "/public")));



const store=MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:process.env.SECRET
    },
    touchAfter:24*3600,
})

store.on("error",()=>{
    console.log("error in mongo session store",err);
})

const sessionOptions={
    store,
    secret:process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+ 7 * 24 * 60 * 60 * 1000,
        maxAge:7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    },
}
//root route 
// app.get("/", (req, res) => {
//     res.send("i am root");
// })


app.use(session(sessionOptions));
app.use(flash());

// passport implementation
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




// flash middleware 
app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})

// demoUser
// app.get("/demoUser", async(req,res)=>{
//     let fakeUser=new User({
//         email:"abc@gmail.com",
//         username:"delta-student",
//     })
//     let registeredUser=await User.register(fakeUser,"helloworld");
//     res.send(registeredUser);
// })

app.use("/listings",listings);
app.use("/listings/:id/reviews",reviews);
app.use("/",user);



// default error if route not match for the ones 
app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"Page not found"));
})
 
// middleware to handle async error 
app.use((err, req, res, next) => {
    let {statusCode=500,message="Something went wrong!"}=err;
    res.status(statusCode).render("error.ejs",{message});
    // res.status(statusCode).send(message);
})

app.listen(8080, () => {
    console.log("server is listening to 8080");
})