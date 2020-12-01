import React ,{useEffect, useReducer, useState} from 'react'
import "./App.css"
import {BrowserRouter as Router , Route , Redirect , Switch} from "react-router-dom"
import {CSSTransition} from "react-transition-group"

//context
import UserContext from "./context/userContext"
import PostContext from "./context/postContext"
import UIContext from "./context/uiContext"

//reducer
import {postReducer} from "./reducers/postReducer"
import {userReducer} from "./reducers/userReducer"
import {uiReducer} from "./reducers/uiReducer"

//actions
import {getCurrentUser} from "./actions/userActions"

//custom components
import Home from "./pages/Home"
import Profile from "./pages/Profile"
import Login from "./pages/Login"
import Signup from "./pages/Signup"
import NavBar from "./components/NavBar"
import CreatePost from "./components/CreatePost"


//
import CloseIcon from '@material-ui/icons/Close';


export default function App() {

    const userIS ={}
    const postsIS=[]
    const uiIS={
        alert:{
            state:false,
            message:"",
            color:"transparent",
        },
        loading:false,
        createPost:false,
        reload:0,
    }

    
    const [imgPreview,setImgPreview] = useState({
        state:false,
        src:"",
    })

    const [userState,userDispatch] = useReducer(userReducer,userIS)
    const [postState,postDispatch] = useReducer(postReducer,postsIS)
    const [uiState,uiDispatch] = useReducer(uiReducer,uiIS)

    useEffect(()=>{

        document.addEventListener("click",(e)=>{
            if(e.target.tagName === "IMG" && e.target.classList.contains("imgPreview"))
                setImgPreview({
                    state:true,
                    src:e.target.src,
                })
        })

        getCurrentUser(userDispatch)
    },[])


    return (
        <UserContext.Provider value={{state:userState,dispatch:userDispatch}}>
            <UIContext.Provider value={{state:uiState,dispatch:uiDispatch}}>
                <PostContext.Provider value={{state:postState,dispatch:postDispatch}}>
                <div className="App">
                <div className="previewImg_container" 
                style={{width:imgPreview.state?"99%":"0%" , height:imgPreview.state?"99vh":"0vh"}}
                >
                        <CloseIcon onClick={()=>setImgPreview({
                        state:false,
                        src:" ",
                    })} />
                    <img className="global_img_preview" src={imgPreview.src} alt=""/>
                </div>
                <Router>
                    <NavBar />
                    <div className={`alert ${uiState.alert.state && "showAlert"}`} 
                    style={{backgroundColor:uiState.alert.color}} >
                        {uiState.alert.message}
                    </div>
                    {userState.user && 
                    <CSSTransition in={uiState.createPost===true} unmountOnExit timeout={500} classNames="showCreate" >
                    <CreatePost />
                    </CSSTransition>
                    }
                    <div className="container">
                        <Switch>
                            {!userState.user && <Route path="/signup" component={Signup} />}
                            {!userState.user && <Route path="/login" component={Login} />}
                            <Route exact path="/" component={Home}/>
                            <Route path="/:username" component={Profile}/>
                            <Redirect from="*" to="/" />
                        </Switch>
                    </div>
                </Router>
                </div>
                </PostContext.Provider>
            </UIContext.Provider>
        </UserContext.Provider>

    )
}
