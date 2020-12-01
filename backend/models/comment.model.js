/**************************** ****************************/
const mongoose = require("mongoose")

/**************************** ****************************/
const commentSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    content:{type:String,required:true},
},{
    timestamps:true,
})

/**************************** ****************************/
module.exports = mongoose.model("Comment",commentSchema)