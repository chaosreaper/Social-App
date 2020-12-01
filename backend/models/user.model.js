/**************************** ****************************/
const mongoose = require("mongoose")
const passport = require("passport")
const passportLocalMongoose = require("passport-local-mongoose")

/**************************** ****************************/
const userSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    username:{type:String,required:true,unique:true},
    email:{type:String,required:true,unique:true},
    password:{type:String},
    userImg:{data: Buffer,contentType:String,text:String},
    bio:{type:String},
    location:{type:String},
    website:{type:String},
    posts:[{type:mongoose.Types.ObjectId,ref:"Post"}],
    likes:[{type:mongoose.Types.ObjectId,ref:"Like"}],
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
    notifications:[{type:mongoose.Types.ObjectId,ref:"Notification"}],
},{
    timestamps:true,
})

userSchema.plugin(passportLocalMongoose)
/**************************** ****************************/
const User = mongoose.model("User",userSchema)

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

/**************************** ****************************/
module.exports = User