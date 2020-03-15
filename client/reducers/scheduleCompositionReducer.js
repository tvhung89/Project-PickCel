import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function scheduleCompositionReducer(state = initialState.scheduleComposition, action) {
    switch(action.type) {
        case types.GET_SCHEDULE_COMPOSITION_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_SCHEDULE_COMPOSITION_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_SCHEDULE_COMPOSITION_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_SCHEDULE_COMPOSITION_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_SCHEDULE_COMPOSITION_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    scheduleComposition: action.scheduleComposition,
                    loading: false
                }
            }
        case types.ADD_SCHEDULE_COMPOSITION_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    scheduleComposition: action.scheduleComposition,
                    loading: false
                }
            }
        case types.UPDATE_SCHEDULE_COMPOSITION_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    scheduleComposition: action.scheduleComposition,
                    loading: false
                }
            }
        case types.DELETE_SCHEDULE_COMPOSITION_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    scheduleComposition: action.scheduleComposition,
                    loading: false
                }
            }
        case types.GET_SCHEDULE_COMPOSITION_FAILED:
            return {
                ...state,
                get: {
                    scheduleComposition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_SCHEDULE_COMPOSITION_FAILED:
            return {
                ...state,
                add: {
                    scheduleComposition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_SCHEDULE_COMPOSITION_FAILED:
            return {
                ...state,
                update: {
                    scheduleComposition: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_SCHEDULE_COMPOSITION_FAILED:
            return {
                ...state,
                delete: {
                    scheduleComposition: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}