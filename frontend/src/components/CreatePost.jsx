import React , {useContext ,useState} from 'react'
import "./CreatePost.css"


//context
import UIContext from "../context/uiContext"
import PostContext from "../context/postContext"

//actions
import {SET_CREATE} from "../actions/types"
import {createPost} from "../actions/postActions"

import Tooltip from '@material-ui/core/Tooltip';
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import CloseIcon from '@material-ui/icons/Close';


export default function CreatePost(props) {

    const ui = useContext(UIContext)
    const dispatch = useContext(UIContext).dispatch

    const [content,setContent] = useState("")
    const [img,setImg] = useState(null)

    const onSubmit =(e)=>{
        e.preventDefault()

        createPost(img,content,ui.dispatch,dispatch)
        setContent("")
        setImg(null)
    }


    return (
        <div className="CreatePost">
            <div className="create_container">
                <form onSubmit={onSubmit}>
                    <div className="create_content">
                    <CloseIcon onClick={()=>ui.dispatch({type:SET_CREATE,value:false})} />
                        <label >Content (required)</label>
                            <textarea name="content" id="content" onChange={e => setContent(e.target.value)}
                             value={content} ></textarea>
                        </div>
                    <div className="create_img">
                        <label >Image (optional)</label>
                        <div className="imgDisplay">
                            <img src=" " alt=""/>
                        </div>
                        <label htmlFor="img" >
                            <Tooltip title="EDIT PHOTO" placement="right">
                                <PhotoCameraIcon className="postImg" />
                            </Tooltip>
                        </label>                       
                        <input type="file" id="img" name="img" accept="image/*" onChange={e=>imgPreview(e,setImg)} style={{display:"none"}} />
                    </div>
                    <button>Publish</button>
                </form>
            </div>
        </div>
    )
}


const imgPreview = (e,setImg) =>{
    
    const img = document.querySelector(".imgDisplay img")
    if(e.target.files !== undefined)
    {img.src = URL.createObjectURL(e.target.files[0])
    setImg(e.target.files[0])}
}