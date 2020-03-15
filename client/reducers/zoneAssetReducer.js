import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function zoneAssetReducer(state = initialState.zoneAsset, action) {
    switch(action.type) {
        case types.GET_ZONE_ASSET_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_ZONE_ASSET_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_ZONE_ASSET_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_ZONE_ASSET_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_ZONE_ASSET_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    zoneAsset: action.zoneAsset,
                    loading: false
                }
            }
        case types.ADD_ZONE_ASSET_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    zoneAsset: action.zoneAsset,
                    loading: false
                }
            }
        case types.UPDATE_ZONE_ASSET_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    zoneAsset: action.zoneAsset,
                    loading: false
                }
            }
        case types.DELETE_ZONE_ASSET_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    zoneAsset: action.zoneAsset,
                    loading: false
                }
            }
        case types.GET_ZONE_ASSET_FAILED:
            return {
                ...state,
                get: {
                    zoneAsset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_ZONE_ASSET_FAILED:
            return {
                ...state,
                add: {
                    zoneAsset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_ZONE_ASSET_FAILED:
            return {
                ...state,
                update: {
                    zoneAsset: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_ZONE_ASSET_FAILED:
            return {
                ...state,
                delete: {
                    zoneAsset: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}