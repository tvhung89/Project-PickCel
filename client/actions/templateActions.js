import * as types from './actionTypes'

const get = (user_id) => {
    return {
        type: types.GET_TEMPLATE,
        user_id
    }
}

const getDefault = () => {
    return {
        type: types.GET_DEFAULT_TEMPLATE
    }
}

const add = (template) => {
    return {
        type: types.ADD_TEMPLATE,
        template
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_TEMPLATE,
        id
    }
}

export default {
    get,
    getDefault,
    add,
    remove
}