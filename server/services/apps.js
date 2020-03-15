import db from '../db/operations'
import utils from '../utils'

const getApp = (condition) => {
    const table = 'apps'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        app: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No app found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "App not found!"
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

const addApp = (app) => {
    const table = 'apps'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(app)) {
            db.exec_query(db.build_insert_query(table, app)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        app: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No app added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding app!"
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

const updateApp = (app) => {
    const table = 'apps'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(app)) {
            const updatedApp = {...app}
            delete updatedApp.id

            db.exec_query(db.build_update_query(table, {
                id: app.id
            }, updatedApp)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        app: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No app found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Can't update app!"
                })
            })
        }
    })
}

const deleteApp = (condition) => {
    const table = 'apps'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        app: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No app found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "App not found!"
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
    getApp,
    addApp,
    updateApp,
    deleteApp
}