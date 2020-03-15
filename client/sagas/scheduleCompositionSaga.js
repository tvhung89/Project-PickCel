import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetScheduleComposition(action) {
    try {
        yield put({ type: types.GET_SCHEDULE_COMPOSITION_LOADING })

        const endpoint = '/api/schedule-composition/get'
        const response = yield call(url => {
            return axios.post(url, {
                schedule_id: action.schedule_id,
                composition_id: action.composition_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_SCHEDULE_COMPOSITION_SUCCESS, scheduleComposition: data.scheduleComposition})
        } else {
            yield put({ type: types.GET_SCHEDULE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_SCHEDULE_COMPOSITION_FAILED, error})
    }
}

function* getScheduleComposition() {
    yield takeLatest(types.GET_SCHEDULE_COMPOSITION, fetchGetScheduleComposition)
}

function* fetchAddScheduleComposition(action) {
    try {
        yield put({ type: types.ADD_SCHEDULE_COMPOSITION_LOADING })

        const endpoint = '/api/schedule-composition/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.scheduleComposition
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_SCHEDULE_COMPOSITION_SUCCESS, scheduleComposition: data.scheduleComposition})
        } else {
            yield put({ type: types.ADD_SCHEDULE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_SCHEDULE_COMPOSITION_FAILED, error})
    }
}

function* addScheduleComposition() {
    yield takeLatest(types.ADD_SCHEDULE_COMPOSITION, fetchAddScheduleComposition)
}

function* fetchUpdateScheduleComposition(action) {
    try {
        yield put({ type: types.UPDATE_SCHEDULE_COMPOSITION_LOADING })

        const endpoint = '/api/schedule-composition/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.scheduleComposition
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_SCHEDULE_COMPOSITION_SUCCESS, scheduleComposition: data.scheduleComposition})
        } else {
            yield put({ type: types.UPDATE_SCHEDULE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_SCHEDULE_COMPOSITION_FAILED, error})
    }
}

function* updateScheduleComposition() {
    yield takeLatest(types.UPDATE_SCHEDULE_COMPOSITION, fetchUpdateScheduleComposition)
}

function* fetchDeleteScheduleComposition(action) {
    try {
        yield put({ type: types.DELETE_SCHEDULE_COMPOSITION_LOADING })

        const endpoint = '/api/schedule-composition/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_SCHEDULE_COMPOSITION_SUCCESS, scheduleComposition: data.scheduleComposition})
        } else {
            yield put({ type: types.DELETE_SCHEDULE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_SCHEDULE_COMPOSITION_FAILED, error})
    }
}

function* deleteScheduleComposition() {
    yield takeLatest(types.DELETE_SCHEDULE_COMPOSITION, fetchDeleteScheduleComposition)
}

export default {
    getScheduleComposition,
    addScheduleComposition,
    updateScheduleComposition,
    deleteScheduleComposition
}