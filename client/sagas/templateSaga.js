import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetTemplate(action) {
    try {
        yield put({ type: types.GET_TEMPLATE_LOADING })

        const endpoint = '/api/template/get'
        const response = yield call(url => {
            return axios.post(url, {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_TEMPLATE_SUCCESS, template: data.template})
        } else {
            yield put({ type: types.GET_TEMPLATE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_TEMPLATE_FAILED, error})
    }
}

function* getTemplate() {
    yield takeLatest(types.GET_TEMPLATE, fetchGetTemplate)
}

function* fetchGetDefaultTemplate(action) {
    try {
        yield put({ type: types.GET_DEFAULT_TEMPLATE_LOADING })

        const endpoint = '/api/template/get'
        const response = yield call(url => {
            return axios.get(url).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_DEFAULT_TEMPLATE_SUCCESS, templates: data.template})
        } else {
            yield put({ type: types.GET_DEFAULT_TEMPLATE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_DEFAULT_TEMPLATE_FAILED, error})
    }
}

function* getDefaultTemplate() {
    yield takeLatest(types.GET_DEFAULT_TEMPLATE, fetchGetDefaultTemplate)
}

function* fetchAddTemplate(action) {
    try {
        yield put({ type: types.ADD_TEMPLATE_LOADING })

        const endpoint = '/api/template/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.template
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_TEMPLATE_SUCCESS, template: {
                template: data.template,
                zones: data.zones
            }})
        } else {
            yield put({ type: types.ADD_TEMPLATE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_TEMPLATE_FAILED, error})
    }
}

function* addTemplate() {
    yield takeLatest(types.ADD_TEMPLATE, fetchAddTemplate)
}

function* fetchDeleteTemplate(action) {
    try {
        yield put({ type: types.DELETE_TEMPLATE_LOADING })

        const endpoint = '/api/template/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_TEMPLATE_SUCCESS, template: {
                template: data.template,
                zones: data.zones
            }})
        } else {
            yield put({ type: types.DELETE_TEMPLATE_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_TEMPLATE_FAILED, error})
    }
}

function* deleteTemplate() {
    yield takeLatest(types.DELETE_TEMPLATE, fetchDeleteTemplate)
}

export default {
    getTemplate,
    getDefaultTemplate,
    addTemplate,
    deleteTemplate
}