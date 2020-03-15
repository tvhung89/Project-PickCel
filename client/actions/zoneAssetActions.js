import * as types from './actionTypes'

const get = (zone_id, asset_id) => {
    return {
        type: types.GET_ZONE_ASSET,
        zone_id,
        asset_id
    }
}

const add = (zoneAsset) => {
    return {
        type: types.ADD_ZONE_ASSET,
        zoneAsset
    }
}

const update = (zoneAsset) => {
    return {
        type: types.UPDATE_ZONE_ASSET,
        zoneAsset
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_ZONE_ASSET,
        id
    }
}

export default {
    get,
    add,
    update,
    remove
}