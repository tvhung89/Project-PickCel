import db from '../db/operations'
import utils from '../utils'
import uuidv1 from 'uuid/v1'

const getTag = (condition) => {
    const table = 'tags'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition)).then(response => {
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
        } else {
            reject({
                success: false,
                error: 'Params not found!'
            })
        }
    })
}

const addTag = (tag) => {
    const table = 'tags'
    tag.id = uuidv1()

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(tag)) {
            let condition =  null;
            if(typeof tag.asset_id !='undefined'){
                condition = {key: tag.key, value: tag.value, asset_id: tag.asset_id}
            }else if(typeof tag.display_id !='undefined'){
                condition = {key: tag.key, value: tag.value, display_id: tag.display_id}
            }else{
                condition = {}
            }
            db.exec_query(db.build_select_query(table,condition)).then(result => {
                    if (result.success && result.data.rowCount > 0) {
                    reject({
                        success: false,
                        error: "Tag already exists!"
                    })
                }else if(result.success && result.data.rowCount == 0){
                    db.exec_query(db.build_insert_query(table, tag, true)).then(res => {
                        if (res.success && res.data.rowCount > 0) {
                            resolve({
                                success: true,
                                tag: res.data.rows[0]
                            })
                        } else {
                            reject({
                                success: false,
                                error: "No tag added!"
                            })
                        }
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Error on adding tag!"
                        })
                    })
                }
            }).catch((err) => {
                reject({
                    success: false,
                    error: "Error on get tags!"
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

const updateTag = (tag) => {
    const table = 'tags'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(tag)) {
            const updatedTag = {...tag}
            delete updatedTag.id

            db.exec_query(db.build_update_query(table, {
                id: tag.id
            }, updatedTag)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        tag: res.data.rows[0]
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
                    error: "Can't update tag!"
                })
            })
        }
    })
}

const deleteTag = (condition) => {
    const table = 'tags'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    resolve({
                        success: true,
                        tag: res.data.rows[0]
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
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

export default {
    getTag,
    addTag,
    updateTag,
    deleteTag
}