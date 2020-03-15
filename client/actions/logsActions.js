import * as types from './actionTypes'

const getLogs = (condition)=>{
return {
    type: types.GET_LOG,
    condition
}
}
export default {
    getLogs
}