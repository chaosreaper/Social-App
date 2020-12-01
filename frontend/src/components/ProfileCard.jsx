import React, { useContext, useState } from 'react'
import "./ProfileCard.css"
import dayjs from "dayjs"
import {Link} from "react-router-dom"

//context
import UserContext from "../context/userContext"
import UIContext from "../context/uiContext"

//actions
import {convertImg} from "../actions/types"
import {imgEdit,profileEdit} from "../actions/userActions"


//MUI components
import PhotoCameraIcon from '@material-ui/icons/PhotoCamera';
import EditIcon from '@material-ui/icons/Edit';
import CloseIcon from '@material-ui/icons/Close';
import SaveIcon from '@material-ui/icons/Save';
import Tooltip from '@material-ui/core/Tooltip';


export default function ProfileCard({variant,search}) {

    var relativeTime = require('dayjs/plugin/relativeTime')
    dayjs.extend(relativeTime)

    const user = useContext(UserContext).state.user
    const dispatch = useContext(UserContext).dispatch
    const ui = useContext(UIContext)

    const [isEditing,setEditing] = useState(false)
    const [profile,setProfile] = useState({
        bio:"",
        location:"",
        website:"",
    })
    
    const imgUpload = (e)=>{
        imgEdit(e,dispatch,ui.dispatch)
    }

    const editProfile = ()=>{
        profileEdit(profile,dispatch,ui.dispatch)
        setEditing(false)
        setProfile({bio:"",location:"",website:""})
    }

    const handleChange = e=>{
        const {name,value} = e.target
        setProfile(prev =>{
            return {
                ...prev,
                [name]:value
            }
        })
    }

    return (
        <div className="ProfileCard">
            {variant !== "Search" && <div className="profile_container">
                <div className="profile_header">
                {user && <form onSubmit={e=>e.preventDefault()} >
                    <input type="file" id="img" name="img" accept="image/*" onChange={imgUpload} />
                        <label htmlFor="img" >
                            <Tooltip title="EDIT PHOTO" placement="right">
                            <PhotoCameraIcon className="profile_imgUpload" />
                            </Tooltip>
                        </label>
                    </form>}
                    <img src={user?convertImg(user.userImg):"/Anonymous.png"} className="imgPreview" alt=""/>
                    <Link to={`/${user?user.username:""}`}><h2> {user?user.username:"Anonymous"} </h2></Link>
                    <p> {user?"joined "+dayjs(user.createdAt).fromNow():"join us now"} </p>
                </div>
                {user && <>
                <div className="profile_body">
                    <Tooltip title="edit profile" placement="right">
                        <EditIcon onClick={()=>setEditing(true)}/>
                    </Tooltip>
                    <div>
                        <h4>Bio</h4>
                        <p> {user.bio} </p>
                    </div>
                    <div>
                        <h4>Location</h4>
                        <p> {user.location} </p>
                    </div>
                    <div>
                        <h4>Website</h4>
                        <p> {user.website} </p>
                    </div>
                    {isEditing &&<div className={`profile_editing`}>
                        <div className="icons">
                            <SaveIcon onClick={editProfile} />
                            <CloseIcon onClick={()=>setEditing(false)}/>
                        </div>
                        <div>
                            <h4>Bio</h4>
                            <input type="text" name="bio" value={profile.bio} onChange={handleChange} autoComplete="off" autoCorrect="off" />
                        </div>
                        <div>
                            <h4>Location</h4>
                            <input type="text" name="location" value={profile.location} onChange={handleChange} autoComplete="off" autoCorrect="off" />
                        </div>
                        <div>
                            <h4>Website</h4>
                            <input type="text" name="website" value={profile.website} onChange={handleChange} autoComplete="off" autoCorrect="off" />
                        </div>
                    </div>}
                </div>
                <div className="profile_footer">
                    <div>
                        <h4>Posts</h4>
                        <p> {user.posts.length} </p>
                    </div>
                    <div>
                        <h4>Likes</h4>
                        <p> {user.likes.length} </p>
                    </div>
                    <div>
                        <h4>Comments</h4>
                        <p> {user.comments.length} </p>
                    </div>
                </div>
                </>}
            </div>}
        {/****************************************************************************/}
        {/****************************************************************************/}
        {/****************************************************************************/}
            {variant === "Search" &&
                <div className="profile_container">
                <div className="profile_header">
                    <img src={search && convertImg(search.userImg)} className="imgPreview" alt=""/>
                    <h2> {search && search.username} </h2>
                    <p> {search && "joined "+dayjs(search.createdAt).fromNow()} </p>
                </div>
                {search && <>
                <div className="profile_body">
                    <div>
                        <h4>Bio</h4>
                        <p> {search.bio} </p>
                    </div>
                    <div>
                        <h4>Location</h4>
                        <p> {search.location} </p>
                    </div>
                    <div>
                        <h4>Website</h4>
                        <p> {search.website} </p>
                    </div>
                </div>
                </>}
            </div>
            }
        </div>
    )
}
