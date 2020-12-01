import React, { useRef, useState,useEffect ,useContext} from 'react'
import "./MainNav.css"
import {Link} from "react-router-dom"

//context
import UserContext from "../context/userContext"
import UIContext from "../context/uiContext"

//actions
import {logoutUser,getUsers} from "../actions/userActions"
import {convertImg, SET_CREATE} from "../actions/types"

//MUI components
import Tooltip from '@material-ui/core/Tooltip';
import HomeIcon from '@material-ui/icons/Home';
import ListAltIcon from '@material-ui/icons/ListAlt';
import LockIcon from '@material-ui/icons/Lock';
import LockOpenIcon from '@material-ui/icons/LockOpen';
import AddIcon from '@material-ui/icons/Add';
import MenuIcon from '@material-ui/icons/Menu';
import CloseIcon from '@material-ui/icons/Close';

export default function MainNav({showMenu,setShowMenu}) {

    const user = useContext(UserContext).state.user
    const dispatch = useContext(UserContext).dispatch
    const ui = useContext(UIContext)

    /* search results */ 
    const [search,setSearch] = useState("")
    const [users,setUsers] = useState([])
    const searchRef = useRef(null)

    useEffect(()=>{
        //emty search bar when you click away
        document.addEventListener("click",(e)=>{
            if(searchRef.current && !searchRef.current.contains(e.target)){
                setSearch("")
            }
        })

        usernames()
    },[])

    const usernames = async ()=>{
        setUsers(await getUsers())
    } 

    const rst = users ? users.map(u =>{
        if(u.username.includes(search) && search !=="")
        return (
            <Link key={u._id} to={`/${u.username}`}><div key={u._id} onClick={()=>setSearch("")} >
                <img src={convertImg(u.userImg)} alt=""/>
                <h4> {u.username} </h4>
            </div></Link>
        )
    }):"username doesn't existe"

    return (
        <div className="MainNav">
            <div className="mainnav_container">
                {/* manu logo & name * showMenu icon */}
                <div className="nav_desc" >
                    <img src="/logo.png" alt="logo"/>
                    <h1>Social App</h1>
                    <div onClick={()=>setShowMenu(!showMenu)}>
                    {showMenu?
                        <CloseIcon />
                        :<MenuIcon />
                    }
                    </div>
                </div>
                {/* search bar and results */}
                <div className="nav_search" >
                    <input type="text" autoCorrect="off" autoComplete="off" 
                    onChange={e=>setSearch(e.target.value)} value={search} />
                    <div ref={searchRef} className="search_results" 
                    style={{maxHeight:search!==""?"200px":"0px"}} >
                            {rst}
                    </div>
                </div>
                {/* navbar items */}
                <div className="nav_items">
                    <Link to="/">
                    <Tooltip title="HOME" placement="bottom" >
                        <HomeIcon />
                    </Tooltip>
                    </Link>
                    {user?
                    <>
                    <Tooltip title="ADD" placement="bottom" >
                        <AddIcon onClick={()=>ui.dispatch({type:SET_CREATE,value:true})} />
                    </Tooltip>
                    <Tooltip title="LOGOUT" placement="bottom" >
                        <LockOpenIcon onClick={()=>logoutUser(dispatch,ui.dispatch)}/>
                    </Tooltip>
                    </>
                    :<>
                    <Link to="/signup">
                    <Tooltip title="SIGNUP" placement="bottom" >
                        <ListAltIcon />
                    </Tooltip>
                    </Link>
                    <Link to="/login">
                    <Tooltip title="LOGIN" placement="bottom" >
                        <LockIcon />
                    </Tooltip>
                    </Link>
                    </>
                    }
                </div>
            </div>
        </div>
    )
}
