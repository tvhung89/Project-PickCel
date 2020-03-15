import db from '../db/operations'
import utils from '../utils'
import zoneService from './zones'
import config from '../../config/config'
import uuidv1 from 'uuid/v1'

const getTemplate = (condition) => {
    const table = 'templates'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_select_query(table, condition, false, {
                name: config.template_temp_name
            })).then(response => {
                if (response.success && response.data.rowCount > 0) {
                    let template = response.data.rows

                    zoneService.getZone().then(res => {
                        let zones = res.zones
                        template = template.map(t => {
                            let templateZones = zones.filter(z => z.template_id === t.id)
                            templateZones.forEach(z => {
                                delete z.template_id
                            })

                            return {
                                ...t,
                                zones: templateZones
                            }
                        })

                        template.forEach(t => {
                            delete t.user_id
                        })

                        resolve({
                            success: true,
                            template
                        })
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Can't get zones!"
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "No template found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Template not found!"
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

const getDefaultTemplate = () => {
    const table = 'templates'

    return new Promise((resolve, reject) => {
        db.exec_query(db.build_select_query(table, {user_id: null}, true)).then(response => {
            if (response.success && response.data.rowCount > 0) {
                let template = response.data.rows

                zoneService.getZone().then(res => {
                    let zones = res.zones
                    template = template.map(t => {
                        let templateZones = zones.filter(z => z.template_id === t.id)
                        templateZones.forEach(z => {
                            delete z.template_id
                        })

                        return {
                            ...t,
                            zones: templateZones
                        }
                    })

                    template.forEach(t => {
                        delete t.user_id
                    })

                    resolve({
                        success: true,
                        template
                    })
                }).catch(() => {
                    reject({
                        success: false,
                        error: "Can't get zones!"
                    })
                })
            } else {
                reject({
                    success: false,
                    error: "No template found!"
                })
            }
        }).catch(() => {
            reject({
                success: false,
                error: "Template not found!"
            })
        })
    })
}

const addTemplate = (template) => {
    const table = 'templates'

    return new Promise((resolve, reject) => {
        if (!template.template.id) {
            template.template.id = uuidv1()
        }
        if (utils.check_properties_validity(template.template)) {
            db.exec_query(db.build_insert_query(table, template.template, true)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    const template_id = res.data.rows[0].id
                    const zones = template.zones
                    let zonesPromises = []
                    zones.forEach(z => {
                        zonesPromises.push(zoneService.addZone({
                            ...z,
                            template_id
                        }))
                    })

                    Promise.all(zonesPromises).then(response => {
                        const zoneResponse = response.map(z => {
                            let zone = z.zone
                            delete zone.template_id

                            return {
                                ...zone
                            }
                        })
                        resolve({
                            success: true,
                            template: res.data.rows[0],
                            zones: zoneResponse
                        })
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Can't add zones!"
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "No template added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding template!"
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

const deleteTemplate = (condition) => {
    const table = 'templates'
    const table_inner_join = 'zones'
    const wheres_join = 'template_id'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            let table_join = {
                compositions: 'template_id'
            }
            db.exec_query(db.build_join_query(table, table_join, condition)).then(result => {
                if (result.success && result.data.rowCount > 0) {
                    reject({
                        success: false,
                        error: "This template already exists in the composition. You can not delete"
                    })
                } else {
                    db.exec_query(db.build_delete_join_query(table, table_inner_join, wheres_join, condition)).then(response => {
                        if (response.success && response.data.rowCount > 0) {
                            resolve({
                                success: true,
                                template: response.data.rows[0]
                            })
                        } else {
                            reject({
                                success: false,
                                error: "No template found!"
                            })
                        }
                    }).catch(error => {
                        reject({
                            success: false,
                            error: error
                        })
                    })
                }
            }).catch(error => {
                reject({
                    success: false,
                    error: error
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
    getTemplate,
    getDefaultTemplate,
    addTemplate,
    deleteTemplate
}