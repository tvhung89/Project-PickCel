import * as types from './actionTypes'

const get = (condition) => {
    if (condition.id) {
        return {
            type: types.GET_COMPOSITION,
            id: condition.id
        }
    } else {
        return {
            type: types.GET_COMPOSITION,
            user_id: condition
        }
    }
}

const add = (composition) => {
    return {
        type: types.ADD_COMPOSITION,
        composition
    }
}

const update = (composition) => {
    return {
        type: types.UPDATE_COMPOSITION,
        composition
    }
}

const updateTemplate = (composition) => {
    return {
        type: types.UPDATE_COMPOSITION_TEMPLATE,
        composition
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_COMPOSITION,
        id
    }
}

export default {
    get,
    add,
    update,
    updateTemplate,
    remove
}