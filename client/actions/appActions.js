import * as types from './actionTypes'

const get = (user_id) => {
    return {
        type: types.GET_APP,
        user_id
    }
}

const add = (app) => {
    return {
        type: types.ADD_APP,
        app
    }
}

const update = (app) => {
    return {
        type: types.UPDATE_APP,
        app
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_APP,
        id
    }
}

export default {
    get,
    add,
    update,
    remove
}