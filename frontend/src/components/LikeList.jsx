import React from 'react'
import "./LikeList.css"


//actions
import {convertImg} from "../actions/types"


//MUI components
import Tooltip from '@material-ui/core/Tooltip';


export default function LikeList({likes}) {


    return (
        <div className="LikeList" >
            <div className="likelist_container" >
                {likes.map(like => {
                    return (
                        <div key={like._id} >
                            <Tooltip title={like.user.username} placement="top" >
                                <img src={convertImg(like.user.userImg)} alt="userImg" />
                            </Tooltip>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}
