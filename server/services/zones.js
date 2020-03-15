import db from '../db/operations'
import utils from '../utils'
import uuidv1 from "uuid/v1";

const getZone = (condition, showId = false) => {
    const table = 'zones'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve(showId ? {
                        success: true,
                        template_id: condition.template_id,
                        zones: res.data.rows
                    } : {
                        success: true,
                        zones: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Zone not found!"
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

const addZone = (zone) => {
    const table = 'zones'

    return new Promise((resolve, reject) => {
        zone.id = uuidv1();
        if (utils.check_properties_validity(zone)) {
            db.exec_query(db.build_insert_query(table, zone, true)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zone: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding zone!"
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

const deleteZone = (condition) => {
    const table = 'zones'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zones: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Zone not found!"
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
    getZone,
    addZone,
    deleteZone
}