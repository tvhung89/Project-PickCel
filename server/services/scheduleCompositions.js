import db from '../db/operations'
import utils from '../utils'

const getScheduleComposition = (condition) => {
    const table = 'schedule_compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        scheduleComposition: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No schedule composition found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Schedule composition not found!"
                })
            })
        } else {
            reject({
                success: false,
                error: 'Params not found!'
            })
        }
    })
}

const addScheduleComposition = (composition) => {
    const table = 'schedule_compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(composition)) {
            db.exec_query(db.build_insert_query(table, composition, true)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        scheduleComposition: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No schedule composition added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding schedule composition!"
                })
            })
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

const updateScheduleComposition = (composition) => {
    const table = 'schedule_compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(composition)) {
            const updatedScheduleComposition = {...composition}
            delete updatedScheduleComposition.id

            db.exec_query(db.build_update_query(table, {
                id: composition.id
            }, updatedScheduleComposition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        addScheduleComposition: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No schedule composition found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Can't update schedule composition!"
                })
            })
        }
    })
}

const deleteScheduleComposition = (condition) => {
    const table = 'schedule_compositions'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        scheduleComposition: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No schedule composition found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Schedule composition not found!"
                })
            })
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

export default {
    getScheduleComposition,
    addScheduleComposition,
    updateScheduleComposition,
    deleteScheduleComposition
}