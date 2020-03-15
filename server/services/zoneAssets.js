import db from '../db/operations'
import utils from '../utils'

const getZoneAsset = (condition) => {
    const table = 'zone_assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zoneAsset: res.data.rows
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone asset found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Zone asset not found!"
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

const addZoneAsset = (asset) => {
    const table = 'zone_assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(asset)) {
            db.exec_query(db.build_insert_query(table, asset, true)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zoneAsset: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone asset added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding zone asset!"
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

const updateZoneAsset = (asset) => {
    const table = 'zone_assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(asset)) {
            const updatedAsset = {...asset}
            delete updatedAsset.id

            db.exec_query(db.build_update_query(table, {
                id: asset.id
            }, updatedAsset)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zoneAsset: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone asset found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Can't update zone asset!"
                })
            })
        }
    })
}

const deleteZoneAsset = (condition) => {
    const table = 'zone_assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        zoneAsset: res.data.rows.length > 1 ? res.data.rows : res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No zone asset found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Zone asset not found!"
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
    getZoneAsset,
    addZoneAsset,
    updateZoneAsset,
    deleteZoneAsset
}