/**************************** ****************************/
const router = require("express").Router()
const mongoose = require("mongoose")
const passport = require("passport")

/**************************** MULTER ****************************/
const multer = require("multer")
const {v4:uuidv4} = require("uuid")
const fs = require("fs")

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads/users/")
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
const User = require("../models/user.model")
const Post = require("../models/post.model")
const Like = require("../models/like.model")
const Notification = require("../models/notif.model")
const Comment = require("../models/comment.model")
const { route } = require("./posts")


/**************************** ROUTES ****************************/
//user signup
router.route("/signup").post(async (req,res)=> {

    if(req.isAuthenticated())
        req.logout()

    //username validation
    if(req.body.username === undefined || req.body.username.length <6 )
        return res.json({status:"failure",error:"username",result:"username must be at least 6 character"})

    const username = await User.findOne({username:req.body.username})
    if(username !== null)
        return res.json({status:"failure",error:"username",result:"username already taken"})


    //email validation
    const pattern = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
    if(!pattern.test(req.body.email))
        return res.json({status:"failure",error:"email",result:"invalid email format"})

    const email = await User.findOne({email:req.body.email})
    if(email !== null)
        return res.json({status:"failure",error:"email",result:"email already taken"})

    //password validation
    if(req.body.password === undefined || req.body.password.length <6 )
        return res.json({status:"failure",error:"password",result:"password must be at least 6 character"})

    if(req.body.password !== req.body.rpassword )
        return res.json({status:"failure",error:"password",result:"password must match"})
    
    await User.register({
        _id:new mongoose.Types.ObjectId,
        username:req.body.username,
        email:req.body.email,
    },
    req.body.password,
    err=>{
        if(err){
            return res.json({status:"failure",error:"error",result:err.message})
        }else{
             passport.authenticate("local")(req,res,()=>{
                return res.json({status:"success",error:"none",result:`Account Has Been Created`})
            })
            
        }
    })
})


/************************************************************/
// user login
router.route("/login").post(async (req,res)=>{

    if(req.isAuthenticated())
        req.logout()

    await passport.authenticate("local",(err,user)=>{
        if(err)
            return res.json({status:"failure",error:"server",result:err.message})
        else
        if(!user) return res.json({status:"failure",error:"credentials",result:`incorrect credentials`})
        else
        req.login(user,err1=>{
            if(err1) return res.json({status:"failure",error:"server",result:err1.message})

            return res.json({status:"success",error:"none",result:`welcome back ${req.user.username}`})
        })

    })(req,res)
})


/************************************************************/
// user logout
router.route("/logout").post((req,res)=>{

    req.logout()
        return res.json({status:"success",error:"none",result:`see you next time`})
})


/************************************************************/
// get current user
router.route("/profile").get(async (req,res)=>{

    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"Auth",result:null})

    const user = await User.findOne({_id:req.user._id}).populate({path:"notifications",populate:{path:"user"},options:{sort:{createdAt:-1}}})
        return res.json({status:"success",error:"none",result:user})
})


/************************************************************/
// find a  user
router.route("/profile/:username").get(async (req,res)=>{

    const user = await User.findOne({username:req.params.username})
    const posts = await Post.find({user:user._id}).populate({path:"user",select:["username","userImg"]})
    .populate({path:"likes",populate:{path:"user",select:["username","userImg"]}})
    .populate({path:"comments",populate:{path:"user",select:["username","userImg"]},options:{sort:{createdAt:-1}}})
    
    return res.json({status:"success",error:"none",result:{user,posts}})
})


/************************************************************/
// update user img
router.route("/profile/img").post(uploadFile,async (req,res)=>{

    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:`you need to be logged in`})

    const oldImg = req.user.userImg
    
    if(req.file !== undefined){
        req.user.userImg.data=fs.readFileSync(req.file.path)
        req.user.userImg.contentType=req.file.mimetype
        req.user.userImg.text=req.file.filename
    }

    await req.user.save()

    return res.json({status:"success",error:"none",result:`your profile photo has been updated`})
})


/************************************************************/
// update user profile
router.route("/profile/edit").post(async (req,res)=>{

    if(!req.isAuthenticated())
        return res.json({status:"failure",error:"auth",result:`you need to be logged in`})

    req.user.bio = req.body && req.body.bio ? req.body.bio.trim()? req.body.bio:"-": req.user.bio
    req.user.website = req.body && req.body.website ? req.body.website.trim()? req.body.website :"-": req.user.website
    req.user.location = req.body && req.body.location? req.body.location.trim()? req.body.location :"-": req.user.location

    await req.user.save()
        return res.json({status:"success",error:"none",result:`your profile has been updated`})

})


/************************************************************/
// user unseen notifications
router.route("/profile/notifications").post(async (req,res)=>{
    if(!req.isAuthenticated())
    return res.json({status:"failure",error:"auth",result:`you need to be logged in`})

    await Notification.updateMany({postOwner:req.user._id},{seen:true})
        return res.json({status:"success",error:"none",result:`all notifications are marked seen`})

})


/************************************************************/
// get all usernames
router.route("/").get(async (req,res)=>{
    
    const usernames =await User.find({},{username:1,userImg:1})
        return res.json({status:"success",error:"none",result:usernames})

})


/**************************** ****************************/
module.exports = router
