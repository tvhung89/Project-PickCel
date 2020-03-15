import * as types from './actionTypes'

const updateDisplayDefaultComposition = (display, default_composition_id) => {
    return {
        type: types.UPDATE_DISPLAY_DEFAULT_COMPOSITION,
        display, default_composition_id
    }
}
export default{
    updateDisplayDefaultComposition
}