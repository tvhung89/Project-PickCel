import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function tagReducer(state = initialState.tag, action) {
    switch(action.type) {
        case types.GET_TAG_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_TAG_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_TAG_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_TAG_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_TAG_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    tag: action.tag,
                    loading: false
                }
            }
        case types.ADD_TAG_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    tag: action.tag,
                    loading: false
                }
            }
        case types.UPDATE_TAG_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    tag: action.tag,
                    loading: false
                }
            }
        case types.DELETE_TAG_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    tag: action.tag,
                    loading: false
                }
            }
        case types.GET_TAG_FAILED:
            return {
                ...state,
                get: {
                    tag: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_TAG_FAILED:
            return {
                ...state,
                add: {
                    tag: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_TAG_FAILED:
            return {
                ...state,
                update: {
                    tag: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_TAG_FAILED:
            return {
                ...state,
                delete: {
                    tag: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}