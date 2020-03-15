import * as types from './actionTypes'

const get = (schedule_id, composition_id) => {
    return {
        type: types.GET_SCHEDULE_COMPOSITION,
        schedule_id,
        composition_id
    }
}

const add = (scheduleComposition) => {
    return {
        type: types.ADD_SCHEDULE_COMPOSITION,
        scheduleComposition
    }
}

const update = (scheduleComposition) => {
    return {
        type: types.UPDATE_SCHEDULE_COMPOSITION,
        scheduleComposition
    }
}

const remove = (id) => {
    return {
        type: types.DELETE_SCHEDULE_COMPOSITION,
        id
    }
}

export default {
    get,
    add,
    update,
    remove
}