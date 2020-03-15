import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function assetReducer(state = initialState.asset, action) {
    switch(action.type) {
        case types.GET_ASSET_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.GET_ASSET_TAGS_LOADING:
            return {
                ...state,
                tags: {
                    ...state.tags,
                    loading: true
                }
            }
        case types.ADD_ASSET_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_ASSET_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_ASSET_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_ASSET_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    asset: action.asset,
                    loading: false
                }
            }
        case types.GET_ASSET_TAGS_SUCCESS:
            return {
                ...state,
                tags: {
                    ...state.tags,
                    tags: action.tags,
                    loading: false
                }
            }
        case types.ADD_ASSET_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    asset: action.asset,
                    loading: false
                }
            }
        case types.UPDATE_ASSET_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    asset: action.asset,
                    loading: false
                }
            }
        case types.DELETE_ASSET_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    asset: action.asset,
                    loading: false
                }
            }
        case types.GET_ASSET_FAILED:
            return {
                ...state,
                get: {
                    asset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.GET_ASSET_TAGS_FAILED:
            return {
                ...state,
                tags: {
                    tags: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_ASSET_FAILED:
            return {
                ...state,
                add: {
                    asset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_ASSET_FAILED:
            return {
                ...state,
                update: {
                    asset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_ASSET_FAILED:
            return {
                ...state,
                delete: {
                    asset: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}