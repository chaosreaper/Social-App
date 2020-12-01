/**************************** PACKAGES ****************************/
require("dotenv").config()
const express = require("express")
const mongoose = require("mongoose")
const session = require("express-session")
const passport = require("passport")
const cors = require("cors")

/**************************** APP SETUP ****************************/
const app = express()

app.use(cors({
    origin:"http://localhost:3000",
    credentials:true,
}))

app.use(express.static('uploads'));
app.use(express.json())
app.use(express.urlencoded({extended:true}))


app.set("trust proxy",1)
app.use(session({
    secret:process.env.SECRET || "keyboard cat",
    resave:false,
    saveUninitialized:false,
    cookie:{sameSite:"none",secure:true}
}))

app.use(passport.initialize())
app.use(passport.session())

/**************************** DB SETUP ****************************/

const uri = process.env.ATLAS_URI || "mongodb://localhost:27017/socialappDB"

mongoose.connect(uri,{
    useCreateIndex:true,
    useNewUrlParser:true,
    useUnifiedTopology:true,
})

mongoose.connection.once("open",()=>{
    console.log(`database connected`);
}).catch(err => {console.log(err)})


/**************************** routes ****************************/
app.route("/").get(async(req,res)=>{
    res.json({status:"succes",error:"none",result:"Welcome To The Wonderland"})
})

app.use("/posts",require("./routes/posts"))
app.use("/users",require("./routes/users"))

/**************************** SERVER START ****************************/
const port = process.env.PORT || 5000

app.listen(port,()=>{
    console.log(`server is running on port ${port}`);
})


/**************************** ****************************/


