import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function displayReducer(state = initialState.display, action) {
    switch(action.type) {
        case types.GET_DISPLAY_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.GET_TAG_DISPLAY_LOADING:
            return {
                ...state,
                tags: {
                    ...state.tags,
                    loading: true
                }
            }
        case types.ADD_DISPLAY_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_DISPLAY_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.GET_DISPLAY_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    display: action.display,
                    loading: false
                }
            }
        case types.GET_TAG_DISPLAY_SUCCESS:
                return {
                    ...state,
                    tags: {
                        ...state.tags,
                        tags: action.tags,
                        loading: false
                    }
                }
        case types.ADD_DISPLAY_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    display: action.display,
                    loading: false
                }
            }
        case types.UPDATE_DISPLAY_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    display: action.display,
                    loading: false
                }
            }
        case types.GET_DISPLAY_FAILED:
            return {
                ...state,
                get: {
                    display: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.GET_TAG_DISPLAY_FAILED:
                return {
                    ...state,
                    tags: {
                        tags: null,
                        loading: false,
                        error: action.error
                    }
                }
        case types.ADD_DISPLAY_FAILED:
            return {
                ...state,
                add: {
                    display: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_DISPLAY_FAILED:
            return {
                ...state,
                update: {
                    display: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}