import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchUpdateDisplayDefaultComposition(action) {
    try {
        yield put({ type: types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_LOADING })
        const endpoint = '/api/setting/update'
        const response = yield call(url => {
            return axios.post(url, {
                display: action.display, default_composition_id: action.default_composition_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_SUCCESS, display: data.display})
        } else {
            yield put({ type: types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_DISPLAY_DEFAULT_COMPOSITION_FAILED, error})
    }
}

function* updateDisplayDefaultComposition() {
    yield takeLatest(types.UPDATE_DISPLAY_DEFAULT_COMPOSITION, fetchUpdateDisplayDefaultComposition)
}
export default {
    updateDisplayDefaultComposition
}