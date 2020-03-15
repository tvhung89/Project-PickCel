import axios from 'axios'
import { call, put, takeLatest } from 'redux-saga/effects'
import * as types from '../actions/actionTypes'

function* fetchGetZoneAsset(action) {
    try {
        yield put({ type: types.GET_ZONE_ASSET_LOADING })

        const endpoint = '/api/zone-asset/get'
        const response = yield call(url => {
            return axios.post(url, {
                zone_id: action.zone_id,
                asset_id: action.asset_id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.GET_ZONE_ASSET_SUCCESS, zoneAsset: data.zoneAsset})
        } else {
            yield put({ type: types.GET_ZONE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.GET_ZONE_ASSET_FAILED, error})
    }
}

function* getZoneAsset() {
    yield takeLatest(types.GET_ZONE_ASSET, fetchGetZoneAsset)
}

function* fetchAddZoneAsset(action) {
    try {
        yield put({ type: types.ADD_ZONE_ASSET_LOADING })

        const endpoint = '/api/zone-asset/add'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.zoneAsset
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.ADD_ZONE_ASSET_SUCCESS, zoneAsset: data.zoneAsset})
        } else {
            yield put({ type: types.ADD_ZONE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.ADD_ZONE_ASSET_FAILED, error})
    }
}

function* addZoneAsset() {
    yield takeLatest(types.ADD_ZONE_ASSET, fetchAddZoneAsset)
}

function* fetchUpdateZoneAsset(action) {
    try {
        yield put({ type: types.UPDATE_ZONE_ASSET_LOADING })

        const endpoint = '/api/zone-asset/update'
        const response = yield call(url => {
            return axios.post(url, {
                ...action.zoneAsset
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.UPDATE_ZONE_ASSET_SUCCESS, zoneAsset: data.zoneAsset})
        } else {
            yield put({ type: types.UPDATE_ZONE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.UPDATE_ZONE_ASSET_FAILED, error})
    }
}

function* updateZoneAsset() {
    yield takeLatest(types.UPDATE_ZONE_ASSET, fetchUpdateZoneAsset)
}

function* fetchDeleteZoneAsset(action) {
    try {
        yield put({ type: types.DELETE_ZONE_ASSET_LOADING })

        const endpoint = '/api/zone-asset/remove'
        const response = yield call(url => {
            return axios.post(url, {
                id: action.id
            }).then(response => response).catch(error => error)
        }, endpoint)
        const data = response.data

        if (data && data.success) {
            yield put({ type: types.DELETE_ZONE_ASSET_SUCCESS, zoneAsset: data.zoneAsset})
        } else {
            yield put({ type: types.DELETE_ZONE_ASSET_FAILED, error: data.error})
        }
        
    } catch (error) {
        yield put({ type: types.DELETE_ZONE_ASSET_FAILED, error})
    }
}

function* deleteZoneAsset() {
    yield takeLatest(types.DELETE_ZONE_ASSET, fetchDeleteZoneAsset)
}

export default {
    getZoneAsset,
    addZoneAsset,
    updateZoneAsset,
    deleteZoneAsset
}