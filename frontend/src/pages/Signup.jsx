import React ,{useContext, useState} from 'react'
import "./Signup.css"


import UserContext from "../context/userContext"
import UIContext from "../context/uiContext"

import {signupUser} from "../actions/userActions"

export default function Signup() {

    const context = useContext(UserContext)
    const ui = useContext(UIContext)


    const [err,setErr] = useState({
        _for:"",
        message:"",
    })

    const [user,setUser] = useState({
        username:"",
        email:"",
        password:"",
        rpassword:"",
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

        const rst = await signupUser(ui.dispatch,user,context.dispatch)

        if(rst && rst.status === "failure"){
            setErr({_for:rst.error,message:rst.result})

            setTimeout(()=>{
                setErr({_for:"",message:""})
            },2000)
        }else{
            setTimeout(()=>{
                window.location.href="/"
            },1500)
        }
    }

    return (
        <div className="Signup">
            <div className="signup_container">
                <form onSubmit={onSubmit}>
                    <div className="form_header">
                        <img src="/logo.png" alt="logo"/>
                        <h2> SignUp </h2>
                    </div>
                    <div className="form_body">
                        <input className={err._for==="username"?"error":""} name="username" type="text" value={user.username} onChange={handleChange} placeholder="Username"  autoCorrect="off" autoComplete="off" />
                        <input className={err._for==="email"?"error":""} name="email" type="email" value={user.email} onChange={handleChange} placeholder="E-mail"  autoCorrect="off" autoComplete="off" />
                        <input className={err._for==="password"?"error":""} name="password" type="password" value={user.password} onChange={handleChange} placeholder="Password"  autoCorrect="off" autoComplete="off" />
                        <input className={err._for==="password"?"error":""} name="rpassword" type="password" value={user.rpassword} onChange={handleChange} placeholder="Repeat Password"  autoCorrect="off" autoComplete="off" />
                        <p> {err.message} </p>
                    </div>
                    <div className="form_footer">
                        <button>submit</button>
                    </div>
                </form>
            </div>
        </div>
    )
}
