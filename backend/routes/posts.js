/**************************** ****************************/
const router = require("express").Router()
const mongoose = require("mongoose")

/**************************** MULTER ****************************/
const multer = require("multer")
const {v4:uuidv4} = require("uuid")
const fs = require("fs")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/posts/")
    },
    filename:(req,file,cb)=>{
        cb(null , uuidv4()+"-"+uuidv4()+"."+file.originalname.split('.')[1])
    }
})

const fileFilter = (req,file,cb) => {
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/png"){
        cb(null,true)
    }else{
        cb(null,false)
    }
}

const uploadFile = multer({storage:storage , fileFilter:fileFilter}).single("img")

/**************************** MODELS IMPORT ****************************/
const Post = require("../models/post.model")
const Like = require("../models/like.model")
const Notification = require("../models/notif.model")
const Comment = require("../models/comment.model")
const { types } = require("util")
const User = require("../models/user.model")

/**************************** ROUTES ****************************/
// get all post
router.route("/").get( async (req,res)=>{    


    const posts = await Post.find()
                    .populate({path:"user",select:["username","userImg"]})
                    .populate({path:"likes",populate:{path:"user",select:["username","userImg"]}})
                    .populate({path:"comments",populate:{path:"user",select:["username","userImg"]},options:{sort:{createdAt:-1}}})
                    .sort({createdAt:-1})
                    .catch(err => {return res.json({status:"failure",error:"error",result:err.message})})

    return res.json({status:"succes",error:"none",result:posts})
})


/************************************************************/
// get a post
router.route("/:postId").get(async (req,res)=>{

    if(req.params.postId.length !==24)
        return res.json({status:"failure",error:"post_id",result:"please use a valid post id"})

    const id = new mongoose.Types.ObjectId(req.params.postId)

    const post = await Post.findById(id).populate("users","username")
            .populate({path:"likes",populate:{path:"user",select:["username","userImg"]}})
            .populate({path:"comments",populate:{path:"user",select:["username","userImg"]},options:{sort:{createdAt:-1}}})
            .catch(err => res.json({status:"failure",error:err,result:err.message}))

   return res.json({status:"succes",error:"none",result:post})

})


/************************************************************/
// create a post
router.route("/add").post(uploadFile,async (req,res)=>{

    //check AUTH
    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:"only memebres can create posts"})

    //validate content
    if(req.body.content === undefined )
        return res.json({status:"failure",error:"post",result:"every post need some content"})

    //create document
    const post = new Post({
        _id:new mongoose.Types.ObjectId(),
        user:req.user,
        content:req.body.content,
        postImg:req.file!== undefined && {
            data:fs.readFileSync(req.file.path),
            contentType:req.file.mimetype,
            text:req.file.filename,
        }
    })


    //save
    await post.save().then(post => {
        req.user.posts.push(post)
        req.user.save()
        return res.json({status:"success",error:"none",result:"Post Created Successfully",post})
    })
    .catch(err => {
        return res.json({status:"failure",error:"error",result:err.message})
    })

})


/************************************************************/
// like/unlike post
router.route("/:postId/like").post(async (req,res)=>{

    //check post id validation
    if(req.params.postId.length !==24)
        return res.json({status:"failure",error:"post_id",result:"please use a valid post id"})

    const id = new mongoose.Types.ObjectId(req.params.postId)

    //check AUTH
    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:"only memebres can like / unlike posts"})

    //find POST
    await Post.findById(id)
            .then(post =>{
                if(post){

                    //check if liked
                    Like.findOneAndDelete({post:post._id,user:req.user._id})
                    .then(like => {
                        if(like){
                            
                            //if yes then remove it from related collections
                            post.likes.remove(like._id)
                            post.save()

                            req.user.likes.remove(like._id)
                            req.user.save()

                                Notification.findOneAndDelete({linkedId:like._id})
                                .then(notif => {
                                    if(notif){
                                        User.findById(notif.postOwner)
                                        .then(user =>{
                                            user.notifications.remove(notif._id)
                                            user.save()
                                        })
                                    }
                                })
                                .catch(err => {throw err})

                            return res.json({status:"success",error:"none",result:"post unliked"})
                        }else{

                            //if no the create document
                            const like = new Like({
                                _id:new mongoose.Types.ObjectId(),
                                post:post,
                                user:req.user
                            })

                            like.save()
                            .then(()=>{

                                //add it to related collections
                                post.likes.push(like)
                                post.save()

                                req.user.likes.push(like)
                                req.user.save()

                                //if the user isn't the owner of the post send a notif
                                if(!req.user.equals(post.user)){

                                    const notification = new Notification({
                                        _id:new mongoose.Types.ObjectId(),
                                        post:post,
                                        user:req.user,
                                        postOwner:post.user,
                                        type:"like",
                                        linkedId:like._id,
                                        seen:false,
                                    })

                                    notification.save()
                                    .then(()=> {
                                        User.findById(notification.postOwner)
                                        .then(user =>{

                                            //add the notif to the related collection
                                            user.notifications.push(notification)
                                            user.save()
                                        })
                                        .catch(err => {throw err})
                                    })
                                    .catch(err => {throw err})

                                }
                            return res.json({status:"success",error:"none",result:"post liked"})
                            })
                            .catch(err => res.json({status:"failure",error:err,result:err.message}))

                        }
                    })
                   .catch(err => res.json({status:"failure",error:err,result:err.message}))

                }else{
                    return res.json({status:"failure",error:"not found",result:"the post you requested doesn't existe or has been deleted"})
                }
            })
           .catch(err => res.json({status:"failure",error:err,result:err.message}))
})


