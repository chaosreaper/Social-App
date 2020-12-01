import React, { useContext, useState ,useEffect, useRef} from 'react'
import "./PostCard.css"
import dayjs from "dayjs"
import {CSSTransition} from "react-transition-group"
import {Link} from "react-router-dom"


//context
import UIContext from "../context/uiContext"
import UserContext from "../context/userContext"
import PostContext from "../context/postContext"

//actions
import {convertImg} from "../actions/types"
import {likePost,deletePost} from "../actions/postActions"

//MUI components
import FavoriteIcon from '@material-ui/icons/Favorite';
import QuestionAnswerIcon from '@material-ui/icons/QuestionAnswer';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import DeleteIcon from '@material-ui/icons/Delete';


//custom components
import LikeList from "./LikeList"
import CommentList from "./CommentList"

export default function PostCard({post,index}) {

    const ui = useContext(UIContext)
    const user = useContext(UserContext).state.user
    const dispatch = useContext(PostContext).dispatch

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    const [isExpanded,setExpanded] = useState(false) 
    const [isLiked,setLiked]= useState(false)
    const [isDeleted,setDeleted] = useState(false)

    const nodeRef = useRef(null)

    useEffect(()=>{ 

        if(user && post.likes.find(like => like.user.username === user.username)){
            setLiked(true)
        }else{
            setLiked(false)
        }
    },[post])


    return (
        <div className="PostCard">
        <CSSTransition nodeRef={nodeRef} in={isDeleted === false} unmountOnExit timeout={2000} classNames="postDeleted" >
            <div ref={nodeRef} className="card_container">
                <div className="card_header">
                    <img src={convertImg(post.user.userImg)} className="imgPreview" alt=""/>
                    <Link to={`/${post.user.username}`}><h3> {post.user.username} </h3></Link>
                    <p> {dayjs(post.createdAt).fromNow()}  </p>
                    {user && user.username === post.user.username && 
                        <DeleteIcon onClick={()=>deletePost(post._id,dispatch,ui.dispatch,index,setDeleted)} />
                    }
                </div>
                {post.postImg && <div className="card_body">
                    <img src={ convertImg(post.postImg) } className="imgPreview" alt=""/>
                    </div>}
                <div className="card_footer" style={{maxHeight:isExpanded?"200px":"45px"}} >
                    <p> {post.content} </p>
                </div>
                <div className="card_action">
                    <div className="card_reaction">
                        <div className="likes" >
                            <FavoriteIcon onClick={()=>likePost(post._id,dispatch,ui.dispatch,index)} 
                            style={{color:isLiked?"#e74c3c":""}} />
                            <span> {post.likes.length} </span>
                            <LikeList likes={post.likes} />
                        </div>
                        <div className="comments" >
                            <QuestionAnswerIcon />
                            <span> {post.comments.length} </span>
                        </div>
                    </div>
                    <div className="card_expand" onClick={()=>{setExpanded(!isExpanded)}} 
                    style={{transform:isExpanded?"rotate(180deg)":"rotate(0deg)"}}>
                        <ExpandMoreIcon />
                    </div>
                </div>
                <div className="card_comments">
                    <CommentList comments={post.comments} postId={post._id} index={index} dispatch={dispatch} alert={ui.dispatch} />
                </div>
            </div>
            </CSSTransition>
        </div>
    )
}
