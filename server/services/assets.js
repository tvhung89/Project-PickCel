import db from '../db/operations'
import utils from '../utils'
import path from 'path'
import fs from 'fs'
import uuidv1 from "uuid/v1";

const CURRENT_WORKING_DIR = process.cwd()

const getAsset = (condition) => {
    const table = 'assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    const assets = res.data.rows
                    let assetsPromise = []

                    assets.forEach(a => {
                        assetsPromise.push(db.exec_query(db.build_select_query('tags', {asset_id: a.id})))
                    })

                    Promise.all(assetsPromise).then(response => {
                        let returnedAssets = assets.map((a, aIndex) => {
                            const tags = response[aIndex].data.rows
                            return {
                                ...a,
                                tags: tags && tags.length > 0 ? tags : []
                            }
                        })
                        resolve({
                            success: true,
                            asset: returnedAssets.length > 1 ? returnedAssets : returnedAssets[0]
                        })
                    }).catch(() => {
                        resolve({
                            success: true,
                            asset: assets.length > 1 ? assets : assets[0]
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "No asset found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Asset not found!"
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

const getAssetTags = (condition) => {
    const table = 'tags'

    return new Promise((resolve, reject) => {
        db.exec_query(db.build_select_query(table, (condition && Object.keys(condition).length > 0 ? condition : null), true, null, `SELECT t.* FROM ${table} as t JOIN assets as a ON t.asset_id = a.id`)).then(response => {
            const res = response

            if (res.success && res.data.rowCount > 0) {
                resolve({
                    success: true,
                    tag: res.data.rows
                })
            } else {
                reject({
                    success: false,
                    error: "No tag found!"
                })
            }
        }).catch(() => {
            reject({
                success: false,
                error: "Tag not found!"
            })
        })
    })
}

const addAsset = (asset) => {
    const table = 'assets'

    return new Promise((resolve, reject) => {
        if (!asset.id) {
            asset.id = uuidv1()
        }

        if (utils.check_properties_validity(asset)) {
            db.exec_query(db.build_insert_query(table, asset, true)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        asset: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No asset added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding asset!"
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

const updateAsset = (asset) => {
    const table = 'assets'

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
                        asset: res.data.rows[0]
                    })
                } else {
                    reject({
                        success: false,
                        error: "No asset found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Can't update asset!"
                })
            })
        }
    })
}

const deleteAsset = (condition) => {
    const table = 'assets'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query('zone_assets', {asset_id: condition.id})).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    reject({
                        success: false,
                        error: "This asset currently belongs to the composition. You cannot delete!"
                    })
                } else {
                    db.exec_query(db.build_delete_query(table, condition)).then(response => {
                        const res = response

                        if (res.success && res.data.rowCount > 0) {
                            const asset = res.data.rows[0]
                            const gcpFileName = asset.content.split('/')
                            fs.unlink(path.join(CURRENT_WORKING_DIR, `/uploads/${gcpFileName[gcpFileName.length - 1]}`), function (err) {
                                if (err) {
                                    reject({
                                        success: false,
                                        error: "Can't delete asset on server!"
                                    })
                                } else {
                                    resolve({
                                        success: true,
                                        asset
                                    })
                                }
                            });
                            // bucket.file(gcpFileName[gcpFileName.length - 1]).delete().then(r => {
                            //     resolve({
                            //         success: true,
                            //         asset
                            //     })
                            // }).catch(() => {
                            //     reject({
                            //         success: false,
                            //         error: "Can't delete asset on server!"
                            //     })
                            // })

                        } else {
                            reject({
                                success: false,
                                error: "No asset found!"
                            })
                        }
                    }).catch(err => {
                        reject({
                            success: false,
                            error: "Asset not found!"
                        })
                    })
                }
            }).catch(err => {
                reject({
                    success: false,
                    error: "Asset not found!"
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
    getAsset,
    getAssetTags,
    addAsset,
    updateAsset,
    deleteAsset
}