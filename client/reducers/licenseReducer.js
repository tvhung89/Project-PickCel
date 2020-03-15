import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function assetReducer(state = initialState.asset, action) {
    switch(action.type) {
        case types.GET_USER_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }

        case types.GET_USER_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    user: action.user,
                    loading: false
                }
            }
        case types.GET_USER_FAILED:
            return {
                ...state,
                get: {
                    asset: null,
                    loading: false,
                    error: action.error
                }
            }

        default:
            return state
    }
}