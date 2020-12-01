/**************************** ****************************/
const mongoose = require("mongoose")

/**************************** ****************************/
const likeSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    post:{type:mongoose.Types.ObjectId,ref:"Post"},
    user:{type:mongoose.Types.ObjectId,ref:"User"},
},{
    timestamps:true,
})

/**************************** ****************************/
module.exports = mongoose.model("Like",likeSchema)