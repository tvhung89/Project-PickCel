import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function scheduleReducer(state = initialState.schedule, action) {
    switch(action.type) {
        case types.GET_SCHEDULE_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.ADD_SCHEDULE_LOADING:
            return {
                ...state,
                add: {
                    ...state.add,
                    loading: true
                }
            }
        case types.UPDATE_SCHEDULE_LOADING:
            return {
                ...state,
                update: {
                    ...state.update,
                    loading: true
                }
            }
        case types.DELETE_SCHEDULE_LOADING:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    loading: true
                }
            }
        case types.GET_SCHEDULE_SUCCESS:
            return {
                ...state,
                get: {
                    ...state.get,
                    schedule: action.schedule,
                    loading: false
                }
            }
        case types.ADD_SCHEDULE_SUCCESS:
            return {
                ...state,
                add: {
                    ...state.add,
                    schedule: action.schedule,
                    loading: false
                }
            }
        case types.UPDATE_SCHEDULE_SUCCESS:
            return {
                ...state,
                update: {
                    ...state.update,
                    schedule: action.schedule,
                    loading: false
                }
            }
        case types.DELETE_SCHEDULE_SUCCESS:
            return {
                ...state,
                delete: {
                    ...state.delete,
                    schedule: action.schedule,
                    loading: false
                }
            }
        case types.GET_SCHEDULE_FAILED:
            return {
                ...state,
                get: {
                    schedule: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.ADD_SCHEDULE_FAILED:
            return {
                ...state,
                add: {
                    schedule: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.UPDATE_SCHEDULE_FAILED:
            return {
                ...state,
                update: {
                    schedule: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.DELETE_SCHEDULE_FAILED:
            return {
                ...state,
                delete: {
                    schedule: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}