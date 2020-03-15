import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchRegister(action) {
    try {
        yield put({ type: types.REGISTER_LOADING })

        const endpoint = '/api/user/register'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.REGISTER_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.REGISTER_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.REGISTER_FAILED, error})
    }
}

function* loadRegister() {
    yield takeLatest(types.REGISTER, fetchRegister)
}

function* fetchLogin(action) {
    try {
        yield put({ type: types.LOGIN_LOADING })

        const endpoint = '/api/user/login'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.LOGIN_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.LOGIN_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.LOGIN_FAILED, error})
    }
}

function* loadLogin() {
    yield takeLatest(types.LOGIN, fetchLogin)
}

function* fetchUser(action) {
    try {
        yield put({ type: types.GET_USER_LOADING })

        const endpoint = '/api/user/get'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_USER_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.GET_USER_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_USER_FAILED, error})
    }
}

function* loadUser() {
    yield takeLatest(types.GET_USER, fetchUser)
}

function* fetchSendResetPasswordEmail(action) {
    try {
        yield put({ type: types.SEND_RESET_PASSWORD_EMAIL_LOADING })

        const endpoint = '/api/user/send-reset-password-email'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.SEND_RESET_PASSWORD_EMAIL_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.SEND_RESET_PASSWORD_EMAIL_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.SEND_RESET_PASSWORD_EMAIL_FAILED, error})
    }
}

function* loadSendResetPasswordEmail() {
    yield takeLatest(types.SEND_RESET_PASSWORD_EMAIL, fetchSendResetPasswordEmail)
}

function* fetchResetPassword(action) {
    try {
        yield put({ type: types.RESET_PASSWORD_LOADING })

        const endpoint = '/api/user/reset-password'
        const response = yield call(url => {
            return axios.post(url, {
                user: action.user,
                token: action.token
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.RESET_PASSWORD_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.RESET_PASSWORD_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.RESET_PASSWORD_FAILED, error})
    }
}

function* loadResetPassword() {
    yield takeLatest(types.RESET_PASSWORD, fetchResetPassword)
}

function* fetchChangePassword(action) {
    try {
        yield put({ type: types.CHANGE_PASSWORD_LOADING })

        const endpoint = '/api/user/change-password'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data
        if (data && data.success) {
            yield put({ type: types.CHANGE_PASSWORD_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.CHANGE_PASSWORD_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.CHANGE_PASSWORD_FAILED, error})
    }
}

function* loadChangePassword() {
    yield takeLatest(types.CHANGE_PASSWORD, fetchChangePassword)
}

function* fetchVerifyUser(action) {
    try {
        yield put({ type: types.VERIFY_USER_LOADING })

        const endpoint = '/api/user/verify-user'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.VERIFY_USER_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.VERIFY_USER_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.VERIFY_USER_FAILED, error})
    }
}

function* verifyUser() {
    yield takeLatest(types.VERIFY_USER, fetchVerifyUser)
}

function* fetchUpdateUser(action) {
    try {
        yield put({ type: types.UPDATE_USER_LOADING })

        const endpoint = '/api/user/update-user-info'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.user
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_USER_SUCCESS, user: data.user})
        } else {
            yield put({ type: types.UPDATE_USER_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_USER_FAILED, error})
    }
}

function* updateUser() {
    yield takeLatest(types.UPDATE_USER, fetchUpdateUser)
}

export default {
    loadRegister,
    loadLogin,
    loadUser,
    loadSendResetPasswordEmail,
    loadResetPassword,
    loadChangePassword,
    verifyUser,
    updateUser
}