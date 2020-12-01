import { COMMENT_A_POST, DELETE_A_POST, GET_ALL_POSTS, LIKE_A_POST, SET_CREATE, SET_RELOAD} from "./types"
import {SET_LOADING,SET_ALERT} from "./types"

/* get all post */
export const getAllPosts =async (dispatch,loading)=>{

    loading({type:SET_LOADING,value:true})

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts`)

    const data = await res.json()

    dispatch({type:GET_ALL_POSTS,value:data.result})

    loading({type:SET_LOADING,value:false})
}


/* like post */
export const likePost = async (id,dispatch,alert,index)=>{

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}/like`,{
        method:"POST",
        mode:"cors",
        credentials:"include"
    })

    const data = await res.json()

    if(data.status === "failure"){
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#e74c3c"}})
    }else{
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})
    }

        //alert and update user ui

    setTimeout(()=>{
        alert({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)


    const res1 = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}`)

    const data1 = await res1.json()

    dispatch({type:LIKE_A_POST,value:data1.result,index:index})
    
}


/* comment post */

export const commentPost = async (id,dispatch,alert,index,content)=>{

    if(content.trim()===""){
        alert({type:SET_ALERT,value:{state:true,message:"every comment need some content",color:"#e74c3c"}})

        setTimeout(()=>{
            alert({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
        },1000)

        return
    }


    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}/comment`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({content:content}),
    })

    const data = await res.json()

    if(data.status === "failure"){
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#e74c3c"}})
    }else{
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})
    }

    setTimeout(()=>{
        alert({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    const res1 = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}`)

    const data1 = await res1.json()

    dispatch({type:COMMENT_A_POST,value:data1.result,index:index})
    
}



/* uncomment post */
export const unCommentPost = async (id,dispatch,alert,index,commentId)=>{

    const confirm = window.confirm("are you sure?")

    if(!confirm){
        return false
    }

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}/${commentId}/delete`,{
        method:"DELETE",
        mode:"cors",
        credentials:"include",
    })

    const data = await res.json()

    if(data.status === "failure"){
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#e74c3c"}})
    }else{
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})
    }

    setTimeout(()=>{
        alert({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    const res1 = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}`)

    const data1 = await res1.json()

    dispatch({type:COMMENT_A_POST,value:data1.result,index:index})
    
}



/* delete post */
export const deletePost = async (id,dispatch,alert,index,deleted)=>{

    const confirm = window.confirm("are you sure?")

    if(!confirm){
        return false
    }

    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/${id}/delete`,{
        method:"DELETE",
        mode:"cors",
        credentials:"include",
    })

    const data = await res.json()

    if(data.status === "failure"){
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#e74c3c"}})
    }else{
        alert({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})
        deleted(true)
    }

    setTimeout(()=>{
        alert({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        dispatch({type:DELETE_A_POST,index:index})
    },2000)

    
}


/* create post */
export const createPost = async (img,content,uiDispatch,dispatch)=>{

    if(content.trim()==="" || (img && img.size>2*1024*1024)){
        uiDispatch({type:SET_ALERT,value:{state:true,message:"content missing / image size exeeds 2MB",color:"#e74c3c"}})

        setTimeout(()=>{
            uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
        },1000)

        return
    }

    const formData = new FormData();

    formData.append('content',content);
    formData.append('img',img);
    
    const res = await fetch(`${process.env.REACT_APP_BACKEND_URI}/posts/add`,{
        method:"POST",
        mode:"cors",
        credentials:"include",
        body:formData,
    })

    const data = await res.json()

    if(data.status === "failure"){
        uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#e74c3c"}})
    }else{
        uiDispatch({type:SET_ALERT,value:{state:true,message:data.result,color:"#2ecc71"}})
        uiDispatch({type:SET_CREATE,value:false})
    }

    setTimeout(()=>{
        uiDispatch({type:SET_ALERT,value:{state:false,message:"",color:"transparent"}})
    },1000)

    setTimeout(()=>{
        uiDispatch({type:SET_RELOAD})
    },1500)

}