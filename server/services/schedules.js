import db from '../db/operations'
import scheduleDb from '../db/schedule'
import utils from '../utils'
import scheduleCompositionService from './scheduleCompositions'
import displayService from './displays'
import uuidv1 from 'uuid/v1'

const getSchedule = (condition) => {
    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(scheduleDb.getScheduleInfo(condition)).then(response => {
                const schedules = response.data.rows
                let tempSchedules = []

                schedules.forEach(c => {
                    const isExist = tempSchedules.length > 0 ? tempSchedules.filter(tc => tc.id == c.id).length > 0 : false
                    const {id, name, version, user_id, created_at} = c

                    if (!isExist) tempSchedules.push({
                        id,
                        name,
                        created_at: Date.parse(created_at) / 1000,
                        version,
                        user_id
                    })
                })

                tempSchedules = tempSchedules.map(t => {
                    let compositions = schedules.filter(c => t.id == c.id)
                    let tempCompositions = []
                    
                    compositions.forEach(z => {
                        tempCompositions.push({
                            id: z.composition_id,
                            name: z.composition_name,
                            duration: z.duration,
                            template_id: z.template_id,
                            start_date: utils.format_date(z.start_date),
                            end_date: utils.format_date(z.end_date),
                            prior_level: z.prior_level,
                            order_level: z.order_level,
                            is_repeat: z.is_repeat,
                            monday: z.monday,
                            tuesday: z.tuesday,
                            wednesday: z.wednesday,
                            thursday: z.thursday,
                            friday: z.friday,
                            saturday: z.saturday,
                            sunday: z.sunday
                        })
                    })

                    return {
                        ...t,
                        compositions: tempCompositions
                    }
                })

                tempSchedules = tempSchedules.map(t => {
                    let displays = schedules.filter(c => t.id == c.id)
                    let tempDisplays = []
                    
                    displays.forEach(z => {
                        const isExist = tempDisplays.length > 0 ? tempDisplays.filter(tz => tz.id == z.display_id).length > 0 : false

                        if (!isExist && z.display_id) tempDisplays.push({
                            id: z.display_id,
                            name: z.display_name,
                            network_status: z.network_status
                        })
                    })

                    return {
                        ...t,
                        displays: tempDisplays
                    }
                })

                resolve({
                    success: true,
                    schedule: tempSchedules
                })
            }).catch(() => {
                reject({
                    success: false,
                    error: "Schedule not found!"
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

const addSchedule = (schedule, is_id = true) => {
    const table = 'schedules'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(schedule)) {
            let newSchedule = {...schedule}
            if (!newSchedule.id) {
                newSchedule.id = uuidv1()
            }
            delete newSchedule.compositions
            delete newSchedule.displays

            db.exec_query(db.build_insert_query(table, newSchedule, is_id)).then(res => {
                if (res.success && res.data.rowCount > 0) {
                    const scheduleInserted = res.data.rows[0]
                    const compositions = [...schedule.compositions]
                    const displays = schedule.displays ? [...schedule.displays] : []
                    let compositionPromises = compositions.map(c => {
                        return scheduleCompositionService.addScheduleComposition({
                            ...c,
                            schedule_id: scheduleInserted.id,
                            id: uuidv1()
                        })
                    })
                    
                    Promise.all(compositionPromises).then(response => {
                        const comps = response.map(r => r.scheduleComposition)

                        if (displays && displays.length > 0) {
                            let displayPromises = displays.map(d => {
                                return displayService.updateDisplay({
                                    id: d.id,
                                    schedule_id: scheduleInserted.id
                                })
                            })

                            Promise.all(displayPromises).then(dRes => {
                                const ds = dRes.map(di => di.display)

                                resolve({
                                    success: true,
                                    schedule: {
                                        ...scheduleInserted,
                                        compositions: comps,
                                        displays: ds
                                    }
                                })
                            }).catch(error => reject({
                                success: false,
                                error: error
                            }))
                        } else {
                            resolve({
                                success: true,
                                schedule: {
                                    ...scheduleInserted,
                                    compositions: comps
                                }
                            })
                        }
                    }).catch(() => reject({
                        success: false,
                        error: "Can't insert compositions into schedule!"
                    }))

                } else {
                    reject({
                        success: false,
                        error: "No schedule added!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Error on adding schedule!"
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

const updateSchedule = (schedule) => {
    return new Promise((resolve, reject) => {
        deleteSchedule({
            id: schedule.id
        }).then(response => {
            let sch = {...schedule}
            if (sch.version) sch.version++

            addSchedule(sch, true).then(res => {
                resolve(res)
            }).catch(error => reject(error))
        }).catch(error => reject(error))
    })
}

const deleteSchedule = (condition) => {
    const table = 'schedules'

    return new Promise((resolve, reject) => {
        if (utils.check_properties_validity(condition)) {
            db.exec_query(db.build_delete_query(table, condition)).then(response => {
                const res = response

                if (res.success && res.data.rowCount > 0) {
                    const schedule = res.data.rows[0]
                    const scheduleId = schedule.id

                    scheduleCompositionService.deleteScheduleComposition({
                        schedule_id: scheduleId
                    }).then(scRes => {
                        displayService.updateDisplay({
                            schedule_id: scheduleId
                        }).then(dRes => {
                            resolve({
                                success: true,
                                schedule: {
                                    ...schedule,
                                    compositions: scRes.scheduleComposition,
                                    displays: dRes.display
                                }
                            })
                        }).catch(error => {
                            if (error.error == "Display not found!") {
                                resolve({
                                    success: true,
                                    schedule: {
                                        ...schedule,
                                        compositions: scRes.scheduleComposition
                                    }
                                })
                            } else {
                                reject(error)
                            }
                        })
                    }).catch(error => reject(error))
                } else {
                    reject({
                        success: false,
                        error: "No schedule found!"
                    })
                }
            }).catch(() => {
                reject({
                    success: false,
                    error: "Schedule not found!"
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
    getSchedule,
    addSchedule,
    updateSchedule,
    deleteSchedule
}