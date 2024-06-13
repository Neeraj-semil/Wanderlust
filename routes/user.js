const express = require("express");
const router = express.Router();
const User = require("../models/user");
const WrapAsync = require("../Utils/WrapAsync");
const passport=require("passport");
const { saveRedirectUrl } = require("../views/middleware");
const userController=require("../controllers/user");

// sign up route
router.get("/signup",userController.renderSignup );

router.post("/signup", WrapAsync(userController.signup))

// login get route
router.get("/login",userController.renderLogin)

// login post route 
router.post("/login",saveRedirectUrl,
 passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), 
 userController.login)

// logout get route 
router.get("/logout",userController.logout)


module.exports = router;