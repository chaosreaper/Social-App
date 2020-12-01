import {SET_ALERT,SET_CREATE,SET_LOADING, SET_RELOAD} from "../actions/types"


export const uiReducer = (state,action)=>{
    switch(action.type){
        case SET_LOADING:{
            return {
                ...state,
                loading:action.value
            }
        }
        case SET_ALERT:{
            return {
                ...state,
                alert:action.value
            }
        }
        case SET_CREATE:{
            return {
                ...state,
                createPost:action.value
            }
        }
        case SET_RELOAD:{
            state.reload+=1
            return {
                ...state
            }
        }
        default:
            return state
    }
}