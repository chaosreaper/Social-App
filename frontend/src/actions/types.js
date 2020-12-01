//user actions
export const GET_CURRENT_USER = "get_current_user"


//post actions
export const GET_ALL_POSTS = "get_all_posts"
export const LIKE_A_POST = "like_a_post"
export const COMMENT_A_POST = "comment_a_post"
export const DELETE_A_POST = "delete_a_post"


//ui actions
export const SET_LOADING = "set_loading"
export const SET_ALERT = "set_alert"
export const SET_CREATE = "set_create"
export const SET_RELOAD = "set_reload"



//extra functions

export const convertImg = (img) =>{

    if(!img)
        return "/default.jpeg"
        
    let binary = ""
    const bytes = [].slice.call(new Uint8Array(img.data.data))
    const base64Flag = "data:image/jpeg;base64,"

    bytes.forEach(b => binary += String.fromCharCode(b))

    return base64Flag + window.btoa(binary)

}