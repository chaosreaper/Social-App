/**************************** ****************************/
const mongoose = require("mongoose")

/**************************** ****************************/
const postSchema = new mongoose.Schema({
    _id:{type:mongoose.Types.ObjectId},
    user:{type:mongoose.Types.ObjectId,ref:"User"},
    content:{type:String,required:true},
    postImg:{data: Buffer,contentType:String,text:String},
    likes:[{type:mongoose.Types.ObjectId,ref:"Like"}],
    comments:[{type:mongoose.Types.ObjectId,ref:"Comment"}],
},{
    timestamps:true,
})

/**************************** ****************************/
module.exports = mongoose.model("Post",postSchema)