import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function logReducer(state = initialState.logs, action) {
    switch(action.type) {
        case types.GET_LOG_LOADING:
            return {
                ...state,
                    loading: true
            }
        case types.GET_LOG_SUCCESS:
            return {
                ...state,
                loading: false,
                logs: action.logs
            }
        case types.GET_LOG_FAILED:
            return {
                ...state,
                    loading: false,
                    error: true
            }
            default:
                return state
        }
    }