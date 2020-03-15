import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function compositionReducer(state = initialState.composition, action) {
    switch(action.type) {
        case types.GET_COMPOSITION_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_COMPOSITION_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_COMPOSITION_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.UPDATE_COMPOSITION_TEMPLATE_LOADING:
            return {
                ...state,
                updateTemplate: {
                    ...state.updateTemplate,
                    loading: true
                }
            }
        case types.DELETE_COMPOSITION_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_COMPOSITION_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    composition: action.composition,
                    loading: false
                }
            }
        case types.ADD_COMPOSITION_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    composition: action.composition,
                    loading: false
                }
            }
        case types.UPDATE_COMPOSITION_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    composition: action.composition,
                    loading: false
                }
            }
        case types.UPDATE_COMPOSITION_TEMPLATE_SUCCESS:
            return {
                ...state,
                updateTemplate: {
                    ...state.updateTemplate,
                    composition: action.composition,
                    loading: false
                }
            }
        case types.DELETE_COMPOSITION_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    composition: action.composition,
                    loading: false
                }
            }
        case types.GET_COMPOSITION_FAILED:
            return {
                ...state,
                get: {
                    composition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_COMPOSITION_FAILED:
            return {
                ...state,
                add: {
                    composition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_COMPOSITION_FAILED:
            return {
                ...state,
                update: {
                    composition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_COMPOSITION_TEMPLATE_FAILED:
            return {
                ...state,
                updateTemplate: {
                    composition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_COMPOSITION_FAILED:
            return {
                ...state,
                delete: {
                    composition: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}