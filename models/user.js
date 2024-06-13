const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose=require("passport-local-mongoose");


const userSchema=new Schema({
    email:{
        type:String,
        required:true,
    }
})
// passport-local-mongoose automatically implement Username, hasing, salting and hash password 
userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);