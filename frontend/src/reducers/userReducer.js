import {GET_CURRENT_USER} from "../actions/types"


export const userReducer = (state,action)=>{
    switch(action.type){
        case GET_CURRENT_USER:{
            return {
                ...state,
                user:action.value
            }
        }
        default:
            return state
    }
}