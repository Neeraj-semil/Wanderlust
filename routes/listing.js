const express=require("express");
const router=express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../Utils/WrapAsync.js");
const {isLoggedIn,isOwner,validateListing}=require("../views/middleware");
const listingController=require("../controllers/listing.js");



//index route 
router.get("/", wrapAsync(listingController.Index));

//new listing create route using controller
router.get("/new",isLoggedIn, listingController.renderNewForm);

//show route for individual title
router.get("/:id", wrapAsync(listingController.showListing));

//create route for post request
router.post("/",isLoggedIn,validateListing, wrapAsync(listingController.createListing)
);

//edit route
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(listingController.renderEdit));

//update route
router.put("/:id",isLoggedIn,isOwner,validateListing, wrapAsync(listingController.updateListing));

//delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


module.exports=router;

