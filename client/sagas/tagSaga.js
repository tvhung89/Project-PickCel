import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'
import clientUtils from '../utils'

function* fetchGetTag(action) {
    try {
        yield put({ type: types.GET_TAG_LOADING })
        let condition = null
        if(typeof action.asset_id !='undefined')
        condition = {asset_id: action.asset_id}
        else if (typeof action.display_id !='undefined')
        condition = {display_id: action.display_id}
        else
        condition = {}
        const endpoint = '/api/tag/get'
        const response = yield call(url => {
            return axios.post(url,condition).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_TAG_SUCCESS, tag: data.tag})
        } else {
            yield put({ type: types.GET_TAG_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_TAG_FAILED, error})
    }
}

function* getTag() {
    yield takeLatest(types.GET_TAG, fetchGetTag)
}

function* fetchAddTag(action) {
    try {
        yield put({ type: types.ADD_TAG_LOADING })

        const endpoint = '/api/tag/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.tag
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_TAG_SUCCESS, tag: data.tag})
            try {
                yield put({ type: types.GET_ASSET_LOADING })
                const endpointasset = '/api/asset/get'
                const responseasset = yield call(url => {
                    return axios.post(url, {
                        user_id: clientUtils.get_user_id()
                    }).then(response => response).catch(error => error)
                }, endpointasset)
                const dataasset = responseasset.data
                if (data && data.success) {
                    yield put({ type: types.GET_ASSET_SUCCESS, asset: dataasset.asset})
                } else {
                    yield put({ type: types.GET_ASSET_FAILED, error: dataasset.error})
                }
                
            } catch (error) {
                yield put({ type: types.GET_ASSET_FAILED, error})
            }
        } else {
            yield put({ type: types.ADD_TAG_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_TAG_FAILED, error})
    }
}

function* addTag() {
    yield takeLatest(types.ADD_TAG, fetchAddTag)
}

function* fetchUpdateTag(action) {
    try {
        yield put({ type: types.UPDATE_TAG_LOADING })

        const endpoint = '/api/tag/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.tag
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_TAG_SUCCESS, tag: data.tag})
        } else {
            yield put({ type: types.UPDATE_TAG_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_TAG_FAILED, error})
    }
}

function* updateTag() {
    yield takeLatest(types.UPDATE_TAG, fetchUpdateTag)
}

function* fetchDeleteTag(action) {
    try {
        yield put({ type: types.DELETE_TAG_LOADING })

        const endpoint = '/api/tag/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_TAG_SUCCESS, tag: data.tag})
        } else {
            yield put({ type: types.DELETE_TAG_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_TAG_FAILED, error})
    }
}

function* deleteTag() {
    yield takeLatest(types.DELETE_TAG, fetchDeleteTag)
}

export default {
    getTag,
    addTag,
    updateTag,
    deleteTag
}