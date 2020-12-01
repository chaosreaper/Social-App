import React, { useRef, useState ,useEffect} from 'react'
import "./NavBar.css"


//custom components
import MainNav from "./MainNav"
import UserNav from "./UserNav"


export default function NavBar() {

    //show menu on mobile
    const [showMenu,setShowMenu] = useState(false)
    const menuRef = useRef(null)

    useEffect(()=>{

        //hide menu on click away from navbar
        document.addEventListener("click",(e)=>{
            if(menuRef.current && !menuRef.current.contains(e.target)){
                setShowMenu(false)
            }
        })
        //hide menu on resize
        window.addEventListener("resize",()=>{
            if(window.innerWidth>900)
            setShowMenu(false)
        })
    })

    return (
        <div className="NavBar">
            <div ref={menuRef} className="nav_container" style={{maxHeight:showMenu?"200px":"70px"}} >
                <MainNav showMenu={showMenu} setShowMenu={setShowMenu}/>
                <UserNav />
            </div>
        </div>
    )
}
