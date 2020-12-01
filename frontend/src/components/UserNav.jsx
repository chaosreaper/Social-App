import React, { useContext, useEffect, useRef, useState } from 'react'
import "./UserNav.css"

import UserContext from "../context/userContext"

import {convertImg} from "../actions/types"
import {userNotifications} from "../actions/userActions"


import VisibilityIcon from '@material-ui/icons/Visibility';

export default function UserNav() {

    const user = useContext(UserContext).state.user
    const dispatch = useContext(UserContext).dispatch

    const [showNotif,setShowNotif] = useState(false)
    const notifRef = useRef(null)

    useEffect(()=>{
        //hide menu on click away from navbar
        document.addEventListener("click",(e)=>{
            if(notifRef.current && !notifRef.current.contains(e.target)){
                setShowNotif(false)
            }
        })

    })

    let cp =0;
    user && user.notifications.forEach(n => {
        if(!n.seen){
            cp++
        }
    })
    return (
        <div className="UserNav">
            <div ref={notifRef} className="usernav_container">
                <img src={user?convertImg(user.userImg):"/Anonymous.png"} alt="" onClick={()=>{
                    setShowNotif(!showNotif)
                    if(cp>0)
                    userNotifications(dispatch)
                    }} />
                {user && cp!==0 && <span> {cp} </span>}
                {user && <div className="notif_container" style={{maxHeight:showNotif?"200px":"0px"}} >
                    {user.notifications.map(n=>{
                        return (
                            <div className="notif" key={n._id} >
                                <img src={convertImg(n.user.userImg)} alt=""/>
                                <p> <span> {n.user.username} </span> has given you a {n.type} </p>
                                {!n.seen && <VisibilityIcon />}
                            </div>
                        )
                    })}
                </div>}
            </div>

        </div>
    )
}
