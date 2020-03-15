import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetAsset(action) {
    try {
        yield put({ type: types.GET_ASSET_LOADING })

        const endpoint = '/api/asset/get'
        const response = yield call(url => {
            return axios.post(url, {
                user_id: action.user_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_ASSET_SUCCESS, asset: data.asset})
        } else {
            yield put({ type: types.GET_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_ASSET_FAILED, error})
    }
}

function* getAsset() {
    yield takeLatest(types.GET_ASSET, fetchGetAsset)
}

function* fetchGetAssetTags(action) {
    try {
        yield put({ type: types.GET_ASSET_TAGS_LOADING })

        const endpoint = '/api/asset/tags/get'
        const response = yield call(url => {
            return axios.post(url, {display_id: null}).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data
        if (data && data.success) {
            yield put({ type: types.GET_ASSET_TAGS_SUCCESS, tags: data.tag})
        } else {
            yield put({ type: types.GET_ASSET_TAGS_FAILED, error: data.error})
        }

    } catch (error) {
        yield put({ type: types.GET_ASSET_TAGS_FAILED, error})
    }
}

function* getAssetTags() {
    yield takeLatest(types.GET_ASSET_TAGS, fetchGetAssetTags)
}

function* fetchAddAsset(action) {
    try {
        yield put({ type: types.ADD_ASSET_LOADING })

        const endpoint = '/api/asset/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.asset
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_ASSET_SUCCESS, asset: data.asset})
        } else {
            yield put({ type: types.ADD_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_ASSET_FAILED, error})
    }
}

function* addAsset() {
    yield takeLatest(types.ADD_ASSET, fetchAddAsset)
}

function* fetchUpdateAsset(action) {
    try {
        yield put({ type: types.UPDATE_ASSET_LOADING })

        const endpoint = '/api/asset/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.asset
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_ASSET_SUCCESS, asset: data.asset})
        } else {
            yield put({ type: types.UPDATE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_ASSET_FAILED, error})
    }
}

function* updateAsset() {
    yield takeLatest(types.UPDATE_ASSET, fetchUpdateAsset)
}

function* fetchDeleteAsset(action) {
    try {
        yield put({ type: types.DELETE_ASSET_LOADING })

        const endpoint = '/api/asset/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_ASSET_SUCCESS, asset: data.asset})
        } else {
            yield put({ type: types.DELETE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_ASSET_FAILED, error})
    }
}

function* deleteAsset() {
    yield takeLatest(types.DELETE_ASSET, fetchDeleteAsset)
}

export default {
    getAsset,
    getAssetTags,
    addAsset,
    updateAsset,
    deleteAsset
}