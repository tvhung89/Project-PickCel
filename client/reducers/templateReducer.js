import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function templateReducer(state = initialState.template, action) {
    switch(action.type) {
        case types.GET_TEMPLATE_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.GET_DEFAULT_TEMPLATE_LOADING:
            return {
                ...state,
                templates: {
                    ...state.templates,
                    loading: true
                }
            }
        case types.ADD_TEMPLATE_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.DELETE_TEMPLATE_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_TEMPLATE_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    template: action.template,
                    loading: false
                }
            }
        case types.GET_DEFAULT_TEMPLATE_SUCCESS:
            return {
                ...state,
                templates: {
                    ...state.templates,
                    templates: action.templates,
                    loading: false
                }
            }
        case types.ADD_TEMPLATE_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    template: action.template,
                    loading: false
                }
            }
        case types.DELETE_TEMPLATE_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    template: action.template,
                    loading: false
                }
            }
        case types.GET_TEMPLATE_FAILED:
            return {
                ...state,
                get: {
                    template: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.GET_DEFAULT_TEMPLATE_FAILED:
            return {
                ...state,
                templates: {
                    ...state.templates,
                    templates: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_TEMPLATE_FAILED:
            return {
                ...state,
                add: {
                    template: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_TEMPLATE_FAILED:
            return {
                ...state,
                delete: {
                    template: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}