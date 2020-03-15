import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetSchedule(action) {
    try {
        yield put({ type: types.GET_SCHEDULE_LOADING })

        const endpoint = '/api/schedule/get'
        const response = yield call(url => {
            return axios.post(url, action.id ? {
                id: action.id
            } : {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_SCHEDULE_SUCCESS, schedule: data.schedule})
        } else {
            yield put({ type: types.GET_SCHEDULE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_SCHEDULE_FAILED, error})
    }
}

function* getSchedule() {
    yield takeLatest(types.GET_SCHEDULE, fetchGetSchedule)
}

function* fetchAddSchedule(action) {
    try {
        yield put({ type: types.ADD_SCHEDULE_LOADING })

        const endpoint = '/api/schedule/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.schedule
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_SCHEDULE_SUCCESS, schedule: data.schedule})
        } else {
            yield put({ type: types.ADD_SCHEDULE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_SCHEDULE_FAILED, error})
    }
}

function* addSchedule() {
    yield takeLatest(types.ADD_SCHEDULE, fetchAddSchedule)
}

function* fetchUpdateSchedule(action) {
    try {
        yield put({ type: types.UPDATE_SCHEDULE_LOADING })

        const endpoint = '/api/schedule/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.schedule
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_SCHEDULE_SUCCESS, schedule: data.schedule})
        } else {
            yield put({ type: types.UPDATE_SCHEDULE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_SCHEDULE_FAILED, error})
    }
}

function* updateSchedule() {
    yield takeLatest(types.UPDATE_SCHEDULE, fetchUpdateSchedule)
}

function* fetchDeleteSchedule(action) {
    try {
        yield put({ type: types.DELETE_SCHEDULE_LOADING })

        const endpoint = '/api/schedule/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_SCHEDULE_SUCCESS, schedule: data.schedule})
        } else {
            yield put({ type: types.DELETE_SCHEDULE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_SCHEDULE_FAILED, error})
    }
}

function* deleteSchedule() {
    yield takeLatest(types.DELETE_SCHEDULE, fetchDeleteSchedule)
}

export default {
    getSchedule,
    addSchedule,
    updateSchedule,
    deleteSchedule
}