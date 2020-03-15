import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetComposition(action) {
    try {
        yield put({ type: types.GET_COMPOSITION_LOADING })

        const endpoint = '/api/composition/get'
        const response = yield call(url => {
            return axios.post(url, action.id ? {
                id: action.id
            } : {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_COMPOSITION_SUCCESS, composition: data.compositions})
        } else {
            yield put({ type: types.GET_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_COMPOSITION_FAILED, error})
    }
}

function* getComposition() {
    yield takeLatest(types.GET_COMPOSITION, fetchGetComposition)
}

function* fetchAddComposition(action) {
    try {
        yield put({ type: types.ADD_COMPOSITION_LOADING })

        const endpoint = '/api/composition/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.composition
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_COMPOSITION_SUCCESS, composition: data.composition})
        } else {
            yield put({ type: types.ADD_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_COMPOSITION_FAILED, error})
    }
}

function* addComposition() {
    yield takeLatest(types.ADD_COMPOSITION, fetchAddComposition)
}

function* fetchUpdateComposition(action) {
    try {
        yield put({ type: types.UPDATE_COMPOSITION_LOADING })

        const endpoint = '/api/composition/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.composition
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_COMPOSITION_SUCCESS, composition: data.composition})
        } else {
            yield put({ type: types.UPDATE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_COMPOSITION_FAILED, error})
    }
}

function* updateComposition() {
    yield takeLatest(types.UPDATE_COMPOSITION, fetchUpdateComposition)
}

function* fetchUpdateCompositionTemplate(action) {
    try {
        yield put({ type: types.UPDATE_COMPOSITION_TEMPLATE_LOADING })

        const endpoint = '/api/composition/update-template'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.composition
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_COMPOSITION_TEMPLATE_SUCCESS, composition: data.composition})
        } else {
            yield put({ type: types.UPDATE_COMPOSITION_TEMPLATE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_COMPOSITION_TEMPLATE_FAILED, error})
    }
}

function* updateCompositionTemplate() {
    yield takeLatest(types.UPDATE_COMPOSITION_TEMPLATE, fetchUpdateCompositionTemplate)
}

function* fetchDeleteComposition(action) {
    try {
        yield put({ type: types.DELETE_COMPOSITION_LOADING })

        const endpoint = '/api/composition/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_COMPOSITION_SUCCESS, composition: data.composition})
        } else {
            yield put({ type: types.DELETE_COMPOSITION_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_COMPOSITION_FAILED, error})
    }
}

function* deleteComposition() {
    yield takeLatest(types.DELETE_COMPOSITION, fetchDeleteComposition)
}

export default {
    getComposition,
    addComposition,
    updateComposition,
    updateCompositionTemplate,
    deleteComposition
}