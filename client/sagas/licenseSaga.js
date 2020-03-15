import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

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


export default {
  loadUser
}