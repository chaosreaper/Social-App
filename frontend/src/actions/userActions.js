import {GET_CURRENT_USER} from "./types"
import {SET_LOADING,SET_ALERT} from "./types"


/* get current user */
export const getCurrentUser = async (dispatch)=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/profile`,{
        mode:"cors",
        credentials:"include"
    })

    const data = await res.json()

    dispatch({type:GET_CURRENT_USER,value:data.result})

}

/* sign up user */
export const signupUser = async (uiDispatch,user,dispatch)=>{

    uiDispatch({type:SET_LOADING,value:true})

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/signup`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(user)
    })

    const data = await res.json()

    if(data.status==="failure")
        return data

    uiDispatch({type:SET_LOADING,value:false})

    uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2980b9"}})
    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        getCurrentUser(dispatch)

    },1500)
}


/* login user */
export const loginUser = async (uiDispatch,user,dispatch)=>{
    uiDispatch({type:SET_LOADING,value:true})

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/login`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(user)
    })

    const data = await res.json()

    if(data.status==="failure")
        return data

    uiDispatch({type:SET_LOADING,value:false})

    uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2980b9"}})
    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        getCurrentUser(dispatch)

    },1500)

}

/* logout user */
export const logoutUser = async (dispatch,uiDispatch)=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/logout`,{
        method:"POST",
        mode:"cors",
        credentials:"include"
    })

    const data = await res.json()



    uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})

    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },2000)

    setTimeout(()=>{
        getCurrentUser(dispatch)

    },2500)
}



/* edit user image */
export const imgEdit = async (e,dispatch,uiDispatch)=>{

    //check file size
    if(e.target.files[0].size>2*1024*1024){
        uiDispatch({type:SET_ALERT,value:{state:true,message:"file size must not exeeds 2MB",color:"#e74c3c"}})

        setTimeout(()=>{
            uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
        },2000)
        
        return false
    }

    //send req to server
    const formData = new FormData();
    formData.append('img',e.target.files[0]);

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/profile/img`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        body:formData
    })

    const data = await res.json()


    //alert and update user ui
    uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})

    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        getCurrentUser(dispatch)
    },1500)
}

/* edit user profile */
export const profileEdit = async (profile,dispatch,uiDispatch)=>{

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/profile/edit`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify(profile)
    })

    const data = await res.json()


    //alert and update user ui
    uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})

    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        getCurrentUser(dispatch)
    },1500)
}



/* get all users */
export const getUsers = async ()=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/`)

    const data = await res.json()
    
    return data.result

}




/* notifications */
export const userNotifications = async (dispatch)=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/profile/notifications`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
    })

    const data = await res.json()
    
    setTimeout(()=>{
        getCurrentUser(dispatch)
    },1500)

    console.log(data.result);
    return data.result
}

/* find User */
export const findUser = async (username)=>{
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/users/profile/${username}`,{
        mode:"cors",
        credentials:"include"
    })

    const data = await res.json()

    return data.result
}