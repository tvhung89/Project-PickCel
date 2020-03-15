import * as types from './actionTypes'

const get = (user_id) => {
    return {
        type: types.GET_DISPLAY,
        user_id
    }
}

const getTags = () => {
    return {
        type: types.GET_TAG_DISPLAY
    }
}


const add = (display) => {
    return {
        type: types.ADD_DISPLAY,
        display
    }
}

const update = (display) => {
    return {
        type: types.UPDATE_DISPLAY,
        display
    }
}

export default {
    get,
    getTags,
    add,
    update
}