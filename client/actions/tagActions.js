import * as types from './actionTypes'

const get = (asset_id) => {
    return {
        type: types.GET_TAG,
        asset_id
    }
}

const getByDisplay = (display_id) => {
    return {
        type: types.GET_TAG,
        display_id
    }
}


const add = (tag) => {
    return {
        type: types.ADD_TAG,
        tag
    }
}

const update = (tag) => {
    return {
        type: types.UPDATE_TAG,
        tag
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_TAG,
        id
    }
}

export default {
    get,
    getByDisplay,
    add,
    update,
    remove
}