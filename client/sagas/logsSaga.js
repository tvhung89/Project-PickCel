import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetLog(action) {
    try {
        yield put({ type: types.GET_LOG_LOADING })

        const endpoint = '/api/logs/get'
        const response = yield call(url => {
            return axios.post(url,action.condition).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data
        if (data && data.success) {
            yield put({ type: types.GET_LOG_SUCCESS, logs: data.logs})
        } else {
            yield put({ type: types.GET_LOG_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_LOG_FAILED, error})
    }
}

function* getLog() {
    yield takeLatest(types.GET_LOG, fetchGetLog)
}
export default {
    getLog
}