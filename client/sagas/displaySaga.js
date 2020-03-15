import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetDisplay(action) {
    try {
        yield put({ type: types.GET_DISPLAY_LOADING })

        const endpoint = '/api/display/get'
        const response = yield call(url => {
            return axios.post(url, {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_DISPLAY_SUCCESS, display: data.display})
        } else {
            yield put({ type: types.GET_DISPLAY_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_DISPLAY_FAILED, error})
    }
}

function* getDisplay() {
    yield takeLatest(types.GET_DISPLAY, fetchGetDisplay)
}

function* fetchGetDisplayTags(action) {
    try {
        yield put({ type: types.GET_TAG_DISPLAY_LOADING })

        const endpoint = '/api/display/tags/get'
        const response = yield call(url => {
            return axios.post(url, {asset_id: null}).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data
        if (data && data.success) {
            yield put({ type: types.GET_TAG_DISPLAY_SUCCESS, tags: data.tag})
        } else {
            yield put({ type: types.GET_TAG_DISPLAY_FAILED, error: data.error})
        }

    } catch (error) {
        yield put({ type: types.GET_TAG_DISPLAY_FAILED, error})
    }
}

function* getDisplayTags() {
    yield takeLatest(types.GET_TAG_DISPLAY, fetchGetDisplayTags)
}

function* fetchAddDisplay(action) {
    try {
        yield put({ type: types.ADD_DISPLAY_LOADING })

        const endpoint = '/api/display/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.display
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_DISPLAY_SUCCESS, display: data.display})
        } else {
            yield put({ type: types.ADD_DISPLAY_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_DISPLAY_FAILED, error})
    }
}

function* addDisplay() {
    yield takeLatest(types.ADD_DISPLAY, fetchAddDisplay)
}

function* fetchUpdateDisplay(action) {
    try {
        yield put({ type: types.UPDATE_DISPLAY_LOADING })

        const endpoint = '/api/display/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.display
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_DISPLAY_SUCCESS, display: data.display})
        } else {
            yield put({ type: types.UPDATE_DISPLAY_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_DISPLAY_FAILED, error})
    }
}

function* updateDisplay() {
    yield takeLatest(types.UPDATE_DISPLAY, fetchUpdateDisplay)
}

export default {
    getDisplay,
    addDisplay,
    getDisplayTags,
    updateDisplay
}