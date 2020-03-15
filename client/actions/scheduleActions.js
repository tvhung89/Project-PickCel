import * as types from './actionTypes'

const get = (condition) => {
    return condition.id ? {
        type: types.GET_SCHEDULE,
        id: condition.id
    } : {
        type: types.GET_SCHEDULE,
        user_id: condition
    }
}

const add = (schedule) => {
    return {
        type: types.ADD_SCHEDULE,
        schedule
    }
}

const update = (schedule) => {
    return {
        type: types.UPDATE_SCHEDULE,
        schedule
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_SCHEDULE,
        id
    }
}

export default {
    get,
    add,
    update,
    remove
}