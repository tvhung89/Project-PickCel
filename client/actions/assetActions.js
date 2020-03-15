import * as types from './actionTypes'

const get = (user_id) => {
    return {
        type: types.GET_ASSET,
        user_id
    }
}

const getTags = () => {
    return {
        type: types.GET_ASSET_TAGS
    }
}

const add = (asset) => {
    return {
        type: types.ADD_ASSET,
        asset
    }
}

const update = (asset) => {
    return {
        type: types.UPDATE_ASSET,
        asset
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_ASSET,
        id
    }
}

export default {
    get,
    getTags,
    add,
    update,
    remove
}