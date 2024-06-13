const express=require("express");
const router=express.Router({mergeParams:true});
const Listing = require("../models/listing.js");
const wrapAsync = require("../Utils/WrapAsync.js");
const ExpressError=require("../Utils/ExpressError.js");
const Review = require("../models/review.js");
const {validateReview,isLoggedIn,isReviewAuthor}=require("../views/middleware");
const reviewController=require("../controllers/reviews.js");






//post review route
router.post("/",isLoggedIn,validateReview,wrapAsync(reviewController.createReview));
  
  // delete review route
  router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(reviewController.destroyReview));


  module.exports=router;