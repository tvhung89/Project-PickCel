import db from '../db/operations'
import utils from '../utils'
import displayDb from '../db/display'
import * as displays from '../../displays.json'
import config from '../../config/config'
import compositionService from './compositions'

const getDisplay = (condition) => {
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(displayDb.getDisplayInfo(condition)).then(response => {
                const displays = response.data.rows
                let tempDisplays = []
                let tagsPromises = []
                let compositionPromises = []

                displays.forEach(d => {
                    const isExist = tempDisplays.length > 0 ? tempDisplays.filter(tc => tc.id == d.id).length > 0 : false
                    const {id, name, online_at, network_status, mac_address_wifi, mac_address_ethernet, address, location, default_composition_id, network_speed, private_ip, public_ip, apk_version, javascript_version, sdk_version, storage, available_ram, brand, device, manufacturer, hardware, model, total_storage, total_ram, orientation, code, is_active, user_id} = d

                    if (!isExist) tempDisplays.push({
                        id,
                        name,
                        online_at,
                        network_status,
                        mac_address_wifi,
                        mac_address_ethernet,
                        address,
                        location,
                        default_composition_id,
                        network_speed,
                        private_ip,
                        public_ip,
                        apk_version,
                        javascript_version,
                        sdk_version,
                        storage,
                        available_ram,
                        brand,
                        device,
                        manufacturer,
                        hardware,
                        model,
                        total_storage,
                        total_ram,
                        orientation,
                        code,
                        is_active,
                        user_id
                    })

                })

                tempDisplays = tempDisplays.map(t => {
                    let schedules = displays.filter(d => t.id == d.id)
                    let tempSchedules = []
                    let compositions = []

                    // compositionPromises.push(compositionService.getComposition({
                    //     id: t.default_composition_id
                    // }))
                    let compositionTemp = compositionService.getComposition({
                        id: t.default_composition_id
                    })
                    compositionPromises.push(compositionTemp)

                    tagsPromises.push(db.exec_query(db.build_select_query('tags', {display_id: t.id})))

                    schedules.forEach(s => {
                        const isExist = tempSchedules.length > 0 ? tempSchedules.filter(ts => ts.id == s.schedule_id).length > 0 : false

                        if (!isExist && s.schedule_id != config.default_composition_id) tempSchedules.push({
                            id: s.schedule_id,
                            name: s.schedule_name,
                            version: s.schedule_version
                        })
                    })

                    tempSchedules = tempSchedules[0]

                    if (tempSchedules) {
                        compositions = displays.filter(d => d.schedule_id == tempSchedules.id)
                        compositions = compositions.map(c => {
                            return {
                                id: c.schedule_composition_id,
                                name: c.composition_name,
                                width: c.width,
                                height: c.height,
                                orientation: c.composition_orientation,
                                start_date: utils.format_date(c.start_date),
                                end_date: utils.format_date(c.end_date),
                                is_repeat: c.is_repeat,
                                monday: c.monday,
                                tuesday: c.tuesday,
                                wednesday: c.wednesday,
                                thursday: c.thursday,
                                friday: c.friday,
                                saturday: c.saturday,
                                sunday: c.sunday,
                            }
                        })
                    }

                    return tempSchedules && tempSchedules.id ? {
                        ...t,
                        schedule: compositions.length > 0 ? {
                            ...tempSchedules,
                            compositions
                        } : tempSchedules,
                        composition: {
                            id: t.default_composition_id
                        }
                    } : {
                        ...t,
                        composition: {
                            id: t.default_composition_id
                        }
                    }
                })

                Promise.all(compositionPromises).then(res => {
                    Promise.all(tagsPromises).then(result => {
                        const compositions = res.map(r => r.compositions[0])
                        const tempTags = []
                        const tags = result.map(tag => tag.data.rows)
                        tags.forEach(ta => {
                            ta.forEach(temp => {
                                tempTags.push(temp)
                            })
                        })
                        const displaysFind = tempDisplays.map(t => {
                            return {
                                ...t,
                                tags: tempTags.filter(ta => ta.display_id === t.id),
                                composition: compositions.find(c => c.id == t.default_composition_id)
                            }
                        })
                        resolve({
                            success: true,
                            display: displaysFind
                        })
                    }).catch(() => {
                        const compositions = res.map(r => r.compositions[0])
                        const displaysFind = tempDisplays.map(t => {
                            return {
                                ...t,
                                composition: compositions.find(c => c.id == t.default_composition_id)
                            }
                        })
                        resolve({
                            success: true,
                            display: displaysFind
                        })
                    })
                }).catch(error => {
                    console.log(error)
                    reject(error)
                })
            }).catch(() => {
                reject({
                    success: false,
                    error: "Display not found!"
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

const addDisplay = (display) => {
    const table = 'displays'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(display) && display.code && display.user_id && display.is_active) {
            // const data = {
            //     ...dis[0],
            //     user_id: display.user_id
            // }
            db.exec_query(db.build_select_query(table, {
                code: display.code
            })).then(response => {
                const displayId = response.data.rows[0].id
                if (response.success && response.data.rowCount > 0) {
                    db.exec_query(db.build_update_query(table, {
                        id: displayId
                    }, display)).then(res => {
                        if (res.success && res.data.rowCount > 0) {
                            const addedDisplay = res.data.rows[0]
                            const msg = {
                                command: config.rabbimq.command.active_player,
                                status: true,
                                message: 'Success'
                            }

                            utils.send_msg_to_display(addedDisplay.queue_name, JSON.stringify(msg)).then(res => {
                                if (res.success) {
                                    getDisplay({
                                        id: addedDisplay.id
                                    }).then(response => {
                                        resolve(response)
                                    }).catch(err => reject(err))
                                } else {
                                    reject(response)
                                }
                            }).catch(err => reject(err))
                            // getDisplay({
                            //     id: addedDisplay.id
                            // }).then(response => {
                            //     resolve(response)
                            // }).catch(err => reject(err))
                        } else {
                            reject({
                                success: false,
                                error: "Error on adding display!"
                            })
                        }
                    }).catch(() => {
                        reject({
                            success: false,
                            error: "Error on adding display!"
                        })
                    })
                } else {
                    reject({
                        success: false,
                        error: "Display is already linked to existing account!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on getting display!"
                })
            })
        } else {
            if (display.code) {
                reject({
                    success: false,
                    error: "Display not found!"
                })
            } else {
                reject({
                    success: false,
                    error: "Please provide display code!"
                })
            }
        }
    })
}

const updateDisplay = (display) => {
    const table = 'displays'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(display)) {
            if (display.displays && display.displays.length > 0) {
                let displayPromises = display.displays.map(d => {
                    return new Promise((re, rj) => {
                        let tempDisplay = {...d}
                        delete tempDisplay.id
                        delete tempDisplay.selected
                        db.exec_query(db.build_update_query(table, {
                            id: d.id
                        }, tempDisplay, !d.selected)).then(response => {
                            const res = response

                            if (res.success && res.data.rowCount > 0) {
                                re({
                                    success: true,
                                    display: res.data.rows[0]
                                })
                            } else {
                                rj({
                                    success: false,
                                    error: "Display not found!"
                                })
                            }
                        }).catch(() => {
                            rj({
                                success: false,
                                error: "Error on updating display information!"
                            })
                        })
                    })
                })

                Promise.all(displayPromises).then(response => {
                    const dis = response.map(r => r.display)
                    resolve({
                        success: true,
                        display: dis
                    })
                }).catch(error => reject(error))
            } else {
                const updatedDisplay = {...display}
                delete updateDisplay.id
                delete updatedDisplay.selected

                db.exec_query(display.schedule_id && !display.id ? db.build_update_query(table, {
                    schedule_id: display.schedule_id
                }, {schedule_id: '00000000-0000-0000-0000-000000000000'}) : db.build_update_query(table, {
                    id: display.id
                }, updatedDisplay, updatedDisplay.selected)).then(response => {
                    const res = response

                    if (res.success && res.data.rowCount > 0) {
                        const updatedDisplay = res.data.rows[0]

                        getDisplay({
                            id: updatedDisplay.id
                        }).then(res => resolve({
                            success: res.success,
                            display: res.display[0]
                        })).catch(error => reject(error))
                    } else {
                        reject({
                            success: false,
                            error: "Display not found!"
                        })
                    }
                }).catch(() => {
                    reject({
                        success: false,
                        error: "Error on updating display information!"
                    })
                })
            }
        } else {
            reject({
                success: false,
                error: "Params not found!"
            })
        }
    })
}

const getDisplayTags = (condition) => {
    const table = 'tags'

    return new Promise((resolve, reject) => {
        db.exec_query(db.build_select_query(table, (condition && Object.keys(condition).length > 0 ? condition : null), true, null, `SELECT t.* FROM ${table} as t JOIN displays as a ON t.display_id = a.id`)).then(response => {
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

export default {
    addDisplay,
    updateDisplay,
    getDisplay,
    getDisplayTags
}