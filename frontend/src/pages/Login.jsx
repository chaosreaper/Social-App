import React, { useContext, useState } from 'react'
import "./Login.css"


import UserContext from "../context/userContext"
import UIContext from "../context/uiContext"

import {loginUser} from "../actions/userActions"


export default function Login() {

    const context = useContext(UserContext)
    const ui = useContext(UIContext)


    const [err,setErr] = useState("")

    const [user,setUser] = useState({
        username:"",
        password:"",
    })

    const handleChange = e =>{
        const {name,value} = e.target
        setUser(prev =>{
            return {
                ...prev,
                [name]:value,
            }
        })
    }

    const onSubmit = async (e)=>{
        e.preventDefault()

        const rst = await loginUser(ui.dispatch,user,context.dispatch)

        if(rst && rst.status === "failure"){
            setErr(rst.result)

            setTimeout(()=>{
                setErr("")
            },2000)
        }else{

            setTimeout(()=>{
                window.location.href="/"
            },1500)
        }
    }

    return (

        <div className="Login">
            <div className="signup_container">
                <form onSubmit={onSubmit}>
                    <div className="form_header">
                        <img src="/logo.png" alt="logo"/>
                        <h2> Login </h2>
                    </div>
                    <div className="form_body">
                        <input className={err !==""?"error":""} name="username" type="text" value={user.username} onChange={handleChange} placeholder="Username"  autoCorrect="off" autoComplete="off" />
                        <input className={err !==""?"error":""} name="password" type="password" value={user.password} onChange={handleChange} placeholder="Password"  autoCorrect="off" autoComplete="off" />
                        <p> {err} </p>
                    </div>
                    <div className="form_footer">
                        <button>submit</button>
                    </div>
                </form>
            </div>
            
        </div>
    )
}
