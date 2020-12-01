import React , {useContext, useState} from 'react'
import "./CommentList.css"


//context
import UserContext from "../context/userContext"

//actions
import {convertImg} from "../actions/types"
import {commentPost,unCommentPost} from "../actions/postActions"

//MUI components
import SendIcon from '@material-ui/icons/Send';
import CloseIcon from '@material-ui/icons/Close';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';


export default function CommentList({comments,postId,dispatch,index,alert}) {

    const user = useContext(UserContext).state.user
    
    const [showComments,setShowComments] = useState(false)
    const [content,setContent] = useState("")


    return (
        <div className="CommentList">
            <div className="commentlist_container"  >
                {user && <div className="send_comment">
                    <img src={convertImg(user.userImg)} alt=""/>
                    <textarea name="content"  autoComplete="off" autoCorrect="off" 
                    onChange={e=>setContent(e.target.value)} value={content} />
                    <SendIcon onClick={()=> {commentPost(postId,dispatch,alert,index,content);setContent("")}} />
                </div>}
                {comments.length !==0 &&<> <div className="comment_container" style={{maxHeight:showComments?"400px":"120px"}}>
                    {comments.map(comment => {
                        return (
                            <div key={comment._id} className="comment">
                            <img src={convertImg(comment.user.userImg)} className="imgPreview" alt="userImg"/>
                            <p> {comment.content} </p>
                            {user && user.username===comment.user.username && 
                            <CloseIcon onClick={()=> unCommentPost(postId,dispatch,alert,index,comment._id)} />}
                        </div>
                        )
                    })}
                </div>
                <ExpandMoreIcon onClick={()=>setShowComments(!showComments)}
                style={{transform:showComments?"rotate(180deg)":"rotate(0deg)"}} /></>}
            </div>
        </div>
    )
}
