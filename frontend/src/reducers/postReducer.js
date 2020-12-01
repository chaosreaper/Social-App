import {GET_ALL_POSTS,LIKE_A_POST,COMMENT_A_POST, DELETE_A_POST} from "../actions/types"


export const postReducer = (state,action)=>{
    switch(action.type){
        case GET_ALL_POSTS:{
            return {
                ...state,
                posts:action.value
            }
        }
        case LIKE_A_POST:{
                state.posts[action.index]=action.value
            return{
                ...state,
            }
        }
        case COMMENT_A_POST:{
                state.posts[action.index]=action.value
            return{
                ...state,
            }
        }
        case DELETE_A_POST:{
            state.posts.splice(action.index,1)
            return {
                ...state,
            }
        }
        default:
            return state
    }
}