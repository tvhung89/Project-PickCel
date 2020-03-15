import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetApp(action) {
    try {
        yield put({ type: types.GET_APP_LOADING })

        const endpoint = '/api/app/get'
        const response = yield call(url => {
            return axios.post(url, {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_APP_SUCCESS, app: data.app})
        } else {
            yield put({ type: types.GET_APP_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_APP_FAILED, error})
    }
}

function* getApp() {
    yield takeLatest(types.GET_APP, fetchGetApp)
}

function* fetchAddApp(action) {
    try {
        yield put({ type: types.ADD_APP_LOADING })

        const endpoint = '/api/app/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.app
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_APP_SUCCESS, app: data.app})
        } else {
            yield put({ type: types.ADD_APP_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_APP_FAILED, error})
    }
}

function* addApp() {
    yield takeLatest(types.ADD_APP, fetchAddApp)
}

function* fetchUpdateApp(action) {
    try {
        yield put({ type: types.UPDATE_APP_LOADING })

        const endpoint = '/api/app/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.app
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_APP_SUCCESS, app: data.app})
        } else {
            yield put({ type: types.UPDATE_APP_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_APP_FAILED, error})
    }
}

function* updateApp() {
    yield takeLatest(types.UPDATE_APP, fetchUpdateApp)
}

function* fetchDeleteApp(action) {
    try {
        yield put({ type: types.DELETE_APP_LOADING })

        const endpoint = '/api/app/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_APP_SUCCESS, app: data.app})
        } else {
            yield put({ type: types.DELETE_APP_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_APP_FAILED, error})
    }
}

function* deleteApp() {
    yield takeLatest(types.DELETE_APP, fetchDeleteApp)
}

export default {
    getApp,
    addApp,
    updateApp,
    deleteApp
}