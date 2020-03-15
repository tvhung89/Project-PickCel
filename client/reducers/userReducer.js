import * as types from '../actions/actionTypes'
import initialState from './initialState';

export default function userReducer(state = initialState.user, action) {
    switch(action.type) {
        case types.REGISTER_LOADING:
            return {
                ...state,
                register: {
                    ...state.register,
                    loading: true
                }
            }
        case types.LOGIN_LOADING:
            return {
                ...state,
                login: {
                    ...state.login,
                    loading: true
                }
            }
        case types.GET_USER_LOADING:
            return {
                ...state,
                get: {
                    ...state.get,
                    loading: true
                }
            }
        case types.SEND_RESET_PASSWORD_EMAIL_LOADING:
            return {
                ...state,
                sendEmail: {
                    ...state.sendEmail,
                    loading: true
                }
            }
        case types.RESET_PASSWORD_LOADING:
            return {
                ...state,
                resetPassword: {
                    ...state.resetPassword,
                    loading: true
                }
            }
        case types.CHANGE_PASSWORD_LOADING:
            return {
                ...state,
                changePassword: {
                    ...state.changePassword,
                    loading: true
                }
            }
        case types.VERIFY_USER_LOADING:
            return {
                ...state,
                verify: {
                    ...state.verify,
                    loading: true
                }
            }
        case types.UPDATE_USER_LOADING:
                return {
                    ...state,
                    update: {
                        ...state.update,
                        loading: true,
                        user: null,
                        error: null
                    }
                }
        case types.REGISTER_SUCCESS:
            return {
                ...state,
                register: {
                    ...state.register,
                    user: action.user,
                    loading: false
                }
            }
        case types.LOGIN_SUCCESS:
            return {
                ...state,
                login: {
                    ...state.login,
                    user: action.user,
                    loading: false
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
        case types.SEND_RESET_PASSWORD_EMAIL_SUCCESS:
            return {
                ...state,
                sendEmail: {
                    ...state.sendEmail,
                    user: action.user,
                    loading: false
                }
            }
        case types.RESET_PASSWORD_SUCCESS:
            return {
                ...state,
                resetPassword: {
                    ...state.resetPassword,
                    user: action.user,
                    loading: false
                }
            }
        case types.CHANGE_PASSWORD_SUCCESS:
            return {
                ...state,
                changePassword: {
                    ...state.changePassword,
                    user: action.user,
                    loading: false
                }
            }
        case types.VERIFY_USER_SUCCESS:
                return {
                    ...state,
                    verify: {
                        ...state.verify,
                        user: action.user,
                        loading: false
                    }
                }
        case types.UPDATE_USER_SUCCESS:
                return {
                    ...state,
                    update: {
                        ...state.update,
                        user: action.user,
                        loading: false
                    }
                }
        case types.REGISTER_FAILED:
            return {
                ...state,
                register: {
                    user: null,
                    loading: false,
                    error: action.error
                },
                login: {
                    ...state.login,
                    user: null
                }
            }
        case types.LOGIN_FAILED:
            return {
                ...state,
                login: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.GET_USER_FAILED:
            return {
                ...state,
                get: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.SEND_RESET_PASSWORD_EMAIL_FAILED:
            return {
                ...state,
                sendEmail: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.RESET_PASSWORD_FAILED:
            return {
                ...state,
                resetPassword: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.CHANGE_PASSWORD_FAILED:
            return {
                ...state,
                changePassword: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        case types.VERIFY_USER_FAILED:
                return {
                    ...state,
                    verify: {
                        user: null,
                        loading: false,
                        error: action.error
                    }
                }
        case types.UPDATE_USER_FAILED:
            return {
                ...state,
                update: {
                    user: null,
                    loading: false,
                    error: action.error
                }
            }
        default:
            return state
    }
}