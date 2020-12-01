import React ,{ useEffect ,useContext} from 'react'
import "./Home.css"

//context
import PostContext from "../context/postContext"
import UIContext from "../context/uiContext"

//actions
import {getAllPosts} from "../actions/postActions"


//custom components
import PostCard from "../components/PostCard"
import ProfileCard from "../components/ProfileCard"



//
import CircularProgress from '@material-ui/core/CircularProgress';

export default function Home() {

    const posts = useContext(PostContext).state.posts
    const dispatch = useContext(PostContext).dispatch
    const ui = useContext(UIContext)

    useEffect(()=>{
        getAllPosts(dispatch,ui.dispatch)
    },[ui.state.reload])


    const rst = posts ? posts.map((post,index) =>{
        return (
            <PostCard key={post._id} post={post} index={index} />
        )
    }):"no data found"

    return (
        <div className="Home">
            <div className="home_container">
                <div className="home_profile">
                    <ProfileCard />
                </div>
                <div className="home_posts">
                    {ui.state.loading?
                        <CircularProgress className="loading" />
                        :rst
                    }
                </div>
            </div>
        </div>
    )
}