/************************************************************/
// comment on post
router.route("/:postId/comment").post(async (req,res)=>{
    //check post id validation
    if(req.params.postId.length !==24)
        return res.json({status:"failure",error:"post_id",result:"please use a valid post id"})

    const id = new mongoose.Types.ObjectId(req.params.postId)

    //check AUTH
    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:"only memebres can comment / uncomment posts"})

    //find POST
    await Post.findById(id)
            .then(post =>{
                if(post){

                    //validate content
                    if(req.body.content === undefined )
                        return res.json({status:"failure",error:"comment",result:"every comment need some content"})

                    const comment = new Comment({
                        _id:new mongoose.Types.ObjectId(),
                        post:post,
                        user:req.user,
                        content:req.body.content,
                    })

                    comment.save()
                    .then(()=>{

                        //add it to related collections
                        post.comments.push(comment)
                        post.save()

                        req.user.comments.push(comment)
                        req.user.save()

                        //if the user isn't the owner of the post send a notif
                        if(!req.user.equals(post.user)){
                            const notification = new Notification({
                                _id:new mongoose.Types.ObjectId(),
                                post:post,
                                user:req.user,
                                postOwner:post.user,
                                type:"comment",
                                linkedId:comment._id,
                                seen:false,
                        })

                        notification.save()
                        .then(()=> {
                            User.findById(notification.postOwner)
                            .then(user =>{

                                //add the notif to the related collection
                                user.notifications.push(notification)
                                user.save()
                            })
                            .catch(err => {throw err})
                        })
                        .catch(err => {throw err})
                        }
                    return res.json({status:"success",error:"none",result:"post commented"})
                    })
                    .catch(err => res.json({status:"failure",error:err,result:err.message}))
                }else{
                    return res.json({status:"failure",error:"not found",result:"the post you requested doesn't existe or has been deleted"})
                }
            })
            .catch(err => res.json({status:"failure",error:err,result:err.message}))        
})


/************************************************************/
// uncomment on post
router.route("/:postId/:commentId/delete").delete(async (req,res)=>{

    if(req.params.postId.length !==24 || req.params.commentId.length !==24)
    return res.json({status:"failure",error:"post_id / comment_id",result:"please use a valid post id"})

    const id = new mongoose.Types.ObjectId(req.params.postId)

    //check AUTH
    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:"only memebres can comment / uncomment posts"})


    //find POST
    await Post.findById(id)
    .then(post =>{
        if(post){

            //check if existe
            Comment.findOneAndDelete({post:post._id,user:req.user._id,_id:req.params.commentId})
            .then(comment => {
                if(comment){
                    
                    //if yes then remove it from related collections
                    post.comments.remove(comment._id)
                    post.save()

                    req.user.comments.remove(comment._id)
                    req.user.save()

                        Notification.findOneAndDelete({linkedId:comment._id})
                        .then(notif => {
                            if(notif){
                                User.findById(notif.postOwner)
                                .then(user =>{
                                    user.notifications.remove(notif._id)
                                    user.save()
                                })
                            }
                        })
                        .catch(err => {throw err})

                    return res.json({status:"success",error:"none",result:"post uncommented"})
                }else{
                    return res.json({status:"success",error:"none",result:"no comment found"})
                }
            })
            .catch(err => res.json({status:"failure",error:err,result:err.message}))

        }else{
            return res.json({status:"failure",error:"not found",result:"the post you requested doesn't existe or has been deleted"})
        }
    })
    .catch(err => res.json({status:"failure",error:err,result:err.message}))
})


/************************************************************/
// delete post
router.route("/:postId/delete").delete(async (req,res)=>{

    if(req.params.postId.length !==24)
    return res.json({status:"failure",error:"post_id",result:"please use a valid post id"})

    const id = new mongoose.Types.ObjectId(req.params.postId)

    //check AUTH
    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:"only memebres can delete there posts"})

    await Post.findOneAndDelete({_id:id,user:req.user._id})
            .then(post=>{
                if(post){

                    req.user.posts.remove(post._id)
                    req.user.save()

                    Like.deleteMany({post:post._id}).catch(err =>{throw err})

                    Comment.deleteMany({post:post._id}).catch(err =>{throw err})

                    Notification.deleteMany({post:post._id}).catch(err =>{throw err})

                    return res.json({status:"success",error:"none",result:"the post and all related records has been deleted"})
                }else{
                    return res.json({status:"failure",error:"not found",result:"post not found"})
                }
            })
            .catch(err => res.json({status:"failure",error:err,result:err.message}))

})

module.exports = router