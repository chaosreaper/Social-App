/**************************** ****************************/
const mongoose = require("mongoose")

/**************************** ****************************/
const notifSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    postOwner:{type:mongoose.Types.ObjectId,ref:"User"},
    type:{type:String,required:true},
    linkedId:{type:mongoose.Types.ObjectId},
    seen:{type:Boolean,required:true},
},{
    timestamps:true,
})

/**************************** ****************************/
module.exports = mongoose.model("Notification",notifSchema)