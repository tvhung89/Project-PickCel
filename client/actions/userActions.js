import * as types from './actionTypes'

const register = (user) => {
    return {
        type: types.REGISTER,
        user
    }
}

const login = (user) => {
    return {
        type: types.LOGIN,
        user
    }
}

const getUser = (user) => {
    return {
        type: types.GET_USER,
        user
    }
}

const sendResetPasswordEmail = (user) => {
    return {
        type: types.SEND_RESET_PASSWORD_EMAIL,
        user
    }
}

const resetPassword = (user, token) => {
    return {
        type: types.RESET_PASSWORD,
        user,
        token
    }
}

const changePassword = (user) => {
    return {
        type: types.CHANGE_PASSWORD,
        user
    }
}

const verify = (user) => {
    return {
        type: types.VERIFY_USER,
        user
    }
}

const update = (user) => {
    return {
        type: types.UPDATE_USER,
        user
    }
}

export default {
    register,
    login,
    getUser,
    sendResetPasswordEmail,
    resetPassword,
    changePassword,
    verify,
    update
}