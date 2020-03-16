import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function displayReducer(state = initialState.setting, action) {
    switch(action.type) {
        case types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_LOADING:
            return {
                ...state,
                loading: true
            }
        case types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_SUCCESS:
            return {
                ...state,
                loading: false
            }
        case types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_FAILED:
            return {
                ...state,
                loading: false,
                error: action.error        
            }
            default:
                return state
        }
        
        
    }