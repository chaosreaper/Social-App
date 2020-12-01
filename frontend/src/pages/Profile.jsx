/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react'


//custom components
import PostCard from "../components/PostCard"
import ProfileCard from "../components/ProfileCard"

//
import {findUser} from "../actions/userActions"

import CircularProgress from '@material-ui/core/CircularProgress';


export default function Profile(props) {

    const [user,setUser] = useState(null)

    useEffect(()=>{
        searchUser()
    },[props.match.params.username])

    const searchUser = async ()=>{

        setUser(await findUser(props.match.params.username))
    }

    const rst = user ?user.posts.length!==0? user.posts.map((post,index) =>{
        return (
            <PostCard key={post._id} post={post} index={index} />
        )
    }):"no data found":<CircularProgress />


    return (
        <div className="Home">
        {user && <div className="home_container">
            <div className="home_profile">
                <ProfileCard variant="Search" search={user.user} />
            </div>
            <div className="home_posts">
                {rst}
            </div>
        </div>
        }
    </div>
    )
}
