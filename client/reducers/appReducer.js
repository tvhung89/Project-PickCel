import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function appReducer(state = initialState.app, action) {
    switch(action.type) {
        case types.GET_APP_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_APP_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_APP_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_APP_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_APP_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    app: action.app,
                    loading: false
                }
            }
        case types.ADD_APP_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    app: action.app,
                    loading: false
                }
            }
        case types.UPDATE_APP_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    app: action.app,
                    loading: false
                }
            }
        case types.DELETE_APP_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    app: action.app,
                    loading: false
                }
            }
        case types.GET_APP_FAILED:
            return {
                ...state,
                get: {
                    app: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_APP_FAILED:
            return {
                ...state,
                add: {
                    app: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_APP_FAILED:
            return {
                ...state,
                update: {
                    app: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_APP_FAILED:
            return {
                ...state,
                delete: {
                    app: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}